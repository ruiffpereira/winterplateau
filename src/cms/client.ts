/**
 * Cliente do construtor de páginas — corre SÓ no build (o SITE_TOKEN nunca chega ao browser).
 *
 * FALHA ALTO: qualquer erro (rede, timeout, HTTP ≠ 200, JSON inválido, objecto sem `pages`, língua
 * trocada) lança e deita o build abaixo. É de propósito: publicar um site vazio é pior do que não publicar.
 * Não copiar o padrão de `src/lib/umami.ts`, que engole erros.
 *
 * Fontes (por ordem):
 *   CMS_FIXTURE=<ficheiro.json>  — ficheiro da língua base; as outras são os irmãos `site-<lang>.json`
 *   API                          — VITE_API_BASE_URL + SITE_TOKEN (+ CF_BYPASS_TOKEN atrás da Cloudflare)
 */
import { existsSync, readFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import fetch from '@kubb/plugin-client/clients/fetch';
import { getWebsitesSite } from '../gen-site/clients/getWebsitesSite.js';
import type { Site } from './types.js';

const TIMEOUT_MS = 30_000;

/** process.env primeiro, `.env` a seguir (este módulo corre também no carregamento da config, sem `import.meta.env`). */
function env(name: string): string {
  if (process.env[name]) return process.env[name] as string;
  if (!existsSync('.env')) return '';
  const line = readFileSync('.env', 'utf8')
    .split(/\r?\n/)
    .find((l) => l.trim().startsWith(`${name}=`));
  return line ? line.slice(line.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '') : '';
}

/** Valida o mínimo de que o kit depende; o resto confia-se no contrato (a API já o validou). */
function parse(raw: unknown, origin: string, locale?: string): Site {
  const s = raw as Partial<Site> | null;
  const bad = (why: string) => new Error(`CMS: resposta inválida de ${origin} — ${why}`);
  if (!s || typeof s !== 'object') throw bad('não é um objecto');
  if (!Array.isArray(s.pages)) throw bad('falta `pages`');
  if (typeof s.defaultLanguage !== 'string' || !Array.isArray(s.languages) || typeof s.locale !== 'string') throw bad('falta `locale`/`defaultLanguage`/`languages`');
  if (typeof s.revision !== 'number') throw bad('falta `revision`');
  if (locale && s.locale !== locale) throw bad(`pedi "${locale}" e veio "${s.locale}"`);
  if (!s.topo || !s.rodape) throw bad('falta `topo`/`rodape`');
  if (s.pages.length === 0) throw bad('`pages` vazio — não se publica um site vazio');
  return { ...s, redirects: Array.isArray(s.redirects) ? s.redirects : [] } as Site;
}

function fromFile(file: string, locale?: string): Site {
  if (!existsSync(file)) throw new Error(`CMS: fixture inexistente: ${file}`);
  try {
    return parse(JSON.parse(readFileSync(file, 'utf8')), file, locale);
  } catch (e) {
    if (e instanceof SyntaxError) throw new Error(`CMS: JSON inválido em ${file}: ${e.message}`);
    throw e;
  }
}

/** Cliente fetch do Kubb que recusa tudo o que não seja 200 (o gerado devolve o corpo de qualquer status). */
const strictClient: typeof fetch = (async (config: Parameters<typeof fetch>[0]) => {
  const res = await fetch(config);
  if (res.status !== 200) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  return res;
}) as typeof fetch;
Object.assign(strictClient, fetch);

async function fromApi(locale?: string): Promise<Site> {
  const baseURL = env('VITE_API_BASE_URL');
  const token = env('SITE_TOKEN');
  if (!baseURL || !token) throw new Error('CMS: faltam VITE_API_BASE_URL e/ou SITE_TOKEN (ou define CMS_FIXTURE para build sem API)');
  const bypass = env('CF_BYPASS_TOKEN');
  const origin = `${baseURL}/websites/site${locale ? `?locale=${locale}` : ''}`;
  try {
    const data = await getWebsitesSite(locale ? { locale } : undefined, {
      client: strictClient,
      baseURL,
      headers: { 'X-Site-Token': token, 'User-Agent': 'winterplateau-build', ...(bypass ? { 'X-CI-Bypass': bypass } : {}) },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return parse(data, origin, locale);
  } catch (e) {
    if (e instanceof Error && e.message.startsWith('CMS:')) throw e;
    throw new Error(`CMS: falhou ${origin} — ${e instanceof Error ? `${e.name}: ${e.message}` : String(e)}`, { cause: e });
  }
}

async function load(): Promise<Site[]> {
  const fixture = env('CMS_FIXTURE');
  // A base primeiro (sem `locale` a API devolve a língua base e a lista das línguas); depois uma por língua.
  const base = fixture ? fromFile(resolve(fixture)) : await fromApi();
  const others = base.languages.filter((l) => l !== base.locale);
  const rest = fixture
    ? others.map((l) => fromFile(join(dirname(resolve(fixture)), basename(fixture).replace(`-${base.locale}.`, `-${l}.`)), l))
    : await Promise.all(others.map((l) => fromApi(l)));
  const revisions = new Set([base, ...rest].map((s) => s.revision));
  if (!fixture && revisions.size > 1) throw new Error(`CMS: o site mudou a meio do build (revisões ${[...revisions].join(', ')}) — volta a correr`);
  console.info(`[cms] ${fixture ? `fixture ${fixture}` : 'API'}: revisão ${base.revision}, línguas ${[base, ...rest].map((s) => s.locale).join(', ')}, ${[base, ...rest].reduce((n, s) => n + s.pages.length, 0)} páginas`);
  return [base, ...rest];
}

/** Todas as línguas, a base primeiro. Um único carregamento por processo (a config e as páginas partilham-no). */
export function loadSites(): Promise<Site[]> {
  const g = globalThis as { __cmsSites?: Promise<Site[]> };
  return (g.__cmsSites ??= load());
}
