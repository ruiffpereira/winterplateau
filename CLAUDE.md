# CLAUDE.md — winterplateau

Site público SSG em Astro para a Winterplateau (EPS e Perfis Metálicos, Vila Verde).

Para o padrão geral de CSV de conteúdo e como importar para o backoffice, ver [../Backoffice/REFERENCIA-PAGINAS.md](../Backoffice/REFERENCIA-PAGINAS.md) → *Importar conteúdo via CSV*.

---

## Stack

- **Astro 4** — SSG puro (`output: 'static'`, sem adapter)
- **Kubb v3** com `pluginClient` — cliente fetch tipado, gerado de `booking.json`; **não** usa `pluginReactQuery` porque o Astro não usa React em SSG
- **Coolify** — o deploy é pedido **pela API** ao gravar no Backoffice (Páginas → Guardar, ou "Publicar agora"): a API chama o Coolify pelo endereço interno com o seu token e confirma no `cms-build.json` do site. **Um push na `main` não faz deploy** — sai no próximo Guardar/"Publicar agora". Decisão em `../DECISOES.md` (2026-10-18, B38 · P2)

---

## Fluxo de deploy

```
Guardar no Backoffice → API (pede o deploy ao Coolify, sem espera) → Coolify → astro build → HTML estático
                                                                                └ lê o conteúdo e o id do Umami da API
API → https://<domínio>/cms-build.json  (confirma a revisão no ar → "Site actualizado" no Backoffice)
```

No Coolify, a app do site precisa de `VITE_SITE_TOKEN` (o nome antigo `SITE_TOKEN` ainda é lido, até sair do Coolify), `VITE_API_BASE_URL` e `CF_BYPASS_TOKEN` **na fase de build**. O
webhook de deploy da app é colado no Backoffice (sessão de suporte → Páginas → Definições do site → Publicação).

O `VITE_SITE_TOKEN` (mesmo nome dos outros sites; o Astro só expõe `PUBLIC_*` ao browser) é passado como Bearer token em todas as chamadas ao endpoint público.

---

## Variáveis de ambiente

Ver [.env.example](.env.example):

```
VITE_API_BASE_URL=http://localhost:3001/api
VITE_SITE_TOKEN=     # gerado no backoffice → Site Tokens
SWAGGER_ACCESS_TOKEN=
```

`CF_BYPASS_TOKEN` (só build, nunca `VITE_`/`PUBLIC_`) passa o `X-CI-Bypass` ao buscar specs/conteúdo atrás da Cloudflare. Nenhuma env tem default silencioso: sem API nem `CMS_FIXTURE` o build não corre.

## Comandos

```bash
npm run kubb    # regenera src/gen/ a partir do spec da API
npm run build   # kubb + astro build
npm run dev     # servidor de desenvolvimento
```

---

## Construtor de páginas (F17)

O site é gerado a partir do objecto `GET /websites/site?locale=xx` (CONTRATO §7/§11 em
`Backoffice/.design/page-builder/`): um pedido por língua, cliente tipado em `src/gen-site/` (Kubb, a partir do
`spec.site.json` **committado** — gerado do código da API com `dumpSpec.ts site`, sem fetch). Código em `src/cms/`
(`client.ts`, `Renderer.astro`, `components/<Type>.astro`, `specials/<tipo>.astro`, `seo.ts`, `routes.ts`,
`text.ts`); layout `src/layouts/Base.astro`; rotas `[...path]` (língua base) e `[lang]/[...path]`.

