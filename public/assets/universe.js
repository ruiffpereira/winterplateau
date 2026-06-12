/* ════ WINTERPLATEAU · UNIVERSO ════
   Constelação técnica de fundo + régua de cotas (alçado vivo).
   O scroll "desce" o edifício: cobertura (+14.00) → fundação (0.00). */
(function () {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── constelação blueprint ── */
  const cv = document.getElementById('uvx');
  if (cv) {
    const ctx = cv.getContext('2d');
    let W, H, nodes = [], mx = -9999, my = -9999;
    function seed() {
      const n = Math.max(46, Math.min(110, Math.round(W * H / 26000)));
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .14, vy: (Math.random() - .5) * .14,
        r: Math.random() < .14 ? 1.8 : 1.1,
        cross: Math.random() < .09,
      }));
    }
    function resize() {
      const DPR = Math.min(devicePixelRatio || 1, 2);
      W = document.documentElement.clientWidth;  // exclui a scrollbar (evita overflow horizontal)
      H = innerHeight;
      cv.width = W * DPR; cv.height = H * DPR;
      cv.style.width = W + 'px'; cv.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      seed();
    }
    addEventListener('resize', resize);
    resize();
    if (matchMedia('(pointer:fine)').matches) {
      addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    }
    const LINK = 130, CUR = 170;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = 'rgb(25,163,224)';
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            ctx.globalAlpha = (1 - Math.sqrt(d2) / LINK) * .07;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const dxm = a.x - mx, dym = a.y - my, dm2 = dxm * dxm + dym * dym;
        if (dm2 < CUR * CUR) {
          ctx.globalAlpha = (1 - Math.sqrt(dm2) / CUR) * .16;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mx, my); ctx.stroke();
        }
      }
      ctx.fillStyle = 'rgb(25,163,224)';
      nodes.forEach(n => {
        if (n.cross) { // pequenas cruzes de topografia
          ctx.globalAlpha = .42;
          ctx.beginPath();
          ctx.moveTo(n.x - 3, n.y); ctx.lineTo(n.x + 3, n.y);
          ctx.moveTo(n.x, n.y - 3); ctx.lineTo(n.x, n.y + 3);
          ctx.stroke();
        } else {
          ctx.globalAlpha = .3;
          ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 7); ctx.fill();
        }
      });
      ctx.globalAlpha = 1;
    }
    function step() {
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x < -12) n.x = W + 12; if (n.x > W + 12) n.x = -12;
        if (n.y < -12) n.y = H + 12; if (n.y > H + 12) n.y = -12;
      });
      draw();
      requestAnimationFrame(step);
    }
    if (reduce) draw(); else requestAnimationFrame(step);
  }

  /* ── régua de cotas ── */
  const er = document.getElementById('eruler');
  if (er) {
    const stops = [...er.querySelectorAll('.er-stop')];
    const marker = er.querySelector('.er-marker');
    const cota = er.querySelector('.er-cota');
    const fill = er.querySelector('.er-fill');
    const mp = document.getElementById('mprog');
    const mpFill = mp ? mp.querySelector('i') : null;
    const mpCota = mp ? mp.querySelector('span') : null;
    const TOP_COTA = 14.0;
    const docH = () => document.documentElement.scrollHeight - innerHeight;
    const secTop = (id) => { const el = document.getElementById(id); return el ? el.offsetTop : 0; };
    function layout() {
      const h = docH();
      stops.forEach(s => {
        s.style.top = (Math.min(1, secTop(s.dataset.target) / h) * 100) + '%';
      });
    }
    function update() {
      const p = Math.max(0, Math.min(1, scrollY / docH()));
      marker.style.top = (p * 100) + '%';
      fill.style.height = (p * 100) + '%';
      cota.textContent = '+' + ((1 - p) * TOP_COTA).toFixed(2);
      if (mpFill) {
        mpFill.style.width = (p * 100) + '%';
        mpCota.textContent = '+' + ((1 - p) * TOP_COTA).toFixed(2);
      }
      let act = 0;
      stops.forEach((s, i) => { if (scrollY >= secTop(s.dataset.target) - innerHeight * .45) act = i; });
      stops.forEach((s, i) => s.classList.toggle('on', i === act));
    }
    stops.forEach(s => s.addEventListener('click', () => {
      const el = document.getElementById(s.dataset.target);
      if (el) scrollTo({ top: el.offsetTop - 50, behavior: 'smooth' });
    }));
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', () => { layout(); update(); });
    addEventListener('load', () => { layout(); update(); });
    layout(); update();
  }
})();
