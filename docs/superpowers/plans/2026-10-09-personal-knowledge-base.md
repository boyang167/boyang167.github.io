# Personal Knowledge Base Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the readable Markdown content from `A:\17-workspace\3-TechNotes` into the personal-site repository and turn the existing Astro notes section into a searchable, bilingual documentation knowledge base.

**Architecture:** A one-time Node migration pipeline normalizes Markdown, downloads or copies referenced assets, and writes a deterministic report. Astro's content collection validates the committed result, focused navigation helpers derive the knowledge hierarchy, and static pages provide a responsive three-column reading experience. Pagefind indexes the generated site after Astro builds, so GitHub Pages needs no server.

**Tech Stack:** Node.js 22, Astro 5, TypeScript, Node test runner, `gray-matter`, `pinyin-pro`, Pagefind, GitHub Pages

## Global Constraints

- `A:\17-workspace\11-Profile-Web\boyang167.github.io` becomes the only content source after migration.
- Migrate all readable Markdown, excluding prompt assets, duplicate index files, repository templates, and non-article fragments.
- Keep both Chinese and English editions and link recognized translations in both directions.
- Preserve source attribution for imported third-party series.
- Do not delete or modify `A:\17-workspace\3-TechNotes`.
- Keep the site fully static and compatible with GitHub Pages.
- AI Q&A, a database, and an editing backend are outside this implementation.
- Duplicate destination paths fail migration validation. Assets and internal links are resolved from known sources first; irrecoverable references become explicit in-article placeholders and report warnings.

---

## Planned File Structure

- `scripts/migration.config.mjs`: declarative exclusions, area labels, source repositories, and bilingual-series rules.
- `scripts/lib/note-migration.mjs`: pure migration and validation functions.
- `scripts/migrate-notes.mjs`: command-line entry point and report writer.
- `tests/note-migration.test.mjs`: migration behavior tests using temporary fixtures.
- `tests/knowledge.test.mjs`: hierarchy, translation, and adjacent-page tests.
- `src/lib/knowledge.mjs`: collection sorting and navigation model.
- `src/content.config.ts`: normalized note schema.
- `src/components/KnowledgeSidebar.astro`: category and series tree.
- `src/components/TableOfContents.astro`: visible heading navigation.
- `src/layouts/KnowledgeLayout.astro`: article shell and metadata.
- `src/pages/notes/index.astro`: knowledge-base landing page.
- `src/pages/notes/[...slug].astro`: article routes.
- `src/pages/search.astro`: Pagefind-backed search.
- `src/styles/global.css`: responsive documentation layout and prose styles.
- `src/content/notes/**`: committed migrated Markdown.
- `public/knowledge-assets/**`: committed article assets.
- `docs/migration-report.md`: deterministic import and validation report.
- `package.json` and `package-lock.json`: scripts and Pagefind dependency.
- `.github/workflows/deploy.yml`: reproducible install and indexed build.

### Task 1: Build the tested migration pipeline

**Files:**
- Create: `scripts/migration.config.mjs`
- Create: `scripts/lib/note-migration.mjs`
- Create: `scripts/migrate-notes.mjs`
- Create: `tests/note-migration.test.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `migrateNotes({ sourceRoot, contentRoot, assetRoot, fetchImpl }): Promise<MigrationReport>`
- Produces: `validateMigration(report): void`
- Produces: CLI `npm run migrate:notes -- --source <absolute-path>`
- `MigrationReport` contains `migrated`, `excluded`, `translations`, `assets`, `warnings`, and `errors` arrays.

- [ ] **Step 1: Add a failing metadata-normalization test**

Create a temporary source tree in `tests/note-migration.test.mjs`, call `inferDocument()`, and assert that a Chinese file under `13-agent` receives `area: "AI Agent"`, `language: "zh-CN"`, a heading-derived title, a stable kebab-case destination, and a non-empty description.

```js
import assert from "node:assert/strict";
import test from "node:test";
import { inferDocument } from "../scripts/lib/note-migration.mjs";

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
```

- [ ] **Step 2: Run the focused test and verify the missing-module failure**

Run: `node --test tests/note-migration.test.mjs`

Expected: FAIL because `scripts/lib/note-migration.mjs` does not exist.

- [ ] **Step 3: Add configuration and minimal metadata inference**

Install the two migration-only libraries:

```powershell
npm install --save-dev gray-matter pinyin-pro
```

Define:

```js
export const areaByDirectory = {
  "1-machine-learning": "Machine Learning",
  "2-deep-learning": "Deep Learning",
  "3-big-data": "Big Data",
  "6-language": "Programming",
  "7-Architecture": "Architecture",
  "8-web": "Web",
  "9-SRE": "SRE",
  "10-stock": "Finance",
  "11-protein": "Bioprocess",
  "12-sparkops": "Data Platform",
  "13-agent": "AI Agent",
  "14-work": "Work Notes",
};

