#!/usr/bin/env node
/**
 * Verifica o `dist/` de um build feito com fixture (`CMS_FIXTURE=fixtures/site-pt.json npm run build`):
 * páginas por língua, hreflang, canonical, JSON-LD, sitemap, robots, cms-build.json, redirects e —
 * o mais importante — que o markdown com tentativas de HTML sai escapado, nunca como HTML cru.
 *
 *   node scripts/check-build.mjs            # usa fixtures/site-pt.json
 *   CMS_FIXTURE=fixtures/site-pt.json node scripts/check-build.mjs
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';

const DIST = resolve('dist');
const fixture = resolve(process.env.CMS_FIXTURE || 'fixtures/site-pt.json');
const ORIGIN = 'https://www.winterplateau.pt';

let failures = 0;
let checks = 0;
const ok = (cond, msg) => {
  checks++;
  if (!cond) {
    failures++;
    console.error(`  FALHA: ${msg}`);
  }
};
const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : null);

const base = JSON.parse(readFileSync(fixture, 'utf8'));
const sites = base.languages.map((l) => JSON.parse(readFileSync(join(dirname(fixture), basename(fixture).replace(`-${base.locale}.`, `-${l}.`)), 'utf8')));
const abs = (path) => `${ORIGIN}${path}${path.endsWith('/') ? '' : '/'}`;
const pageFile = (path) => join(DIST, path === '/' ? '' : path, 'index.html');
const attr = (html, re) => (html.match(re) || [])[1];

ok(existsSync(DIST), 'dist/ não existe — corre o build primeiro');

// 1. Páginas por língua: ficheiro, lang, canonical, hreflang, noindex, JSON-LD
const htmlByPath = new Map();
for (const site of sites) {
  for (const page of site.pages) {
    const html = read(pageFile(page.path));
    ok(html !== null, `falta ${page.path}/index.html (${site.locale})`);
    if (html === null) continue;
    htmlByPath.set(page.path, html);
    ok(html.includes(`<html lang="${site.locale}"`), `${page.path}: <html lang> deveria ser ${site.locale}`);
    ok(html.includes(`<link rel="canonical" href="${abs(page.path)}">`), `${page.path}: canonical em falta`);
    for (const [lang, path] of Object.entries(page.alternates)) {
      ok(html.includes(`<link rel="alternate" hreflang="${lang}" href="${abs(path)}">`), `${page.path}: hreflang ${lang} em falta`);
    }
    ok(html.includes(`hreflang="x-default" href="${abs(page.alternates[site.defaultLanguage])}"`), `${page.path}: x-default em falta`);
    ok(/<title>[^<]+ · Winterplateau<\/title>/.test(html), `${page.path}: <title> sem o nome do site`);
    ok(html.includes('property="og:title"') && html.includes('property="og:url"'), `${page.path}: Open Graph em falta`);
    ok(html.includes('<header class="topo">') && html.includes('<footer class="rodape"'), `${page.path}: topo/rodapé em falta`);
    ok(/<h1[ >]/.test(html), `${page.path}: sem <h1>`);
    ok(page.seo.noindex === html.includes('<meta name="robots" content="noindex, nofollow">'), `${page.path}: noindex ${page.seo.noindex ? 'em falta' : 'indevido'}`);

    const ld = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map((m) => {
      try {
        return JSON.parse(m[1]);
      } catch {
        ok(false, `${page.path}: JSON-LD inválido`);
        return {};
      }
    });
    const types = ld.map((o) => o['@type']);
    ok(types.includes('Organization') && types.includes('BreadcrumbList'), `${page.path}: falta Organization/BreadcrumbList`);
    const has = (type) => page.items.some((i) => i.kind === 'block' && i.comps.some((c) => c.type === type));
    for (const [comp, type] of [['faq', 'FAQPage'], ['negocio', 'LocalBusiness'], ['avaliacoes', 'Review']]) {
      ok(has(comp) === types.includes(type), `${page.path}: ${type} ${has(comp) ? 'em falta' : 'indevido'}`);
    }
    // Só scripts JSON-LD nas páginas (nada inline vindo do conteúdo)
    const scripts = [...html.matchAll(/<script\b[^>]*>/g)].map((m) => m[0]);
    ok(scripts.every((s) => s.includes('application/ld+json')), `${page.path}: <script> inesperado: ${scripts.find((s) => !s.includes('ld+json'))}`);
  }
}
ok(htmlByPath.size === sites.reduce((n, s) => n + s.pages.length, 0), 'número de páginas');
ok(sites.some((s) => s.pages.some((p) => p.seo.noindex)), 'a fixture deveria ter uma página noindex');

// 2. sitemap.xml: só indexáveis, com alternates
const sitemap = read(join(DIST, 'sitemap.xml')) ?? '';
ok(sitemap.includes('xmlns:xhtml='), 'sitemap sem namespace xhtml');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const indexable = sites.flatMap((s) => s.pages.filter((p) => !p.seo.noindex));
ok(locs.length === indexable.length, `sitemap tem ${locs.length} URLs, esperava ${indexable.length}`);
for (const p of indexable) {
  ok(locs.includes(abs(p.path)), `sitemap sem ${p.path}`);
  for (const [lang, path] of Object.entries(p.alternates)) ok(sitemap.includes(`hreflang="${lang}" href="${abs(path)}"`), `sitemap: ${p.path} sem alternate ${lang}`);
}
for (const p of sites.flatMap((s) => s.pages.filter((q) => q.seo.noindex))) ok(!locs.includes(abs(p.path)), `sitemap inclui a página noindex ${p.path}`);

// 3. robots.txt e cms-build.json
const robots = read(join(DIST, 'robots.txt')) ?? '';
ok(robots.includes(`Sitemap: ${ORIGIN}/sitemap.xml`) && /Allow: \//.test(robots), 'robots.txt');
const build = JSON.parse(read(join(DIST, 'cms-build.json')) ?? 'null');
ok(build && build.revision === base.revision && Object.keys(build).length === 1, `cms-build.json deveria ser {"revision":${base.revision}}`);

// 4. Redirects (da API + endereços antigos)
for (const r of base.redirects) {
  const html = read(join(DIST, r.from, 'index.html'));
  ok(html !== null && html.includes(`url=${ORIGIN}${r.to}`), `redirect ${r.from} → ${r.to}`);
}
for (const [from, to] of [['/Projetos.html', '/obras'], ['/privacidade.html', '/privacidade']]) {
  const html = read(join(DIST, from, 'index.html'));
  ok(html !== null && html.includes(`url=${ORIGIN}${to}`), `redirect antigo ${from} → ${to}`);
}
const legacy = read(join(DIST, 'Projeto.html')) ?? '';
ok(legacy.includes('"reabilitacao-fachada-braga":"/obras/reabilitacao-fachada-braga"') && legacy.includes("get('obra')"), 'Projeto.html (?obra=) antigo');

// 5. Nenhum texto do markdown sai como HTML cru
const allHtml = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.html') && !p.includes(`${join('dist', 'assets')}`) && !p.endsWith('Projeto.html')) allHtml.push([p, readFileSync(p, 'utf8')]);
  }
})(DIST);
for (const [p, html] of allHtml) {
  const rel = p.slice(DIST.length);
  ok(!/<script\b[^>]*>[^<]*alert/i.test(html), `${rel}: <script>alert cru`);
  ok(!/<img\b[^>]*\bonerror\s*=/i.test(html), `${rel}: <img onerror> cru`);
  ok(!/<[a-z][^>]*\son[a-z]+\s*=/i.test(html), `${rel}: atributo on* num elemento`);
  ok(!/(?:href|src)\s*=\s*["']?\s*javascript:/i.test(html), `${rel}: href/src javascript:`);
  ok(!/<b onclick/i.test(html), `${rel}: <b onclick> cru`);
}
const evil = htmlByPath.get(base.pages.find((p) => p.path.startsWith('/obras/')).path) ?? '';
ok(evil.includes('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'), 'o <script> do markdown deveria sair escapado como texto');
ok(evil.includes('&lt;img src=x onerror=alert(1)&gt;'), 'o <img onerror> do markdown deveria sair escapado como texto');
ok(evil.includes('<strong>negrito</strong>') && evil.includes('<em>itálico</em>'), 'negrito/itálico permitidos deveriam funcionar');
ok(evil.includes('<a href="https://example.com/a?b=1&amp;c=2" rel="noopener noreferrer">segura</a>') && evil.includes('<a href="mailto:geral@example.com">mail</a>'), 'ligações seguras deveriam sair');
ok(!evil.includes('javascript:') || !/href="[^"]*javascript/i.test(evil), 'ligação javascript: não pode ser href');
ok(!/instagram[^>]*>[^<]*<\/a>.*facebook/s.test(evil) && !evil.includes('data-network="facebook"'), 'rede social com URL javascript: não pode sair');

console.log(failures ? `\ncheck-build: ${failures} falha(s) em ${checks} verificações` : `check-build: ${checks} verificações OK (${htmlByPath.size} páginas, ${locs.length} no sitemap)`);
process.exit(failures ? 1 : 0);
