import katex from 'katex';
import { marked } from 'marked';
import { annotateHtmlHeadings, type TocItem } from './markdown-toc';

const BLOCK_MATH = /\$\$([\s\S]*?)\$\$/g;
/** 行内 $...$（排除 $$） */
const INLINE_MATH = /(?<!\$)\$(?!\$)((?:\\.|[^$\\\n])+?)\$(?!\$)/g;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderTex(tex: string, displayMode: boolean): string {
  const trimmed = tex.trim();
  if (!trimmed) return '';
  try {
    return katex.renderToString(trimmed, {
      displayMode,
      throwOnError: false,
      strict: 'ignore',
      trust: false,
      output: 'html',
    });
  } catch {
    return `<code class="math-fallback">${escapeHtml(trimmed)}</code>`;
  }
}

function injectMath(markdown: string): string {
  let out = markdown.replace(BLOCK_MATH, (_, tex) => {
    const html = renderTex(tex, true);
    return html ? `\n\n<div class="math-display">${html}</div>\n\n` : '';
  });
  out = out.replace(INLINE_MATH, (_, tex) => {
    const html = renderTex(tex, false);
    return html ? `<span class="math-inline">${html}</span>` : `$${tex}$`;
  });
  return out;
}

/** Markdown → HTML，支持 Typora 风格 $ / $$ 公式（KaTeX 静态渲染） */
export function renderMarkdownWithMath(
  markdown: string,
  preprocess?: (md: string) => string,
): string {
  const body = preprocess ? preprocess(markdown) : markdown;
  const withMath = injectMath(body);
  return marked.parse(withMath, { async: false, gfm: true }) as string;
}

export type RenderedMarkdownDocument = {
  html: string;
  toc: TocItem[];
};

/** 笔记正文：Markdown + 公式 + 标题锚点与目录 */
export function renderMarkdownDocument(
  markdown: string,
  preprocess?: (md: string) => string,
): RenderedMarkdownDocument {
  const html = renderMarkdownWithMath(markdown, preprocess);
  return annotateHtmlHeadings(html);
}
