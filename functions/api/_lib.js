// Shared helpers for the /api/* Pages Functions.
// Env: APPS_SCRIPT_URL, APPS_SCRIPT_SECRET, TURNSTILE_SECRET, ADMIN_EMAILS (comma list), KV binding DIALI_KV (optional).
export const json = (data, status = 200, extra = {}) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra } });

export async function readJson(request, max = 20000) {
  const text = await request.text();
  if (text.length > max) throw new Error('too_large');
  return text ? JSON.parse(text) : {};
}

export async function script(env, action, payload = {}) {
  if (!env.APPS_SCRIPT_URL) return { error: 'not_configured' };
  const res = await fetch(env.APPS_SCRIPT_URL, {
    method: 'POST', redirect: 'follow',
    headers: { 'content-type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ v: 2, secret: env.APPS_SCRIPT_SECRET, action, payload }),
  });
  if (!res.ok) return { error: 'upstream', status: res.status };
  try { return await res.json(); } catch { return { error: 'upstream_parse' }; }
}

export async function turnstile(env, token, ip) {
  if (!env.TURNSTILE_SECRET) return true; // not configured yet (preview)
  if (!token) return false;
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST', body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token, remoteip: ip || '' }),
  });
  const d = await r.json().catch(() => ({}));
  return !!d.success;
}

// Fixed-window rate limit in KV: `limit` requests per `windowSec` per key.
export async function rateLimit(env, key, limit, windowSec) {
  if (!env.DIALI_KV) return true;
  const bucket = Math.floor(Date.now() / 1000 / windowSec);
  const k = `rl:${key}:${bucket}`;
  const n = Number((await env.DIALI_KV.get(k)) || 0);
  if (n >= limit) return false;
  await env.DIALI_KV.put(k, String(n + 1), { expirationTtl: windowSec + 60 });
  return true;
}

// Idempotency: the same key returns the same stored response for 10 minutes.
export async function idem(env, key, fn) {
  if (!env.DIALI_KV || !key) return fn();
  const k = `idem:${key}`;
  const hit = await env.DIALI_KV.get(k);
  if (hit) return JSON.parse(hit);
  const out = await fn();
  if (!out.error || out.error === 'taken' || out.error === 'cap') await env.DIALI_KV.put(k, JSON.stringify(out), { expirationTtl: 600 });
  return out;
}

export const ip = (request) => request.headers.get('cf-connecting-ip') || '';
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const SEAT_RE = /^[B-G](?:[1-9]|1\d|20)$/;
export const clean = (s, n = 200) => String(s ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, n);
export const LANGS = ['en', 'nl', 'fr'];

export function adminEmail(request, env) {
  // Cloudflare Access sets this header after the one-time PIN login. Requests without it never reach admin actions.
  const email = (request.headers.get('cf-access-authenticated-user-email') || '').toLowerCase();
  const allowed = (env.ADMIN_EMAILS || '').toLowerCase().split(',').map((s) => s.trim()).filter(Boolean);
  return email && allowed.includes(email) ? email : null;
}
