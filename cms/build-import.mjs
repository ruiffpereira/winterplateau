#!/usr/bin/env node
/**
 * Gera `cms/import.json` — o site ACTUAL da Winterplateau (o da branch `main`) no formato do corpo do
 * `POST /cms/site-builder/save` (CONTRATO §5.2, sem `baseRevision`), para o importador da API
 * (`API-FullStack/scripts/importSitePages.ts`).
 *
 * Fontes: `content-import.csv` (chaves PT/EN/FR), o dicionário `public/assets/i18n.js` da `main` (commit 0772465) (traduz pelo texto PT
 * — é o que o site actual mostra) e o código da `main` de então (estrutura, endereços — commit 0772465). Onde não há tradução o valor fica
 * AUSENTE (nunca se inventa): o importador lista-o e `--fill-missing` copia o PT.
 *
 *   node cms/build-import.mjs            # reescreve cms/import.json
 *
 * Ids simbólicos (`@page:…`, `@block:…`, `@folder:…`) e ficheiros (`@media:<nome>`) são resolvidos pelo importador.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LANGS = ['pt', 'en', 'fr'];
/** O site actual: último commit da `main` antes de o kit do construtor entrar nela (ainda tem `public/assets/i18n.js`). */
const SITE_REF = '0772465';

// ── Fontes ───────────────────────────────────────────────────────────────────

/** CSV com vírgulas não escapadas no valor: chave e língua à esquerda, tipo/secção/pai à direita. */
function parseCsv(text) {
  const dict = {};
  for (const line of text.replace(/\r/g, '').split('\n').slice(1).filter(Boolean)) {
    const m = /^([^,]+),([a-z]{2}),([\s\S]*),([^,]*),([^,]*),([^,]*)$/.exec(line);
    if (!m) throw new Error(`Linha do CSV ilegível: ${line.slice(0, 80)}`);
    (dict[m[1]] ??= {})[m[2]] = m[3] === 'undefined' || m[3] === '' ? undefined : m[3];
  }
  return dict;
}
const csv = parseCsv(readFileSync(join(ROOT, 'content-import.csv'), 'utf8'));
// O CSV traz esta descrição entre aspas (artefacto da exportação; o site de antes não as mostrava).
for (const l of LANGS) if (csv['hero.description']?.[l]) csv['hero.description'][l] = csv['hero.description'][l].replace(/^"(.*)"$/, '$1');

function loadDict() {
  const src = execFileSync('git', ['-c', 'safe.directory=*', 'show', `${SITE_REF}:public/assets/i18n.js`], { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 24 }).split('\n');
  const start = src.findIndex((l) => l.includes('const DICT = {'));
  const end = src.findIndex((l, i) => i > start && /^ {2}};\s*$/.test(l));
  return new Function(`${src.slice(start, end + 1).join('\n').replace('const DICT =', 'return').replace(/;\s*$/, '')}`)();
}
const DICT = loadDict();

// ── Textos ───────────────────────────────────────────────────────────────────

/** `<em>x</em>` (richtext do CSV) → `*x*` (itálico do catálogo). */
const em = (s) => (s === undefined ? s : s.replace(/<em>(.*?)<\/em>/g, '*$1*'));
const clean = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && v !== ''));

/** I18n de uma chave do CSV. O dicionário do site (por texto PT) tem a última palavra: o CSV tem um "com" por "avec". */
function T(key, map = (s) => s) {
  const d = csv[key];
  if (!d?.pt) throw new Error(`Chave em falta no CSV: ${key}`);
  return clean(Object.fromEntries(LANGS.map((l) => [l, map(l === 'pt' ? d.pt : DICT[l]?.[d.pt] ?? d[l])])));
}
/** I18n de um texto PT: dicionário do site; sem entrada, só o PT (a tradução fica por fazer). */
function tx(pt) {
  return clean({ pt, en: DICT.en[pt], fr: DICT.fr[pt] });
}
/** Chave do CSV cujo valor é o mesmo em todas as línguas quando EN/FR vêm vazios (unidades como "m²"). */
const Tn = (key) => ({ ...N(csv[key].pt), ...T(key) });
/** Valor igual em todas as línguas (nomes, números, designações técnicas, moradas). */
const N = (v) => Object.fromEntries(LANGS.map((l) => [l, v]));
/** Mesmo texto composto por língua. */
const each = (fn) => Object.fromEntries(LANGS.map((l) => [l, fn(l)]));
const lang = (key, l) => (l === 'pt' ? csv[key]?.pt : DICT[l]?.[csv[key]?.pt] ?? csv[key]?.[l]);
const neutral = (key) => csv[key].pt;

