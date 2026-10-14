import { defineConfig } from '@kubb/core'
import { pluginOas } from '@kubb/plugin-oas'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginClient } from '@kubb/plugin-client'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

function readDotEnv() {
  if (!existsSync('.env')) return {}
  return Object.fromEntries(
    readFileSync('.env', 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#') && line.includes('='))
      .map((line) => {
        const [key, ...rest] = line.split('=')
        return [key, rest.join('=').replace(/^["']|["']$/g, '')]
      }),
  )
}

const dotEnv = readDotEnv()
const API_BASE =
  process.env.VITE_API_BASE_URL ?? dotEnv.VITE_API_BASE_URL ?? 'http://localhost:3001/api'
const SWAGGER_KEY =
  process.env.SWAGGER_ACCESS_TOKEN ?? dotEnv.SWAGGER_ACCESS_TOKEN ?? ''
// Build-time only — NUNCA prefixar com VITE_. Combina com a WAF custom rule na
// Cloudflare (header X-CI-Bypass => Skip Bot Fight) para a build atravessar o edge.
const CF_BYPASS = process.env.CF_BYPASS_TOKEN ?? dotEnv.CF_BYPASS_TOKEN ?? ''

// Pré-fetch do spec com o header de bypass e escreve um ficheiro local; o Kubb lê
// o ficheiro (o suporte a headers custom no input do Kubb é limitado). O token só
// vai no header — não fica em spec*.json nem no código gerado.
async function fetchSpec(url: string, outFile: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'kubb-codegen',
      ...(CF_BYPASS ? { 'X-CI-Bypass': CF_BYPASS } : {}),
    },
  })
  if (!res.ok) {
    throw new Error(
      `Falha a obter o OpenAPI spec (${res.status} ${res.statusText}) de ${url}. ` +
        `Se for a Cloudflare a bloquear, confirma CF_BYPASS_TOKEN e a WAF rule.`,
    )
  }
  writeFileSync(outFile, await res.text())
  return outFile
}

// KUBB_OFFLINE=1 — reutiliza spec.json / spec.analytics.json já descarregados (gitignored) em vez de
// ir buscá-los à API. Só para quando a API não está acessível; por omissão o comportamento é o de sempre.
const OFFLINE = process.env.KUBB_OFFLINE === '1'
async function specFrom(url: string, outFile: string): Promise<string> {
  if (OFFLINE) {
    if (!existsSync(outFile)) throw new Error(`KUBB_OFFLINE=1 mas falta ${outFile} — corre uma vez com a API acessível.`)
    return outFile
  }
  return fetchSpec(url, outFile)
}

const KEY_QS = SWAGGER_KEY ? `?key=${SWAGGER_KEY}` : ''
const SPEC = await specFrom(`${API_BASE}-docs/websites/booking.json${KEY_QS}`, 'spec.json')
// Estatísticas: o par {websiteId, src} do Umami deste tenant (lido no build).
const SPEC_ANALYTICS = await specFrom(`${API_BASE}-docs/websites/analytics.json${KEY_QS}`, 'spec.analytics.json')
// Construtor de páginas (/websites/site): spec COMMITADO, sem fetch — a rota ainda não está em produção.
// Regenerar a partir da API: `pnpm exec ts-node --transpile-only scripts/dumpSpec.ts site > ../winterplateau/spec.site.json`
// (ou, com a API em produção, descarregar `${API_BASE}-docs/websites/site.json`).
const SPEC_SITE = 'spec.site.json'

const plugins = [
  pluginOas(),
  pluginTs(),
  pluginClient({
    baseURL: API_BASE,
  }),
]

export default defineConfig([
  {
    root: '.',
    input: { path: SPEC },
    output: { path: './src/gen', extension: { '.ts': '.js' }, clean: true },
    plugins,
  },
  // Sem baseURL fixo: o código gerado vai para o git e o URL da API muda por
  // ambiente — src/lib/umami.ts passa-o no pedido (VITE_API_BASE_URL do build).
  // Cliente `fetch` nativo (este site não tem axios).
  {
    root: '.',
    input: { path: SPEC_ANALYTICS },
    output: { path: './src/gen-analytics', extension: { '.ts': '.js' }, clean: true },
    plugins: [pluginOas(), pluginTs(), pluginClient({ importPath: '@kubb/plugin-client/clients/fetch' })],
  },
  // Construtor de páginas: /websites/site (+ /site/page). Mesmo molde do analytics (fetch nativo, baseURL em runtime).
  {
    root: '.',
    input: { path: SPEC_SITE },
    output: { path: './src/gen-site', extension: { '.ts': '.js' }, clean: true },
    plugins: [pluginOas(), pluginTs(), pluginClient({ importPath: '@kubb/plugin-client/clients/fetch' })],
  },
])
