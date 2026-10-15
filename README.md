# Winterplateau — site público

Site estático (Astro) da Winterplateau. **O conteúdo não está neste repo**: a cliente monta as páginas no
Backoffice (menu **Páginas**, o construtor de páginas) e o build lê-o da API (`GET /api/websites/site`, uma vez
por língua). Este repo só tem o **kit** que desenha esse conteúdo com os estilos da Winterplateau.

Pormenor (stack, deploy, envs, manifest, importação): [CLAUDE.md](CLAUDE.md).

## Correr

```bash
npm install
cp .env.example .env          # VITE_API_BASE_URL + SITE_TOKEN do tenant
npm run dev
```

Sem API, a partir de um ficheiro com o objecto público:

```bash
CMS_FIXTURE=fixtures/real/site-pt.json npm run build
CMS_FIXTURE=fixtures/real/site-pt.json npm run check     # verifica o dist/ (SEO, línguas, sitemap, redirects)
```

## Onde está o quê

| Pasta | O que é |
|---|---|
| `src/cms/` | O kit: cliente da API, rotas por língua, SEO, componentes do núcleo, especiais, estilos |
| `src/pages/` | Rotas (`[...path]`, `[lang]`), `sitemap.xml`, `robots.txt`, `cms-build.json` (prova da revisão no ar) e os endereços antigos (`/Projeto.html?obra=`) |
| `cms/manifest.json` | Estilos, fundos, ícones e especiais que o site oferece — o dono carrega-o no Admin |
| `cms/import.json` | O site antigo como importação para o construtor (gerado por `cms/build-import.mjs`) |
| `fixtures/` | Objectos públicos para builds sem API |
| `.github/workflows/deploy.yml` | Deploy no Coolify a cada push na `main` (e pelo botão "Publicar" do Backoffice) |
