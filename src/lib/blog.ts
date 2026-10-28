import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'blog'>;

/** 列表每页条数；超过 10 篇即分页，由前端「加载更多」展开（静态站无需额外路由） */
export const BLOG_LIST_PAGE_SIZE = 10;

export type BlogListMeta = {
  slug: string;
  href: string;
  title: string;
  description: string;
  category: string;
  dateLabel: string;
  dateIso: string;
  readTime: string;
  icon: string;
  year: number;
};

/** 列表筛选项的优先排序（未出现在文章里的分类不会显示按钮） */
export const BLOG_CATEGORY_ORDER = [
  'AI Agent',
  '数据工程',
  '机器学习',
  '知识管理',
  '产品与方案',
  '个人开源产品',
] as const;

/** 从已发布文章收集 category，用于列表页筛选（与 frontmatter 联动） */
export function collectBlogCategories(posts: BlogEntry[]): string[] {
  const seen = new Set<string>();
  for (const post of posts) {
    const cat = post.data.category?.trim();
    if (cat) seen.add(cat);
  }
  const ordered = BLOG_CATEGORY_ORDER.filter((c) => seen.has(c));
  const rest = [...seen]
    .filter((c) => !BLOG_CATEGORY_ORDER.includes(c as (typeof BLOG_CATEGORY_ORDER)[number]))
    .sort((a, b) => a.localeCompare(b, 'zh-CN'));
  return [...ordered, ...rest];
}

export async function getPublishedBlogPosts(): Promise<BlogEntry[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function formatBlogDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** 首页卡片日期样式：2026.06.10 */
export function formatBlogDateDots(date: Date): string {
  return formatBlogDate(date).replace(/-/g, '.');
}

/** 相对 wiki `raw/3-blog/` 的路径（不含 .md），子目录会保留，如 `agent/foo` */
export function blogPostSlug(entry: BlogEntry): string {
  return entry.id.replace(/\.md$/i, '');
}

export function blogPostHref(entry: BlogEntry): string {
  return `/blog/${blogPostSlug(entry)}/`;
}

export function toBlogListMeta(entry: BlogEntry): BlogListMeta {
  const dateLabel = formatBlogDate(entry.data.date);
  return {
    slug: blogPostSlug(entry),
    href: blogPostHref(entry),
    title: entry.data.title,
    description: entry.data.description,
    category: entry.data.category,
    dateLabel,
    dateIso: dateLabel,
    readTime: entry.data.readTime,
    icon: entry.data.icon,
    year: entry.data.date.getFullYear(),
  };
}

/** 按发布年分组（年内仍按 getPublishedBlogPosts 的全局时间倒序） */
export function groupBlogPostsByYear(
  posts: BlogEntry[],
): { year: number; posts: BlogEntry[] }[] {
  const groups = new Map<number, BlogEntry[]>();
  for (const post of posts) {
    const year = post.data.date.getFullYear();
    const list = groups.get(year) ?? [];
    list.push(post);
    groups.set(year, list);
  }
  return [...groups.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, yearPosts]) => ({ year, posts: yearPosts }));
}

/** 静态分页总页数（可选 `/blog/page/N/` 路由） */
export function blogListPageCount(total: number, pageSize = BLOG_LIST_PAGE_SIZE): number {
  return Math.max(1, Math.ceil(total / pageSize));
}

/** 首页精选卡片 eyebrow（与原有英文标签风格一致） */
export function blogFeaturedEyebrow(category: string): string {
  const map: Record<string, string> = {
    'AI Agent': 'AI AGENT',
    知识管理: 'LLM WIKI',
    数据工程: 'DATA ENGINEERING',
    机器学习: 'MACHINE LEARNING',
    产品与方案: 'PRODUCT',
    个人开源产品: 'OPEN SOURCE',
  };
  return map[category] ?? category.toUpperCase();
}

export async function getFeaturedBlogPosts(limit = 3): Promise<BlogEntry[]> {
  return (await getPublishedBlogPosts()).filter((p) => p.data.featured).slice(0, limit);
}
