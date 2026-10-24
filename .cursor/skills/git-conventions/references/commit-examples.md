# Commit 示例（personal-tech-portal）

## 功能

```
feat(home): highlight featured projects on landing page

Surface three active projects above the fold to match portfolio goals.
```

```
feat(blog): add slug page for ml-validation

Extend getStaticPaths with grouped CV section content.
```

## 修复

```
fix(i18n): replace substring translation for mixed date lines

English mode left "阅读" in blog meta; use longest-match dict pass.
```

```
fix(layout): prevent mobile nav from overlapping hero CTA
```

## 文档与 Skill

```
docs(readme): add local dev and Pages deployment steps
```

```
docs(skills): document git branch and commit conventions
```

## CI / 构建

```
ci(deploy): enable workflow_dispatch for manual Pages deploy
```

```
build(astro): set site URL for github.io user domain
```

## 依赖与杂项

```
chore(deps): update astro and lockfile
```

```
chore: add .gitignore entries for local editor folders
```

## 不推荐

```
update stuff
fix bug
WIP
```

```
feat: changed many files (no scope, no why)
```

## 中文 subject（团队偏好时）

```
fix(i18n): 修复 Projects 页英文模式下中文标签
feat(about): 增加 TOOLBOX 技能卡片数据
docs(readme): 补充 GitHub Pages 发布前检查项
```

类型与 scope 仍建议保持英文前缀，便于与 Conventional Commits 工具链一致。
