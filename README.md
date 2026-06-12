# Winterplateau — Astro Project

Website oficial da Winterplateau, desenvolvido com [Astro](https://astro.build).  
EPS e Perfis Metálicos para a Construção · Vila Verde, Portugal · Desde 2016.

---

## 🚀 Início Rápido

### Pré-requisitos
- [Node.js](https://nodejs.org/) **v18.17.1** ou superior
- npm (incluído no Node.js)

### Instalar dependências

```bash
npm install
```

### Servidor de desenvolvimento

```bash
npm run dev
```

Abre o browser em **http://localhost:4321**

### Build para produção

```bash
npm run build
```

Os ficheiros são gerados na pasta `dist/`.

### Pré-visualizar o build

```bash
npm run preview
```

---

## 📁 Estrutura do Projeto

```
winterplateau-astro/
├── public/
│   ├── favicon.svg
│   ├── assets/
│   │   ├── projects.js          ← DADOS das obras + geração de cards/fachadas/slider
│   │   ├── winter.css           ← Estilos partilhados pelas subpáginas (nav, footer, cards)
│   │   └── universe.js          ← Universo: constelação + régua de cotas ("alçado vivo")
│   └── scripts/
│       └── home.js              ← Motor da homepage (nav, reveal, contadores, 3D, obras)
├── src/
│   ├── components/
│   │   ├── Nav.astro               ← Navegação fixa
│   │   ├── Hero.astro              ← Secção hero (3D)
│   │   ├── Marquee.astro           ← Faixa de texto animada
│   │   ├── Stats.astro             ← Estatísticas da empresa
│   │   ├── ProductEpsExterior.astro ← Produto 01 (3D)
│   │   ├── ProductEpsInterior.astro ← Produto 02 (3D)
│   │   ├── Statement.astro         ← Frase de destaque
│   │   ├── MetalProfiles.astro     ← Perfis Metálicos (3D)
│   │   ├── Obras.astro             ← Secção de obras em destaque
│   │   ├── About.astro             ← Quem Somos
│   │   ├── Downloads.astro         ← Documentação técnica
│   │   ├── CtaBand.astro           ← Call-to-action
│   │   ├── Contact.astro           ← Contactos
│   │   └── Footer.astro            ← Rodapé
│   ├── layouts/
│   │   └── BaseLayout.astro        ← Layout base (head, fontes)
│   ├── pages/
│   │   ├── index.astro             ← Página principal
│   │   ├── Projetos.astro          ← Índice de obras (→ Projetos.html)
│   │   └── Projeto.astro           ← Detalhe de obra (→ Projeto.html?obra=slug)
│   └── styles/
│       └── global.css              ← Todos os estilos globais e tokens CSS
├── astro.config.mjs
├── package.json
├── tsconfig.json
└── .gitignore
```

---

## 🎨 Design System

| Token        | Valor       | Uso                     |
|--------------|-------------|-------------------------|
| `--bl`       | `#19A3E0`   | Azul principal (brand)  |
| `--bld`      | `#1280B0`   | Azul escuro (hover)     |
| `--ink`      | `#0C0C0B`   | Texto principal         |
| `--ink2`     | `#3E3D3A`   | Texto secundário        |
| `--ink3`     | `#737069`   | Texto terciário         |
| `--off`      | `#F7F6F3`   | Fundo neutro claro      |
| `--off2`     | `#EEECEE`   | Fundo neutro médio      |
| `--bdr`      | `#E1DFD9`   | Bordas e divisores      |

**Tipografia:**
- Display: `Cormorant Garamond` (weight 300/400, italic disponível)
- UI: `DM Sans` (weight 300/400/500)

---

## ✨ Animações 3D ("Plantas Vivas")

Os desenhos a azul (blueprints) são separados em **planos de profundidade reais** e animados de forma subtil:

- **Camadas 3D** — fundo (grelha), meio (edifício/janelas) e frente (molduras EPS que saltam da fachada)
- **Respiração contínua** — inclinação suave e constante, indica movimento sem distrair
- **Parallax ao cursor** — a cena inclina-se na direção do rato (apenas em ecrãs com cursor)
- **Montagem na entrada** — as camadas surgem da profundidade + varredura "scanner" azul
- **Perfis metálicos** — extrudidos em 3D (secções empilhadas como barras de metal sólidas)

Toda a lógica vive em `public/scripts/home.js`. Os estilos em `src/styles/global.css` (secções `3D BLUEPRINT SCENES` e `METAL PROFILE EXTRUSIONS`).
Respeita `prefers-reduced-motion`: quem desativa animações vê tudo estático e legível.

- **Parallax de profundidade** — cada camada desloca-se de forma diferente conforme o cursor (frente mais que o fundo), criando profundidade real em vez de uma simples rotação.

### Universo · "Alçado Vivo"
- Fundo escuro contínuo com constelação técnica (canvas, liga-se ao cursor)
- Régua de cotas fixa à direita: o scroll "desce" o edifício (+14.00 m → 0.00 m); em mobile vira barra de progresso com a cota no topo (`#mprog`)
- Secções como folhas de desenho numeradas (`data-sheet="FL 0X · …"`)
- Página de projeto com prumo central e etapas alternadas esquerda/direita

### Responsividade
- **≤1024px** — os blueprints 3D passam a aparecer empilhados (visíveis em mobile, não escondidos); menu hambúrguer (`#nburger` → `#mmenu`)
- **≤560px** — grelhas em coluna única, tipografia do hero reduzida

---

## 🏗️ Obras (conteúdo dinâmico / backoffice)

Todas as obras são geridas num **único ficheiro**: `public/assets/projects.js`.

O array `PROJECTS` é a fonte de verdade — em produção é alimentado pelo backoffice. A partir dele o site gera automaticamente:

- a **secção de destaque** na homepage (`Obras.astro` → `#obrasHome`)
- o **índice** de obras com filtros (`Projetos.astro`)
- cada **página de detalhe** (`Projeto.astro?obra=slug`) com slider antes/depois, processo e materiais

### Adicionar uma obra

```js
{
  slug: 'nome-unico-da-obra',     // usado no URL: Projeto.html?obra=nome-unico-da-obra
  title: 'Título da Obra',
  location: 'Cidade', year: '2024',
  type: 'Reabilitação',           // ou 'Construção Nova' (usado nos filtros)
  cols: 3, floors: 4,             // geometria da ilustração de fachada
  summary: 'Descrição da intervenção…',
  products: ['Cornijas', 'Bandas', 'Peitoris'],
  stats: [{ n: '420', u: 'm²', l: 'Fachada' }, …],
  process: [{ ph: '01', t: 'Diagnóstico', d: '…' }, …],
}
```

### Fotografias reais

As ilustrações de fachada (antes/depois) funcionam como *fallback* elegante. Para usar **fotografias reais** da obra, basta substituir os `<svg>` gerados em `facadeSVG()` por `<img>`, ou preencher os `photoSlot()` da secção "Durante a obra" — os locais já estão marcados e dimensionados.

---

## 📣 Marketing

- **SEO** — meta tags otimizadas, canonical, JSON-LD LocalBusiness, `public/sitemap.xml` e `public/robots.txt`
- **Open Graph** — imagem de partilha em `public/assets/og-image.png` (1200×630)
- **Leads** — secção "Peça o seu orçamento" (`Orcamento.astro`); por defeito abre email para geral@winterplateau.pt. Para ligar a um backoffice/Formspree, preencher `formEndpoint` em `public/assets/marketing.js`
- **WhatsApp** — botão flutuante em todas as páginas; substituir o número em `marketing.js` (`whatsapp`)
- **Analytics** — preencher `gaId` em `marketing.js` (GA4) e carrega automaticamente
- **Testemunhos** — `Testemunhos.astro` com 3 espaços reservados (tracejado) para citações reais
- **Idiomas PT/EN/FR** — `public/assets/i18n.js` traduz todo o site em runtime; a escolha persiste. Em produção pode migrar-se para rotas estáticas `/en` `/fr` com hreflang

## 🌍 Deploy

Este projeto é compatível com qualquer plataforma que suporte Node.js ou static output:

- **[Vercel](https://vercel.com)** — zero config, basta ligar o repositório
- **[Netlify](https://netlify.com)** — build command: `npm run build`, publish dir: `dist`
- **[Cloudflare Pages](https://pages.cloudflare.com)** — build command: `npm run build`, output: `dist`

Para deploy estático puro, o output em `dist/` pode ser servido por qualquer servidor HTTP.

---

## 📞 Contactos

**Winterplateau**  
Avenida Principal, Nº 202 · 4730-041 Atiães, Vila Verde, Braga  
📞 +351 253 193 667  
✉️ geral@winterplateau.pt  
🌐 [www.winterplateau.pt](https://www.winterplateau.pt)
