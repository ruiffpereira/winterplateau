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
const countOf = (html, re) => (html.match(re) || []).length;

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
    const hasTopo = base.topo.comps.length > 0;
    ok(html.includes('<header class="topo">') === hasTopo, `${page.path}: topo ${hasTopo ? 'em falta' : 'indevido (o site não tem topo)'}`);
    ok(html.includes('<footer class="rodape"') === base.rodape.comps.length > 0, `${page.path}: rodapé ${base.rodape.comps.length ? 'em falta' : 'indevido (o site não tem rodapé)'}`);
    ok(html.includes('<main id="conteudo" data-topo') === hasTopo, `${page.path}: data-topo do <main>`);
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
    // Só JSON-LD inline; os scripts do kit são módulos do bundle (`/_astro/*.js`), nunca código inline
    const scripts = [...html.matchAll(/<script\b[^>]*>/g)].map((m) => m[0]);
    const bundled = (s) => s.includes('type="module"') && /src="\/_astro\/[^"]+\.js"/.test(s);
    ok(scripts.every((s) => s.includes('application/ld+json') || bundled(s)), `${page.path}: <script> inesperado: ${scripts.find((s) => !s.includes('ld+json') && !bundled(s))}`);
    ok(scripts.some(bundled), `${page.path}: sem o script do kit`);
  }
}
ok(htmlByPath.size === sites.reduce((n, s) => n + s.pages.length, 0), 'número de páginas');
const FULL = base.pages.some((p) => p.path === '/componentes'); // fixture completa; a mínima (fixtures/minimo) só prova a tolerância
if (FULL) ok(sites.some((s) => s.pages.some((p) => p.seo.noindex)), 'a fixture deveria ter uma página noindex');

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
for (const [from, to] of FULL ? [['/Projetos.html', '/obras'], ['/privacidade.html', '/privacidade']] : []) {
  const html = read(join(DIST, from, 'index.html'));
  ok(html !== null && html.includes(`url=${ORIGIN}${to}`), `redirect antigo ${from} → ${to}`);
}
const legacy = read(join(DIST, 'Projeto.html')) ?? '';
if (FULL) ok(legacy.includes('"reabilitacao-fachada-braga":"/obras/reabilitacao-fachada-braga"') && legacy.includes("get('obra')"), 'Projeto.html (?obra=) antigo');

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
if (FULL) {
const evil = htmlByPath.get(base.pages.find((p) => p.path.startsWith('/obras/')).path) ?? '';
ok(evil.includes('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'), 'o <script> do markdown deveria sair escapado como texto');
ok(evil.includes('&lt;img src=x onerror=alert(1)&gt;'), 'o <img onerror> do markdown deveria sair escapado como texto');
ok(evil.includes('<strong>negrito</strong>') && evil.includes('<em>itálico</em>'), 'negrito/itálico permitidos deveriam funcionar');
ok(evil.includes('<a href="https://example.com/a?b=1&amp;c=2" rel="noopener noreferrer">segura</a>') && evil.includes('<a href="mailto:geral@example.com">mail</a>'), 'ligações seguras deveriam sair');
ok(!evil.includes('javascript:') || !/href="[^"]*javascript/i.test(evil), 'ligação javascript: não pode ser href');
ok(!/instagram[^>]*>[^<]*<\/a>.*facebook/s.test(evil) && !evil.includes('data-network="facebook"'), 'rede social com URL javascript: não pode sair');
}