```bash
# sem API — fixtures/site-pt.json é a língua base; as outras são os irmãos site-en.json, site-fr.json
CMS_FIXTURE=fixtures/site-pt.json npm run build && npm run check   # check = scripts/check-build.mjs sobre o dist/
# com a API local — VITE_API_BASE_URL + VITE_SITE_TOKEN (e CF_BYPASS_TOKEN atrás da Cloudflare) no .env
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


### Aspecto e scripts do kit (F18)

- **CSS** em `src/cms/styles/` (`kit.css` base, fundos, grelha, topo, rodapé · `components.css` · `specials.css`). Classes `c-<tipo>` +
  `c-<tipo>--<estilo>`; o fundo do bloco (`data-bg`: claro · escuro · marca) só define variáveis (`--fg`, `--ac`, `--btn-bg`, …),
  por isso cada componente tem uma só definição. Estilo, fundo ou ícone que o kit não conhece cai no aspecto base — nunca rebenta.
- **Scripts** em `src/cms/scripts/`, módulos empacotados pelo Astro (importados em `Base.astro`; `assetsInlineLimit: 0` mantém-nos fora do
  HTML). Cada um trabalha por instância e tolera blocos em falta, repetidos ou em qualquer ordem. A numeração `FL 01…`, o zig-zag e as
  paragens da régua saem do `Renderer.astro`, a partir da posição real dos itens. `i18n.js` saiu (as línguas são rotas); o texto do
  próprio kit (formulário, nomes acessíveis) está em `src/cms/ui.ts`.
- **`formulario`** envia do browser `POST {VITE_API_BASE_URL}/websites/leads` com o site token (`publicApi()` em `client.ts`; é o
  identificador público do tenant, como nos outros sites). Só um **201** conta como sucesso. Sem API no build o `data-endpoint` fica vazio e
  o formulário diz "indisponível".
- **Fixtures:** `fixtures/site-*.json` (todos os componentes, estilos e fundos; bloco repetido; ordem trocada) e `fixtures/minimo/`
  (sem topo nem rodapé, uma língua) — `CMS_FIXTURE=fixtures/minimo/site-pt.json npm run build && npm run check`. Orçamento do kit: 3 000 linhas.

### Go-live (F19): manifest e conteúdo no construtor

- `cms/manifest.json` — o manifest final (estilos do D-D, fundos, ícones, especiais `edificio3d`/`faixa`, partes); o dono carrega-o no Admin. Cópia em `API-FullStack/tests/fixtures/winterplateau-manifest.json` (um teste da API garante que passam no `parseManifest` e que são iguais).
- `cms/import.json` — o site de antes (commit `0772465` da `main`) como corpo do `save`, **gerado** por `node cms/build-import.mjs` (não editar à mão) a partir do CSV, do `i18n.js` antigo e do código da `main`. Depois de o gerar, copiá-lo para `API-FullStack/scripts/data/winterplateau-import.json` (é essa cópia que vai na imagem da API e que o dono importa; um teste da API exige que sejam iguais). Importa-se com `API-FullStack/scripts/importSitePages.ts` (ver o `CLAUDE.md` da API).
- **O topo da página inicial é UM item: o especial `edificio3d` («Topo com edifício 3D»).** Campos (todos opcionais): `eyebrow`, `titulo` (`*itálico*` = a 2.ª linha, a branco; o resto a azul), `descricao` (md), `botoes` (até 2: `label`, `dest`, `estilo` cheio/contorno) e `lado` (`direita`/`esquerda` = onde fica o EDIFÍCIO; em ecrã estreito o texto fica sempre em cima). A cena 3D é desenho fixo do kit, nunca editável. **Regra (CO-10): um bloco do design nunca se parte em vários itens da estrutura** — cada item é uma faixa da largura toda e o que o design põe lado a lado vive dentro de um bloco/especial. O `build-import.mjs` não gera um bloco à parte para o topo.
- `cms/migracao.zip` — o zip de «Migrar site»: `node cms/build-import.mjs && node cms/build-zip.mjs` (gitignored). Os PDFs/imagens não estão no repo: o `build-zip.mjs` lê-os de `cms/media/` (se existir) ou do `migracao.zip` anterior — não o apagar entre execuções.
- `fixtures/real/site-{pt,en,fr}.json` — o objecto público desse import, para `CMS_FIXTURE=fixtures/real/site-pt.json npm run build && npm run check`.

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
