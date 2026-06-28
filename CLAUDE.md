# CLAUDE.md — winterplateau

Site público SSG em Astro para a Winterplateau (EPS e Perfis Metálicos, Vila Verde).

Para o padrão geral de CSV de conteúdo e como importar para o backoffice, ver [../CLAUDE.md](../CLAUDE.md) → secção **Padrão: Importar Conteúdo para o CMS**.

---

## Stack

- **Astro 4** — SSG puro (`output: 'static'`, sem adapter)
- **Kubb v3** com `pluginClient` — cliente fetch tipado, gerado de `booking.json`; **não** usa `pluginReactQuery` porque o Astro não usa React em SSG
- **Coolify** — deploy triggered pelo botão "Publicar" do backoffice (webhook)

---

## Fluxo de deploy

```
Backoffice → "Publicar" → Coolify webhook → astro build → GET /api/websites/content → HTML estático
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
