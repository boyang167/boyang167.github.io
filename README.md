# Personal Tech Hub — Astro starter

一个用于个人技术影响力建设的 Astro 静态网站原型，包含首页、关于我、技术博客、项目作品集和知识库入口。

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
- 技术博客：在关联仓库 **`personal-knowledge-wiki/raw/3-blog/`** 新增 Markdown（可复制门户 `docs/blog-article-template.md`）。支持子目录，如 `agent/foo.md` → `/blog/agent/foo/`；`draft: true` 不发布；`featured: true` 可上首页精选。本地需 sibling `../personal-knowledge-wiki` 或 submodule `external/personal-knowledge-wiki`。
- 当前头像为字母缩写的 CSS 占位设计，可替换为本人授权使用的照片。

## 目录结构

```text
src/
  components/Header.astro
  layouts/BaseLayout.astro
  pages/
    index.astro
    about.astro
    lib/blog-root.ts
    blog/index.astro
    blog/[...slug].astro
    projects/index.astro
    knowledge/index.astro
.github/workflows/deploy.yml
astro.config.mjs
```

## 设计原则

- 以内容和工程实践为中心，采用留白、低饱和背景、蓝色强调和卡片布局。
- About 页面是个人品牌入口：定位、技术理念、能力方向、经历、公开内容与联系方式。
- 当前不依赖数据库或服务端 API，适合静态托管；知识库内容来自关联仓库 **`publish/`**（见下方）。

## 关联知识库（personal-knowledge-wiki）

| 项 | 说明 |
|----|------|
| Submodule | `external/personal-knowledge-wiki` → [boyang167/personal-knowledge-wiki](https://github.com/boyang167/personal-knowledge-wiki) |
| 线上路径 | [/knowledge/](https://boyang167.github.io/knowledge/) |
| 自动同步 | wiki 的 `publish/` push 后触发门户部署（需 wiki 配置 `PORTAL_REPO_TOKEN`） |

克隆与 Token 配置见 [.github/KNOWLEDGE_WIKI_SETUP.md](.github/KNOWLEDGE_WIKI_SETUP.md)。

```bash
git submodule update --init --recursive
```