// ── Peças ────────────────────────────────────────────────────────────────────

let n = 0;
const comp = (type, style, col, v = {}) => ({ type, style, col, v });
const titulo = (text, style = 'seccao', level = 'h2', align = 'left', col = 'all') => comp('titulo', style, col, { text, align, level });
const etiqueta = (text, col = 'all') => comp('etiqueta', 'normal', col, { text });
const texto = (body, style = 'normal', col = 'all') => comp('texto', style, col, { body });
const botao = (label, dest, style = 'cheio', col = 'all') => comp('botao', style, col, { label, dest });
const lista = (items, col = 'all') => comp('lista', 'normal', col, { items: items.map((text) => ({ text })) });
const toBlock = (k) => ({ kind: 'anchor', blockId: `@block:${k}` });
const toPage = (k) => ({ kind: 'page', pageId: `@page:${k}` });
const media = (name) => ({ same: true, values: { pt: `@media:${name}` } });

const blocks = [];
const folders = [
  { id: '@folder:inicio', name: 'Página inicial' },
  { id: '@folder:obras', name: 'Obras' },
  { id: '@folder:legal', name: 'Páginas legais' },
];
function block(key, name, folder, bg, layout, comps, anchor = null) {
  blocks.push({ id: `@block:${key}`, name, folderId: `@folder:${folder}`, layout, bg, ...(anchor ? { anchor } : {}), comps });
  return { kind: 'block', blockId: `@block:${key}` };
}
const special = (specialType, specialData) => ({ kind: 'special', specialType, specialData });

// ── Página inicial ───────────────────────────────────────────────────────────

const MARQUEE = ['Bandas', 'Cornijas', 'Colunas', 'Peitoris', 'EPS Exterior', 'EPS Interior', 'Rodatetos', 'Tetos Falsos', 'Divisórias', 'Perfil TC', 'Montante Stud', 'Canal Raia', 'Abobadilhas', 'Capoto'];
// Designações técnicas de perfis: o site actual não as traduz (e o CSV também não).
const TECH = new Set(['EPS Exterior', 'EPS Interior', 'Perfil TC', 'Montante Stud', 'Canal Raia']);
const name = (pt) => (TECH.has(pt) ? N(pt) : tx(pt));

const homeItems = [];
// O topo é UM item (regra do dono, 2026-10-21): o especial leva o texto E o edifício; nunca se parte num bloco à parte.
homeItems.push(
  special('edificio3d', {
    eyebrow: T('hero.tagline'),
    titulo: N('Winter*plateau*'),
    descricao: T('hero.description'),
    botoes: [
      { label: T('hero.cta_primary'), dest: toBlock('eps'), estilo: 'cheio' },
      { label: T('hero.cta_secondary'), dest: toBlock('downloads'), estilo: 'contorno' },
    ],
    lado: 'direita',
  }),
);
homeItems.push(special('faixa', { items: MARQUEE.map((m) => ({ name: name(m) })) }));

homeItems.push(
  block('numeros', 'Início · Números', 'inicio', 'escuro', 1, [
    comp('numeros', 'normal', 'all', {
      items: [1, 2, 3, 4].map((i) => ({ value: neutral(`stats.${i}.value`), label: T(`stats.${i}.label`), sub: T(`stats.${i}.sublabel`) })),
    }),
  ]),
);

const product = (key, anchor, name_, sel) =>
  block(key, name_, 'inicio', 'claro', 2, [
    etiqueta(T(`${sel}.eyebrow`), 1),
    titulo(T(`${sel}.title`), 'seccao', 'h2', 'left', 1),
    texto(T(`${sel}.description`), 'normal', 1),
    lista([1, 2, 3, 4].map((i) => T(`${sel}.item.${i}`)), 2),
  ], anchor);
homeItems.push(product('eps', '#eps', 'Início · EPS Exterior', 'eps_exterior'));
homeItems.push(product('interior', '#interior', 'Início · EPS Interior', 'eps_interior'));

