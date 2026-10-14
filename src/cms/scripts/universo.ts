/**
 * "Universo": constelação técnica de fundo + régua de cotas. O scroll "desce" o edifício (cobertura +14.00 → fundação 0.00).
 * Tudo é criado aqui a partir do que a página tem: a constelação só se houver blocos/especiais escuros;
 * a régua só se houver pelo menos duas paragens (`[data-stop]`, postas pelo Renderer) — e as posições vêm
 * da posição real dos elementos, recalculada quando a página muda de tamanho.
 */
const reduce = (): boolean => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initUniverso(): void {
  if (document.querySelector('.bloco[data-bg="escuro"], .especial--edificio3d')) constelacao();
  regua();
}

function constelacao(): void {
  const cv = document.createElement('canvas');
  cv.id = 'uvx';
  cv.setAttribute('aria-hidden', 'true');
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  document.body.prepend(cv);

  interface Node { x: number; y: number; vx: number; vy: number; r: number; cross: boolean }
  let W = 0;
  let H = 0;
  let nodes: Node[] = [];
  let mx = -9999;
  let my = -9999;
  let raf = 0;
  const LINK = 130;
  const CUR = 170;

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = document.documentElement.clientWidth; // sem a barra de rolagem (evita overflow horizontal)
    H = innerHeight;
    cv.width = W * dpr;
    cv.height = H * dpr;
    cv.style.width = W + 'px';
    cv.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.max(46, Math.min(110, Math.round((W * H) / 26000)));
    nodes = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.14, vy: (Math.random() - 0.5) * 0.14,
      r: Math.random() < 0.14 ? 1.8 : 1.1,
      cross: Math.random() < 0.09,
    }));
    if (reduce()) draw();
  };

  function draw() {
    ctx!.clearRect(0, 0, W, H);
    ctx!.strokeStyle = 'rgb(25,163,224)';
    ctx!.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK * LINK) {
          ctx!.globalAlpha = (1 - Math.sqrt(d2) / LINK) * 0.07;
          ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(b.x, b.y); ctx!.stroke();
        }
      }
      const dm2 = (a.x - mx) ** 2 + (a.y - my) ** 2;
      if (dm2 < CUR * CUR) {
        ctx!.globalAlpha = (1 - Math.sqrt(dm2) / CUR) * 0.16;
        ctx!.beginPath(); ctx!.moveTo(a.x, a.y); ctx!.lineTo(mx, my); ctx!.stroke();
      }
    }
    ctx!.fillStyle = 'rgb(25,163,224)';
    for (const n of nodes) {
      if (n.cross) {
        ctx!.globalAlpha = 0.42;
        ctx!.beginPath();
        ctx!.moveTo(n.x - 3, n.y); ctx!.lineTo(n.x + 3, n.y);
        ctx!.moveTo(n.x, n.y - 3); ctx!.lineTo(n.x, n.y + 3);
        ctx!.stroke();
      } else {
        ctx!.globalAlpha = 0.3;
        ctx!.beginPath(); ctx!.arc(n.x, n.y, n.r, 0, 7); ctx!.fill();
      }
    }
    ctx!.globalAlpha = 1;
  }

  const step = () => {
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < -12) n.x = W + 12;
      if (n.x > W + 12) n.x = -12;
      if (n.y < -12) n.y = H + 12;
      if (n.y > H + 12) n.y = -12;
    }
    draw();
    raf = document.hidden ? 0 : requestAnimationFrame(step);
  };

  addEventListener('resize', resize);
  if (matchMedia('(pointer:fine)').matches) addEventListener('pointermove', (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });
  resize();
  if (!reduce()) {
    raf = requestAnimationFrame(step);
    document.addEventListener('visibilitychange', () => { if (!document.hidden && !raf) raf = requestAnimationFrame(step); });
  }
}

function regua(): void {
  const stopEls = Array.from(document.querySelectorAll<HTMLElement>('[data-stop]'));
  if (stopEls.length < 2) return;
  const TOP_COTA = 14.0;
  const make = <K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, text?: string) => {
    const el = document.createElement(tag);
    el.className = cls;
    if (text !== undefined) el.textContent = text;
    return el;
  };

  const bar = make('nav', 'eruler');
  bar.setAttribute('aria-label', document.querySelector<HTMLElement>('main')?.dataset.rulerLabel ?? '');
  const track = make('div', 'er-track');
  const fill = make('div', 'er-fill');
  const marker = make('div', 'er-marker');
  const cota = make('span', 'er-cota', '+14.00');
  marker.append(cota);
  track.append(fill, marker);
  const buttons = stopEls.map((el) => {
    const b = make('button', 'er-stop');
    b.type = 'button';
    b.append(document.createElement('i'), make('span', '', el.dataset.stop));
    b.addEventListener('click', () => el.scrollIntoView({ behavior: reduce() ? 'auto' : 'smooth', block: 'start' }));
    track.append(b);
    return b;
  });
  bar.append(track);
  const mp = make('div', 'mprog');
  mp.setAttribute('aria-hidden', 'true');
  const mpFill = document.createElement('i');
  const mpCota = make('span', '', '+14.00');
  mp.append(mpFill, mpCota);
  document.body.append(bar, mp);

  let tops: number[] = [];
  const docH = () => Math.max(1, document.documentElement.scrollHeight - innerHeight);
  const layout = () => {
    tops = stopEls.map((el) => el.getBoundingClientRect().top + scrollY);
    buttons.forEach((b, i) => { b.style.top = Math.min(1, Math.max(0, tops[i] / docH())) * 100 + '%'; });
    update();
  };
  let pending = false;
  function update() {
    pending = false;
    const p = Math.max(0, Math.min(1, scrollY / docH()));
    const text = '+' + ((1 - p) * TOP_COTA).toFixed(2);
    marker.style.top = p * 100 + '%';
    fill.style.height = p * 100 + '%';
    mpFill.style.width = p * 100 + '%';
    cota.textContent = mpCota.textContent = text;
    let active = 0;
    tops.forEach((t, i) => { if (scrollY >= t - innerHeight * 0.45) active = i; });
    buttons.forEach((b, i) => b.classList.toggle('on', i === active));
  }
  addEventListener('scroll', () => { if (!pending) { pending = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', layout);
  addEventListener('load', layout);
  if ('ResizeObserver' in window) new ResizeObserver(layout).observe(document.body); // imagens e fontes a chegar mudam as alturas
  layout();
}
