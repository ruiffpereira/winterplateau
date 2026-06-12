/* ════════════════════════════════════════════════════════════════
   WINTERPLATEAU · OBRAS / PROJETOS
   Single source of truth. In production this array is produced by the
   backoffice; the site renders cards, the index grid and each detail
   page from it. Add a project = add an entry here.
   ════════════════════════════════════════════════════════════════ */

const PROJECTS = [
  {
    slug: 'reabilitacao-fachada-braga',
    title: 'Reabilitação de Fachada',
    location: 'Braga',
    year: '2023',
    type: 'Reabilitação',
    cols: 3, floors: 4, hue: 206,
    summary: 'Recuperação integral da envolvente de um edifício de habitação dos anos 80. Aplicação de sistema ETICS (capoto) com molduras decorativas em EPS — cornijas, bandas e peitoris — devolvendo carácter e eficiência térmica ao imóvel.',
    products: ['Capoto / ETICS', 'Cornijas', 'Bandas', 'Peitoris'],
    stats: [{ n: '420', u: 'm²', l: 'Fachada' }, { n: '6', u: 'sem', l: 'Duração' }, { n: 'B', u: '→A+', l: 'Eficiência' }],
    process: [
      { ph: '01', t: 'Diagnóstico', d: 'Levantamento de patologias, fissuras e pontes térmicas da fachada existente.' },
      { ph: '02', t: 'Preparação', d: 'Limpeza, reparação do reboco e aplicação do sistema de isolamento ETICS.' },
      { ph: '03', t: 'Molduras EPS', d: 'Colagem e fixação das cornijas, bandas e peitoris Winterplateau.' },
      { ph: '04', t: 'Acabamento', d: 'Barramento armado, primário e revestimento final na cor escolhida.' },
    ],
  },
  {
    slug: 'moradia-ponte-de-lima',
    title: 'Moradia Unifamiliar',
    location: 'Ponte de Lima',
    year: '2022',
    type: 'Construção Nova',
    cols: 2, floors: 2, hue: 199,
    summary: 'Construção de raiz de moradia contemporânea. As molduras de vão e a cornija de remate em EPS conferem profundidade à fachada sem o peso e o custo da pedra natural.',
    products: ['Molduras de Vão', 'Cornija', 'Pilastras'],
    stats: [{ n: '260', u: 'm²', l: 'Área' }, { n: '4', u: 'sem', l: 'Duração' }, { n: '12', u: 'vãos', l: 'Molduras' }],
    process: [
      { ph: '01', t: 'Projeto', d: 'Definição do desenho de fachada e seleção dos perfis de moldura.' },
      { ph: '02', t: 'Estrutura', d: 'Alvenaria concluída e fachada preparada para receber as molduras.' },
      { ph: '03', t: 'Aplicação', d: 'Montagem das molduras de vão, pilastras e cornija de remate.' },
      { ph: '04', t: 'Pintura', d: 'Acabamento final e tratamento hidrófugo das superfícies.' },
    ],
  },
  {
    slug: 'edificio-comercial-guimaraes',
    title: 'Edifício Comercial',
    location: 'Guimarães',
    year: '2024',
    type: 'Reabilitação',
    cols: 4, floors: 3, hue: 210,
    summary: 'Modernização da fachada de um edifício comercial no centro histórico. Bandas horizontais e pilastras verticais em EPS criam um ritmo elegante que valoriza as montras ao nível da rua.',
    products: ['Bandas', 'Pilastras', 'Cornijas', 'Capoto / ETICS'],
    stats: [{ n: '680', u: 'm²', l: 'Fachada' }, { n: '8', u: 'sem', l: 'Duração' }, { n: '3', u: 'pisos', l: 'Intervenção' }],
    process: [
      { ph: '01', t: 'Estudo', d: 'Compatibilização com as regras do centro histórico e licenciamento.' },
      { ph: '02', t: 'Isolamento', d: 'Aplicação de capoto em toda a envolvente exterior.' },
      { ph: '03', t: 'Composição', d: 'Montagem das bandas e pilastras segundo o desenho aprovado.' },
      { ph: '04', t: 'Entrega', d: 'Acabamento, limpeza e entrega da obra ao cliente.' },
    ],
  },
  {
    slug: 'apartamentos-vila-verde',
    title: 'Bloco de Apartamentos',
    location: 'Vila Verde',
    year: '2023',
    type: 'Construção Nova',
    cols: 4, floors: 5, hue: 203,
    summary: 'Empreendimento de habitação coletiva com fachada ventilada e remates em EPS. Solução leve que acelera a obra e garante uniformidade em todos os pisos.',
    products: ['Cornijas', 'Bandas', 'Peitoris', 'Capoto / ETICS'],
    stats: [{ n: '1.240', u: 'm²', l: 'Fachada' }, { n: '14', u: 'sem', l: 'Duração' }, { n: '20', u: 'frações', l: 'Habitação' }],
    process: [
      { ph: '01', t: 'Planeamento', d: 'Faseamento da obra por alçado e logística de estaleiro.' },
      { ph: '02', t: 'Isolamento', d: 'Sistema ETICS aplicado piso a piso.' },
      { ph: '03', t: 'Molduras', d: 'Bandas, cornijas e peitoris montados em série.' },
      { ph: '04', t: 'Acabamento', d: 'Revestimento final e ensaios de desempenho térmico.' },
    ],
  },
  {
    slug: 'restauro-solar-barcelos',
    title: 'Restauro de Solar',
    location: 'Barcelos',
    year: '2021',
    type: 'Reabilitação',
    cols: 3, floors: 2, hue: 196,
    summary: 'Recuperação de elementos decorativos de um solar do século XIX. Réplicas das molduras originais executadas em EPS de alta densidade, fiéis ao desenho histórico.',
    products: ['Molduras à medida', 'Cornijas', 'Pilastras'],
    stats: [{ n: '310', u: 'm²', l: 'Fachada' }, { n: '10', u: 'sem', l: 'Duração' }, { n: '1850', u: '', l: 'Época' }],
    process: [
      { ph: '01', t: 'Levantamento', d: 'Medição e moldagem dos elementos decorativos originais.' },
      { ph: '02', t: 'Produção', d: 'Corte CNC das réplicas em EPS de alta densidade.' },
      { ph: '03', t: 'Montagem', d: 'Aplicação cuidada respeitando a composição histórica.' },
      { ph: '04', t: 'Patine', d: 'Acabamento texturado a imitar a pedra envelhecida.' },
    ],
  },
  {
    slug: 'clinica-famalicao',
    title: 'Clínica Privada',
    location: 'V. N. Famalicão',
    year: '2024',
    type: 'Construção Nova',
    cols: 3, floors: 3, hue: 208,
    summary: 'Fachada limpa e contemporânea para um edifício de saúde. Linhas horizontais em banda de EPS marcam os pisos e integram a sinalética exterior.',
    products: ['Bandas', 'Cornija', 'Capoto / ETICS'],
    stats: [{ n: '540', u: 'm²', l: 'Fachada' }, { n: '7', u: 'sem', l: 'Duração' }, { n: 'A+', u: '', l: 'Eficiência' }],
    process: [
      { ph: '01', t: 'Conceito', d: 'Definição da linguagem de fachada com o gabinete de arquitetura.' },
      { ph: '02', t: 'Isolamento', d: 'Capoto contínuo para máximo desempenho térmico.' },
      { ph: '03', t: 'Bandas', d: 'Montagem das bandas horizontais que ritmam os pisos.' },
      { ph: '04', t: 'Entrega', d: 'Acabamento branco e integração da sinalética.' },
    ],
  },
];

