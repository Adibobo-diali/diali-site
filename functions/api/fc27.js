import { json, script } from './_lib.js';
// Public bracket state, cached 10 s (the page polls every 15 s).
export async function onRequestGet({ request, env, waitUntil }) {
  const cache = caches.default; const key = new Request(new URL('/api/fc27', request.url).toString());
  const hit = await cache.match(key); if (hit) return hit;
  const s = await script(env, 'fc27Public');
  if (s.error) return json({ error: 'unavailable' }, 503);
  const res = json(s, 200, { 'cache-control': 'public, max-age=10, s-maxage=10' });
  waitUntil(cache.put(key, res.clone()));
  return res;
}
