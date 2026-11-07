import { json, script } from './_lib.js';
// GET /api/state — live wave and seat state, cached 5 s at the edge.
export async function onRequestGet({ request, env, waitUntil }) {
  const cache = caches.default;
  const key = new Request(new URL('/api/state', request.url).toString());
  const hit = await cache.match(key);
  if (hit) return hit;
  const s = await script(env, 'state');
  if (s.error) return json({ error: 'unavailable' }, 503);
  const res = json(s, 200, { 'cache-control': 'public, max-age=5, s-maxage=5' });
  waitUntil(cache.put(key, res.clone()));
  return res;
}
