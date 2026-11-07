import { readJson, script } from './_lib.js';
// Custom events (door clicks, shares, share arrivals). Cloudflare Web Analytics has no custom events, so we count them here.
const ALLOWED = /^(door_enter|cta_[a-z0-9-]+|share_(whatsapp|instagram|copy|arrival))$/;
export async function onRequestPost({ request, env, waitUntil }) {
  try { const b = await readJson(request, 1000); if (ALLOWED.test(b.e)) waitUntil(script(env, 'track', { e: b.e, p: String(b.p || '').slice(0, 80) })); } catch {}
  return new Response(null, { status: 204 });
}
