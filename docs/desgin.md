# Personal Tech Hub — 架构与产品定位

个人技术门户：**内容在 Wiki，展示在站点，发布走静态构建**。访问者应快速理解定位与能力，并沿 Blog → Notes → Knowledge → Skills 形成可检索、可复用的知识路径。

---

## 1. 内容源与内容模型

### 唯一内容源：`personal-knowledge-wiki`

所有可发布内容集中维护于 Wiki 仓库，门户仓库不复制正文，仅通过 **Git Submodule + 构建前解析脚本** 拉取并生成 Astro 内容集合。

| 内容类型 | 说明 |
| -------- | ---- |
| **Blog** | 长文、架构思考、产品与技术叙事 |
| **Notes** | 主题笔记、学习记录、工程备忘 |
| **Knowledge** | 结构化知识条目、领域地图与索引 |
| **Skills** | Agent Skills、方法论与可复用工作流说明 |
| **Projects** | 项目说明、仓库链接与交付摘要（规划/逐步落地） |
| **Case Studies** | 案例拆解：问题、方案、架构与结果（规划/逐步落地） |
| **Metadata** | 分类、标签、日期、阅读时长、图标等 frontmatter |

**载体格式：** Markdown · YAML frontmatter · JSON（必要时）· 图片资源

---

## 2. 展示层与技术架构

### 展示仓库：`boyang167.github.io`（本仓库 `personal-tech-portal`）

| 层级 | 技术 |
| ---- | ---- |
| 框架 | Astro 5（静态输出） |
| 语言 | TypeScript（数据与工具脚本） |
| UI | Astro 组件 + 全局 CSS 设计 tokens |
| 内容 | `@astrojs/content` + Wiki 路径映射 |

**职责边界：**

- Wiki：写作、版本、目录结构、资源文件。
- Portal：路由、布局、i18n、主题、搜索/筛选、阅读体验与构建优化。

---

## 3. 构建与发布流程

```text
personal-knowledge-wiki (submodule)
        ↓
prepare-note-assets / prepare-blog-assets（资源同步）
        ↓
astro build（122+ 静态页）
        ↓
GitHub Actions → GitHub Pages
```

- 本地：`npm run build` 生成 `dist/`。
- 远程：推送到 `main` 触发 CI，产物部署至 GitHub Pages。

---

## 4. 网站信息架构

### 导航与页面（当前 + 规划）

| 区域 | 页面 | 角色 |
| ---- | ---- | ---- |
| 入口 | 首页 | 定位、精选内容、知识系统入口 |
| 品牌 | 关于我 | 能力矩阵、经历、方法论 |
| 知识 | Blog / Notes / Knowledge / Skills | 由浅入深的内容消费路径 |
| 作品 | Projects / Case Studies | 工程成果与案例（与 Wiki 内容对齐后上线） |
| 增强 | Knowledge Graph / 智能检索 | 图谱与 Agent 能力（演进方向） |

### 四层产品叙事（与页面呼应）

1. **Personal Brand** — 个人定位、技术能力、职业与领域背景（首页、About）。
2. **Engineering Portfolio** — 项目作品、架构设计、生产级工程实践（Projects、Case Studies、精选 Blog）。
3. **Knowledge System** — 博客、笔记、知识库、技术体系地图（Blog、Notes、Knowledge）。
4. **AI Capability** — Skills、Agent、知识图谱与智能检索（Skills 及后续 Graph / Search）。

---

## 5. 核心价值与建设目标

网站同时服务三个目标：

1. **建立个人技术影响力** — 让访问者在首屏与 About 中快速理解技术定位与核心能力（Agent、数据平台、ML/DL、CMC 等）。
2. **展示真实工程成果** — 用项目、案例与长文说明「如何解决实际问题」，而非仅罗列技术名词。
3. **沉淀长期知识资产** — Blog、Notes、Knowledge、Skills（及未来的 Projects）通过分类、链接与统一视觉系统形成**可持续迭代、互相引用**的个人知识体系。

---

## 附录：仓库关系示意

```text
11-Profile-Web/
├── personal-knowledge-wiki/    # 内容源（Submodule）
└── personal-tech-portal/       # 展示层（Astro → boyang167.github.io）
```

维护约定：新增栏目或内容类型时，先扩展 Wiki 目录与 frontmatter 约定，再在 Portal 增加集合定义与页面模板，避免双处维护正文。
