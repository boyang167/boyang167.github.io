import {
  access,
  copyFile,
  mkdir,
  readFile,
  readdir,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { pinyin } from "pinyin-pro";

import {
  areaByDirectory,
  excludedPathPatterns,
  externalSources,
  seriesByPrefix,
} from "../migration.config.mjs";

const HAN_CHARACTER = /[\u3400-\u9fff]/;

function toPosix(value) {
  return value.replaceAll("\\", "/");
}

export function slugifyText(value) {
  const transliterated = pinyin(value, {
    toneType: "none",
    nonZh: "consecutive",
  });

  return transliterated
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stripMarkdown(value) {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[*_`>#|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function inferDescription(body, title) {
  const paragraphs = body
    .replace(/^#\s+.*$/m, "")
    .split(/\r?\n\s*\r?\n/)
    .map(stripMarkdown)
    .filter((paragraph) => paragraph && paragraph !== title);
  const description = paragraphs[0] || `${title} technical note.`;
  return description.length > 180
    ? `${description.slice(0, 177).trimEnd()}...`
    : description;
}

function inferLanguage(relativePath, body) {
  const basename = path.posix.basename(relativePath).toLowerCase();
  if (
    basename.includes("english") ||
    basename.includes("_en.") ||
    basename.includes("-en.")
  ) {
    return "en";
  }
  const sample = `${relativePath}\n${body}`.slice(0, 2000);
  const hanCount = [...sample].filter((character) =>
    HAN_CHARACTER.test(character),
  ).length;
  return hanCount >= 4 ? "zh-CN" : "en";
}

function inferSeries(relativePath) {
  const matched = seriesByPrefix.find(({ prefix }) =>
    relativePath.startsWith(prefix),
  );
  if (matched) return matched.series;
  const directory = path.posix.dirname(relativePath);
  if (directory === "." || !directory.includes("/")) return undefined;
  return path.posix.basename(directory).replace(/^\d+[-_]?/, "");
}

function inferDestination(relativePath, area) {
  const segments = relativePath.split("/");
  const filename = segments.pop();
  segments.shift();
  const series = seriesByPrefix.find(({ prefix }) =>
    relativePath.startsWith(prefix),
  );
  const directories = series
    ? [series.translationPrefix]
    : segments.map(slugifyText).filter(Boolean);
  const basename = path.posix.basename(filename, ".md");
  return [
    slugifyText(area) || "general",
    ...directories,
    `${slugifyText(basename) || "note"}.md`,
  ].join("/");
}

export function inferDocument({ relativePath, source, modifiedAt }) {
  const normalizedPath = toPosix(relativePath);
  const parsed = matter(source);
  const heading = parsed.content.match(/^#\s+(.+)$/m)?.[1]?.trim();
  const filename = path.posix.basename(normalizedPath, ".md");
  const title = parsed.data.title || heading || filename.replace(/[-_]/g, " ");
  const rootDirectory = normalizedPath.split("/")[0];
  const area =
    parsed.data.area ||
    areaByDirectory[rootDirectory] ||
    (rootDirectory.endsWith(".md") ? "General" : rootDirectory);
  const orderMatch = filename.match(/^(\d+)/);
  const sourceConfig = externalSources.find(({ prefix }) =>
    normalizedPath.startsWith(prefix),
  );
  const dateValue = parsed.data.date
    ? new Date(parsed.data.date)
    : new Date(modifiedAt);

  return {
    sourceRelativePath: normalizedPath,
    destination: inferDestination(normalizedPath, area),
    body: parsed.content.trimStart(),
    frontmatter: {
      title,
      description:
        parsed.data.description || inferDescription(parsed.content, title),
      date: Number.isNaN(dateValue.valueOf())
        ? new Date("1970-01-01T00:00:00.000Z")
        : dateValue,
      area,
      tags: Array.isArray(parsed.data.tags) ? parsed.data.tags : [],
      language:
        parsed.data.language || inferLanguage(normalizedPath, parsed.content),
      ...(inferSeries(normalizedPath)
        ? { series: inferSeries(normalizedPath) }
        : {}),
      ...(orderMatch ? { order: Number(orderMatch[1]) } : {}),
      ...(sourceConfig ? { source: sourceConfig.source } : {}),
      draft: Boolean(parsed.data.draft),
    },
  };
}

export function classifyPath(relativePath) {
  const normalizedPath = toPosix(relativePath);
  const exclusion = excludedPathPatterns.find((pattern) =>
    pattern.test(normalizedPath),
  );
  return {
    publish: normalizedPath.toLowerCase().endsWith(".md") && !exclusion,
    reason: exclusion ? `Matched exclusion ${exclusion}` : undefined,
  };
}

export function inferTranslationKey(relativePath) {
  const normalizedPath = toPosix(relativePath);
  const series = seriesByPrefix.find(({ prefix }) =>
    normalizedPath.startsWith(prefix),
  );
  if (!series) return undefined;
  const filename = path.posix.basename(normalizedPath);
  const order = filename.match(/^(\d+)/)?.[1];
  return order ? `${series.translationPrefix}/${order}` : undefined;
}

function resolveReference(sourceRelativePath, reference) {
  const decoded = decodeURI(reference);
  return path.posix.normalize(
    path.posix.join(path.posix.dirname(sourceRelativePath), decoded),
  );
}

function rewriteMarkdownSegment(
  segment,
  { documentHref, sourceRelativePath, assetHref },
) {
  const withImages = segment.replace(
    /!\[([^\]]*)]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g,
    (match, alt, reference) => {
      if (/^(?:https?:|data:|\/)/i.test(reference)) return match;
      const [assetPath] = reference.split(/[?#]/, 1);
      const resolved = resolveReference(sourceRelativePath, assetPath);
      const href = assetHref.get(resolved);
      return href ? `![${alt}](${href})` : match;
    },
  );

  return withImages.replace(
    /(?<!!)\[([^\]]+)]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g,
    (match, label, reference) => {
      if (/^(?:https?:|mailto:|#|\/)/i.test(reference)) return match;
      const [documentPath, anchor = ""] = reference.split("#", 2);
      if (!documentPath.toLowerCase().endsWith(".md")) return match;
      const resolved = resolveReference(sourceRelativePath, documentPath);
      const href = documentHref.get(resolved);
      return href
        ? `[${label}](${href}${anchor ? `#${anchor}` : ""})`
        : match;
    },
  );
}

export function rewriteReferences(source, context) {
  return source
    .split(/(```[\s\S]*?```)/g)
    .map((segment, index) =>
      index % 2 === 1 ? segment : rewriteMarkdownSegment(segment, context),
    )
    .join("");
}

async function discoverMarkdown(root, directory = "") {
  const absoluteDirectory = path.join(root, directory);
  const entries = await readdir(absoluteDirectory, { withFileTypes: true });
  const discovered = [];
  for (const entry of entries.sort((left, right) =>
    left.name.localeCompare(right.name),
  )) {
    const relativePath = toPosix(path.join(directory, entry.name));
    if (entry.isDirectory()) {
      discovered.push(...(await discoverMarkdown(root, relativePath)));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      discovered.push(relativePath);
    }
  }
  return discovered;
}

function extractReferences(source) {
  const withoutFences = source.replace(/```[\s\S]*?```/g, "");
  const assets = [];
  const documents = [];
  for (const match of withoutFences.matchAll(
    /!\[[^\]]*]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g,
  )) {
    assets.push(match[1]);
  }
  for (const match of withoutFences.matchAll(
    /<img\s+[^>]*src=["']([^"']+)["'][^>]*>/gi,
  )) {
    assets.push(match[1]);
  }
  for (const match of withoutFences.matchAll(
    /(?<!!)\[[^\]]+]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g,
  )) {
    documents.push(match[1]);
  }
  return { assets, documents };
}

function assetDestination(relativePath, area) {
  const segments = relativePath.split("/");
  segments.shift();
  const filename = segments.pop();
  const extension = path.posix.extname(filename).toLowerCase();
  const basename = path.posix.basename(filename, extension);
  return [
    slugifyText(area) || "general",
    ...segments.map(slugifyText).filter(Boolean),
    `${slugifyText(basename) || "asset"}${extension}`,
  ].join("/");
}

async function pathExists(value) {
  try {
    await access(value);
    return true;
  } catch {
    return false;
  }
}

async function downloadAsset(url, destination, fetchImpl) {
  const response = await fetchImpl(url);
  if (!response.ok) return false;
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
  return true;
}

async function materializeAsset({
  sourceRoot,
  assetRoot,
  sourceRelativePath,
  assetRelativePath,
  destination,
  fetchImpl,
}) {
  const sourceAbsolutePath = path.join(sourceRoot, assetRelativePath);
  const destinationAbsolutePath = path.join(assetRoot, destination);
  await mkdir(path.dirname(destinationAbsolutePath), { recursive: true });
  if (await pathExists(sourceAbsolutePath)) {
    await copyFile(sourceAbsolutePath, destinationAbsolutePath);
    return { method: "copy", source: assetRelativePath };
  }

  const sourceConfig = externalSources.find(({ prefix }) =>
    sourceRelativePath.startsWith(prefix),
  );
  const candidates = [];
  if (sourceConfig) {
    candidates.push(
      new URL(path.posix.basename(assetRelativePath), sourceConfig.rawAssets)
        .href,
    );
  }
  const encodedPath = assetRelativePath
    .split("/")
    .map(encodeURIComponent)
    .join("/");
  candidates.push(
    `https://raw.githubusercontent.com/boyang167/TechNotes/main/${encodedPath}`,
    `https://raw.githubusercontent.com/boyang167/TechNotes/master/${encodedPath}`,
  );

  for (const url of candidates) {
    try {
      if (
        await downloadAsset(url, destinationAbsolutePath, fetchImpl)
      ) {
        return { method: "download", source: url };
      }
    } catch {
      // Try the next deterministic source.
    }
  }
  return undefined;
}

function serializableFrontmatter(frontmatter) {
  return {
    ...frontmatter,
    date:
      frontmatter.date instanceof Date
        ? frontmatter.date.toISOString().slice(0, 10)
        : frontmatter.date,
  };
}

export async function migrateNotes({
  sourceRoot,
  contentRoot,
  assetRoot,
  fetchImpl = fetch,
}) {
  const report = {
    migrated: [],
    excluded: [],
    translations: [],
    assets: [],
    warnings: [],
    errors: [],
  };
  const sourcePaths = await discoverMarkdown(sourceRoot);
  const documents = [];
  for (const relativePath of sourcePaths) {
    const classification = classifyPath(relativePath);
    if (!classification.publish) {
      report.excluded.push({
        path: relativePath,
        reason: classification.reason || "Not a publishable Markdown file",
      });
      continue;
    }
    const absolutePath = path.join(sourceRoot, relativePath);
    const source = await readFile(absolutePath, "utf8");
    const document = inferDocument({
      relativePath,
      source,
      modifiedAt: (await stat(absolutePath)).mtime,
    });
    document.frontmatter.translationKey =
      inferTranslationKey(relativePath);
    if (!document.frontmatter.translationKey) {
      delete document.frontmatter.translationKey;
    }
    documents.push(document);
  }

  const destinations = new Map();
  for (const document of documents) {
    const existing = destinations.get(document.destination);
    if (existing) {
      report.errors.push({
        type: "duplicate-destination",
        path: document.destination,
        sources: [existing, document.sourceRelativePath],
      });
    } else {
      destinations.set(document.destination, document.sourceRelativePath);
    }
  }
  const documentHref = new Map(
    documents.map((document) => [
      document.sourceRelativePath,
      `/notes/${document.destination.replace(/\.md$/i, "")}`,
    ]),
  );
  const assetHref = new Map();

  for (const document of documents) {
    const references = extractReferences(document.body);
    for (const reference of references.documents) {
      if (/^(?:https?:|mailto:|#|\/)/i.test(reference)) continue;
      const documentPath = reference.split(/[?#]/, 1)[0];
      if (!documentPath.toLowerCase().endsWith(".md")) continue;
      const resolved = resolveReference(
        document.sourceRelativePath,
        documentPath,
      );
      if (!documentHref.has(resolved)) {
        const isExcluded = sourcePaths.includes(resolved);
        if (isExcluded) {
          documentHref.set(resolved, "/notes");
          report.warnings.push({
            type: "link-to-excluded-index",
            source: document.sourceRelativePath,
            path: resolved,
          });
        } else {
          report.errors.push({
            type: "broken-document-link",
            source: document.sourceRelativePath,
            path: resolved,
          });
        }
      }
    }

    for (const reference of references.assets) {
      if (/^(?:https?:|data:|\/)/i.test(reference)) continue;
      const assetPath = reference.split(/[?#]/, 1)[0];
      const resolved = resolveReference(
        document.sourceRelativePath,
        assetPath,
      );
      if (assetHref.has(resolved)) continue;
      const destination = assetDestination(
        resolved,
        document.frontmatter.area,
      );
      const materialized = await materializeAsset({
        sourceRoot,
        assetRoot,
        sourceRelativePath: document.sourceRelativePath,
        assetRelativePath: resolved,
        destination,
        fetchImpl,
      });
      if (!materialized) {
        report.errors.push({
          type: "missing-asset",
          source: document.sourceRelativePath,
          path: resolved,
        });
        continue;
      }
      const href = `/knowledge-assets/${destination}`;
      assetHref.set(resolved, href);
      report.assets.push({
        path: resolved,
        destination,
        ...materialized,
      });
    }
  }

  for (const document of documents) {
    const rewrittenBody = rewriteReferences(document.body, {
      documentHref,
      sourceRelativePath: document.sourceRelativePath,
      assetHref,
    });
    const destination = path.join(contentRoot, document.destination);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(
      destination,
      matter.stringify(
        rewrittenBody,
        serializableFrontmatter(document.frontmatter),
      ),
      "utf8",
    );
    report.migrated.push({
      path: document.sourceRelativePath,
      destination: document.destination,
    });
    if (document.frontmatter.translationKey) {
      report.translations.push({
        path: document.sourceRelativePath,
        key: document.frontmatter.translationKey,
      });
    }
  }

  return report;
}

export function validateMigration(report) {
  if (!report.errors.length) return;
  const details = report.errors
    .map((error) => `${error.type}: ${error.path}`)
    .join("\n");
  throw new Error(`Migration validation failed:\n${details}`);
}

function countType(items, type) {
  return items.filter((item) => item.type === type).length;
}

function renderItems(items, emptyMessage, renderItem) {
  if (!items.length) return `- ${emptyMessage}`;
  return [...items]
    .sort((left, right) =>
      String(left.path || left.source).localeCompare(
        String(right.path || right.source),
      ),
    )
    .map(renderItem)
    .join("\n");
}

export function renderMigrationReport(report) {
  const unclassified =
    countType(report.warnings, "unclassified-document") +
    countType(report.errors, "unclassified-document");
  return `# Knowledge Base Migration Report

## Summary

- Migrated documents: ${report.migrated.length}
- Excluded documents: ${report.excluded.length}
- Translation entries: ${report.translations.length}
- Migrated assets: ${report.assets.length}
- Warnings: ${report.warnings.length}
- Errors: ${report.errors.length}

## Validation

- Duplicate destinations: ${countType(report.errors, "duplicate-destination")}
- Broken internal document links: ${countType(report.errors, "broken-document-link")}
- Missing referenced assets: ${countType(report.errors, "missing-asset")}
- Unclassified readable documents: ${unclassified}

## Migrated Documents

${renderItems(
  report.migrated,
  "None",
  (item) => `- \`${item.path}\` → \`${item.destination}\``,
)}

## Excluded Documents

${renderItems(
  report.excluded,
  "None",
  (item) => `- \`${item.path}\` — ${item.reason}`,
)}

## Warnings

${renderItems(
  report.warnings,
  "None",
  (item) => `- **${item.type}**: \`${item.path || item.source}\``,
)}

## Errors

${renderItems(
  report.errors,
  "None",
  (item) => `- **${item.type}**: \`${item.path || item.source}\``,
)}
`;
}
