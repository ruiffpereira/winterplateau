/**
 * Texto vindo da API → HTML seguro. É o ÚNICO caminho para `set:html` com texto do CMS.
 *
 * Tudo é escapado primeiro; só depois se reconhecem `**negrito**`, `*itálico*` e `[texto](ligação)`
 * (e, em `md`, parágrafos, quebras de linha e listas). A ligação só passa se for `http(s):`, `mailto:`,
 * `tel:`, relativa ou `#…` — o resto fica como texto simples.
 */

const ESC: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const escapeHtml = (s: string): string => s.replace(/[&<>"']/g, (c) => ESC[c]);
const unescapeHtml = (s: string): string => s.replace(/&(amp|lt|gt|quot|#39);/g, (_, e) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" })[e as string]!);

/** Controlo e espaços invisíveis que o browser ignora dentro de um esquema (`java\tscript:`). */
const INVISIBLE = /[\s\u0000-\u001f\u007f\u00ad\u200b-\u200f\u2028\u2029\u2060\ufeff]/;

/** Ligação aceitável: `http(s):`, `mailto:`, `tel:`, relativa (`/x`, `x`, `./x`) ou `#âncora`. */
export function safeHref(href: unknown): string | null {
  if (typeof href !== 'string') return null;
  const h = href.trim();
  if (!h || INVISIBLE.test(h) || h.includes('\x5c') || h.startsWith('//')) return null;
  const scheme = /^([^/?#:]*):/.exec(h);
  if (scheme) return /^(https?|mailto|tel)$/i.test(scheme[1]) ? h : null;
  return h;
}

/** `src` de imagem/vídeo/documento: `http(s):` ou caminho do próprio site. */
export function safeSrc(src: unknown): string | null {
  const h = safeHref(src);
  return h && !/^(mailto|tel):/i.test(h) && !h.startsWith('#') ? h : null;
}

const SLOT = /\ue000(\d+)\ue001/g;

function inlineEscaped(escaped: string): string {
  const slots: string[] = [];
  const keep = (html: string) => `\ue000${slots.push(html) - 1}\ue001`;
  let out = escaped.replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g, (_, label: string, url: string) => {
    const href = safeHref(unescapeHtml(url));
    const text = emphasis(label);
    if (!href) return text;
    const ext = /^https?:/i.test(href) ? ' rel="noopener noreferrer"' : '';
    return keep(`<a href="${escapeHtml(href)}"${ext}>${text}</a>`);
  });
  out = emphasis(out);
  // dois níveis chegam: um link dentro de um link nunca é gerado (o texto do link só tem ênfase)
  return out.replace(SLOT, (_, i: string) => slots[Number(i)]);
}

function emphasis(s: string): string {
  return s.replace(/\*\*(?=\S)([^*]+?)\*\*/g, '<strong>$1</strong>').replace(/\*(?=\S)([^*]+?)\*/g, '<em>$1</em>');
}

const clean = (s: unknown): string => (typeof s === 'string' ? s.replace(/[\ue000\ue001]/g, '') : '');

/** `text` do catálogo: uma linha, só ênfase (e ligações, se as houver). */
export function inline(s: unknown): string {
  return inlineEscaped(escapeHtml(clean(s)));
}

/** `md` do catálogo: parágrafos, `-`/`*`/`1.` em listas, quebras de linha, ênfase e ligações. Nunca HTML cru. */
export function md(s: unknown): string {
  const blocks = clean(s).replace(/\r\n?/g, '\n').trim().split(/\n{2,}/);
  return blocks
    .map((block) => {
      const lines = block.split('\n');
      const ul = lines.every((l) => /^\s*[-*]\s+\S/.test(l));
      const ol = lines.every((l) => /^\s*\d+[.)]\s+\S/.test(l));
      if (ul || ol) {
        const items = lines.map((l) => `<li>${inlineEscaped(escapeHtml(l.replace(/^\s*(?:[-*]|\d+[.)])\s+/, '')))}</li>`);
        return `<${ul ? 'ul' : 'ol'}>${items.join('')}</${ul ? 'ul' : 'ol'}>`;
      }
      return `<p>${lines.map((l) => inlineEscaped(escapeHtml(l))).join('<br>')}</p>`;
    })
    .join('\n');
}

/** Texto sem marcação (meta, `alt`, `aria-label`, JSON-LD): tira a ênfase e fica com o texto das ligações. */
export function plain(s: unknown): string {
  return clean(s)
    .replace(/\[([^\]\n]+)\]\([^)\s]*\)/g, '$1')
    .replace(/\*\*?(?=\S)([^*]+?)\*\*?/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/** JSON para dentro de `<script type="application/ld+json">`: `<`, `>`, `&` e separadores de linha escapados (nunca fecha o script). */
export function json(value: unknown): string {
  return JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, (c) => String.fromCharCode(92) + 'u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
}
