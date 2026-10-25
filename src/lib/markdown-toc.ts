export type TocItem = {
  depth: number;
  id: string;
  text: string;
};

const TOC_MIN_DEPTH = 2;
const TOC_MAX_DEPTH = 5;

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function slugFromText(text: string, fallbackIndex: number): string {
  const base = text
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fff-]/g, '')
    .slice(0, 64);
  return base || `section-${fallbackIndex}`;
}

/** 为 h2–h5 注入 id，并生成侧栏目录数据 */
export function annotateHtmlHeadings(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const slugCounts = new Map<string, number>();
  let index = 0;

  const out = html.replace(
    /<h([1-6])(\s[^>]*)?>([\s\S]*?)<\/h\1>/gi,
    (match, depthStr: string, attrs: string | undefined, inner: string) => {
      const depth = Number.parseInt(depthStr, 10);
      const text = stripHtml(inner);
      if (!text) return match;

      const existingId = attrs?.match(/\bid="([^"]+)"/i)?.[1];
      index += 1;
      let id = existingId ?? slugFromText(text, index);
      if (!existingId) {
        const seen = slugCounts.get(id) ?? 0;
        slugCounts.set(id, seen + 1);
        if (seen > 0) id = `${id}-${seen + 1}`;
      }

      if (depth >= TOC_MIN_DEPTH && depth <= TOC_MAX_DEPTH) {
        toc.push({ depth, id, text });
      }

      if (existingId) return match;

      const attrPart = attrs?.trim() ? ` ${attrs.trim()}` : '';
      return `<h${depth} id="${id}"${attrPart}>${inner}</h${depth}>`;
    },
  );

  return { html: out, toc };
}
