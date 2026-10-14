# CLAUDE.md — winterplateau

Site público SSG em Astro para a Winterplateau (EPS e Perfis Metálicos, Vila Verde).

Para o padrão geral de CSV de conteúdo e como importar para o backoffice, ver [../CLAUDE.md](../CLAUDE.md) → secção **Padrão: Importar Conteúdo para o CMS**.

---

## Stack

- **Astro 4** — SSG puro (`output: 'static'`, sem adapter)
- **Kubb v3** com `pluginClient` — cliente fetch tipado, gerado de `booking.json`; **não** usa `pluginReactQuery` porque o Astro não usa React em SSG
- **Coolify** — deploy pelo workflow `.github/workflows/deploy.yml` a cada push na `main` (o painel está na VPN; o webhook do GitHub não lhe chega)

---

## Fluxo de deploy

```
push na main → GitHub Actions (WireGuard) → Coolify → astro build → HTML estático
                                                       └ pede o id do Umami a GET /api/websites/analytics/tracking
```

O `SITE_TOKEN` é passado como Bearer token em todas as chamadas ao endpoint público.

---

## Variáveis de ambiente

Ver [.env.example](.env.example):

```
VITE_API_BASE_URL=http://localhost:3001/api
SITE_TOKEN=          # gerado no backoffice → Site Tokens
SWAGGER_ACCESS_TOKEN=
```

## Comandos

```bash
npm run kubb    # regenera src/gen/ a partir do spec da API
npm run build   # kubb + astro build
npm run dev     # servidor de desenvolvimento
```

---

## Construtor de páginas (branch `cms`, F17)

O site é gerado a partir do objecto `GET /websites/site?locale=xx` (CONTRATO §7/§11 em
`Backoffice/.design/page-builder/`): um pedido por língua, cliente tipado em `src/gen-site/` (Kubb, a partir do
`spec.site.json` **committado** — gerado do código da API com `dumpSpec.ts site`, sem fetch). Código em `src/cms/`
(`client.ts`, `Renderer.astro`, `components/<Type>.astro`, `specials/<tipo>.astro`, `seo.ts`, `routes.ts`,
`text.ts`); layout `src/layouts/Base.astro`; rotas `[...path]` (língua base) e `[lang]/[...path]`.

```bash
# sem API — fixtures/site-pt.json é a língua base; as outras são os irmãos site-en.json, site-fr.json
CMS_FIXTURE=fixtures/site-pt.json npm run build && npm run check   # check = scripts/check-build.mjs sobre o dist/
# com a API local — VITE_API_BASE_URL + SITE_TOKEN (e CF_BYPASS_TOKEN atrás da Cloudflare) no .env
npm run build
```

- **Falha alto.** Qualquer erro ao ler o site (rede, timeout 30 s, HTTP ≠ 200, JSON inválido, sem `pages`,
  língua trocada, revisão que muda a meio) deita o build abaixo. Nunca se publica um site vazio — não copiar o
  padrão de `src/lib/umami.ts`, que engole erros. Sem `CMS_FIXTURE` e sem API o build **não** corre.
- **Sem HTML cru.** Todo o texto da API passa por `src/cms/text.ts` (`inline`/`md`/`plain`/`safeHref`/`safeSrc`/`json`);
  nunca `set:html` com texto vindo da API sem isso. Ligações só `http(s):`, `mailto:`, `tel:`, relativas e `#`.
- Os `redirects` da API entram pela integração `src/cms/integration.ts`; os endereços antigos (`/Projetos.html`,
  `/Projeto.html?obra=`, `/privacidade.html`) em `src/cms/routes.ts` + `src/pages/Projeto.html.ts`.
- `npm run kubb` precisa da API para o `spec.json`/`spec.analytics.json` (como sempre); com `KUBB_OFFLINE=1` reutiliza
  os que já estão no disco. Regenerar o spec do site: `cd ../API-FullStack && pnpm exec ts-node --transpile-only
  scripts/dumpSpec.ts site > ../winterplateau/spec.site.json`.

---

## Conteúdo (CSV)

O ficheiro `content-import.csv` tem todo o conteúdo do site — 6 colunas: `key, locale, value, type, section, parent`.

### Convenção de chaves para projectos

```
project.{slug}.slug              — data, só pt
project.{slug}.title             — text, pt + en + fr
project.{slug}.location          — text, só pt
project.{slug}.year              — number, só pt
project.{slug}.type              — text, pt + en + fr
project.{slug}.summary           — text, pt + en + fr
project.{slug}.product.1…N       — text, só pt
project.{slug}.stat.1…3.value    — number/text, só pt
project.{slug}.stat.1…3.unit     — text, pt + en + fr  (omitir linha se não há unidade)
project.{slug}.stat.1…3.label    — text, pt + en + fr
project.{slug}.process.1…4.phase — text, só pt
project.{slug}.process.1…4.title — text, pt + en + fr
project.{slug}.process.1…4.description — text, pt + en + fr
project.{slug}.seo.title         — text, pt + en + fr
project.{slug}.seo.description   — text, pt + en + fr
project.{slug}.seo.og_image      — image, só pt
```

### Projectos na homepage

As chaves `obras_home.featured.1`, `.2`, `.3` (secção **Obras**, parent **Homepage**, tipo `data`) guardam o slug do projecto destacado. O cliente edita no backoffice sem tocar em código.

### Slugs dos 6 projectos actuais

`reabilitacao-fachada-braga` · `moradia-ponte-de-lima` · `edificio-comercial-guimaraes` · `apartamentos-vila-verde` · `restauro-solar-barcelos` · `clinica-famalicao`
