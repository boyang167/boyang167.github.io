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
