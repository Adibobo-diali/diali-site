import { json, readJson, script, rateLimit, ip, EMAIL_RE, clean, LANGS } from './_lib.js';
export async function onRequestPost({ request, env }) {
  let b; try { b = await readJson(request); } catch { return json({ error: 'invalid' }, 400); }
  if (!(await rateLimit(env, 'wl:' + ip(request), 5, 3600))) return json({ error: 'rate_limited' }, 429);
  const email = clean(b.email).toLowerCase();
  if (!EMAIL_RE.test(email)) return json({ error: 'invalid' }, 400);
  const out = await script(env, 'waitlist', { email, seats: Math.min(4, Math.max(1, Number(b.seats) || 1)), lang: LANGS.includes(b.lang) ? b.lang : 'en', ref: clean(b.ref, 40) });
  return json(out, out.error ? 502 : 200);
}
