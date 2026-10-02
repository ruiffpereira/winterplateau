/**
 * Estatísticas (Umami) — o par {websiteId, src} do tenant deste site, pedido à
 * API UMA vez por build (todas as páginas partilham a mesma promessa).
 *
 * Corre só no build: o SITE_TOKEN nunca chega ao browser. Sem site no Umami a
 * API devolve 204 → null → a página sai sem script. Se a API falhar, o build
 * continua (só sem estatísticas). Um domínio novo apanha-se no deploy seguinte.
 */
import { getWebsitesAnalyticsTracking } from '../gen-analytics/clients/getWebsitesAnalyticsTracking.js';

type Tracking = { websiteId: string; src: string } | null;

let pending: Promise<Tracking> | null = null;

export function getUmamiTracking(): Promise<Tracking> {
  if (!pending) pending = load();
  return pending;
}

async function load(): Promise<Tracking> {
  const token = import.meta.env.SITE_TOKEN;
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  if (!token || !baseURL) return null;
  try {
    const tracking = await getWebsitesAnalyticsTracking({ baseURL, headers: { 'X-Site-Token': token } });
    if (!tracking?.websiteId || !tracking?.src) return null;
    return { websiteId: tracking.websiteId, src: tracking.src };
  } catch {
    return null;
  }
}