homeItems.push(
  block('statement', 'Início · Frase de marca', 'inicio', 'marca', 1, [
    etiqueta(T('statement.sup')),
    titulo(each((l) => `${lang('statement.title', l)} *${lang('statement.title_em', l)}*`), 'frase', 'h2', 'center'),
    texto(T('statement.subtitle'), 'grande'),
  ]),
);

homeItems.push(
  block('metal', 'Início · Perfis metálicos', 'inicio', 'claro', 1, [
    etiqueta(T('metal.eyebrow')),
    titulo(T('metal.title')),
    comp('iconetexto', 'normal', 'all', {
      items: [1, 2, 3, 4].map((i) => {
        const tags = [1, 2, 3].map((t) => csv[`metal.${i}.tag.${t}`]?.pt).filter(Boolean);
        return {
          title: T(`metal.${i}.name`),
          text: each((l) => `${lang(`metal.${i}.description`, l)}\n\n${tags.map((t) => `- ${t}`).join('\n')}`),
        };
      }),
    }),
  ], '#metal'),
);

const SLUGS = Object.keys(csv).filter((k) => /^project\.[a-z0-9-]+\.slug$/.test(k)).map((k) => k.split('.')[1]);
const featured = [1, 2, 3].map((i) => csv[`obras_home.featured.${i}`].pt);

homeItems.push(
  block('obras-home', 'Início · Obras em destaque', 'inicio', 'claro', 1, [
    etiqueta(T('obras_home.eyebrow')),
    titulo(T('obras_home.title')),
    texto(T('obras_home.description'), 'grande'),
    comp('paginas', 'normal', 'all', { pick: featured.map((s) => `@page:${s}`) }),
    botao(T('obras_home.cta'), toPage('obras'), 'contorno'),
  ], '#obras'),
);

homeItems.push(
  block('empresa', 'Início · Empresa', 'inicio', 'claro', 2, [
    titulo(N(neutral('about.founding_year')), 'destaque', 'h3', 'left', 1),
    etiqueta(T('about.eyebrow'), 2),
    titulo(T('about.title', em), 'seccao', 'h2', 'left', 2),
    texto(T('about.body'), 'normal', 2),
    lista([1, 2, 3].map((i) => T(`about.cert.${i}`)), 2),
  ], '#about'),
);

// "Testemunhos" não entra: o site actual só tem texto de reserva ("Espaço reservado para o testemunho real do cliente").

const PDFS = [
  ['DECLARACAO_DESEMPENHO.pdf', 1],
  ['declaracao-conformidade.pdf', 2],
  ['dop.pdf', 3],
  ['modo-de-aplicacao-molduras.pdf', 4],
  ['WINTERPLATEAU_Catalogo-XS_AF.pdf', 5],
  ['catalogo-rodatetos-winterplateau_Versao-1.pdf', 6],
];
for (const [file, i] of PDFS) {
  const url = csv[`downloads.${i}.file`].pt;
  if (!url.endsWith(file)) throw new Error(`PDF ${i}: esperava ${file}, o CSV tem ${url}`);
}
homeItems.push(
  block('downloads', 'Início · Downloads', 'inicio', 'claro', 1, [
    etiqueta(T('downloads.eyebrow')),
    titulo(T('downloads.title')),
    comp('documentos', 'normal', 'all', { items: PDFS.map(([file, i]) => ({ name: T(`downloads.${i}.name`), file: media(file) })) }),
  ], '#downloads'),
);

homeItems.push(
  block('cta', 'Início · Chamada para orçamento', 'inicio', 'marca', 1, [
    titulo(each((l) => `${lang('cta.title', l)} *${lang('cta.title_em', l)}*`), 'frase', 'h2', 'center'),
    texto(T('cta.description'), 'grande'),
    botao(T('cta.primary'), toBlock('orcamento')),
    botao(T('cta.secondary'), toBlock('downloads'), 'contorno'),
  ]),
);

homeItems.push(
  block('orcamento', 'Início · Pedido de orçamento', 'inicio', 'claro', 2, [
    etiqueta(T('orcamento.eyebrow'), 1),
    titulo(T('orcamento.title'), 'seccao', 'h2', 'left', 1),
    texto(T('orcamento.description'), 'normal', 1),
    lista([1, 2, 3].map((i) => T(`orcamento.point.${i}`)), 1),
    comp('formulario', 'normal', 2, { types: [1, 2, 3, 4, 5].map((i) => ({ name: T(`orcamento.option.${i}`) })) }),
    texto(T('orcamento.note'), 'pequeno', 2),
  ], '#orcamento'),
);

