import fs from 'node:fs';
import path from 'node:path';

function countBlogMarkdown(root: string): number {
  if (!fs.existsSync(root)) return 0;
  let n = 0;
  const stack = [root];
  while (stack.length) {
    const dir = stack.pop()!;
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) stack.push(full);
      else if (ent.isFile() && ent.name.endsWith('.md')) n++;
    }
  }
  return n;
}

/** 博客 Markdown 根目录：wiki `raw/3-blog`（本地 sibling 或 submodule，取 Markdown 更多的一侧） */
export function resolveBlogRoot(): string {
  const cwd = process.cwd();
  const fallback = path.join(
    cwd,
    'external',
    'personal-knowledge-wiki',
    'raw',
    '3-blog',
  );
  const candidates = [
    path.join(cwd, '..', 'personal-knowledge-wiki', 'raw', '3-blog'),
    fallback,
  ].filter((p) => fs.existsSync(p));
  if (candidates.length === 0) return fallback;
  candidates.sort((a, b) => countBlogMarkdown(b) - countBlogMarkdown(a));
  return candidates[0];
}

export const BLOG_CONTENT_ROOT = resolveBlogRoot();