/* ── FAÇADE ILLUSTRATION ──
   Generates a blueprint-flavoured building. mode 'before' = old/dull,
   no moldings; mode 'after' = refreshed with blue EPS moldings.        */
function facadeSVG(p, mode) {
  const W = 480, H = 360;
  const bx = 46, bw = W - bx * 2;
  const by = 46, bh = H - by - 30;
  const cols = p.cols, floors = p.floors;
  const after = mode === 'after';
  const wall = after ? '#F2EEE6' : '#C7C1B4';
  const win = after ? 'rgba(25,163,224,.16)' : '#8E887C';
  const winStroke = after ? '#19A3E0' : '#6E685D';
  const line = after ? '#19A3E0' : '#857F73';
  const sky = after ? '#EAF6FC' : '#DAD7CF';

  const padIn = 22;
  const gx = 14, gy = 16;
  const innerX = bx + padIn, innerW = bw - padIn * 2;
  const cw = (innerW - (cols - 1) * gx) / cols;
  const innerTop = by + (after ? 30 : 18);
  const innerH = (by + bh) - innerTop - 16;
  const ch = (innerH - (floors - 1) * gy) / floors;

  let s = `<svg viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">`;
  s += `<rect width="${W}" height="${H}" fill="${sky}"/>`;
  // ground
  s += `<line x1="0" y1="${by + bh + 8}" x2="${W}" y2="${by + bh + 8}" stroke="${line}" stroke-width="1" stroke-dasharray="5 6" opacity=".4"/>`;
  // building body
  s += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="${wall}" stroke="${line}" stroke-width="1.2"/>`;

  if (after) {
    // cornice (3 stepped layers)
    s += `<rect x="${bx - 8}" y="${by - 4}" width="${bw + 16}" height="14" fill="rgba(25,163,224,.10)" stroke="${line}" stroke-width="1.1"/>`;
    s += `<rect x="${bx - 4}" y="${by - 11}" width="${bw + 8}" height="8" fill="rgba(25,163,224,.07)" stroke="${line}" stroke-width=".7"/>`;
    s += `<rect x="${bx}" y="${by - 16}" width="${bw}" height="6" fill="rgba(25,163,224,.05)" stroke="${line}" stroke-width=".6"/>`;
    // pilasters
    s += `<rect x="${bx}" y="${by + 10}" width="14" height="${bh - 10}" fill="rgba(25,163,224,.06)" stroke="${line}" stroke-width=".7"/>`;
    s += `<rect x="${bx + bw - 14}" y="${by + 10}" width="14" height="${bh - 10}" fill="rgba(25,163,224,.06)" stroke="${line}" stroke-width=".7"/>`;
  } else {
    // weathering: crack + stains
    s += `<path d="M${bx + bw * .62} ${by} l-8 34 l10 26 l-6 40" stroke="${line}" stroke-width="1" opacity=".5" fill="none"/>`;
    s += `<ellipse cx="${bx + 26}" cy="${by + bh - 30}" rx="20" ry="34" fill="#000" opacity=".05"/>`;
    s += `<ellipse cx="${bx + bw - 30}" cy="${by + 40}" rx="16" ry="28" fill="#000" opacity=".045"/>`;
  }

  for (let r = 0; r < floors; r++) {
    const wy = innerTop + r * (ch + gy);
    // band between floors (after only)
    if (after && r > 0) {
      const by2 = wy - gy / 2 - 5;
      s += `<rect x="${bx - 6}" y="${by2}" width="${bw + 12}" height="10" fill="rgba(25,163,224,.09)" stroke="${line}" stroke-width=".9"/>`;
    }
    for (let c = 0; c < cols; c++) {
      const wx = innerX + c * (cw + gx);
      s += `<rect x="${wx.toFixed(1)}" y="${wy.toFixed(1)}" width="${cw.toFixed(1)}" height="${ch.toFixed(1)}" fill="${win}" stroke="${winStroke}" stroke-width=".9"/>`;
      s += `<line x1="${(wx + cw / 2).toFixed(1)}" y1="${wy.toFixed(1)}" x2="${(wx + cw / 2).toFixed(1)}" y2="${(wy + ch).toFixed(1)}" stroke="${winStroke}" stroke-width=".5" opacity=".5"/>`;
      s += `<line x1="${wx.toFixed(1)}" y1="${(wy + ch / 2).toFixed(1)}" x2="${(wx + cw).toFixed(1)}" y2="${(wy + ch / 2).toFixed(1)}" stroke="${winStroke}" stroke-width=".5" opacity=".5"/>`;
      // peitoril (sill) under each window — after only
      if (after) {
        s += `<rect x="${(wx - 4).toFixed(1)}" y="${(wy + ch).toFixed(1)}" width="${(cw + 8).toFixed(1)}" height="5" fill="rgba(25,163,224,.14)" stroke="${line}" stroke-width=".8"/>`;
      }
    }
  }
  s += `</svg>`;
  return s;
}

/* ── COMPARISON BLOCK (before/after) ── */
function comparisonHTML(p, draggable) {
  return `
    <div class="cmp${draggable ? ' cmp-drag' : ''}" data-cmp>
      <div class="cmp-layer cmp-before">${facadeSVG(p, 'before')}<span class="cmp-tag cmp-tag-b">Antes</span></div>
      <div class="cmp-layer cmp-after" data-after>${facadeSVG(p, 'after')}<span class="cmp-tag cmp-tag-a">Depois</span></div>
      ${draggable ? '<div class="cmp-handle" data-handle><span class="cmp-grip"><i></i><i></i></span></div>' : '<div class="cmp-divider" aria-hidden="true"></div>'}
    </div>`;
}

/* ── PROJECT CARD ── */
function cardHTML(p, featured) {
  const tags = p.products.slice(0, 3).map(t => `<li>${t}</li>`).join('');
  return `
    <a class="pcard${featured ? ' pcard-feat' : ''}" href="Projeto.html?obra=${p.slug}" data-rv>
      <div class="pcard-media">${comparisonHTML(p, false)}
        <span class="pcard-type">${p.type}</span>
      </div>
      <div class="pcard-body">
        <div class="pcard-meta">${p.location} · ${p.year}</div>
        <h3 class="pcard-title">${p.title}</h3>
        <ul class="pcard-tags">${tags}</ul>
        <span class="pcard-go">Ver obra
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 7h10M8 3l4 4-4 4"/></svg>
        </span>
      </div>
    </a>`;
}

/* ── RENDER HELPERS ── */
function getProject(slug) { return PROJECTS.find(p => p.slug === slug) || PROJECTS[0]; }

function mountObrasHome(sel) {
  const el = document.querySelector(sel);
  if (!el) return;
  const list = PROJECTS.slice(0, 3);
  el.innerHTML = cardHTML(list[0], true) + list.slice(1).map(p => cardHTML(p, false)).join('');
}

function mountObrasGrid(sel) {
  const el = document.querySelector(sel);
  if (!el) return;
  el.innerHTML = PROJECTS.map(p => cardHTML(p, false)).join('');
}

/* ── DRAGGABLE BEFORE/AFTER SLIDER ── */
function initComparisons() {
  document.querySelectorAll('[data-cmp].cmp-drag').forEach(cmp => {
    const after = cmp.querySelector('[data-after]');
    const handle = cmp.querySelector('[data-handle]');
    let pos = 0.5, dragging = false;
    const apply = () => {
      const pct = (pos * 100).toFixed(2);
      after.style.clipPath = `inset(0 0 0 ${pct}%)`;
      handle.style.left = `${pct}%`;
    };
    const setFromX = (clientX) => {
      const r = cmp.getBoundingClientRect();
      pos = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
      apply();
    };
    handle.addEventListener('pointerdown', (e) => { dragging = true; handle.setPointerCapture(e.pointerId); cmp.classList.add('drag-on'); });
    window.addEventListener('pointermove', (e) => { if (dragging) setFromX(e.clientX); });
    window.addEventListener('pointerup', () => { dragging = false; cmp.classList.remove('drag-on'); });
    cmp.addEventListener('pointerdown', (e) => { if (e.target.closest('[data-handle]')) return; setFromX(e.clientX); });
    apply();
  });
}

/* ── SHARED CHROME (nav + footer) for subpages ── */
function navHTML(active) {
  const on = (k) => active === k ? ' on' : '';
  return `
  <nav class="nav" id="nav">
    <div class="nav-in">
      <a href="index.html" class="nlogo"><div class="nmark">W</div><span class="nword">Winterplateau</span></a>
      <div class="nlinks">
        <a class="nlnk" href="index.html#eps">EPS Exterior</a>
        <a class="nlnk" href="index.html#interior">EPS Interior</a>
        <a class="nlnk" href="index.html#metal">Perfis Metálicos</a>
        <a class="nlnk${on('obras')}" href="Projetos.html">Obras</a>
        <a class="nlnk" href="index.html#about">Empresa</a>
        <a class="nlnk" href="index.html#contact">Contactos</a>
      </div>
      <div class="nlang"><span class="on">PT</span><span>EN</span><span>FR</span></div>
      <a href="index.html#contact" class="ncta">Solicitar Orçamento</a>
      <button class="nburger" id="nburger" aria-label="Menu" aria-expanded="false"><span></span><span></span><span></span></button>
    </div>
  </nav>
  <div class="mmenu" id="mmenu">
    <a href="index.html#eps">EPS Exterior</a>
    <a href="index.html#interior">EPS Interior</a>
    <a href="index.html#metal">Perfis Metálicos</a>
    <a href="Projetos.html">Obras</a>
    <a href="index.html#about">Empresa</a>
    <a href="index.html#contact">Contactos</a>
    <a class="mcta" href="index.html#contact">Solicitar Orçamento</a>
    <div class="mlang"><span class="on">PT</span><span>EN</span><span>FR</span></div>
  </div>`;
}

function footerHTML() {
  return `
  <footer class="footer">
    <div class="ftop">
      <div>
        <a href="index.html" class="nlogo"><div class="nmark">W</div><span class="nword">Winterplateau</span></a>
        <p class="ftag">Soluções em EPS e Perfis Metálicos para construção e reabilitação. Fabricação nacional, qualidade europeia.</p>
      </div>
      <div><div class="fch">Soluções</div><div class="fcl">
        <a href="index.html#eps">EPS Exterior</a><a href="index.html#interior">EPS Interior</a><a href="index.html#metal">Perfis Metálicos</a></div></div>
      <div><div class="fch">Empresa</div><div class="fcl">
        <a href="Projetos.html">Obras</a><a href="index.html#about">Quem Somos</a><a href="index.html#downloads">Downloads</a><a href="index.html#contact">Contactos</a></div></div>
      <div><div class="fch">Contactos</div><div class="fcl">
        <a href="tel:+351253193667">+351 253 193 667</a><a href="mailto:geral@winterplateau.pt">geral@winterplateau.pt</a><span style="font-size:12px;color:rgba(255,255,255,.26);font-weight:300">Vila Verde, Braga</span></div></div>
    </div>
    <div class="fbot">
      <span class="fcopy">© 2024 Winterplateau. Todos os direitos reservados.</span>
      <div class="fleg"><a href="#">Política de Privacidade</a><a href="#">Termos e Condições</a></div>
    </div>
  </footer>`;
}

function initChrome() {
  const nav = document.getElementById('nav');
  if (nav) addEventListener('scroll', () => nav.classList.toggle('solid', scrollY > 40), { passive: true });
  const burger = document.getElementById('nburger'), mmenu = document.getElementById('mmenu');
  if (burger && mmenu) {
    const close = () => { burger.classList.remove('x'); mmenu.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); };
    burger.addEventListener('click', () => {
      const open = mmenu.classList.toggle('open');
      burger.classList.toggle('x', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mmenu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  }
  // reveal
  const obs = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll('[data-rv]').forEach(el => obs.observe(el));
  function revealInView() {
    const vh = innerHeight;
    document.querySelectorAll('[data-rv]:not(.on)').forEach(el => { const r = el.getBoundingClientRect(); if (r.top < vh * .94 && r.bottom > 0) el.classList.add('on'); });
  }
  addEventListener('load', () => setTimeout(revealInView, 500));
  addEventListener('scroll', revealInView, { passive: true });
}

/* ── PHOTO SLOT (backoffice fills these with real photos) ── */
function photoSlot(label, ratio) {
  return `<div class="pslot" style="aspect-ratio:${ratio || '4/3'}">
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="2.5" y="5" width="19" height="15" rx="2"/><circle cx="12" cy="12.5" r="3.4"/><path d="M8 5l1.5-2h5L16 5"/></svg>
    <span>${label}</span>
  </div>`;
}

/* ── PROJECT DETAIL ── */
function productLink(name) {
  const n = name.toLowerCase();
  let href = 'index.html#eps';
  if (n.includes('interior') || n.includes('rodate') || n.includes('teto')) href = 'index.html#interior';
  else if (n.includes('perfil') || n.includes('metál') || n.includes('divis')) href = 'index.html#metal';
  return `<a class="mat" href="${href}"><span class="mat-dot"></span>${name}<svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 7h10M8 3l4 4-4 4"/></svg></a>`;
}

