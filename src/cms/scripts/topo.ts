/** Topo: realça a borda ao rolar e liga o botão do menu (painel em ecrãs estreitos). Sem topo na página, não faz nada. */
export function initTopo(): void {
  document.querySelectorAll<HTMLElement>('header.topo').forEach((topo) => {
    const onScroll = () => topo.classList.toggle('solid', scrollY > 40);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const burger = topo.querySelector<HTMLButtonElement>('.burger');
    const panel = topo.querySelector<HTMLElement>('.panel');
    if (!burger || !panel) return;
    const set = (open: boolean) => {
      topo.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    };
    burger.addEventListener('click', () => set(!topo.classList.contains('open')));
    panel.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('a')) set(false);
    });
    topo.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && topo.classList.contains('open')) {
        set(false);
        burger.focus();
      }
    });
    document.addEventListener('click', (e) => {
      if (topo.classList.contains('open') && !topo.contains(e.target as Node)) set(false);
    });
    matchMedia('(min-width: 1025px)').addEventListener('change', (m) => m.matches && set(false));
  });
}
