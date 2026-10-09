import assert from "node:assert/strict";
import {
  mkdtemp,
  mkdir,
  readFile,
  rm,
  utimes,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";

import {
  classifyPath,
  inferDocument,
  inferTranslationKey,
  migrateNotes,
  renderMigrationReport,
  rewriteReferences,
  validateMigration,
} from "../scripts/lib/note-migration.mjs";

test("infers normalized metadata from path and heading", () => {
  const result = inferDocument({
    relativePath: "13-agent/基础知识.md",
    source: "# Agent 基础\n\n这是用于构建 Agent 的核心概念。",
    modifiedAt: new Date("2026-10-09T00:00:00Z"),
  });

  assert.equal(result.frontmatter.title, "Agent 基础");
  assert.equal(result.frontmatter.area, "AI Agent");
  assert.equal(result.frontmatter.language, "zh-CN");
  assert.equal(result.destination, "ai-agent/ji-chu-zhi-shi.md");
  assert.match(result.frontmatter.description, /核心概念/);
});

test("excludes generated prompt resources and repository indexes", () => {
  assert.equal(
    classifyPath("13-agent/claude-code-docs/imgs/prompts/01.md").publish,
    false,
  );
  assert.equal(classifyPath("README.md").publish, false);
  assert.equal(
    classifyPath("13-agent/claude-code-docs/README_EN.md").publish,
    false,
  );
  assert.equal(classifyPath("13-agent/agent.md").publish, true);
});

test("pairs numbered Chinese and English series documents", () => {
  const pair = inferTranslationKey(
    "13-agent/claude-code-docs/docs/01-Architecture-Overview.md",
  );
  assert.equal(pair, "claude-code-docs/01");
  assert.equal(
    inferTranslationKey(
      "13-agent/claude-code-docs/docs/01-架构总览.md",
    ),
    pair,
  );
});

test("does not classify an English document by its Chinese edition link", () => {
  const result = inferDocument({
    relativePath:
      "13-agent/claude-code-docs/docs/01-Architecture-Overview.md",
    source:
      "[中文](./01-架构总览.md)\n\n# Architecture Overview\n\nThis chapter explains the complete agent architecture, runtime, tools, permissions, and context management.",
    modifiedAt: new Date("2026-10-09T00:00:00Z"),
  });

  assert.equal(result.frontmatter.language, "en");
});

test("keeps code-heavy Chinese notes classified as Chinese", () => {
  const result = inferDocument({
    relativePath: "6-language/go.md",
    source:
      "# Go\n\n这是中文笔记。\n\n```go\nfunc HandleRequest(ctx context.Context, request *http.Request) error {\n  return service.Process(ctx, request)\n}\n```",
    modifiedAt: new Date("2026-10-09T00:00:00Z"),
  });

  assert.equal(result.frontmatter.language, "zh-CN");
});

test("keeps mostly English prose classified as English", () => {
  const result = inferDocument({
    relativePath: "14-work/context.md",
    source:
      "# Context\n\nThis document explains the ontology workflow, data discovery, graph construction, knowledge services, and agent skills in detail.\n\n补充中文说明。",
    modifiedAt: new Date("2026-10-09T00:00:00Z"),
  });

  assert.equal(result.frontmatter.language, "en");
});

test("rewrites migrated markdown links and image references", () => {
  const output = rewriteReferences(
    "[下一章](./02-Agent循环.md)\n![架构](../imgs/01-arch.png)",
    {
      documentHref: new Map([
        [
          "13-agent/docs/02-Agent循环.md",
          "/notes/ai-agent/series/02-agent-xun-huan",
        ],
      ]),
      sourceRelativePath: "13-agent/docs/01-架构.md",
      assetHref: new Map([
        [
          "13-agent/imgs/01-arch.png",
          "/knowledge-assets/ai-agent/01-arch.png",
        ],
      ]),
    },
  );
  assert.match(
    output,
    /\(\/notes\/ai-agent\/series\/02-agent-xun-huan\)/,
  );
  assert.match(
    output,
    /\(\/knowledge-assets\/ai-agent\/01-arch\.png\)/,
  );
});

test("replaces unresolved internal links with an explicit notice", () => {
  const output = rewriteReferences("[旧章节](./missing.md)", {
    documentHref: new Map(),
    sourceRelativePath: "13-agent/docs/current.md",
    assetHref: new Map(),
    missingDocuments: new Set(["13-agent/docs/missing.md"]),
  });

  assert.equal(output, "旧章节 *(original link unavailable)*");
});

test("migrates documents, local assets, and internal links", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "note-migration-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const sourceRoot = path.join(root, "source");
  const contentRoot = path.join(root, "content");
  const assetRoot = path.join(root, "assets");
  await mkdir(path.join(sourceRoot, "13-agent", "docs", "image"), {
    recursive: true,
  });
  await writeFile(
    path.join(sourceRoot, "13-agent", "docs", "01-架构.md"),
    "# 架构\n\n[下一章](./02-循环.md)\n\n![图](./image/arch.png)",
  );
  await utimes(
    path.join(sourceRoot, "13-agent", "docs", "01-架构.md"),
    new Date("2024-02-03T00:00:00Z"),
    new Date("2024-02-03T00:00:00Z"),
  );
  await writeFile(
    path.join(sourceRoot, "13-agent", "docs", "02-循环.md"),
    "# 循环\n\nAgent 循环正文。",
  );
  await writeFile(
    path.join(sourceRoot, "13-agent", "docs", "image", "arch.png"),
    "png",
  );
  await writeFile(path.join(sourceRoot, "README.md"), "# Index");

  const report = await migrateNotes({
    sourceRoot,
    contentRoot,
    assetRoot,
    fetchImpl: async () => new Response(null, { status: 404 }),
  });

  validateMigration(report);
  assert.equal(report.migrated.length, 2);
  assert.equal(report.excluded.length, 1);
  assert.equal(report.assets.length, 1);
  const migrated = await readFile(
    path.join(contentRoot, "ai-agent", "docs", "01-jia-gou.md"),
    "utf8",
  );
  assert.match(migrated, /date: '2024-02-03'/);
  assert.match(migrated, /\/notes\/ai-agent\/docs\/02-xun-huan/);
  assert.match(migrated, /\/knowledge-assets\/ai-agent\/docs\/image\/arch\.png/);
});

