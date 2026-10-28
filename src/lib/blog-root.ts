import fs from 'node:fs';
import path from 'node:path';

/** 博客 Markdown 根目录：wiki `raw/3-blog`（本地 sibling 或 submodule） */
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
  return candidates[0] ?? fallback;
}

export const BLOG_CONTENT_ROOT = resolveBlogRoot();