const MORADA = ['contact.address.line1', 'contact.address.line2', 'contact.address.line3'].map(neutral);
homeItems.push(
  block('contactos', 'Início · Contactos', 'inicio', 'claro', 2, [
    etiqueta(T('contact.eyebrow'), 1),
    titulo(T('contact.title'), 'seccao', 'h2', 'left', 1),
    comp('contacto', 'normal', 1, { address: MORADA.join('\n'), phone: neutral('contact.phone.value'), email: neutral('contact.email.value') }),
    comp('redes', 'normal', 1, {
      items: ['linkedin', 'facebook', 'instagram'].map((network) => ({ network, url: neutral(`contact.social.${network}`) })),
    }),
    comp('mapa', 'normal', 2, { address: 'Avenida Principal 202, 4730-041 Atiães, Vila Verde, Braga, Portugal', zoom: 'rua', title: N('Winterplateau') }),
  ], '#contact'),
);

// ── Obras ────────────────────────────────────────────────────────────────────

const obrasItems = [
  block('obras-intro', 'Obras · Introdução', 'obras', 'claro', 1, [
    titulo(T('projects_page.eyebrow'), 'destaque', 'h1'),
    texto(T('projects_page.description'), 'grande'),
    comp('paginas', 'normal', 'all', { pick: SLUGS.map((s) => `@page:${s}`) }),
  ]),
  block('obras-cta', 'Obras · Chamada para orçamento', 'obras', 'marca', 1, [
    titulo(T('projects_page.cta.title'), 'frase', 'h2', 'center'),
    texto(T('projects_page.cta.description'), 'grande'),
    botao(T('nav.cta'), toBlock('orcamento')),
  ]),
];

const projectPages = [];
const projectItems = {};
for (const slug of SLUGS) {
  const p = (k) => `project.${slug}.${k}`;
  const stats = [1, 2, 3].map((i) => ({
    value: neutral(p(`stat.${i}.value`)),
    label: T(p(`stat.${i}.label`)),
    ...(csv[p(`stat.${i}.unit`)] ? { sub: Tn(p(`stat.${i}.unit`)) } : {}),
  }));
  const products = [1, 2, 3, 4].map((i) => csv[p(`product.${i}`)]?.pt).filter(Boolean);
  const steps = [1, 2, 3, 4].map((i) => ({
    title: each((l) => `${csv[p(`process.${i}.phase`)].pt} · ${lang(p(`process.${i}.title`), l)}`),
    text: T(p(`process.${i}.description`)),
  }));
  const others = SLUGS.filter((s) => s !== slug).slice(0, 3);
  projectItems[`@page:${slug}`] = [
    block(`${slug}-cabecalho`, `${csv[p('title')].pt} · Cabeçalho`, 'obras', 'claro', 1, [
      etiqueta(each((l) => `${lang(p('type'), l)} · ${csv[p('location')].pt} · ${csv[p('year')].pt}`)),
      titulo(T(p('title')), 'destaque', 'h1'),
      texto(T(p('summary')), 'grande'),
    ]),
    block(`${slug}-numeros`, `${csv[p('title')].pt} · Números`, 'obras', 'escuro', 1, [comp('numeros', 'normal', 'all', { items: stats })]),
    block(`${slug}-processo`, `${csv[p('title')].pt} · Processo`, 'obras', 'claro', 1, [
      etiqueta(T('project_detail.process.eyebrow')),
      titulo(T('project_detail.process.title')),
      comp('iconetexto', 'normal', 'all', { items: steps }),
    ]),
    block(`${slug}-materiais`, `${csv[p('title')].pt} · Materiais`, 'obras', 'claro', 1, [
      etiqueta(T('project_detail.solutions.eyebrow')),
      titulo(T('project_detail.solutions.title')),
      lista(products.map((x) => (TECH.has(x) ? N(x) : tx(x)))),
    ]),
    block(`${slug}-outras`, `${csv[p('title')].pt} · Outras obras`, 'obras', 'escuro', 1, [
      titulo(T('project_detail.other.title')),
      comp('paginas', 'normal', 'all', { pick: others.map((s) => `@page:${s}`) }),
      botao(T('project_detail.other.cta'), toPage('obras'), 'contorno'),
    ]),
  ];
  const seoTitle = (l) => lang(p('seo.title'), l)?.replace(/\s*\|\s*Winterplateau\s*$/, '');
  projectPages.push({
    id: `@page:${slug}`,
    parentId: '@page:obras',
    slug: csv[p('slug')].pt,
    title: T(p('title')),
    status: 'published',
    seo: { title: clean(each(seoTitle)), description: T(p('seo.description')), image: media('og-image.png') },
  });
}

