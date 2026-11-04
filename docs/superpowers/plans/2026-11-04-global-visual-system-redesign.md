# Global Visual System Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 统一个人技术门户的视觉系统、页面布局和交互细节，形成高级编辑感与工程秩序兼具的全站体验。

**Architecture:** 以 `BaseLayout.astro` 中的全局 tokens 和基础组件为单一视觉源，`Header.astro` 负责导航交互，各页面仅保留与内容类型相关的 scoped 样式。列表页共享视觉语言，详情页共享阅读壳层，不引入新依赖或客户端框架。

**Tech Stack:** Astro 5、HTML、scoped/global CSS、原生 JavaScript、现有 Markdown/Mermaid 渲染链路。

## Global Constraints

- 不改变现有导航栏目、内容来源、Markdown 结构和发布流程。
- 不新增 UI 库、动画库或客户端框架。
- 保持中文/英文切换、浅色/深色模式和 Astro 静态输出。
- 全站不得出现页面级横向滚动；代码、表格和图示可局部滚动。
- 所有交互控件保留键盘焦点和至少 40px 的可操作高度。

---

### Task 1: 建立全局设计系统与导航外壳

**Files:**
- Modify: `src/layouts/BaseLayout.astro:511-end`
- Modify: `src/components/Header.astro`

**Interfaces:**
- Consumes: 现有全局 class（`.wrap`、`.card`、`.tag`、`.button-*`、`.page-hero`）。
- Produces: 全站 tokens、基础组件状态、sticky Header、统一 Footer。

- [ ] **Step 1: 运行基线构建**

Run:

```powershell
npm run build
```

Expected: exit code `0`，所有静态路由正常生成。

- [ ] **Step 2: 重构全局 tokens**

在 `:root` 与 `.dark` 中定义：

```css
:root {
  --content-max: 1440px;
  --reading-max: 760px;
  --page-gutter: clamp(20px, 4vw, 64px);
  --bg: #f5f7fb;
  --surface: #ffffff;
  --surface-raised: #fbfcff;
  --surface-muted: #eef2f8;
  --text: #15213a;
  --muted: #647089;
  --subtle: #8b96aa;
  --line: #dfe5ef;
  --blue: #315ee8;
  --blue-strong: #2347b7;
  --blue-soft: #eaf0ff;
  --navy: #14233f;
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --shadow-sm: 0 1px 2px rgba(20, 35, 63, .04);
  --shadow-md: 0 12px 32px rgba(20, 35, 63, .07);
  --shadow-lg: 0 24px 64px rgba(20, 35, 63, .1);
}
```

深色模式为背景、三层 surface、文字、边框和阴影分别定义值，避免简单反色。

- [ ] **Step 3: 统一基础组件**

更新 `.wrap`、标题、正文、`.section`、`.card`、`.tag`、按钮、输入框、链接和 focus-visible：

```css
.card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  transition: border-color .16s ease, box-shadow .16s ease, transform .16s ease;
}

.card:hover {
  border-color: color-mix(in srgb, var(--blue) 18%, var(--line));
  box-shadow: var(--shadow-md);
}
```

- [ ] **Step 4: 实现 sticky Header**

让 `.site-header` 使用：

```css
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  min-height: 72px;
  background: color-mix(in srgb, var(--bg) 84%, transparent);
  backdrop-filter: blur(18px);
  border-bottom: 1px solid color-mix(in srgb, var(--line) 78%, transparent);
}
```

保留现有导航、语言、主题和移动菜单逻辑；调整 active、hover、移动菜单面板和触控尺寸。

- [ ] **Step 5: 统一 Footer 与 reduced motion**

Footer 压缩高度并保持单层分隔；`prefers-reduced-motion` 下关闭位移与非必要过渡。

- [ ] **Step 6: 检查全局诊断与构建**

Run:

```powershell
npm run build
```

Expected: exit code `0`；Header 在所有页面存在且无模板错误。

- [ ] **Step 7: 提交全局系统**