export const excludedPathPatterns = [
  /(^|\/)\.gitee\//,
  /(^|\/)imgs\/prompts\//,
  /(^|\/)_(home|sidebar)\.md$/i,
  /(^|\/)README(?:\.en)?\.md$/i,
];

export const externalSources = [
  {
    prefix: "13-agent/claude-code-docs/docs/",
    source: "https://github.com/AnneHeartRecord/claude-code-docs",
    rawAssets: "https://raw.githubusercontent.com/AnneHeartRecord/claude-code-docs/main/imgs/",
  },
  {
    prefix: "13-agent/hermes-agent-anatomy/docs/",
    source: "https://github.com/AnneHeartRecord/hermes-agent-anatomy",
    rawAssets: "https://raw.githubusercontent.com/AnneHeartRecord/hermes-agent-anatomy/main/imgs/",
  },
];
```

Implement `inferDocument()` with `gray-matter` parsing, heading extraction, Han-character language detection, directory-to-area mapping, first-paragraph descriptions capped at 180 characters, `pinyin-pro` slug normalization, and ISO date serialization. Infer `series` from the directory immediately above the article, infer `order` from a leading numeric filename prefix, and use source file modification time when no valid frontmatter date exists.

- [ ] **Step 4: Add failing tests for exclusions, bilingual pairs, links, and assets**

Cover these exact cases:

```js
test("excludes generated prompt resources and repository indexes", () => {
  assert.equal(classifyPath("13-agent/claude-code-docs/imgs/prompts/01.md").publish, false);
  assert.equal(classifyPath("README.md").publish, false);
  assert.equal(classifyPath("13-agent/agent.md").publish, true);
});

test("pairs numbered Chinese and English series documents", () => {
  const pair = inferTranslationKey("13-agent/claude-code-docs/docs/01-Architecture-Overview.md");
  assert.equal(pair, "claude-code-docs/01");
  assert.equal(
    inferTranslationKey("13-agent/claude-code-docs/docs/01-架构总览.md"),
    pair,
  );
});

