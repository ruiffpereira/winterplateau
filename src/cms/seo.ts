/** SEO que é do kit (CONTRATO §9): título, URLs absolutas, hreflang e JSON-LD. Texto passa por `plain()`. */
import { plain, safeSrc } from './text.js';
import type { Comp, Ctx, Item, Page } from './types.js';

export const SITE_NAME = 'Winterplateau';

const OG_LOCALE: Record<string, string> = { pt: 'pt_PT', en: 'en_GB', fr: 'fr_FR', es: 'es_ES', de: 'de_DE' };
export const ogLocale = (l: string): string => OG_LOCALE[l] ?? l;

/** URL absoluta com barra final (o formato `directory` serve `/obras/`); `#âncora` e query não existem em páginas. */
export function absUrl(path: string, site: URL | string): string {
  const u = new URL(path, site);
  if (!u.pathname.endsWith('/') && !/\.[a-z0-9]+$/i.test(u.pathname)) u.pathname += '/';
  return u.toString();
}

export const titleOf = (page: Page): string => `${plain(page.seo.title || page.title)} · ${SITE_NAME}`;

export const compsOf = (items: Item[]): Comp[] => items.flatMap((it) => (it.kind === 'block' ? it.comps : []));

/** Os `<link rel=alternate hreflang>`: as línguas do `alternates` + `x-default` na língua base. */
export function hreflangs(ctx: Ctx, site: URL | string): { hreflang: string; href: string }[] {
  const alt = ctx.page.alternates;
  const out = Object.entries(alt).map(([hreflang, path]) => ({ hreflang, href: absUrl(path, site) }));
  const def = alt[ctx.site.defaultLanguage];
  return def ? [...out, { hreflang: 'x-default', href: absUrl(def, site) }] : out;
}

/** Organization + BreadcrumbList sempre; FAQPage / LocalBusiness / Review quando a página tem esses componentes. */
export function jsonLd(ctx: Ctx, site: URL | string): object[] {
  const { page } = ctx;
  const all = [...ctx.site.topo.comps, ...compsOf(page.items), ...ctx.site.rodape.comps];
  const pageComps = compsOf(page.items);
  const logo = safeSrc(all.find((c) => c.type === 'imagem')?.image);
  const sameAs = all.filter((c) => c.type === 'redes').flatMap((c) => (c.items ?? []).map((i: { url?: string }) => i.url).filter((u: unknown): u is string => typeof u === 'string' && /^https?:/i.test(u)));
  const org = { '@type': 'Organization', name: SITE_NAME, url: absUrl('/', site), ...(logo ? { logo: new URL(logo, site).toString() } : {}), ...(sameAs.length ? { sameAs } : {}) };
  const out: object[] = [
    { '@context': 'https://schema.org', ...org },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: page.breadcrumb.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: plain(b.title), item: absUrl(b.path, site) })),
    },
  ];

  const faq = pageComps.filter((c) => c.type === 'faq').flatMap((c) => c.items ?? []);
  if (faq.length) {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((f: { q: string; a: string }) => ({ '@type': 'Question', name: plain(f.q), acceptedAnswer: { '@type': 'Answer', text: plain(f.a) } })),
    });
  }
  for (const n of pageComps.filter((c) => c.type === 'negocio')) {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: plain(n.name),
      address: plain(n.address),
      ...(n.phone ? { telephone: plain(n.phone) } : {}),
      ...(n.email ? { email: plain(n.email) } : {}),
      ...(n.hours?.length ? { openingHours: n.hours.map((h: { day?: string; time?: string }) => plain(`${h.day ?? ''} ${h.time ?? ''}`)) } : {}),
      url: absUrl(page.path, site),
    });
  }
  for (const r of pageComps.filter((c) => c.type === 'avaliacoes').flatMap((c) => c.items ?? [])) {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'Review',
      itemReviewed: org,
      reviewRating: { '@type': 'Rating', ratingValue: Number(r.stars ?? 5), bestRating: 5 },
      author: { '@type': 'Person', name: plain(r.name) },
      reviewBody: plain(r.text),
    });
  }
  return out;
}
