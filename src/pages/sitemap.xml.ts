import type { APIRoute } from 'astro';
import { loadSites } from '../cms/client';
import { absUrl } from '../cms/seo';
import { escapeHtml } from '../cms/text';

/** Só páginas publicadas (a API não envia as outras) e sem `noindex`, cada uma com os `xhtml:link` das outras línguas. */
export const GET: APIRoute = async ({ site }) => {
  const origin = site ?? new URL('https://www.winterplateau.pt');
  const sites = await loadSites();
  const urls = sites.flatMap((s) =>
    s.pages
      .filter((p) => !p.seo.noindex)
      .map((p) => {
        const alts = Object.entries(p.alternates).map(([l, path]) => `    <xhtml:link rel="alternate" hreflang="${escapeHtml(l)}" href="${escapeHtml(absUrl(path, origin))}"/>`);
        const lastmod = /^\d{4}-\d{2}-\d{2}/.test(p.updatedAt) ? `\n    <lastmod>${p.updatedAt.slice(0, 10)}</lastmod>` : '';
        return `  <url>\n    <loc>${escapeHtml(absUrl(p.path, origin))}</loc>${lastmod}\n${alts.join('\n')}\n  </url>`;
      }),
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
