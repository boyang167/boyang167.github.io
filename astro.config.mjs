import { defineConfig } from 'astro/config';

/** 避免 dev 监视 notes 大图库与 wiki 静态素材导致 EMFILE（Windows） */
function devWatchIgnored(watchPath) {
  const p = watchPath.replace(/\\/g, '/');
  if (p.includes('/public/notes-media/')) return true;
  if (p.includes('/raw/1-Note/img/')) return true;
  if (p.includes('/2-StudyMaterials/')) return true;
  return false;
}

export default defineConfig({
  site: 'https://boyang167.github.io',
  output: 'static',
  vite: {
    server: {
      watch: {
        ignored: [devWatchIgnored],
      },
    },
  },
});
