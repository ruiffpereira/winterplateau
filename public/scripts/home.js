// Render Obras showcase from project data (backoffice-driven)
mountObrasHome('#obrasHome');

// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('solid', window.scrollY > 40);
}, {passive:true});

// Mobile menu
const burger = document.getElementById('nburger');
const mmenu = document.getElementById('mmenu');
if (burger && mmenu) {
  const closeMenu = () => { burger.classList.remove('x'); mmenu.classList.remove('open'); burger.setAttribute('aria-expanded','false'); };
  burger.addEventListener('click', () => {
    const open = mmenu.classList.toggle('open');
    burger.classList.toggle('x', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  mmenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

// Scroll reveal
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('on'); obs.unobserve(e.target); }
  });
}, {threshold: 0.12});
document.querySelectorAll('[data-rv]').forEach(el => obs.observe(el));

// Stat counters
const cobs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = parseInt(el.dataset.count);
    if (!target) return;
    const suffix = el.dataset.suffix || '';
    const start = target === 2016 ? 2010 : 0;
    const dur = 1300;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = Math.round(start + (target - start) * ease);
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    cobs.unobserve(el);
  });
}, {threshold: 0.4});
document.querySelectorAll('[data-count]').forEach(el => cobs.observe(el));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); window.scrollTo({top: t.getBoundingClientRect().top + scrollY - 74, behavior:'smooth'}); }
  });
});

/* ════ 3D BLUEPRINT ENGINE ════ */
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Build extruded 3D metal profiles from each flat icon
document.querySelectorAll('.mc-ico').forEach(ico => {
  const src = ico.querySelector('svg');
  if (!src) return;
  const ext = document.createElement('div');
  ext.className = 'ext';
  const DEPTH = 11, STEP = 2.4;          // number of slices + spacing
  for (let i = 0; i < DEPTH; i++) {
    const c = src.cloneNode(true);
    c.removeAttribute('width'); c.removeAttribute('height');
    const z = (i - (DEPTH - 1)) * STEP;  // back slices first, front cap last
    c.style.transform = `translateZ(${z}px)`;
    if (i === DEPTH - 1) c.classList.add('cap');
    ext.appendChild(c);
  }
  ico.replaceChild(ext, src);
});

// Scenes: entry assemble + idle float + viewport-anchored parallax (rotation + per-layer depth)
const scenes = [];
document.querySelectorAll('.scene').forEach(scene => {
  const stage = scene.querySelector('.stage');
  if (!stage) return;
  const amp = parseFloat(scene.dataset.amp || '6');
  // assign each layer a depth-based parallax factor (front shifts most)
  const layers = [...scene.querySelectorAll('.lyr')];
  const zs = layers.map(l => parseFloat(getComputedStyle(l).getPropertyValue('--z')) || 0);
  const zMin = Math.min(...zs), zMax = Math.max(...zs), zSpan = (zMax - zMin) || 1;
  layers.forEach((l, i) => {
    const norm = (zs[i] - zMin) / zSpan;       // 0 (back) → 1 (front)
    l.style.setProperty('--pf', (0.25 + norm * 1.15).toFixed(3));
  });
  scenes.push({ scene, stage, amp, px: 0, py: 0 });
  const io = new IntersectionObserver((es) => {
    es.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        setTimeout(() => e.target.classList.add('ready'), 1250); // snappy parallax after assemble
      }
    });
  }, { threshold: 0.18 });
  io.observe(scene);
});

// Global pointer — normalized to viewport centre (consistent, never lurches)
let pointerX = 0, pointerY = 0;
if (!reduce && window.matchMedia('(pointer:fine)').matches) {
  window.addEventListener('pointermove', (ev) => {
    pointerX = (ev.clientX / innerWidth - 0.5) * 2;   // -1 … 1
    pointerY = (ev.clientY / innerHeight - 0.5) * 2;
  }, { passive: true });
}

// Fallback reveal — guard against any IntersectionObserver flakiness
function revealInView(){
  const vh = innerHeight || document.documentElement.clientHeight;
  document.querySelectorAll('[data-rv]:not(.on), .scene:not(.in)').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < vh * 0.92 && r.bottom > 0) {
      if (el.matches('.scene')) { el.classList.add('in'); setTimeout(() => el.classList.add('ready'), 1250); }
      else el.classList.add('on');
    }
  });
}
addEventListener('load', () => setTimeout(revealInView, 600));
addEventListener('scroll', revealInView, { passive: true });

if (!reduce) {
  const ROT = 5;        // max degrees of pointer tilt
  const SHIFT = 18;     // max px of layer depth-shift
  const t0 = performance.now();
  const loop = (now) => {
    const t = (now - t0) / 1000;
    scenes.forEach(s => {
      s.px += (pointerX - s.px) * 0.045;  // smooth easing
      s.py += (pointerY - s.py) * 0.045;
      // gentle continuous float (always alive)
      const floatY = Math.sin(t * 0.45) * s.amp;
      const floatX = Math.cos(t * 0.34) * (s.amp * 0.4);
      const rotY = floatY + s.px * ROT;
      const rotX = floatX - s.py * (ROT * 0.6) - 2;
      s.stage.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
      // per-layer depth parallax
      s.scene.style.setProperty('--mx', (s.px * SHIFT).toFixed(2) + 'px');
      s.scene.style.setProperty('--my', (s.py * SHIFT).toFixed(2) + 'px');
    });
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
} else {
  scenes.forEach(s => s.stage.style.transform = 'rotateX(-2deg) rotateY(4deg)');
}
