/** Ícones do kit como caminhos SVG (viewBox 24, traço) — constantes nossas, nunca texto da API. */
export const ICONS: Record<string, string[]> = {
  escudo: ['M12 2.5l8 3v6c0 5-3.4 9-8 10.5-4.6-1.5-8-5.5-8-10.5v-6z', 'M8.5 12l2.5 2.5 4.5-5'],
  folha: ['M5 19C5 10 10 5 20 5c0 10-5 14-14 14', 'M5 19c3-5 6-8 10-10'],
};
/** Ícone de um id do manifest que o kit não conhece: círculo com visto (nunca fica sem ícone). */
export const ICON_FALLBACK = ['M12 3a9 9 0 100 18 9 9 0 000-18z', 'M8 12.5l2.7 2.7L16 9.5'];

export const NETWORKS: Record<string, { label: string; d: string[] }> = {
  instagram: { label: 'Instagram', d: ['M8 3h8a5 5 0 015 5v8a5 5 0 01-5 5H8a5 5 0 01-5-5V8a5 5 0 015-5z', 'M12 8a4 4 0 100 8 4 4 0 000-8z', 'M17.5 6.5h.01'] },
  facebook: { label: 'Facebook', d: ['M17 3h-2.5A4.5 4.5 0 0010 7.5V10H7v4h3v7h4v-7h3l1-4h-4V7.5a.5.5 0 01.5-.5H17z'] },
  linkedin: { label: 'LinkedIn', d: ['M6 3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6a3 3 0 013-3z', 'M8 10.5V16M8 8v.01M12 16v-3.2a2.3 2.3 0 014.6 0V16M12 10.5V16'] },
  youtube: { label: 'YouTube', d: ['M6.5 5.5h11a4 4 0 014 4v5a4 4 0 01-4 4h-11a4 4 0 01-4-4v-5a4 4 0 014-4z', 'M10.5 9.5v5l4.2-2.5z'] },
  tiktok: { label: 'TikTok', d: ['M14 3v11.5a3.5 3.5 0 11-3.5-3.5', 'M14 3c.3 2.6 2 4.4 5 4.6'] },
  x: { label: 'X', d: ['M4 4l16 16M20 4L4 20'] },
};

export const CONTACT = {
  pin: ['M12 2a6 6 0 00-6 6c0 4.5 6 12 6 12s6-7.5 6-12a6 6 0 00-6-6z', 'M12 6.5a1.9 1.9 0 100 3.8 1.9 1.9 0 000-3.8z'],
  phone: ['M3 4.5h4.5l2.25 5.25-2.25 1.5a13.5 13.5 0 006.75 6.75l1.5-2.25L21 18v4.5c-9.9 0-18-8.1-18-18z'],
  mail: ['M3 6h18v12H3z', 'M3 7l9 6 9-6'],
};

export const FILE = ['M7 3h7l5 5v13H7z', 'M14 3v5h5'];
export const ARROW = ['M5 12h14M13 6l6 6-6 6'];
