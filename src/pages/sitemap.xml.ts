import { getCollection } from 'astro:content';
export async function GET() {
  const base = 'https://www.dialivzw.eu';
  const fixed = ['/', '/the-mind-behind-the-game', '/fc27', '/seats', '/our-programs', '/events', '/news', '/become-a-sponsor/partner', '/contact', '/privacy', '/seats-privacy'];
  const ev = (await getCollection('events')).map((e) => `/events/${e.id}`);
  const nw = (await getCollection('news')).map((n) => `/news/${n.id}`);
  const urls = [...fixed, ...ev, ...nw].map((u) => `<url><loc>${base}${u}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'content-type': 'application/xml' } });
}
