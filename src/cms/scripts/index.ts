/**
 * Scripts do site, empacotados pelo Astro. Cada um trabalha por instância (querySelectorAll sobre o que existir),
 * tolera que o bloco não esteja na página, esteja repetido ou venha em qualquer ordem, e não depende dos outros:
 * se um falhar, os restantes correm.
 */
import { initFormularios } from './formulario';
import { initCounters, initReveal } from './reveal';
import { initScenes } from './scene';
import { initTopo } from './topo';
import { initUniverso } from './universo';

const run = (name: string, fn: () => void): void => {
  try {
    fn();
  } catch (e) {
    console.warn(`[site] ${name} falhou`, e);
  }
};

run('topo', initTopo);
run('cenas', initScenes);
run('universo', initUniverso);
run('formularios', initFormularios);
run('contadores', initCounters);
run('entradas', initReveal);