// ── Privacidade (PT: texto da `main`, src/pages/privacidade.astro; EN/FR: traduzidos por Claude a 2026-10-15,
//    por decisão do dono — texto legal, a rever por ele no Backoffice) ─────────────────────────────────────────

const MAIL = '[geral@winterplateau.pt](mailto:geral@winterplateau.pt)';
const PRIVACY = [
  [
    { pt: '1. Responsável pelo tratamento', en: '1. Data controller', fr: '1. Responsable du traitement' },
    {
      pt: `A Winterplateau é a responsável pelo tratamento dos seus dados. Para qualquer questão de privacidade, contacte-nos através de ${MAIL}.`,
      en: `Winterplateau is the controller of your personal data. For any privacy question, please contact us at ${MAIL}.`,
      fr: `Winterplateau est responsable du traitement de vos données. Pour toute question relative à la vie privée, contactez-nous à ${MAIL}.`,
    },
  ],
  [
    { pt: '2. Que dados recolhemos', en: '2. What data we collect', fr: '2. Données que nous collectons' },
    {
      pt: '- **Pedidos de orçamento e contacto:** nome, email, telefone e a mensagem/descrição que nos envia.\n- **Estatísticas de utilização:** dados agregados e anónimos sobre as visitas ao site (ver secção Cookies).',
      en: '- **Quote and contact requests:** name, email, phone number and the message/description you send us.\n- **Usage statistics:** aggregated, anonymous data about visits to the website (see the Cookies section).',
      fr: '- **Demandes de devis et de contact :** nom, e-mail, téléphone et le message/la description que vous nous envoyez.\n- **Statistiques d’utilisation :** données agrégées et anonymes sur les visites du site (voir la section Cookies).',
    },
  ],
  [
    { pt: '3. Para que usamos os dados', en: '3. How we use the data', fr: '3. Utilisation des données' },
    {
      pt: '- Responder a pedidos de orçamento e a mensagens de contacto;\n- Prestar apoio e dar seguimento comercial ao seu pedido;\n- Melhorar o site através de estatísticas agregadas.',
      en: '- To reply to quote requests and contact messages;\n- To provide support and commercial follow-up to your request;\n- To improve the website through aggregated statistics.',
      fr: '- Répondre aux demandes de devis et aux messages de contact ;\n- Assurer le suivi et l’accompagnement commercial de votre demande ;\n- Améliorer le site grâce à des statistiques agrégées.',
    },
  ],
  [
    { pt: '4. Base legal', en: '4. Legal basis', fr: '4. Base juridique' },
    {
      pt: 'Tratamos os seus dados com base no seu **consentimento** e/ou em diligências **pré-contratuais** a seu pedido (resposta a orçamentos), e no nosso **interesse legítimo** em manter o site seguro e funcional.',
      en: 'We process your data on the basis of your **consent** and/or **pre-contractual** steps taken at your request (replying to quotes), and our **legitimate interest** in keeping the website secure and working.',
      fr: 'Nous traitons vos données sur la base de votre **consentement** et/ou de mesures **précontractuelles** prises à votre demande (réponse aux devis), ainsi que de notre **intérêt légitime** à maintenir le site sûr et fonctionnel.',
    },
  ],
  [
    { pt: '5. Cookies e estatísticas', en: '5. Cookies and statistics', fr: '5. Cookies et statistiques' },
    {
      pt: 'Usamos apenas cookies **essenciais** ao funcionamento do site. Para estatísticas usamos uma ferramenta **sem cookies e anónima** (Umami, auto-hospedado), que **não** rastreia os visitantes entre sites nem cria perfis individuais.',
      en: 'We only use cookies that are **essential** for the website to work. For statistics we use a **cookie-free, anonymous** tool (Umami, self-hosted), which does **not** track visitors across websites or build individual profiles.',
      fr: 'Nous n’utilisons que des cookies **essentiels** au fonctionnement du site. Pour les statistiques, nous utilisons un outil **sans cookies et anonyme** (Umami, auto-hébergé), qui ne suit **pas** les visiteurs d’un site à l’autre et ne crée pas de profils individuels.',
    },
  ],
  [
    { pt: '6. Conservação dos dados', en: '6. Data retention', fr: '6. Conservation des données' },
    {
      pt: 'Conservamos os dados de contacto apenas durante o tempo necessário para dar resposta ao seu pedido e cumprir obrigações legais aplicáveis.',
      en: 'We keep contact data only for as long as necessary to reply to your request and to comply with applicable legal obligations.',
      fr: 'Nous conservons les données de contact uniquement pendant la durée nécessaire pour répondre à votre demande et respecter les obligations légales applicables.',
    },
  ],
  [
    { pt: '7. Os seus direitos', en: '7. Your rights', fr: '7. Vos droits' },
    {
      pt: `Tem direito a aceder, retificar, eliminar e exportar (portabilidade) os seus dados, bem como a opor-se ou limitar o seu tratamento. Para exercer estes direitos, contacte-nos através de ${MAIL}. Tem ainda o direito de apresentar reclamação à Comissão Nacional de Proteção de Dados (CNPD).`,
      en: `You have the right to access, rectify, erase and export (portability) your data, and to object to or restrict its processing. To exercise these rights, contact us at ${MAIL}. You also have the right to lodge a complaint with the Portuguese data protection authority (Comissão Nacional de Proteção de Dados — CNPD).`,
      fr: `Vous avez le droit d’accéder à vos données, de les rectifier, de les effacer et de les exporter (portabilité), ainsi que de vous opposer à leur traitement ou de le limiter. Pour exercer ces droits, contactez-nous à ${MAIL}. Vous avez également le droit d’introduire une réclamation auprès de l’autorité portugaise de protection des données (Comissão Nacional de Proteção de Dados — CNPD).`,
    },
  ],
  [
    { pt: '8. Subcontratantes', en: '8. Processors', fr: '8. Sous-traitants' },
    {
      pt: 'Para prestar o serviço recorremos a fornecedores que tratam dados em nosso nome (alojamento e envio de emails), sujeitos a obrigações de confidencialidade e segurança. Os dados não são vendidos a terceiros.',
      en: 'To provide the service we use suppliers that process data on our behalf (hosting and email delivery), bound by confidentiality and security obligations. Your data is never sold to third parties.',
      fr: 'Pour fournir le service, nous faisons appel à des prestataires qui traitent des données pour notre compte (hébergement et envoi d’e-mails), soumis à des obligations de confidentialité et de sécurité. Les données ne sont jamais vendues à des tiers.',
    },
  ],
  [
    { pt: '9. Alterações a esta política', en: '9. Changes to this policy', fr: '9. Modifications de cette politique' },
    {
      pt: 'Podemos atualizar esta política. A data da última atualização é indicada no topo desta página.',
      en: 'We may update this policy. The date of the last update is shown at the top of this page.',
      fr: 'Nous pouvons mettre à jour cette politique. La date de la dernière mise à jour est indiquée en haut de cette page.',
    },
  ],
];
const bold = (o) => Object.fromEntries(Object.entries(o).map(([l, v]) => [l, `**${v}**`]));
const UPDATED = { pt: 'junho de 2026', en: 'June 2026', fr: 'juin 2026' };
const privacyComps = [
  titulo(T('privacy.title'), 'destaque', 'h1'),
  texto(Object.fromEntries(Object.keys(UPDATED).map((l) => [l, `${(csv['privacy.updated_label'][l] ?? csv['privacy.updated_label'].pt)}: ${UPDATED[l]}`])), 'pequeno'),
  texto({
    pt: 'A sua privacidade é importante para a Winterplateau. Esta política explica que dados pessoais recolhemos através deste site, para que os usamos e quais os seus direitos ao abrigo do Regulamento Geral sobre a Proteção de Dados (RGPD).',
    en: 'Your privacy matters to Winterplateau. This policy explains what personal data we collect through this website, what we use it for and what your rights are under the General Data Protection Regulation (GDPR).',
    fr: 'Votre vie privée est importante pour Winterplateau. Cette politique explique quelles données personnelles nous collectons via ce site, à quelles fins nous les utilisons et quels sont vos droits au titre du Règlement général sur la protection des données (RGPD).',
  }, 'grande'),
  ...PRIVACY.flatMap(([h, p]) => [texto(bold(h)), texto(p)]),
];

