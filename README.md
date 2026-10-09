# Boyang Wang Knowledge Base

Astro 5 personal site and static technical knowledge base for AI agents, data systems, architecture, SRE, web engineering and bioprocess applications.

## Local development

```bash
npm ci
npm test
npm run dev
```

`npm run build` performs Astro type checking, generates the static site, and builds the Pagefind full-text index.

## Writing knowledge documents

The website repository is the only maintained content source. Add new Markdown or MDX files under `src/content/notes/`; the former `3-TechNotes` directory is no longer read or synchronized.

Every note requires:

```yaml
---
title: Agent 上下文工程
description: 构建长对话 Agent 时管理上下文预算的方法。
date: 2026-10-09
updated: 2026-10-09
area: AI Agent
series: Agent Architecture
order: 4
language: zh-CN
translationKey: agent-context-engineering
tags: [Agent, Context Engineering]
draft: false
---
```

- `language` must be `zh-CN` or `en`.
- Give translated editions the same `translationKey`.
- `updated`, `series`, `order`, `translationKey`, and `source` are optional.
- Add `source` for externally attributed material.
- Put article assets under `public/knowledge-assets/` and reference them with absolute paths such as `/knowledge-assets/ai-agent/diagram.png`.

## Content migration

The one-time migration pipeline remains available for audit and reproducibility:

```powershell
node scripts/migrate-notes.mjs --source "A:\17-workspace\3-TechNotes"
```

It normalizes metadata, preserves bilingual pairs, localizes recoverable assets, and records irrecoverable references in `docs/migration-report.md`.

## Deployment

Push to `main`. GitHub Actions installs from `package-lock.json`, builds Astro and Pagefind, and deploys `dist/` to GitHub Pages.