# About Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `/about/` 重构为首屏精炼、下方渐进展开的个人技术品牌页，突出 AI × Data × CMC 定位与可验证的工程能力。

**Architecture:** 保持 Astro 静态页面与现有数据数组，在 `about.astro` 内重组页面语义和样式；只在出现新中文文案时同步 `BaseLayout.astro` 的中英文映射。页面不新增客户端脚本或依赖，响应式和深色模式完全由 CSS 实现。

**Tech Stack:** Astro 5、HTML、scoped CSS、现有 `BaseLayout.astro` i18n 脚本。

## Global Constraints

- 不引入新的 JavaScript 框架、组件库或运行时依赖。
- 保持现有链接、导航、内容来源与 Astro 静态输出。
- 保持现有中英文切换和深色模式。
- 桌面端与移动端不得出现横向滚动、文字截断或按钮溢出。
- 主要修改 `src/pages/about.astro`；仅在新增或修改中英文文案时更新 `src/layouts/BaseLayout.astro`。

---

### Task 1: 重组首屏与领域支柱

**Files:**
- Modify: `src/pages/about.astro:4-9`
- Modify: `src/pages/about.astro:315-365`
- Modify: `src/layouts/BaseLayout.astro:115-160`

**Interfaces:**
- Consumes: `highlights` 数组、`BaseLayout`、现有按钮与标签全局样式。
- Produces: `.about-hero` 首屏、`.focus-strip` 四领域支柱、完整中英文文案映射。

- [ ] **Step 1: 建立当前页面验证基线**

Run:

```powershell
npm run build
```

Expected: Astro build exit code `0`，生成 `/about/index.html`。

- [ ] **Step 2: 将领域摘要改成四个品牌支柱**

在 `src/pages/about.astro` 中将 `highlights` 改为：

```ts
const highlights = [
  { n: '01', title: 'Agent Engineering', desc: 'Architecture · Harness · Runtime · Orchestration' },
  { n: '02', title: 'Data Platform', desc: 'Data governance · Knowledge engineering · AI for BI' },
  { n: '03', title: 'ML / DL', desc: 'Modeling · Validation · Production lifecycle' },
  { n: '04', title: 'CMC Digitalization', desc: 'Domain knowledge · Process intelligence · Delivery' },
];
```

- [ ] **Step 3: 精简首屏标签并增强语义**

将首屏标签限定为：

```astro
<div class="tag-row" aria-label="核心技术方向">
  <span class="tag">Agent Engineering</span>
  <span class="tag">Data Platform</span>
  <span class="tag">Machine Learning</span>
  <span class="tag">CMC Digitalization</span>
</div>
```

将原 `stat-strip` 改为：

```astro
<section class="wrap focus-strip" aria-label="核心能力领域">
  {highlights.map((item) => (
    <article class="focus-item">
      <span class="focus-index">{item.n}</span>
      <strong>{item.title}</strong>
      <small>{item.desc}</small>
    </article>
  ))}
</section>
```

- [ ] **Step 4: 同步新中文文案的英文映射**

在 `src/layouts/BaseLayout.astro` 的 `zhToEn` 扩展对象中增加：

```js
'核心技术方向':'Core technical focus',
'核心能力领域':'Core capabilities',
'Machine Learning':'Machine Learning',
'CMC Digitalization':'CMC Digitalization',
```

不为纯英文内容创建重复映射。

- [ ] **Step 5: 构建验证首屏结构**

Run:

```powershell
npm run build
```

Expected: exit code `0`；`dist/about/index.html` 包含 `focus-strip` 与四个 `focus-item`。

- [ ] **Step 6: 提交首屏结构**

```powershell
git add src/pages/about.astro src/layouts/BaseLayout.astro
git commit -m "refactor(about): clarify hero and focus pillars"
```

---

### Task 2: 建立渐进式能力与方法叙事

**Files:**
- Modify: `src/pages/about.astro:367-463`
- Modify: `src/pages/about.astro:685-1015`

