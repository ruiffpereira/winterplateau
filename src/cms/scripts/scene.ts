/**
 * Cenas 3D do especial "edifício": montagem à entrada, flutuação e parallax pelo rato (rotação + profundidade por camada).
 * Por instância: cada `.scene` tem o seu estado; o ciclo de animação só corre enquanto houver uma cena à vista.
 */
interface Scene {
  el: HTMLElement;
  stage: HTMLElement;
  amp: number;
  px: number;
  py: number;
  visible: boolean;
}

export function initScenes(): void {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scenes: Scene[] = [];
  document.querySelectorAll<HTMLElement>('.scene').forEach((el) => {
    const stage = el.querySelector<HTMLElement>('.stage');
    if (!stage) return;
    // cada camada recebe um factor de parallax pela profundidade (a da frente mexe mais)
    const layers = Array.from(el.querySelectorAll<HTMLElement>('.lyr'));
    const zs = layers.map((l) => parseFloat(getComputedStyle(l).getPropertyValue('--z')) || 0);
    const zMin = Math.min(...zs);
    const span = Math.max(...zs) - zMin || 1;
    layers.forEach((l, i) => l.style.setProperty('--pf', (0.25 + ((zs[i] - zMin) / span) * 1.15).toFixed(3)));
    scenes.push({ el, stage, amp: parseFloat(el.dataset.amp ?? '6') || 6, px: 0, py: 0, visible: false });
  });
  if (!scenes.length) return;

  if (reduce || !('IntersectionObserver' in window)) {
    scenes.forEach((s) => {
      s.el.classList.add('in', 'ready');
      s.stage.style.transform = 'rotateX(-2deg) rotateY(4deg)';
    });
    return;
  }

  let pointerX = 0;
  let pointerY = 0;
  if (matchMedia('(pointer:fine)').matches) {
    addEventListener(
      'pointermove',
      (ev) => {
        pointerX = (ev.clientX / innerWidth - 0.5) * 2;
        pointerY = (ev.clientY / innerHeight - 0.5) * 2;
      },
      { passive: true },
    );
  }

  const t0 = performance.now();
  let raf = 0;
  const loop = (now: number) => {
    const t = (now - t0) / 1000;
    for (const s of scenes) {
      if (!s.visible) continue;
      s.px += (pointerX - s.px) * 0.045;
      s.py += (pointerY - s.py) * 0.045;
      const rotY = Math.sin(t * 0.45) * s.amp + s.px * 5;
      const rotX = Math.cos(t * 0.34) * s.amp * 0.4 - s.py * 3 - 2;
      s.stage.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
      s.el.style.setProperty('--mx', (s.px * 18).toFixed(2) + 'px');
      s.el.style.setProperty('--my', (s.py * 18).toFixed(2) + 'px');
    }
    raf = scenes.some((s) => s.visible) && !document.hidden ? requestAnimationFrame(loop) : 0;
  };
  const wake = () => {
    if (!raf && !document.hidden && scenes.some((s) => s.visible)) raf = requestAnimationFrame(loop);
  };
  document.addEventListener('visibilitychange', wake);

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        const s = scenes.find((x) => x.el === e.target)!;
        s.visible = e.isIntersecting;
        if (!e.isIntersecting) return;
        if (!s.el.classList.contains('in')) {
          s.el.classList.add('in');
          setTimeout(() => s.el.classList.add('ready'), 1250); // parallax mais vivo depois de montada
        }
        wake();
      }),
    { threshold: 0.18 },
  );
  scenes.forEach((s) => io.observe(s.el));
}