```powershell
git add src/layouts/BaseLayout.astro src/components/Header.astro
git commit -m "style: establish global editorial design system"
```

---

### Task 2: 精修首页与关于我页面

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/pages/about.astro`

**Interfaces:**
- Consumes: Task 1 的全局 tokens、卡片、按钮、标签与 Header。
- Produces: 高质感首页 Hero、知识入口、精选文章与统一能力区块。

- [ ] **Step 1: 优化首页首屏节奏**

压缩 `.home-hero-compact` 的上下间距，限制文字行宽，增强 eyebrow、定位文案与 CTA 的层级；右侧视觉使用 `--surface-raised`、细网格和低对比渐变。

- [ ] **Step 2: 优化知识系统入口**

将 `.project-links` 统一为导航卡：

```css
.project-links a {
  min-height: 76px;
  padding: 16px 18px;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  background: var(--surface);
}
```

标题、说明和箭头建立明确层级，hover 仅使用边框、背景和轻位移。

- [ ] **Step 3: 优化精选文章**

统一 `.article-card` 的图形区、正文区、标题行数、摘要行数和元信息；确保三张卡等高并使用全局表面与阴影。

- [ ] **Step 4: 统一 About 能力卡**

将 Agent、Data、ML、Full-Stack、Platform、Math 的标题、摘要、四列分组、生态/实践区和技术 chip 对齐到同一视觉规则；保留已有内容，不改变能力信息。

- [ ] **Step 5: 修正 About 响应式**

验证 1440、1024、768、390 宽度下：

- 摘要不溢出。
- 四列在中屏改两列、手机改单列。
- ML 与其他通栏卡充分利用宽度。
- 技术 chip 不截断。

- [ ] **Step 6: 构建验证**

Run:

```powershell
npm run build
```

Expected: 首页与 About 路由生成成功。

- [ ] **Step 7: 提交首页与 About**

```powershell
git add src/pages/index.astro src/pages/about.astro
git commit -m "style: refine home and about experiences"
```

---

### Task 3: 统一博客、笔记、知识库与 Skill 列表页

**Files:**
- Modify: `src/pages/blog/index.astro`
- Modify: `src/pages/notes/index.astro`
- Modify: `src/pages/knowledge/index.astro`
- Modify: `src/pages/skills/index.astro`

**Interfaces:**
- Consumes: Task 1 的页面 Hero、卡片、标签、输入框和 section 规则。
- Produces: 统一工具条、分类导航、列表卡片、日期和空状态。

- [ ] **Step 1: 重构博客工具条**

让 `.blog-toolbar-panel` 使用单层 raised surface；筛选按钮采用轻背景 active 状态；搜索框使用统一输入框高度与 focus ring。

- [ ] **Step 2: 优化博客卡片**

卡片减少大面积空白，分类/图标位于辅助层，标题与摘要成为视觉中心，日期与阅读时长形成底部元信息；桌面三列、中屏两列、移动单列。

- [ ] **Step 3: 统一 Notes 与 Knowledge**

让两个页面共享相同视觉语言：

- Sidebar 使用 sticky 目录和低对比背景。
- Category 标题成为分组锚点。
- `.knowledge-card` 使用紧凑导航卡布局。
- 摘要最多显示 2–3 行。
- 日期输出统一为 `YYYY.MM.DD`，需要在 Astro 数据映射中格式化，而不是渲染完整 Date 字符串。

- [ ] **Step 4: 优化 Skills 列表**

让 `skills-hero`、`skills-nav`、`skills-section` 和 `skill-card` 与 Notes/Knowledge 对齐，同时保留 Skill 的用途说明和图标。

- [ ] **Step 5: 统一空状态和底部说明**

空状态使用同一虚线容器、简短说明和可执行入口；底部来源说明降低视觉权重。

- [ ] **Step 6: 构建与交互验证**

Run:

```powershell
npm run build
```

Expected: 四个列表路由生成成功；博客搜索和分类筛选仍可工作。

- [ ] **Step 7: 提交列表页**

```powershell
git add src/pages/blog/index.astro src/pages/notes/index.astro src/pages/knowledge/index.astro src/pages/skills/index.astro
git commit -m "style: unify content listing experiences"
```

---

### Task 4: 统一所有详情页阅读体验

**Files:**
- Modify: `src/pages/blog/[...slug].astro`
- Modify: `src/pages/notes/[...slug].astro`
- Modify: `src/pages/knowledge/[...slug].astro`
- Modify: `src/pages/skills/[...slug].astro`

**Interfaces:**
- Consumes: Task 1 的全局排版、颜色、表面和链接规则。
- Produces: 统一详情页 Hero、正文、目录、代码、表格、图片和结尾 CTA。

- [ ] **Step 1: 对齐详情页壳层**

统一返回链接、标题、摘要、分类、日期、阅读时长与 banner 的顺序和间距；正文使用：

```css
.prose {
  max-width: var(--reading-max);
  font-size: 15px;
  line-height: 1.82;
}
```

- [ ] **Step 2: 优化正文排版**

统一 H2–H4、段落、列表、引用、链接、分隔线和锚点滚动偏移。正文标题上方留白显著大于下方留白。

- [ ] **Step 3: 优化技术内容**

- `pre`、表格和 Mermaid 外层允许局部横向滚动。
- Inline code 与 block code 使用不同 surface。
- 表格使用 sticky header（适用时）、细线和斑马层级。
- 图片使用统一圆角、边框、居中与 caption。

- [ ] **Step 4: 优化目录**

桌面端目录 sticky，当前 hover/active 状态清晰；移动端目录回到正文前并减少嵌套缩进。

- [ ] **Step 5: 统一结尾 CTA**

博客、知识库、笔记与 Skill 详情使用统一的返回/交流/相关入口样式，不改变实际链接目标。

- [ ] **Step 6: 构建验证**

Run:

```powershell
npm run build
```

Expected: 所有动态详情路由生成成功；Markdown、KaTeX、Mermaid 不报错。

- [ ] **Step 7: 提交详情页**

```powershell
git add src/pages/blog/[...slug].astro src/pages/notes/[...slug].astro src/pages/knowledge/[...slug].astro src/pages/skills/[...slug].astro
git commit -m "style: unify long-form reading experience"
```

---

### Task 5: 全站响应式、主题与最终验证

**Files:**
- Modify if needed: `src/layouts/BaseLayout.astro`
- Modify if needed: `src/components/Header.astro`
- Modify if needed: `src/pages/**/*.astro`

**Interfaces:**
- Consumes: Task 1–4 的最终页面与组件。
- Produces: 可发布的全站视觉优化结果。

- [ ] **Step 1: 检查最近编辑文件的 IDE 诊断**

读取所有改动 Astro 文件的 lint；修复本次引入的错误。

- [ ] **Step 2: 运行完整生产构建**

Run:

```powershell
npm run build
```

Expected: exit code `0`；静态页面数量与内容源一致。

- [ ] **Step 3: 验证桌面与平板**

浏览器检查 1440×1000、1024×768：

- Header sticky 且不遮挡锚点。
- 首页和 About 无横向溢出。
- 列表页工具条与卡片层级清晰。
- 详情页正文、目录、表格和代码块可读。

- [ ] **Step 4: 验证移动端**

浏览器检查 390×844：

- 菜单可打开、关闭和导航。
- 搜索、筛选、标签和按钮不溢出。
- 页面无横向滚动。
- 宽内容仅在局部容器滚动。

- [ ] **Step 5: 验证语言与主题**

在首页、About、Blog、Knowledge 和一篇详情页切换：

- 中文 / 英文
- 浅色 / 深色

确认无新增未翻译文案、低对比文字或布局破坏。

- [ ] **Step 6: 检查仓库差异**

Run:

```powershell
git diff --check
git status --short
```

Expected: 无 whitespace error；仅包含计划内文件。

- [ ] **Step 7: 最终提交**

```powershell
git add src
git commit -m "style: complete global visual system redesign"
```
