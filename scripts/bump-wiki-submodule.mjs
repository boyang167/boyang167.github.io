/**
 * 将 external/personal-knowledge-wiki 对齐到 origin/main，便于提交子模块指针。
 * CI 在 push 门户时也会 fetch wiki main；本地 clone 仅 submodule 时仍需偶尔运行本脚本并 commit。
 */
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const sub = path.join(root, 'external', 'personal-knowledge-wiki');

function run(cmd) {
  execSync(cmd, { cwd: sub, stdio: 'inherit' });
}

run('git fetch origin main');
run('git checkout FETCH_HEAD');
const sha = execSync('git rev-parse --short HEAD', { cwd: sub, encoding: 'utf8' }).trim();
console.log(`\n[bump-wiki-submodule] external/personal-knowledge-wiki @ ${sha}`);
console.log('下一步（在 personal-tech-portal 根目录）：');
console.log('  git add external/personal-knowledge-wiki');
console.log('  git commit -m "chore(submodule): bump personal-knowledge-wiki"');
console.log('  git push origin main');
