/** Entrada dos elementos `[data-rv]` ao rolar e contadores `[data-count]` (números). */
const reduce = (): boolean => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initReveal(): void {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-rv]'));
  if (!els.length || reduce() || !('IntersectionObserver' in window)) return; // sem animação: o CSS deixa tudo visível
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('on');
        io.unobserve(e.target);
      }),
    { rootMargin: '0px 0px -6% 0px' },
  );
  const vh = innerHeight;
  for (const el of els) {
    const r = el.getBoundingClientRect();
    if (r.top < vh || r.bottom <= 0) el.classList.add('on'); // já à vista (ou já passado): nunca esconder nem piscar
    else io.observe(el);
  }
  // só agora o CSS esconde o que falta revelar — se este script falhar, nada fica invisível
  document.documentElement.classList.add('js');
}

export function initCounters(): void {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-count]')).filter((el) => parseInt(el.dataset.count ?? '', 10) > 0);
  if (!els.length || reduce() || !('IntersectionObserver' in window)) return;
  const startOf = (target: number, suffix: string) => (!suffix && target >= 1900 && target <= 2100 ? target - 6 : 0); // anos: contam dos últimos 6
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const el = e.target as HTMLElement;
        const target = parseInt(el.dataset.count ?? '0', 10);
        const suffix = el.dataset.suffix ?? '';
        const from = startOf(target, suffix);
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / 1300, 1);
          el.textContent = Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3))) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }),
    { threshold: 0.4 },
  );
  for (const el of els) {
    const suffix = el.dataset.suffix ?? '';
    el.textContent = startOf(parseInt(el.dataset.count!, 10), suffix) + suffix;
    io.observe(el);
  }
}