**Interfaces:**
- Consumes: `skillAreas`、`principles`、`splitSkillItems()`。
- Produces: `.capability-stack` 能力分层与 `.principles-flow` 三步价值流程。

- [ ] **Step 1: 为能力项增加主次层级**

在能力循环中按索引输出优先级：

```astro
{skillAreas.map((area, index) => (
  <article
    class:list={[
      'capability-card',
      index < 4 ? 'capability-card-primary' : 'capability-card-supporting',
      area.layout === 'agent' && 'capability-card-featured',
    ]}
  >
    <!-- 沿用现有标题、摘要、分组和 chip 内容 -->
  </article>
))}
```

保留全部技术项，但取消“每项同等重量”的卡片墙效果。

- [ ] **Step 2: 将能力容器改为渐进式布局**

将 `.skills-grid` 替换为 `.capability-stack`：

```css
.capability-stack {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.capability-card-featured {
  grid-column: 1 / -1;
}

.capability-card-supporting {
  background: color-mix(in srgb, var(--surface) 76%, transparent);
}
```

复用现有 skill group 与 chip 语义，不增加展开脚本。

- [ ] **Step 3: 将价值原则改为流程语义**

将原则容器改为：

```astro
<div class="principles-flow" aria-label="从领域知识到产品交付的方法">
  {principles.map((item, index) => (
    <article class="principle-step">
      <span class="principle-index">{item.n}</span>
      <h3>{item.title}</h3>
      <p class="principle-lead">{item.lead}</p>
      <p class="muted">{item.desc}</p>
      {index < principles.length - 1 && <span class="principle-connector" aria-hidden="true">→</span>}
    </article>
  ))}
</div>
```

- [ ] **Step 4: 添加桌面和移动端流程样式**

```css
.principles-flow {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.principle-step {
  position: relative;
  padding: 24px;
  border-top: 2px solid color-mix(in srgb, var(--blue) 72%, transparent);
  background: var(--surface);
}

.principle-connector {
  position: absolute;
  top: 24px;
  right: -13px;
  z-index: 2;
  color: var(--blue);
}

@media (max-width: 760px) {
  .principles-flow {
    grid-template-columns: 1fr;
  }

  .principle-connector {
    top: auto;
    right: auto;
    bottom: -17px;
    left: 24px;
    transform: rotate(90deg);
  }
}
```

- [ ] **Step 5: 构建验证能力与方法区**

Run:

```powershell
npm run build
```

Expected: exit code `0`；页面保留六个能力领域和三个原则，且无 Astro 模板错误。

- [ ] **Step 6: 提交能力与方法区**

```powershell
git add src/pages/about.astro
git commit -m "refactor(about): create progressive capability narrative"
```

---

### Task 3: 优化经历层级并合并页面收尾

**Files:**
- Modify: `src/pages/about.astro:465-522`
- Modify: `src/pages/about.astro:1017-1146`
- Modify: `src/layouts/BaseLayout.astro:115-180`

**Interfaces:**
- Consumes: `timeline`、现有博客/知识库/GitHub 链接。
- Produces: `.experience-list` 经历区和单一 `.about-cta` 收尾区。

- [ ] **Step 1: 增强经历内容层级**

为经历条目使用以下结构：

```astro
<article class="experience-item">
  <div class="experience-meta">
    <time>{item.date}</time>
    <span>{item.tag}</span>
  </div>
  <div class="experience-content">
    <h3>{item.title}</h3>
    <p class="muted">{item.desc}</p>
  </div>
</article>
```

用左侧时间与身份、右侧成果说明替代点线装饰。

- [ ] **Step 2: 合并公开内容和联系模块**

用一个 `.about-cta` 替换 `impact-section` 与 `contact-section`：

