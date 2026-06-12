import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.winterplateau.pt',
  // emit Projetos.html / Projeto.html (matching the asset links in projects.js)
  build: { format: 'file' },
});
