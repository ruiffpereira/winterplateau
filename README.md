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
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Nav.astro               ← Navegação fixa
│   │   ├── Hero.astro              ← Secção hero (acima da dobra)
│   │   ├── Marquee.astro           ← Faixa de texto animada
│   │   ├── Stats.astro             ← Estatísticas da empresa
│   │   ├── ProductEpsExterior.astro ← Produto 01
│   │   ├── ProductEpsInterior.astro ← Produto 02
│   │   ├── Statement.astro         ← Frase de destaque
│   │   ├── MetalProfiles.astro     ← Perfis Metálicos
│   │   ├── About.astro             ← Quem Somos
│   │   ├── Downloads.astro         ← Documentação técnica
│   │   ├── CtaBand.astro           ← Call-to-action
│   │   ├── Contact.astro           ← Contactos
│   │   └── Footer.astro            ← Rodapé
│   ├── layouts/
│   │   └── BaseLayout.astro        ← Layout base (head, fontes, scripts)
│   ├── pages/
│   │   └── index.astro             ← Página principal
│   ├── scripts/
│   │   └── main.js                 ← JS de comportamento (nav, scroll reveal, contadores)
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