```astro
<section class="wrap about-cta" id="contact">
  <div class="about-cta-copy">
    <div class="eyebrow">OPEN KNOWLEDGE · LET'S CONNECT</div>
    <h2>把实践沉淀为知识，<br />把技术连接到真实问题。</h2>
    <p class="muted">
      持续分享 Agent、数据平台、机器学习与 CMC 数字化实践，也欢迎交流企业级 Agent 与数据智能系统的工程落地。
    </p>
  </div>
  <nav class="about-cta-links" aria-label="内容与联系">
    <a href="/blog/"><span>技术博客</span><small>实践、架构与复盘</small><i>↗</i></a>
    <a href="/knowledge/"><span>知识库</span><small>结构化领域知识</small><i>↗</i></a>
    <a href="https://github.com/boyang167" target="_blank" rel="noreferrer"><span>GitHub</span><small>代码与公开项目</small><i>↗</i></a>
  </nav>
</section>
```

- [ ] **Step 3: 同步收尾文案英文映射**

在 `BaseLayout.astro` 中增加新标题、说明、辅助文字及 `内容与联系` 的英文翻译，确保切换英文后无中文残留。

- [ ] **Step 4: 添加经历与 CTA 样式**

经历区使用细分隔线和两栏网格；CTA 使用浅蓝渐变背景、单层链接列表和明显但克制的 hover 状态。移动端全部切换为单栏。

- [ ] **Step 5: 构建验证收尾结构**

Run:

```powershell
npm run build
```

Expected: exit code `0`；页面只存在一个 `id="contact"`，博客、知识库和 GitHub 链接均存在。

- [ ] **Step 6: 提交经历与 CTA**

```powershell
git add src/pages/about.astro src/layouts/BaseLayout.astro
git commit -m "refactor(about): streamline experience and closing CTA"
```

---

### Task 4: 统一视觉系统并完成浏览器验证

**Files:**
- Modify: `src/pages/about.astro:525-end`
- Test: `src/pages/about.astro`
- Test: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Consumes: Task 1–3 的最终 HTML 类名。
- Produces: 桌面、平板、移动端和深色模式均可用的最终页面。

- [ ] **Step 1: 统一页面级视觉变量**

在 about scoped CSS 顶部定义页面局部变量：

```css
.about-hero,
.focus-strip,
.capabilities-section,
.about-cta {
  --about-radius-lg: 24px;
  --about-radius-md: 16px;
  --about-border: color-mix(in srgb, var(--line) 88%, transparent);
  --about-accent-soft: color-mix(in srgb, var(--blue-soft) 82%, var(--surface));
}
```

统一圆角、边框、阴影强度与 section 间距，移除已无引用的旧 `.stat-strip`、`.timeline-*`、`.impact-*`、`.contact-*` 样式。

- [ ] **Step 2: 完成响应式断点**

验证并补齐：

```css
@media (max-width: 960px) {
  .about-hero,
  .about-cta {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .about-portrait {
    grid-row: 1;
  }

  .focus-strip,
  .capability-stack,
  .principles-flow {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 3: 检查最近编辑文件的诊断**

使用 IDE lint 检查：

- `src/pages/about.astro`
- `src/layouts/BaseLayout.astro`

Expected: 无新增错误。

- [ ] **Step 4: 运行生产构建**

Run:

```powershell
npm run build
```

Expected: exit code `0`，Astro 完成静态输出。

- [ ] **Step 5: 浏览器验证桌面端**

在 `http://localhost:4321/about/` 使用 1440 × 1000 视口验证：

- 首屏双栏且下一模块开头可见。
- 四个领域支柱单行排列。
- 能力区信息完整但主次清晰。
- 方法区为三步横向流程。
- 经历条目层级清楚。
- 页面底部仅一个 CTA。

- [ ] **Step 6: 浏览器验证移动端与深色模式**

使用 390 × 844 视口验证：

- 品牌卡先于首屏文字。
- 所有模块单栏，无横向滚动。
- 标签和按钮自然换行。
- 深色模式下文字、边框、品牌卡和 CTA 对比清晰。

- [ ] **Step 7: 最终提交**

```powershell
git add src/pages/about.astro src/layouts/BaseLayout.astro
git commit -m "style(about): unify editorial engineering design"
```