function projectDetailHTML(p) {
  const stats = p.stats.map(s => `<div class="pj-stat"><div class="pj-stat-n">${s.n}<em>${s.u}</em></div><div class="pj-stat-l">${s.l}</div></div>`).join('');
  const process = p.process.map((s, i) => `
    <div class="pj-step${i % 2 ? ' flip' : ''}" data-rv>
      <div class="pj-step-txt"><h3>${s.t}</h3><p>${s.d}</p></div>
      <div class="pj-node"><span>${s.ph}</span></div>
      <div class="pj-step-photo">${photoSlot('Fotografia · ' + s.t, '5/4')}</div>
    </div>`).join('');
  const mats = p.products.map(productLink).join('');
  const others = PROJECTS.filter(o => o.slug !== p.slug).slice(0, 3).map(o => cardHTML(o, false)).join('');

  return `
  <section class="pj-hero">
    <div class="pj-wrap">
      <nav class="pj-crumb"><a href="index.html">Início</a><span>/</span><a href="Projetos.html">Obras</a><span>/</span><b>${p.title}</b></nav>
      <div class="pj-head">
        <div>
          <span class="pj-type">${p.type}</span>
          <h1 class="pj-title">${p.title}</h1>
          <div class="pj-loc">${p.location} · ${p.year}</div>
        </div>
        <p class="pj-lead">${p.summary}</p>
      </div>
      <figure class="pj-compare" data-rv>
        ${comparisonHTML(p, true)}
        <figcaption><svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 4L2 8l3 4M11 4l3 4-3 4"/></svg> Arraste para comparar o antes e o depois</figcaption>
      </figure>
    </div>
  </section>

  <section class="pj-statsband">
    <div class="pj-wrap pj-stats">${stats}</div>
  </section>

  <section class="pj-process-sec">
    <div class="pj-wrap">
      <div class="pj-sec-hdr" data-rv><div class="pj-eye">O Processo</div><h2 class="pj-h2">Durante a obra</h2></div>
      <div class="pj-spine">${process}</div>
    </div>
  </section>

  <section class="pj-mat-sec">
    <div class="pj-wrap pj-mat-in">
      <div data-rv><div class="pj-eye">Soluções aplicadas</div><h2 class="pj-h2">Materiais Winterplateau nesta obra</h2></div>
      <div class="pj-mats" data-rv>${mats}</div>
    </div>
  </section>

  <section class="pj-next">
    <div class="pj-wrap">
      <div class="pj-next-hdr"><h2 class="pj-h2" style="color:#fff">Outras obras</h2><a href="Projetos.html" class="osee" style="color:var(--bl)">Ver todas<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 7h10M8 3l4 4-4 4"/></svg></a></div>
      <div class="obras-grid pj-others">${others}</div>
    </div>
  </section>`;
}