// ── Partes comuns ────────────────────────────────────────────────────────────

const topo = {
  comps: [
    comp('imagem', 'normal', 'all', { image: media('favicon.svg'), alt: N('Winterplateau') }),
    comp('menu', 'normal', 'all', {
      items: [
        { label: T('nav.eps_exterior'), dest: toBlock('eps') },
        { label: T('nav.eps_interior'), dest: toBlock('interior') },
        { label: T('nav.metal'), dest: toBlock('metal') },
        { label: T('nav.projects'), dest: toPage('obras') },
        { label: T('nav.company'), dest: toBlock('empresa') },
        { label: T('nav.downloads'), dest: toBlock('downloads') },
        { label: T('nav.contacts'), dest: toBlock('contactos') },
      ],
    }),
    comp('botao', 'cheio', 'all', { label: T('nav.cta'), dest: toBlock('orcamento') }),
    comp('linguas', 'normal', 'all', {}),
  ],
};
const rodape = {
  layout: 3,
  bg: 'escuro',
  comps: [
    texto(T('footer.tagline'), 'normal', 1),
    comp('redes', 'normal', 1, { items: ['linkedin', 'facebook', 'instagram'].map((network) => ({ network, url: neutral(`contact.social.${network}`) })) }),
    texto(each((l) => `**${lang('footer.col.solutions', l)}**`), 'normal', 2),
    comp('menu', 'normal', 2, {
      items: [
        { label: T('nav.eps_exterior'), dest: toBlock('eps') },
        { label: T('nav.eps_interior'), dest: toBlock('interior') },
        { label: T('nav.metal'), dest: toBlock('metal') },
      ],
    }),
    texto(each((l) => `**${lang('footer.col.company', l)}**`), 'normal', 3),
    comp('menu', 'normal', 3, {
      items: [
        { label: T('about.eyebrow'), dest: toBlock('empresa') },
        { label: tx('Portefólio'), dest: toPage('obras') },
        { label: T('nav.downloads'), dest: toBlock('downloads') },
        { label: T('nav.contacts'), dest: toBlock('contactos') },
      ],
    }),
    texto(T('footer.copyright'), 'pequeno', 'all'),
    comp('menu', 'normal', 'all', { items: [{ label: T('footer.privacy'), dest: toPage('privacidade') }] }),
  ],
};

