import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

/** Submodule path: personal-knowledge-wiki → publish/ */
export const WIKI_PUBLISH_ROOT = path.join(
  process.cwd(),
  'external',
  'personal-knowledge-wiki',
  'publish',
);

export type KnowledgeEntry = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  updated: string;
  category: string;
  body: string;
};

function listMarkdownFiles(dir: string, relativeTo: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) {
      out.push(...listMarkdownFiles(full, relativeTo));
      continue;
    }
    if (!name.name.endsWith('.md') || name.name.toLowerCase() === 'readme.md') continue;
    out.push(path.relative(relativeTo, full).replace(/\\/g, '/'));
  }
  return out;
}

export function loadPublishEntries(): KnowledgeEntry[] {
  const files = listMarkdownFiles(WIKI_PUBLISH_ROOT, WIKI_PUBLISH_ROOT);
  const entries = files.map((rel) => {
    const raw = fs.readFileSync(path.join(WIKI_PUBLISH_ROOT, rel), 'utf8');
    const { data, content } = matter(raw);
    const slug = rel.replace(/\.md$/i, '');
    const segments = slug.split('/');
    const category = segments.length > 1 ? segments[0] : 'general';
    return {
      slug,
      title: String(data.title ?? slug.split('/').pop() ?? slug),
      summary: String(data.summary ?? ''),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      updated: String(data.updated ?? ''),
      category,
      body: content.trim(),
    };
  });
  return entries.sort((a, b) => {
    const da = a.updated || '';
    const db = b.updated || '';
    if (da !== db) return db.localeCompare(da);
    return a.title.localeCompare(b.title, 'zh-CN');
  });
}

export function loadPublishEntry(slug: string): KnowledgeEntry | undefined {
  return loadPublishEntries().find((e) => e.slug === slug);
}

export function wikiPublishAvailable(): boolean {
  return fs.existsSync(WIKI_PUBLISH_ROOT);
}