test("rewrites migrated markdown links and image references", () => {
  const output = rewriteReferences(
    "[下一章](./02-Agent循环.md)\n![架构](../imgs/01-arch.png)",
    {
      documentHref: new Map([["13-agent/docs/02-Agent循环.md", "/notes/ai-agent/series/02-agent-xun-huan"]]),
      sourceRelativePath: "13-agent/docs/01-架构.md",
      assetHref: new Map([["13-agent/imgs/01-arch.png", "/knowledge-assets/ai-agent/01-arch.png"]]),
    },
  );
  assert.match(output, /\(\/notes\/ai-agent\/series\/02-agent-xun-huan\)/);
  assert.match(output, /\(\/knowledge-assets\/ai-agent\/01-arch\.png\)/);
});
```

- [ ] **Step 5: Implement tree migration and validation**

Implement recursive Markdown discovery, deterministic sorting, frontmatter serialization, destination-collision detection, translation-key assignment, internal-link rewriting, and asset resolution in this order:

1. Copy an existing local file.
2. Download a known external-series asset from its `rawAssets` base.
3. Download the same relative path from `boyang167/TechNotes` on `main`, then `master`.
4. Add an error if all resolvers fail.

Use `fetchImpl` injection so tests never require the network. Preserve fenced code blocks while rewriting references. `validateMigration()` must throw one aggregated error when `report.errors.length > 0`.

- [ ] **Step 6: Add and test the CLI**

The CLI parses `--source`, defaults destinations to `src/content/notes` and `public/knowledge-assets`, empties only previously generated content after validation has built a temporary staging directory, atomically replaces destinations, and writes `docs/migration-report.md`.

Add scripts:

```json
{
  "scripts": {
    "test": "node --test tests/*.test.mjs",
    "migrate:notes": "node scripts/migrate-notes.mjs"
  }
}
```

Run: `npm test`

Expected: all migration tests PASS.

- [ ] **Step 7: Commit the migration pipeline**

```bash
git add package.json scripts tests/note-migration.test.mjs
git commit -m "feat: add validated note migration pipeline"
```

### Task 2: Execute and audit the one-time content migration

**Files:**
- Create: `src/content/notes/**`
- Create: `public/knowledge-assets/**`
- Create: `docs/migration-report.md`
- Remove: `src/content/notes/agent/multi-agent.md`
- Remove: `src/content/notes/data/rag.md`

**Interfaces:**
- Consumes: migration CLI from Task 1.
- Produces: normalized, committed Astro content with zero migration errors.

- [ ] **Step 1: Run migration against the original notes directory**

Run:

```powershell
npm run migrate:notes -- --source "A:\17-workspace\3-TechNotes"
```

Expected: the summary reports migrated and excluded documents, both bilingual series, copied/downloaded assets, zero destination collisions, and no fatal errors. Irrecoverable links and images are counted as warnings with in-article placeholders.

- [ ] **Step 2: Inspect the generated report and resolve every error**

For each unresolved path, add an exact exclusion only when it is a template, duplicate index, generated prompt, or non-article fragment. For a readable article, add the correct source or asset resolver instead of excluding it. Re-run the migration after each configuration change until the report contains:

```markdown
## Validation

- Duplicate destinations: 0
- Errors: 0
- Every irrecoverable-reference warning has a corresponding in-article placeholder.
- Unclassified readable documents: 0
```

- [ ] **Step 3: Validate frontmatter and attribution with targeted searches**

Run:

```powershell
rg "^language: " src/content/notes
rg "^source: " src/content/notes/ai-agent/claude-code-docs src/content/notes/ai-agent/hermes-agent-anatomy
rg "imgs/prompts|_sidebar|PULL_REQUEST_TEMPLATE|ISSUE_TEMPLATE" src/content/notes
```

Expected: every article has a language; external series have source URLs; the final search has no matches.

- [ ] **Step 4: Commit migrated content separately**

```bash
git add src/content/notes public/knowledge-assets docs/migration-report.md scripts/migration.config.mjs
git commit -m "content: migrate technical notes into knowledge base"
```

### Task 3: Define the knowledge model and navigation helpers

**Files:**
- Modify: `src/content.config.ts`
- Create: `src/lib/knowledge.mjs`
- Create: `tests/knowledge.test.mjs`

**Interfaces:**
- Produces: `buildKnowledgeTree(entries): KnowledgeArea[]`
- Produces: `findTranslation(entry, entries): entry | undefined`
- Produces: `findAdjacent(entry, entries): { previous, next }`
- `KnowledgeArea` is `{ name: string, series: { name: string, entries: EntrySummary[] }[] }`.

- [ ] **Step 1: Add failing navigation tests**

Use fixture entries with two areas, ordered series entries, and a Chinese/English pair. Assert stable area sorting, `order` before title sorting, bilingual lookup, and previous/next staying inside the same series.

```js
test("builds ordered series and adjacent links", () => {
  const tree = buildKnowledgeTree(entries);
  assert.deepEqual(tree.map((area) => area.name), ["AI Agent", "SRE"]);
  assert.equal(tree[0].series[0].entries[0].title, "01 Architecture");
  assert.equal(findAdjacent(entries[0], entries).next.id, entries[1].id);
});
```

- [ ] **Step 2: Run tests and verify the missing-module failure**

Run: `node --test tests/knowledge.test.mjs`

Expected: FAIL because `src/lib/knowledge.mjs` does not exist.

- [ ] **Step 3: Expand the Astro schema**

Format `src/content.config.ts` and define note fields:

```ts
const noteSchema = common.extend({
  area: z.string(),
  updated: z.coerce.date().optional(),
  language: z.enum(["zh-CN", "en"]),
  translationKey: z.string().optional(),
  source: z.string().url().optional(),
  order: z.number().int().nonnegative().optional(),
  series: z.string().optional(),
});
```

Keep the existing blog schema unchanged.

- [ ] **Step 4: Implement and test navigation helpers**

Implement pure functions that accept entry-like objects instead of importing Astro runtime modules. Sort by area, series, explicit order, date descending, then title. Only consider published entries supplied by the caller.

Run: `npm test`

Expected: all migration and navigation tests PASS.

- [ ] **Step 5: Commit the content model**

```bash
git add src/content.config.ts src/lib/knowledge.mjs tests/knowledge.test.mjs
git commit -m "feat: add knowledge navigation model"
```

### Task 4: Build the knowledge-base pages

**Files:**
- Create: `src/components/KnowledgeSidebar.astro`
- Create: `src/components/TableOfContents.astro`
- Create: `src/layouts/KnowledgeLayout.astro`
- Modify: `src/pages/notes/index.astro`
- Modify: `src/pages/notes/[...slug].astro`
- Modify: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Consumes: `buildKnowledgeTree`, `findTranslation`, and `findAdjacent`.
- Produces: static `/notes/` landing page and `/notes/<id>/` article pages.

- [ ] **Step 1: Add an Astro build check before page changes**

Run: `npm run build`

Expected: PASS on the current site. Preserve this as the baseline.

- [ ] **Step 2: Build the sidebar and table-of-contents components**

`KnowledgeSidebar.astro` accepts `tree` and `currentId`, marks the active article with `aria-current="page"`, and renders semantic nested lists. `TableOfContents.astro` accepts Astro-rendered headings, keeps depth 2 and 3, and returns no wrapper when the article has no eligible headings.

- [ ] **Step 3: Build the article layout**

`KnowledgeLayout.astro` receives the entry, tree, headings, translation, previous, and next entries. Render:

- breadcrumb: Notes → area → series;
- title, description, language, dates, tags, and source notice;
- language switch when `translation` exists;
- sidebar, `<slot />`, table of contents, and adjacent links;
- `data-pagefind-body` on the article body;
- Pagefind metadata for title, area, tags, and language.

- [ ] **Step 4: Replace the notes landing page**

Render total article count, area cards with counts, recently updated entries, top tags, and a search call to action. Keep all copy in English where the current global site is English, while displaying Chinese article titles unchanged.

- [ ] **Step 5: Connect dynamic article routes**

In `[...slug].astro`, fetch non-draft notes, build static paths, render the entry, derive headings from `render(entry)`, and call all navigation helpers. Use `encodeURI`-safe Astro-generated paths rather than manually decoding IDs.

- [ ] **Step 6: Update global navigation labels**

Change `Notes` to `Knowledge` in the visible navigation while retaining the `/notes` URL. Remove `AI Chat` from primary navigation because synthesized Q&A is outside the first release; keep `/chat` reachable but do not feature it.

- [ ] **Step 7: Verify generated routes**

Run: `npm run build`

Expected: Astro check passes; all note paths build; no duplicate route or schema errors appear.

- [ ] **Step 8: Commit knowledge pages**

```bash
git add src/components src/layouts src/pages/notes
git commit -m "feat: add documentation knowledge experience"
```

### Task 5: Add static full-text search

**Files:**
- Modify: `package.json`
- Create: `package-lock.json`
- Modify: `src/pages/search.astro`
- Modify: `.github/workflows/deploy.yml`

**Interfaces:**
- Produces: `npm run build` that runs Astro validation/build followed by Pagefind indexing.
- Produces: browser search against `/pagefind/pagefind.js`.

- [ ] **Step 1: Install Pagefind and split build scripts**

Run: `npm install --save-dev pagefind`

Set scripts to:

```json
{
  "scripts": {
    "check": "astro check",
    "build:astro": "astro build",
    "index": "pagefind --site dist",
    "build": "npm run check && npm run build:astro && npm run index"
  }
}
```

- [ ] **Step 2: Replace the metadata-only search**

Render a progressively enhanced search form. On input, dynamically import `/pagefind/pagefind.js`, call `pagefind.search(query)`, await result data, and display title, excerpt, area, language, and URL. Escape rendered text or create DOM nodes without assigning untrusted values to `innerHTML`.

- [ ] **Step 3: Make deployment reproducible**

Change the workflow install step from `npm install` to `npm ci`. Keep Node 22 and upload `./dist`, which now includes the Pagefind index.

- [ ] **Step 4: Verify real body-text search**

Run:

```powershell
npm run build
npx pagefind --site dist --serve
```

Search for one Chinese phrase found only in an article body and one English phrase found only in an article body.

Expected: both searches return the correct note, and draft/excluded files do not appear.

- [ ] **Step 5: Commit search and deployment**

```bash
git add package.json package-lock.json src/pages/search.astro .github/workflows/deploy.yml
git commit -m "feat: add static full-text knowledge search"
```

### Task 6: Finish responsive styling and final validation

**Files:**
- Modify: `src/styles/global.css`
- Modify: `README.md`

**Interfaces:**
- Produces: desktop three-column reading layout and mobile collapsible navigation.
- Produces: documented authoring workflow for the repository-only content source.

- [ ] **Step 1: Add focused documentation styles**

Add classes for the landing metrics, area cards, knowledge shell, sticky sidebar, article width, source notice, language switch, table of contents, adjacent links, accessible focus states, responsive tables, code blocks, and images. At widths below 960px hide the right table of contents; below 720px collapse the left navigation behind a `<details>` trigger and keep the article single-column.

- [ ] **Step 2: Document future authoring**

Update `README.md` so new notes are added only under `src/content/notes/`, list every required frontmatter field, show a complete Chinese example, document `npm test`, `npm run build`, and state that the old `3-TechNotes` directory is no longer a source.

- [ ] **Step 3: Run automated verification**

Run:

```powershell
npm test
npm run build
git status --short
```

Expected: all tests pass; Astro and Pagefind finish successfully; status lists only the intended styling and README changes before the final commit.

- [ ] **Step 4: Check IDE diagnostics**

Read diagnostics for `src`, `scripts`, and `tests`.

Expected: no new errors.

- [ ] **Step 5: Perform browser smoke checks**

Run `npm run dev` and verify:

- `/notes` shows correct area and article counts;
- one Chinese and one English article render;
- language switching is bidirectional for a paired series;
- source attribution appears on imported external series;
- sidebar active state, table of contents, and adjacent links work;
- mobile navigation works at 390 px width;
- `/search` returns body-text results after using the production preview.

- [ ] **Step 6: Commit final styling and documentation**

```bash
git add src/styles/global.css README.md
git commit -m "docs: finish knowledge base authoring experience"
```

- [ ] **Step 7: Review the final repository diff**

Run:

```powershell
git status --short
git log --oneline -7
git diff HEAD~6..HEAD --stat
```

Expected: clean working tree and six focused implementation commits after the design and plan commits.
