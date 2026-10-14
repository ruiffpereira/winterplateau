import type { AstroIntegration } from 'astro';
import { loadSites } from './client.js';
import { redirectsOf } from './routes.js';

/** Lê o site ao configurar o build (falha alto se a API falhar) e injecta os `redirects` do objecto na config do Astro. */
export default function cms(): AstroIntegration {
  return {
    name: 'cms-redirects',
    hooks: {
      'astro:config:setup': async ({ updateConfig }) => {
        updateConfig({ redirects: redirectsOf(await loadSites()) });
      },
    },
  };
}
