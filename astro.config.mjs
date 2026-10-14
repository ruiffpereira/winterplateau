import { defineConfig } from 'astro/config';
import cms from './src/cms/integration.ts';

export default defineConfig({
  site: 'https://www.winterplateau.pt',
  // URLs limpos (/obras/ em vez de /obras.html). Os endereços antigos *.html vivem em src/cms/routes.ts.
  build: { format: 'directory' },
  // O site vem da API (ou de CMS_FIXTURE): redirects, páginas e SEO — ver src/cms/ e o CLAUDE.md.
  integrations: [cms()],
});
