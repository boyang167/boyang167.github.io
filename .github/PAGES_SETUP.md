# 修复 GitHub Pages / Deployments 失败

主站：**https://boyang167.github.io/**  
仓库：**boyang167/boyang167.github.io**

## 一、若日志是 `deploy-pages` + HTTP 404

说明还在跑**旧 workflow**（`build` + `deploy` 两个 job），或 Pages 未启用。

**当前仓库应只有 1 个 job：`build-and-deploy`**（推送到 `gh-pages`）。  
请打开 Actions，确认最新 run 使用的是更新后的 workflow；必要时 **Re-run** 或再 push 一次 `main`。

## 二、仓库 Settings（必做，约 1 分钟）

### 1. Pages 发布源

https://github.com/boyang167/boyang167.github.io/settings/pages

| 项 | 选择 |
|----|------|
| Source | **Deploy from a branch** |
| Branch | **gh-pages** |
| Folder | **/ (root)** |

不要选 **GitHub Actions**（当前 workflow 是推 `gh-pages` 分支，不是 artifact 部署）。

### 2. Actions 写权限（peaceiris 推分支需要）

https://github.com/boyang167/boyang167.github.io/settings/actions

**Workflow permissions** → 选 **Read and write permissions** → Save。

若仍是 Read-only，`Deploy to gh-pages branch` 会 permission denied。

### 3. 仓库须为 Public（免费 Pages）

私有库需 GitHub Pro 才能用 Pages。确认仓库 **Public**。

## 三、验证顺序

1. Actions 里 **build-and-deploy** 成功（绿色）。  
2. 仓库 **Branches** 中有 **gh-pages**，且含 `index.html`。  
3. Settings → Pages 已按上表保存。  
4. 访问 https://boyang167.github.io/（可强制刷新或隐身窗口）。

## 四、日常发布

```bash
git push origin main
```

Actions 会重建并更新 `gh-pages` 分支。
