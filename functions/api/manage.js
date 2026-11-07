import { json, readJson, script, clean, SEAT_RE } from './_lib.js';
export async function onRequestGet({ request, env }) {
  const token = clean(new URL(request.url).searchParams.get('token'), 64);
  if (!token) return json({ error: 'not_found' }, 404);
  const out = await script(env, 'get', { token });
  return json(out, out.ok ? 200 : 404);
}
export async function onRequestPost({ request, env }) {
  let b; try { b = await readJson(request); } catch { return json({ error: 'invalid' }, 400); }
  if (b.reconfirm) { const r = await script(env, 'reconfirm', { token: clean(b.token, 64) }); return json(r, r.ok ? 200 : 400); }
  const seats = (Array.isArray(b.seats) ? b.seats : []).map((s) => String(s).toUpperCase()).filter((s) => SEAT_RE.test(s));
  const out = await script(env, 'release', { token: clean(b.token, 64), seats });
  return json(out, out.ok ? 200 : 400);
}
