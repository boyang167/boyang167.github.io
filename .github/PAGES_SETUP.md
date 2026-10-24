# 启用 GitHub Pages（boyang167/boyang.github.io）

部署失败且 Actions 里 **deploy** 或 **Setup Pages** 报错时，通常是 **尚未在仓库里启用 Pages**。

## 一次性设置（约 30 秒）

1. 登录 GitHub，打开：  
   **https://github.com/boyang167/boyang.github.io/settings/pages**
2. **Build and deployment** → **Source** 选 **GitHub Actions**（不要选 *Deploy from a branch*）。
3. 打开 **https://github.com/boyang167/boyang.github.io/actions**
4. 选中 **Deploy Astro to GitHub Pages** → **Run workflow**（或 Re-run 最近一次失败的任务）。

## 成功后访问

https://boyang167.github.io/boyang.github.io/

（与 `astro.config.mjs` 中 `base: '/boyang.github.io'` 一致。）
