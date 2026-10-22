import { marked } from 'marked';

function escapeAttr(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function isHttpUrl(href: string) {
  return /^(https?:)?\/\//i.test(href);
}

/** 标题锚点 id：保留中英文数字 */
function slugifyHeading(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'section';
}

const CALLOUT_LABELS: Record<string, string> = {
  note: '注意',
  tip: '提示',
  important: '重要',
  warning: '警告',
  caution: '当心',
};

/** GitHub 风格 callout：> [!NOTE] … */
function transformCallouts(markdown: string) {
  return markdown.replace(
    /^> \[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\][^\n]*\n((?:>[^\n]*\n?)*)/gim,
    (_full, kindRaw: string, body: string) => {
      const kind = kindRaw.toLowerCase();
      const label = CALLOUT_LABELS[kind] ?? kindRaw;
      const text = body
        .split('\n')
        .map((line) => line.replace(/^>\s?/, ''))
        .join('\n')
        .trim();
      return `\n<div class="md-callout is-${kind}" data-callout="${kind}"><p class="md-callout-label">${label}</p>\n\n${text}\n\n</div>\n\n`;
    },
  );
}

marked.use({
  gfm: true,
  breaks: false,
  renderer: {
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens);
      const safeHref = escapeAttr(href || '');
      const titleAttr = title ? ` title="${escapeAttr(title)}"` : '';
      if (isHttpUrl(href || '')) {
        return `<a href="${safeHref}"${titleAttr} target="_blank" rel="noopener noreferrer" class="md-link is-external">${text}</a>`;
      }
      return `<a href="${safeHref}"${titleAttr} class="md-link">${text}</a>`;
    },
    image({ href, title, text }) {
      const src = escapeAttr(href || '');
      const alt = escapeAttr(text || '');
      const titleAttr = title ? ` title="${escapeAttr(title)}"` : '';
      const caption = title ? `<figcaption>${escapeAttr(title)}</figcaption>` : '';
      return `<figure class="md-figure"><img src="${src}" alt="${alt}" loading="lazy" decoding="async"${titleAttr} />${caption}</figure>`;
    },
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens);
      const plain = tokens.map((t) => ('text' in t ? String(t.text ?? '') : '')).join('') || text.replace(/<[^>]+>/g, '');
      const id = escapeAttr(slugifyHeading(plain));
      return `<h${depth} id="${id}" class="md-heading"><a class="md-heading-anchor" href="#${id}" aria-label="链接到此节">#</a>${text}</h${depth}>\n`;
    },
  },
});

/** Markdown → HTML；外链新开、图片 figure、callout、标题锚点、表格可横滑 */
export function renderMarkdown(markdown: string) {
  const withCallouts = transformCallouts(markdown ?? '');
  let html = marked.parse(withCallouts, { async: false }) as string;
  html = html
    .replaceAll('<table>', '<div class="table-scroll"><table>')
    .replaceAll('</table>', '</table></div>');
  return html;
}

export { escapeHtml };
