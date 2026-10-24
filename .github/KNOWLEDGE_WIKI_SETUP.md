# 知识库仓库关联（personal-knowledge-wiki）

门户通过 **Git Submodule** 引用 wiki，并在 **`publish/`** 变更时 **自动重建** GitHub Pages。

| 仓库 | 角色 |
|------|------|
| [boyang167/personal-knowledge-wiki](https://github.com/boyang167/personal-knowledge-wiki) | 知识源；对外仅 `publish/` |
| [boyang167/boyang167.github.io](https://github.com/boyang167/boyang167.github.io) | 本门户；submodule 路径 `external/personal-knowledge-wiki` |

## 本地首次克隆门户

```bash
git clone --recurse-submodules https://github.com/boyang167/boyang167.github.io.git
cd boyang167.github.io
npm install
npm run dev
```

已克隆但未带子模块：

```bash
git submodule update --init --recursive
```

## 自动部署（wiki → 门户）

1. 在 **wiki** 仓库 Settings → Secrets → Actions 新建 **`PORTAL_REPO_TOKEN`**  
   - 使用 Fine-grained PAT 或 Classic PAT（`repo` 或至少对 **boyang167.github.io** 有 **Contents: Read** + 能调用 `repository_dispatch` 的权限）。
2. 向 **`publish/`** 提交并 push 到 **`main`**。  
3. Wiki workflow [notify-portal.yml](https://github.com/boyang167/personal-knowledge-wiki/blob/main/.github/workflows/notify-portal.yml) 会向门户发送 `wiki-publish-updated`。  
4. 门户 [deploy.yml](./workflows/deploy.yml) 拉取 submodule、checkout 对应 wiki SHA、构建并更新 **`gh-pages`**。

未配置 `PORTAL_REPO_TOKEN` 时，wiki 侧 workflow 会 **跳过 dispatch**（仅 warning），你仍可手动 push 门户 `main` 或 **workflow_dispatch** 部署。

## 日常写 wiki

1. 在 `personal-knowledge-wiki` 维护 `wiki/`（Agent / 本地）。  
2. 审核通过后 **手动** 复制到 `publish/`（见 wiki 的 `publish/README.md`）。  
3. Push wiki → 门户自动更新（配置 token 后）。

本地联调 publish 未 push 时，在 submodule 目录拉分支或复制文件后 `npm run dev` 即可预览。
