import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIRS = new Set(['img', '.git', 'node_modules']);

function countCategoryDirs(noteRoot) {
  if (!fs.existsSync(noteRoot)) return 0;
  return fs.readdirSync(noteRoot, { withFileTypes: true }).filter(
    (d) => d.isDirectory() && d.name !== 'img',
  ).length;
}

function resolveNotesRoot() {
  const fallback = path.join(root, 'external', 'personal-knowledge-wiki', 'raw', '1-Note');
  const candidates = [
    path.join(root, '..', 'personal-knowledge-wiki', 'raw', '1-Note'),
    fallback,
  ].filter((p) => fs.existsSync(p));
  if (candidates.length === 0) return fallback;
  candidates.sort((a, b) => countCategoryDirs(b) - countCategoryDirs(a));
  return candidates[0];
}

function listMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue;
      out.push(...listMarkdownFiles(full));
      continue;
    }
    if (ent.name.endsWith('.md')) out.push(full);
  }
  return out;
}

/** 与 wiki-notes rewriteNoteMediaUrls 引用的路径一致 */
function collectImageRefs(markdown) {
  const refs = new Set();
  const patterns = [
    /\]\(\.\.\/img\/([^)]+)\)/g,
    /\]\(\.\/img\/([^)]+)\)/g,
    /\]\(img\/([^)]+)\)/g,
    /src="\.\.\/img\/([^"]+)"/g,
    /src="\.\/img\/([^"]+)"/g,
  ];
  for (const re of patterns) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(markdown)) !== null) {
      refs.add(m[1].replace(/\\/g, '/'));
    }
  }
  return refs;
}

function emptyDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    fs.rmSync(path.join(dir, name), { recursive: true, force: true });
  }
}

const noteRoot = resolveNotesRoot();
const destRoot = path.join(root, 'public', 'notes-media', 'img');

function dirHasImageFiles(dir) {
  if (!fs.existsSync(dir)) return false;
  return fs.readdirSync(dir, { withFileTypes: true }).some((e) => e.isFile());
}

function resolveImgSrc() {
  const candidates = [
    path.join(noteRoot, 'img'),
    path.join(root, 'external', 'personal-knowledge-wiki', 'raw', '1-Note', 'img'),
  ];
  for (const dir of candidates) {
    if (dirHasImageFiles(dir)) return dir;
  }
  return null;
}

const imgSrc = resolveImgSrc();

console.log('[prepare-note-assets] notes root:', noteRoot);

if (!imgSrc) {
  console.warn('[prepare-note-assets] skip: no img/ directory with files (check submodule or restore raw/1-Note/img)');
  process.exit(0);
}

console.log('[prepare-note-assets] img source:', imgSrc);

const mdFiles = listMarkdownFiles(noteRoot);
const wanted = new Set();
for (const file of mdFiles) {
  const text = fs.readFileSync(file, 'utf8');
  for (const ref of collectImageRefs(text)) wanted.add(ref);
}

fs.mkdirSync(destRoot, { recursive: true });
emptyDir(destRoot);

let copied = 0;
let missing = 0;
for (const ref of wanted) {
  const from = path.join(imgSrc, ref);
  const to = path.join(destRoot, ref);
  if (!fs.existsSync(from)) {
    missing += 1;
    continue;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  copied += 1;
}

console.log(
  `[prepare-note-assets] ${mdFiles.length} markdown · ${wanted.size} image refs · copied ${copied}${missing ? ` · missing ${missing}` : ''}`,
);
