/**
 * Forma do objecto público `GET /websites/site` (CONTRATO §7 + §11). Os tipos gerados pelo Kubb
 * (`src/gen-site`) descrevem os componentes como `object[]` — a forma resolvida de cada tipo do
 * catálogo (§3.3) não está no OpenAPI, por isso fica aqui, escrita contra o contrato.
 */

/** Componente já resolvido: texto na língua, media → URL, `dest` → `href`, listas sem `_id`. */
export interface Comp {
  type: string;
  style: string;
  col: 'all' | 1 | 2 | 3;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [field: string]: any;
}

export interface PageCard {
  title: string;
  href: string;
  description: string;
  image: string | null;
}

export interface Block {
  kind: 'block';
  anchor: string | null;
  layout: 1 | 2 | 3;
  bg: string;
  comps: Comp[];
}

export interface Special {
  kind: 'special';
  type: string;
  fields: Record<string, unknown>;
}

export type Item = Block | Special;

export interface Page {
  path: string;
  alternates: Record<string, string>;
  title: string;
  updatedAt: string;
  seo: {
    title: string;
    description: string;
    image: string | null;
    /** Texto alternativo da imagem de partilha da página (B38 · P3). */
    imageAlt?: string | null;
    noindex: boolean;
    canonical: string | null;
  };
  breadcrumb: { title: string; path: string }[];
  items: Item[];
}

export interface Site {
  revision: number;
  /** Nome do site (Admin), igual em todas as línguas; `null` se o dono ainda não o definiu. */
  siteName?: string | null;
  /** Imagem de partilha por omissão do site e o seu alt, na língua (B38 · P3); a página sem imagem própria usa esta. */
  seo?: { image: string | null; imageAlt: string | null };
  locale: string;
  defaultLanguage: string;
  languages: string[];
  topo: { comps: Comp[] };
  rodape: { layout?: 1 | 2 | 3; bg?: string; comps: Comp[] };
  pages: Page[];
  redirects: { from: string; to: string }[];
}

/** O que cada página renderizada sabe do sítio onde está (para `linguas`, canonical, JSON-LD…). */
export interface Ctx {
  site: Site;
  page: Page;
}
