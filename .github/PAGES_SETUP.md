# 启用 GitHub Pages（boyang167/boyang167.github.io）

个人主站：**https://boyang167.github.io/**

## 为什么 deploy 会 404？

若日志出现 `Failed to create deployment (status: 404)` 和 *Ensure GitHub Pages has been enabled*，说明 **仓库还没在 Settings 里打开 Pages**。  
当前 workflow 已改为把构建结果推到 **`gh-pages` 分支**，不再使用 `actions/deploy-pages`。

## 设置步骤（按顺序）

### 1. 先跑通 Actions

1. 打开 https://github.com/boyang167/boyang167.github.io/actions  
2. 运行 **Deploy Astro to GitHub Pages**，等待 **build-and-deploy** 变绿。  
3. 确认仓库出现 **`gh-pages` 分支**（含 `index.html` 等）。

### 2. 再在 Settings 里绑定 Pages（必做）

1. 打开 https://github.com/boyang167/boyang167.github.io/settings/pages  
2. **Build and deployment** → **Source** 选 **Deploy from a branch**  
3. **Branch** 选 **`gh-pages`**，目录选 **`/ (root)`**，点 **Save**。  
4. 等 1～3 分钟，访问 https://boyang167.github.io/

> 若 Source 仍是 **GitHub Actions**，而 workflow 已改为推 `gh-pages`，站点不会更新——请改成 **Deploy from a branch**。

## 日常更新

向 `main` 推送代码 → Actions 自动构建并更新 `gh-pages` → 站点刷新。
