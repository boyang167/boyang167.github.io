import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

function countBlogMarkdown(blogRoot) {
  if (!fs.existsSync(blogRoot)) return 0;
  let n = 0;
  const stack = [blogRoot];
  while (stack.length) {
    const dir = stack.pop();
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) stack.push(full);
      else if (ent.isFile() && ent.name.endsWith('.md')) n += 1;
    }
  }
  return n;
}

function resolveBlogRoot() {
  const fallback = path.join(root, 'external', 'personal-knowledge-wiki', 'raw', '3-blog');
  const candidates = [
    path.join(root, '..', 'personal-knowledge-wiki', 'raw', '3-blog'),
    fallback,
  ].filter((p) => fs.existsSync(p));
  if (candidates.length === 0) return fallback;
  candidates.sort((a, b) => countBlogMarkdown(b) - countBlogMarkdown(a));
  return candidates[0];
}

const SKIP_MD_DIRS = new Set(['img']);

function listMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    for (const ent of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, ent.name);
      if (ent.isDirectory()) {
        if (SKIP_MD_DIRS.has(ent.name)) continue;
        stack.push(full);
        continue;
      }
      if (ent.name.endsWith('.md')) out.push(full);
    }
  }
  return out;
}

/**
 * 与 blog.ts rewriteBlogMediaUrls 一致：
 * - `../img/…` → public/blog-media/img/…
 * - `./…` → public/blog-media/{mdDir}/…
 */
function collectImageCopyJobs(markdown, mdDir) {
  /** @type {{ from: string, to: string }[]} */
  const jobs = [];
  const seen = new Set();

  function add(from, to) {
    const key = `${from}|${to}`;
    if (seen.has(key)) return;
    seen.add(key);
    jobs.push({ from, to });
  }

  const patterns = [
    { re: /!\[[^\]]*]\(\.\.\/img\/([^)]+)\)/g, kind: 'shared' },
    { re: /src="\.\.\/img\/([^"]+)"/g, kind: 'shared' },
    { re: /!\[[^\]]*]\(\.\/([^)]+)\)/g, kind: 'local' },
    { re: /src="\.\/([^"]+)"/g, kind: 'local' },
  ];

  for (const { re, kind } of patterns) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(markdown)) !== null) {
      const rel = m[1].replace(/\\/g, '/');
      if (kind === 'shared') {
        add(path.join(blogRoot, 'img', rel), path.join(destRoot, 'img', rel));
      } else {
        const from = mdDir ? path.join(blogRoot, mdDir, rel) : path.join(blogRoot, rel);
        const to = mdDir ? path.join(destRoot, mdDir, rel) : path.join(destRoot, rel);
        add(from, to);
      }
    }
  }
  return jobs;
}

function mdDirFromFile(blogRoot, mdFile) {
  const rel = path.relative(blogRoot, mdFile).replace(/\\/g, '/');
  const dir = path.posix.dirname(rel);
  return dir === '.' ? '' : dir;
}

const blogRoot = resolveBlogRoot();
const destRoot = path.join(root, 'public', 'blog-media');

console.log('[prepare-blog-assets] blog root:', blogRoot);

function copyJob({ from, to }) {
  if (!fs.existsSync(from)) return 'missing';
  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (fs.existsSync(to)) {
    const srcStat = fs.statSync(from);
    const dstStat = fs.statSync(to);
    if (srcStat.size === dstStat.size && srcStat.mtimeMs === dstStat.mtimeMs) {
      return 'skip';
    }
  }
  try {
    fs.copyFileSync(from, to);
    return 'copied';
  } catch (err) {
    console.warn(`[prepare-blog-assets] copy failed: ${from} (${err.code ?? err.message})`);
    return 'missing';
  }
}

if (!fs.existsSync(blogRoot)) {
  console.warn('[prepare-blog-assets] skip: blog root missing');
  process.exit(0);
}

const mdFiles = listMarkdownFiles(blogRoot);
/** @type {Map<string, { from: string, to: string }>} */
const jobsByKey = new Map();

for (const file of mdFiles) {
  const text = fs.readFileSync(file, 'utf8');
  const mdDir = mdDirFromFile(blogRoot, file);
  for (const job of collectImageCopyJobs(text, mdDir)) {
    jobsByKey.set(`${job.from}|${job.to}`, job);
  }
}

if (jobsByKey.size === 0) {
  console.log('[prepare-blog-assets] no relative image refs in blog markdown');
  process.exit(0);
}

fs.mkdirSync(destRoot, { recursive: true });

let copied = 0;
let missing = 0;

for (const job of jobsByKey.values()) {
  const result = copyJob(job);
  if (result === 'copied') copied += 1;
  else if (result === 'missing') missing += 1;
}

console.log(
  `[prepare-blog-assets] ${mdFiles.length} markdown · copied ${copied}${missing ? ` · missing ${missing}` : ''}`,
);
