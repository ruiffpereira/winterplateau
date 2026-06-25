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

const SPEC = await fetchSpec(
  `${API_BASE}-docs/websites/booking.json${SWAGGER_KEY ? `?key=${SWAGGER_KEY}` : ''}`,
  'spec.json',
)

export default defineConfig({
  root: '.',
  input: {
    path: SPEC,
  },
  output: {
    path: './src/gen',
    extension: { '.ts': '.js' },
    clean: true,
  },
  plugins: [
    pluginOas(),
    pluginTs(),
    pluginClient({
      baseURL: API_BASE,
    }),
  ],
})
