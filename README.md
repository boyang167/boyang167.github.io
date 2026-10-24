# Personal Tech Hub — Astro starter

一个用于个人技术影响力建设的 Astro 静态网站原型，包含首页、自我介绍、技术博客、项目作品集和知识库入口。

## 本地运行

```bash
npm install
npm run dev
```

浏览器打开 Astro 输出的本地地址（通常为 `http://localhost:4321`）。

## 构建

```bash
npm run build
npm run preview
```

## 发布到 GitHub Pages

本仓库远程为 **`boyang167/boyang167.github.io`**（GitHub 用户站，根路径部署）。

| 配置项 | 当前值 |
|--------|--------|
| `site` | `https://boyang167.github.io` |
| `base` | （无，站点在域名根路径） |
| 线上地址 | https://boyang167.github.io/ |

### 首次启用 Pages（必做一次）

详见 [.github/PAGES_SETUP.md](.github/PAGES_SETUP.md)。简要步骤：

1. 等 [Actions](https://github.com/boyang167/boyang167.github.io/actions) 中 **Deploy Astro to GitHub Pages** 成功（会创建/更新 `gh-pages` 分支）。
2. 打开 [Pages 设置](https://github.com/boyang167/boyang167.github.io/settings/pages)。
3. **Source** 选 **Deploy from a branch** → 分支 **`gh-pages`** → 目录 **`/ (root)`** → Save。

### 日常发布

推送到 `main` 后，`.github/workflows/deploy.yml` 会自动构建并部署。

## 发布前必改内容

- 在 `src/components/Header.astro` 和 `src/layouts/BaseLayout.astro` 替换网站名称（如需）。
- 在 `src/pages/about.astro` 替换个人简介、经历、技术理念和联系信息。时间线文案是结构示例，不是已经核实的个人履历。
- 在 `src/pages/about.astro` 将 GitHub、LinkedIn、邮箱占位链接替换为真实链接。
- 在 `src/pages/projects/index.astro` 替换项目描述、状态和真实成果；不公开的企业信息不要放入公开站点。
- 在 `src/pages/blog/index.astro` 更新文章列表；每篇文章需要在 `src/pages/blog/[slug].astro` 的 `getStaticPaths()` 中添加对应数据，或后续迁移到 Astro Content Collections。
- 当前头像为字母缩写的 CSS 占位设计，可替换为本人授权使用的照片。

## 目录结构

```text
src/
  components/Header.astro
  layouts/BaseLayout.astro
  pages/
    index.astro
    about.astro
    blog/index.astro
    blog/[slug].astro
    projects/index.astro
    knowledge/index.astro
.github/workflows/deploy.yml
astro.config.mjs
```

## 设计原则

- 以内容和工程实践为中心，采用留白、低饱和背景、蓝色强调和卡片布局。
- About 页面是个人品牌入口：定位、技术理念、能力方向、经历、公开内容与联系方式。
- 当前不依赖数据库或服务端 API，适合静态托管；知识库先作为公开入口，后续可独立迁移到 Starlight。
