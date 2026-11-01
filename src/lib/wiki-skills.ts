import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const SKIP_DIRS = new Set(['img', '.git', 'node_modules', 'references']);

export type WikiSkillEntry = {
  slug: string;
  name: string;
  title: string;
  summary: string;
  tags: string[];
  category: string;
  body: string;
  skillPath: string;
};

function countSkillDirs(root: string): number {
  if (!fs.existsSync(root)) return 0;
  let count = 0;
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!entry.isDirectory() || SKIP_DIRS.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (fs.existsSync(path.join(full, 'SKILL.md'))) count += 1;
      walk(full);
    }
  };
  walk(root);
  return count;
}

const SIBLING_SKILLS_ROOT = (cwd: string) =>
  path.join(cwd, '..', 'personal-knowledge-wiki', 'raw', '4-Skill');

/** 优先 sibling wiki（本地开发），再 fallback 到 submodule；按 Skill 数量取更全的一份 */
export function resolveSkillsRoot(): string {
  const cwd = process.cwd();
  const sibling = SIBLING_SKILLS_ROOT(cwd);
  const fallback = path.join(cwd, 'external', 'personal-knowledge-wiki', 'raw', '4-Skill');
  const candidates = [sibling, fallback].filter((p) => fs.existsSync(p));
  if (candidates.length === 0) return fallback;
  candidates.sort((a, b) => {
    const byCount = countSkillDirs(b) - countSkillDirs(a);
    if (byCount !== 0) return byCount;
    if (a === sibling) return -1;
    if (b === sibling) return 1;
    return 0;
  });
  return candidates[0];
}

function listSkillFiles(dir: string, relativeTo: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, name.name);
    if (name.isDirectory()) {
      if (SKIP_DIRS.has(name.name)) continue;
      const skillFile = path.join(full, 'SKILL.md');
      if (fs.existsSync(skillFile)) {
        out.push(path.relative(relativeTo, skillFile).replace(/\\/g, '/'));
      } else {
        out.push(...listSkillFiles(full, relativeTo));
      }
      continue;
    }
  }
  return out;
}

function titleFromName(name: string, fallback: string): string {
  if (name) return name;
  return fallback.replace(/-/g, ' ');
}

function categoryFromSlug(slug: string): string {
  const segments = slug.split('/');
  return segments.length > 1 ? segments[0] : 'skills';
}

export function skillCategoryLabel(id: string): string {
  if (id === 'skills') return 'Skill';
  return id.replace(/-/g, ' ');
}

let skillsCache: WikiSkillEntry[] | undefined;
let skillsCacheRoot: string | undefined;

export function loadWikiSkills(): WikiSkillEntry[] {
  const root = resolveSkillsRoot();
  const dev = typeof import.meta !== 'undefined' && import.meta.env?.DEV;
  if (!dev && skillsCache && skillsCacheRoot === root) {
    return skillsCache;
  }
  const files = listSkillFiles(root, root);
  const entries = files.map((rel) => {
    const abs = path.join(root, rel);
    const raw = fs.readFileSync(abs, 'utf8');
    const { data, content } = matter(raw);
    const slug = path.dirname(rel).replace(/\\/g, '/');
    const folderName = slug.split('/').pop() ?? slug;
    const name = String(data.name ?? folderName);
    const body = content.trim();
    return {
      slug,
      name,
      title: titleFromName(name, folderName),
      summary: String(data.description ?? '').trim(),
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      category: categoryFromSlug(slug),
      body,
      skillPath: rel,
    };
  });
  const sorted = entries.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category, 'zh-CN');
    return a.title.localeCompare(b.title, 'zh-CN');
  });
  if (!dev) {
    skillsCache = sorted;
    skillsCacheRoot = root;
  }
  return sorted;
}

export function loadWikiSkill(slug: string): WikiSkillEntry | undefined {
  return loadWikiSkills().find((e) => e.slug === slug);
}

export function listSkillCategories(): string[] {
  const fromEntries = [...new Set(loadWikiSkills().map((e) => e.category))];
  return fromEntries.sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

export function wikiSkillsAvailable(): boolean {
  return fs.existsSync(resolveSkillsRoot());
}