// 6. Kit do F18: componentes, estilos, fundos, especiais, numeração, zig-zag, ids, scripts
for (const site of sites) {
  for (const page of site.pages) {
    const html = htmlByPath.get(page.path) ?? '';
    const blocks = page.items.filter((i) => i.kind === 'block');
    const sheets = [...html.matchAll(/ data-sheet="FL (\d+)"/g)].map((m) => Number(m[1]));
    ok(sheets.length === blocks.length && sheets.every((n, i) => n === i + 1), `${page.path}: numeração FL deveria ser 01…${blocks.length}, veio [${sheets}]`);
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    const dup = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
    ok(dup.length === 0, `${page.path}: ids duplicados: ${dup}`);
    for (const c of [...site.topo.comps, ...blocks.flatMap((b) => b.comps), ...site.rodape.comps]) {
      ok(html.includes(`c-${c.type} c-${c.type}--${c.style}`), `${page.path}: falta a classe c-${c.type}--${c.style}`);
    }
    for (const b of blocks) ok(html.includes(`data-bg="${b.bg}"`), `${page.path}: fundo ${b.bg} em falta`);
    for (const sp of page.items.filter((i) => i.kind === 'special')) ok(html.includes(`especial--${sp.type}`), `${page.path}: especial ${sp.type} em falta`);
    ok(!page.items.some((i) => i.kind === 'block' && i.comps.some((c) => c.type === 'botao' && c.style === 'claro')), `${page.path}: a fixture não deve usar o botão "claro" (sai do manifest no F19)`);
  }
}
if (FULL) {
  const pt = sites[0];
  const html = (p) => htmlByPath.get(p) ?? '';
  const comp = html('/componentes');
  const required = { titulo: ['seccao', 'destaque', 'frase'], texto: ['normal', 'grande', 'pequeno'], botao: ['cheio', 'contorno'], imagem: ['normal', 'redonda', 'total'], espaco: ['p', 'm', 'g'] };
  for (const [type, styles] of Object.entries(required)) for (const st of styles) ok(comp.includes(`c-${type} c-${type}--${st}`), `/componentes: falta o estilo ${type}/${st}`);
  for (const bg of ['claro', 'escuro', 'marca']) ok(comp.includes(`data-bg="${bg}"`), `/componentes: falta o fundo ${bg}`);
  const types = new Set(pt.pages.flatMap((p) => p.items.flatMap((i) => (i.kind === 'block' ? i.comps.map((c) => c.type) : []))).concat(pt.topo.comps.map((c) => c.type), pt.rodape.comps.map((c) => c.type)));
  for (const t of ['titulo', 'etiqueta', 'texto', 'botao', 'lista', 'numeros', 'imagem', 'galeria', 'video', 'mapa', 'logotipos', 'iconetexto', 'precos', 'documentos', 'paginas', 'citacoes', 'faq', 'negocio', 'avaliacoes', 'contacto', 'formulario', 'menu', 'redes', 'linguas', 'espaco']) ok(types.has(t), `as fixtures não têm nenhum componente "${t}"`);
  for (const t of ['edificio3d', 'faixa']) ok(pt.pages.some((p) => p.items.some((i) => i.kind === 'special' && i.type === t)), `as fixtures não têm o especial ${t}`);
  ok(countOf(comp, / data-zig="1"/g) === 1, `/componentes: esperava 1 bloco com zig-zag, vieram ${countOf(comp, / data-zig="1"/g)}`);
  ok(countOf(html('/orcamento'), / data-zig=/g) === 0, '/orcamento: bloco sem média não faz zig-zag');
    ok(comp.includes('data-icon') === false && comp.includes('class="icon"'), '/componentes: ícones do iconetexto');
  // blocos repetidos e especiais repetidos
  const rep = html('/repetidos');
  ok(countOf(rep, / id="repetido"/g) === 1, `/repetidos: a âncora repetida deveria ficar uma só vez (veio ${countOf(rep, / id="repetido"/g)})`);
  ok(countOf(rep, /<div class="faixa-set" aria-hidden="true"/g) === 2, '/repetidos: cada faixa deveria ter uma cópia escondida das leitoras de ecrã');
  ok(countOf(rep, /<section class="bloco"[^>]* data-sheet=/g) === 5 && countOf(rep, /especial--edificio3d/g) === 2, '/repetidos: os blocos e os especiais repetidos deveriam sair todos');
  ok(rep.includes('id="hdp-1"') && rep.includes('id="hdp-4"'), '/repetidos: cada edifício com o seu id de padrão SVG');
  ok(countOf(rep, /<form class="c-formulario/g) === 2, '/repetidos: dois formulários');
  // formulário: marcação e ligação à API (sem API no build o endpoint fica vazio e o script mostra "indisponível")
  const orc = html('/orcamento');
  ok(/<form class="c-formulario[^>]*novalidate[^>]*data-endpoint=""/.test(orc) || /<form class="c-formulario[^>]*data-endpoint=/.test(orc), '/orcamento: formulário sem data-endpoint');
  for (const n of ['name', 'email', 'phone', 'message']) ok(orc.includes(`name="${n}"`), `/orcamento: campo ${n} em falta no formulário`);
  ok(orc.includes('role="status"'), '/orcamento: o formulário precisa de uma zona de estado (aria-live)');
  ok(orc.includes('https://wa.me/351253193667'), '/orcamento: botão do WhatsApp com o telefone do contacto');
  // acessibilidade mínima: texto alternativo e nome nos controlos
  ok(!/<img(?![^>]*\balt=)[^>]*>/.test(comp), '/componentes: <img> sem atributo alt');
  ok(/<a class="skip" href="#conteudo"/.test(comp) && /<button class="burger"[^>]*aria-expanded="false"[^>]*aria-label=/.test(comp), '/componentes: salto para o conteúdo e botão do menu acessíveis');
  const en = html('/en/repeated');
  ok(en.includes('CORNICE') && en.includes('Skip to content'), '/en/repeated: textos do kit na língua da página');
}

// 7. Código do kit: orçamento de linhas, `set:html` só com text.ts, nada de HTML escrito por scripts
const walk = (dir, out = []) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
};
let kitLines = 0;
for (const f of [...walk('src/cms'), 'src/layouts/Base.astro']) {
  const src = readFileSync(f, 'utf8');
  kitLines += src.split('\n').length - 1;
  for (const m of src.matchAll(/set:html=\{([^}]*)\}/g)) ok(/^\s*(inline|md|json)\(/.test(m[1]), `${f}: set:html com algo que não passa por text.ts: ${m[1]}`);
  if (f.includes(join('cms', 'scripts'))) ok(!/innerHTML|insertAdjacentHTML|document\.write|\beval\(/.test(src), `${f}: o script escreve HTML`);
}
ok(kitLines <= 3000, `o kit tem ${kitLines} linhas (orçamento: 3 000)`);
ok(!existsSync(join(DIST, 'assets', 'i18n.js')) && !existsSync(join(DIST, 'scripts', 'home.js')), 'os scripts antigos (i18n.js, home.js) não deviam estar no dist');
console.log(`kit: ${kitLines} linhas`);

console.log(failures ? `\ncheck-build: ${failures} falha(s) em ${checks} verificações` : `check-build: ${checks} verificações OK (${htmlByPath.size} páginas, ${locs.length} no sitemap)`);
process.exit(failures ? 1 : 0);
