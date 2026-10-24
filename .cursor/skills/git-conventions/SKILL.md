---
name: git-conventions
description: >-
  Enforces Git workflow for personal-tech-portal: Conventional Commits, branch
  naming, safe commit/push/PR steps, and GitHub Pages deploy rules. Use when the
  user asks to commit, push, create a branch or PR, write a commit message, or
  mentions git 规范、提交、分支、合并、GitHub Pages 部署.
---

# Git 规范（personal-tech-portal）

本 skill 适用于 **personal-tech-portal**（Astro 静态站 + GitHub Actions 部署 Pages）。Agent 执行任何 Git 操作前必须先读并遵守本文。

## 仓库约定

| 项 | 约定 |
|----|------|
| 本地目录 | `personal-tech-portal`（工作区路径可不同，以含本 skill 的仓库根为准） |
| GitHub 远程 | **`boyang167/boyang167.github.io`**（用户站，个人主站） |
| `origin` URL | `https://github.com/boyang167/boyang167.github.io.git` |
| 线上地址 | **https://boyang167.github.io/**（根路径，无 `base`） |
| 默认分支 | `main` |
| 部署 | 推送到 `main` 触发 `.github/workflows/deploy.yml` |
| 包管理 | npm（`package-lock.json` 应提交） |
| 忽略项 | 见根目录 `.gitignore`（含 `node_modules/`、`dist/`、`.astro/`） |

### Astro / Pages 配置（方案 B · 用户根域）

- `astro.config.mjs`：`site: 'https://boyang167.github.io'`，**不要**设置 `base`（除非改回项目站）。
- Pages 首次启用：仓库 **Settings → Pages → Source = GitHub Actions**（见 `.github/PAGES_SETUP.md`）。
- **不要**默认推送到 `boyang167/boyang.github.io`（旧项目站路径）；仅当用户明确要求时使用该远程并恢复 `base: '/boyang.github.io'`。

### Windows 提交注意

若 `git commit` 报 `unknown option trailer`，使用完整路径 Git：

`C:\1-install\13-git\Git\mingw64\bin\git.exe`

或用 `git write-tree` + `git commit-tree` + `git update-ref` 创建提交（勿改 git config）。

## 分支命名

```
main                          # 可发布分支
feat/<short-topic>            # 新功能
fix/<short-topic>             # 缺陷修复
docs/<short-topic>            # 仅文档
chore/<short-topic>           # 工具、依赖、配置
ci/<short-topic>              # CI / 部署
refactor/<short-topic>        # 重构（无行为变化）
```

- 使用小写英文与连字符，主题简短（如 `feat/i18n-about-pages`）。
- 单人在 `main` 上小步提交可接受；较大改动优先开 `feat/*` 或 `fix/*` 再合并。

## 提交信息（Conventional Commits）

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### type（必选）

| type | 用途 |
|------|------|
| `feat` | 新功能、新页面、新内容块 |
| `fix` | 修复 bug、错误文案、布局问题 |
| `docs` | README、注释、skill 文档 |
| `style` | 纯样式/格式，不改逻辑 |
| `refactor` | 重构，不改变对外行为 |
| `perf` | 性能优化 |
| `test` | 测试 |
| `build` | 构建系统、Astro 配置 |
| `ci` | GitHub Actions、部署 |
| `chore` | 依赖升级、杂项 |

### scope（推荐）

与目录对应，例如：`site`、`about`、`blog`、`projects`、`knowledge`、`i18n`、`layout`、`deploy`、`deps`、`skills`。

### subject 规则

- 使用**祈使句、现在时**（「添加」用「add」英文提交时用 add/fix，中文团队可用中文 subject：`fix(i18n): 修复 About 页英文残留`）。
- 首行 ≤ 72 字符，不加句号。
- 说明 **why**，不要只列文件名。

### 正文与页脚

- 正文：变更动机、取舍、与 issue 的关系。
- `BREAKING CHANGE:` 或 `Closes #123` 放在页脚。

更多示例见 [references/commit-examples.md](references/commit-examples.md)。

## Agent 提交工作流（必须遵守）

仅在用户**明确要求 commit** 时创建提交（用户规则：不要主动 commit）。

1. 并行执行：`git status`、`git diff`（含 staged）、`git log -3 --oneline`（对齐历史风格）。
2. 检查：不提交 `.env`、密钥、`node_modules`、`dist`、`.astro` 缓存。
3. `git add` 只加与本次任务相关的文件。
4. 用 HEREDOC 写 commit message（Windows PowerShell 可用 here-string 等价方式）。
5. 提交后 `git status` 确认成功。
6. **不要** `git push --force` 到 `main`；**不要**改 `git config`；**不要** `--no-verify` 除非用户明确要求。
7. 未要求 push 时，不要 push。

## Push 与 GitHub Pages

- 检查远程：`git remote -v`，应为 `boyang167.github.io.git`。
- 首次：`git remote add origin https://github.com/boyang167/boyang167.github.io.git`，`git push -u origin main`。
- 推送前确认 `site` 与部署目标一致（当前主站无 `base`）。
- 部署失败：先看 [Actions](https://github.com/boyang167/boyang167.github.io/actions)，本地 `npm run build` 必须通过；deploy 失败常见原因是 Pages 未选 GitHub Actions。

## Pull Request（可选）

标题与首条 commit 的 type/scope 一致。描述模板：

```markdown
## Summary
- …

## Test plan
- [ ] `npm run dev` 本地浏览
- [ ] `npm run build` 无报错
- [ ] 中英文切换（如改到 i18n）
```

## 禁止与安全

- 禁止 force push `main` / `master`（除非用户书面要求并知悉风险）。
- 禁止提交含口令、token、私钥的文件。
- 避免 `git commit --amend`：仅当用户要求、且 HEAD 为本会话创建、且未 push 时考虑。

## 与本项目相关的常见 commit 示例

```
feat(blog): add agent-evaluation article stub
fix(i18n): translate knowledge sidebar labels to English
docs(readme): document boyang167.github.io root Pages URL
build(site): set site URL for user GitHub Pages root
ci(deploy): pin Node version in workflow
chore(deps): bump astro to 5.x
skills(git): add git-conventions skill for agents
```
