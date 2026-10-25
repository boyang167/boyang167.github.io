import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { NOTE_CATEGORY_ORDER, sortCategoryIds } from './note-categories';

const SKIP_DIRS = new Set(['img', '.git', 'node_modules']);

export type WikiNoteEntry = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  updated: string;
  status: string;
  category: string;
  body: string;
};

function countCategoryDirs(root: string): number {
  if (!fs.existsSync(root)) return 0;
  return fs.readdirSync(root, { withFileTypes: true }).filter(
    (d) => d.isDirectory() && !SKIP_DIRS.has(d.name),
  ).length;
}

/** 优先使用目录更全的路径：本地 sibling 仓库或 submodule */
export function resolveNotesRoot(): string {
  const cwd = process.cwd();
  const fallback = path.join(cwd, 'external', 'personal-knowledge-wiki', 'raw', '1-Note');
  const candidates = [
    path.join(cwd, '..', 'personal-knowledge-wiki', 'raw', '1-Note'),
    fallback,
  ].filter((p) => fs.existsSync(p));
  if (candidates.length === 0) return fallback;
  candidates.sort((a, b) => countCategoryDirs(b) - countCategoryDirs(a));
  return candidates[0];
}

export const WIKI_NOTES_ROOT = resolveNotesRoot();

function listMarkdownFiles(dir: string, relativeTo: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) {
      if (SKIP_DIRS.has(name.name)) continue;
      out.push(...listMarkdownFiles(full, relativeTo));
      continue;
    }
    if (!name.name.endsWith('.md')) continue;
    out.push(path.relative(relativeTo, full).replace(/\\/g, '/'));
  }
  return out;
}

function titleFromMarkdown(content: string, fallback: string): string {
  const m = content.match(/^#\s+(.+)$/m);
  return m?.[1]?.trim() || fallback;
}

function summaryFromMarkdown(content: string): string {
  const lines = content.split('\n');
  let pastTitle = false;
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (!pastTitle && t.startsWith('#')) {
      pastTitle = true;
      continue;
    }
    if (t.startsWith('#')) continue;
    if (t.startsWith('![')) continue;
    if (t.startsWith('|')) continue;
    if (t.startsWith('```')) continue;
    return t.replace(/\*\*/g, '').slice(0, 160);
  }
  return '';
}

export function rewriteNoteMediaUrls(markdown: string): string {
  return markdown
    .replace(/\]\(\.\.\/img\//g, '](/notes-media/img/')
    .replace(/\]\(\.\/img\//g, '](/notes-media/img/')
    .replace(/\]\(img\//g, '](/notes-media/img/')
    .replace(/src="\.\.\/img\//g, 'src="/notes-media/img/')
    .replace(/src="\.\/img\//g, 'src="/notes-media/img/');
}

export function listNoteCategories(): string[] {
  if (!fs.existsSync(WIKI_NOTES_ROOT)) return [...NOTE_CATEGORY_ORDER];
  const onDisk = fs
    .readdirSync(WIKI_NOTES_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !SKIP_DIRS.has(d.name))
    .map((d) => d.name);
  return sortCategoryIds([...new Set([...NOTE_CATEGORY_ORDER, ...onDisk])]);
}

let wikiNotesCache: WikiNoteEntry[] | undefined;
let wikiNotesCacheRoot: string | undefined;

export function loadWikiNotes(): WikiNoteEntry[] {
  if (wikiNotesCache && wikiNotesCacheRoot === WIKI_NOTES_ROOT) {
    return wikiNotesCache;
  }
  const files = listMarkdownFiles(WIKI_NOTES_ROOT, WIKI_NOTES_ROOT);
  const entries = files.map((rel) => {
    const raw = fs.readFileSync(path.join(WIKI_NOTES_ROOT, rel), 'utf8');
    const { data, content } = matter(raw);
    const slug = rel.replace(/\.md$/i, '');
    const segments = slug.split('/');
    const category = segments.length > 1 ? segments[0] : '1-Note';
    const baseName = slug.split('/').pop() ?? slug;
    const body = content.trim();
    return {
      slug,
      title: String(data.title ?? titleFromMarkdown(body, baseName)),
      summary: String(data.summary ?? summaryFromMarkdown(body)),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      updated: String(data.updated ?? ''),
      status: String(data.status ?? 'raw'),
      category,
      body,
    };
  });
  const sorted = entries.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category, 'zh-CN');
    return a.slug.localeCompare(b.slug, 'zh-CN');
  });
  wikiNotesCache = sorted;
  wikiNotesCacheRoot = WIKI_NOTES_ROOT;
  return sorted;
}

export function loadWikiNote(slug: string): WikiNoteEntry | undefined {
  return loadWikiNotes().find((e) => e.slug === slug);
}

export function wikiNotesAvailable(): boolean {
  return fs.existsSync(WIKI_NOTES_ROOT);
}