test("validation rejects missing referenced assets", () => {
  assert.throws(
    () =>
      validateMigration({
        migrated: [],
        excluded: [],
        translations: [],
        assets: [],
        warnings: [],
        errors: [{ type: "missing-asset", path: "missing.png" }],
      }),
    /missing-asset.*missing\.png/s,
  );
});

test("renders deterministic validation counts", () => {
  const markdown = renderMigrationReport({
    migrated: [{ path: "a.md", destination: "general/a.md" }],
    excluded: [{ path: "README.md", reason: "index" }],
    translations: [],
    assets: [],
    warnings: [],
    errors: [],
  });

  assert.match(markdown, /Migrated documents: 1/);
  assert.match(markdown, /Excluded documents: 1/);
  assert.match(markdown, /Duplicate destinations: 0/);
  assert.match(markdown, /Broken internal document links: 0/);
  assert.match(markdown, /Missing referenced assets: 0/);
});

test("resolves remote assets concurrently with abort signals", async (t) => {
  const root = await mkdtemp(path.join(tmpdir(), "note-download-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const sourceRoot = path.join(root, "source");
  await mkdir(
    path.join(sourceRoot, "13-agent", "claude-code-docs", "docs"),
    { recursive: true },
  );
  await writeFile(
    path.join(
      sourceRoot,
      "13-agent",
      "claude-code-docs",
      "docs",
      "01-架构.md",
    ),
    "# 架构\n\n![一](../imgs/one.png)\n![二](../imgs/two.png)",
  );
  let active = 0;
  let maximumActive = 0;
  const signals = [];

  const report = await migrateNotes({
    sourceRoot,
    contentRoot: path.join(root, "content"),
    assetRoot: path.join(root, "assets"),
    assetConcurrency: 2,
    fetchTimeoutMs: 50,
    missingResourcePolicy: "placeholder",
    fetchImpl: async (_url, options) => {
      signals.push(options?.signal);
      active += 1;
      maximumActive = Math.max(maximumActive, active);
      await new Promise((resolve) => setTimeout(resolve, 5));
      active -= 1;
      return new Response(null, { status: 404 });
    },
  });

  assert.equal(report.errors.length, 0);
  assert.equal(
    report.warnings.filter(({ type }) => type === "missing-asset").length,
    2,
  );
  assert.ok(maximumActive >= 2);
  assert.ok(signals.every(Boolean));
  const migrated = await readFile(
    path.join(
      root,
      "content",
      "ai-agent",
      "claude-code-docs",
      "01-jia-gou.md",
    ),
    "utf8",
  );
  assert.match(migrated, /Missing image resource/);
  assert.doesNotMatch(migrated, /\.\.\/imgs\/(?:one|two)\.png/);
});
