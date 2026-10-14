import type { APIRoute } from 'astro';
import { loadSites } from '../cms/client';

/** A prova de que o site no ar já tem a revisão gravada: a API lê isto (`/cms-build.json`) depois do deploy (CONTRATO §8). */
export const GET: APIRoute = async () => {
  const [base] = await loadSites();
  return new Response(JSON.stringify({ revision: base.revision }), { headers: { 'Content-Type': 'application/json' } });
};