// ── Páginas ──────────────────────────────────────────────────────────────────

const strip = (s) => s?.replace(/\s*\|\s*Winterplateau\s*$/, '').replace(/^Winterplateau\s*—\s*/, '');
const seoOf = (prefix) => ({
  title: clean(each((l) => strip(lang(`${prefix}.title`, l)))),
  description: T(`${prefix}.description`),
  keywords: T(`${prefix}.keywords`),
  image: media('og-image.png'),
});

const pages = [
  { id: '@page:home', parentId: null, slug: '', isHome: true, title: T('nav.home'), status: 'published', seo: seoOf('seo.home') },
  { id: '@page:obras', parentId: null, slug: 'obras', title: T('nav.projects'), status: 'published', seo: seoOf('seo.projects') },
  ...projectPages,
  { id: '@page:privacidade', parentId: null, slug: 'privacidade', title: T('privacy.title'), status: 'published' },
];

blocks.push({ id: '@block:privacidade', name: 'Política de Privacidade', folderId: '@folder:legal', layout: 1, bg: 'claro', comps: privacyComps });

const payload = {
  _comentario: 'Gerado por cms/build-import.mjs — não editar à mão. Formato: corpo do POST /cms/site-builder/save sem baseRevision.',
  folders: { upsert: folders },
  pages: { upsert: pages },
  blocks: { upsert: blocks },
  items: {
    '@page:home': homeItems,
    '@page:obras': obrasItems,
    ...projectItems,
    '@page:privacidade': [{ kind: 'block', blockId: '@block:privacidade' }],
  },
  parts: { topo, rodape },
};

writeFileSync(join(ROOT, 'cms', 'import.json'), `${JSON.stringify(payload, null, 2)}\n`);
console.log(`cms/import.json: ${pages.length} páginas, ${blocks.length} blocos, ${folders.length} pastas, ${Object.values(payload.items).flat().length} itens`);
void n;
