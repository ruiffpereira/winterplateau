import type { APIRoute } from 'astro';
import { loadSites } from '../cms/client';
import { legacyObras } from '../cms/routes';
import { json } from '../cms/text';

/**
 * Endereço antigo `/Projeto.html?obra=<slug>`. O site é estático e não lê a query, por isso esta página
 * (um ficheiro `Projeto.html`, não um redirect) lê-a no browser e vai para o endereço novo da obra.
 */
export const GET: APIRoute = async () => {
  const map = legacyObras(await loadSites());
  const html = `<!doctype html>
<html lang="pt"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>Winterplateau</title>
<script>
var m = ${json(map)};
var o = new URLSearchParams(location.search).get('obra');
location.replace(Object.prototype.hasOwnProperty.call(m, o) ? m[o] : '/');
</script></head>
<body><noscript><a href="/">Winterplateau</a></noscript></body></html>
`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
