/** Endereços: rotas estáticas por língua, redirects e a ponte para os endereços antigos do site. */
import type { Page, Site } from './types.js';

/**
 * Endereços do site antigo (formato `file`) que ainda circulam no Google e em links externos.
 * `from` → `to` (path da língua base). Só entram se o destino existir como página; os `redirects` da API
 * têm prioridade. `/Projeto.html?obra=<slug>` é tratado por `src/pages/Projeto.html.ts` (o static não lê a query).
 * Os destinos são os do manifest da Winterplateau — confirmar no F19, com os dados reais.
 */
const LEGACY: Record<string, string> = {
  '/Projetos.html': '/obras',
  '/privacidade.html': '/privacidade',
};

const norm = (p: string): string => (p.length > 1 ? p.replace(/\/+$/, '') : p) || '/';
const baseOf = (sites: Site[]): Site => sites[0];
/** `Astro.params.path` de um endereço sem o prefixo da língua (`/` → undefined, `/obras/x` → `obras/x`). */
export const paramOf = (path: string): string | undefined => (path === '/' ? undefined : path.replace(/^\//, ''));

/** Páginas de uma língua para `getStaticPaths` (a base em `[...path]`; as outras em `[lang]/[...path]`). */
export function pagesOf(site: Site): { page: Page; params: { lang?: string; path: string | undefined } }[] {
  const base = site.locale === site.defaultLanguage;
  return site.pages.map((page) => {
    const rest = base ? page.path : page.path.replace(new RegExp(`^/${site.locale}(?=/|$)`), '') || '/';
    return { page, params: base ? { path: paramOf(rest) } : { lang: site.locale, path: paramOf(rest) } };
  });
}

/** Todos os redirects (API + antigos), sem os que colidem com uma página real ou não são caminhos. */
export function redirectsOf(sites: Site[]): Record<string, string> {
  const pages = new Set(sites.flatMap((s) => s.pages.map((p) => norm(p.path))));
  const out: Record<string, string> = {};
  const add = (from: string, to: string, origin: string) => {
    const f = norm(from);
    if (!f.startsWith('/') || /[?#]/.test(f) || !to.startsWith('/')) return console.warn(`[cms] redirect ${origin} ignorado (não é um caminho): ${from} → ${to}`);
    if (pages.has(f)) return console.warn(`[cms] redirect ${origin} ignorado (${f} é uma página): ${from} → ${to}`);
    if (norm(to) === f) return;
    out[f] = to;
  };
  // A API devolve os redirects de todas as línguas em cada resposta; chega a base.
  for (const r of baseOf(sites).redirects) add(r.from, r.to, "da API");
  for (const [from, to] of Object.entries(LEGACY)) {
    if (out[norm(from)]) continue;
    if (pages.has(to)) add(from, to, 'antigo');
    else console.warn(`[cms] endereço antigo ${from} sem destino (${to} não é uma página) — sem redirect`);
  }
  return out;
}

/** `obra=<slug>` → path novo, para o `Projeto.html` antigo. O slug é o último segmento do path da obra. */
export function legacyObras(sites: Site[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const p of baseOf(sites).pages) {
    const depth = p.path.split('/').filter(Boolean);
    if (depth.length >= 2) out[depth[depth.length - 1]] = p.path;
  }
  return out;
}
