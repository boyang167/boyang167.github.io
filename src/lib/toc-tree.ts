import type { TocItem } from './markdown-toc';

export type TocTreeNode = {
  item: TocItem;
  children: TocTreeNode[];
};

/** 将扁平目录按标题层级（h2–h5）组装为树，供侧栏折叠展示 */
export function buildTocTree(items: TocItem[]): TocTreeNode[] {
  const roots: TocTreeNode[] = [];
  const stack: TocTreeNode[] = [];

  for (const item of items) {
    const node: TocTreeNode = { item, children: [] };
    while (stack.length > 0 && stack[stack.length - 1].item.depth >= item.depth) {
      stack.pop();
    }
    if (stack.length === 0) {
      roots.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }
    stack.push(node);
  }

  return roots;
}
