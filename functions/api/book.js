import { json, readJson, script, turnstile, rateLimit, idem, ip, EMAIL_RE, SEAT_RE, clean, LANGS } from './_lib.js';
// POST /api/book — atomic reserve on confirm (Apps Script LockService check-then-write).
export async function onRequestPost({ request, env }) {
  let b; try { b = await readJson(request); } catch { return json({ error: 'invalid' }, 400); }
  if (!(await rateLimit(env, 'book:' + ip(request), 3, 3600))) return json({ error: 'rate_limited' }, 429);
  if (!(await turnstile(env, b.turnstile, ip(request)))) return json({ error: 'captcha' }, 403);
  const seats = Array.isArray(b.seats) ? [...new Set(b.seats.map((s) => String(s).toUpperCase()))] : [];
  const email = clean(b.email, 200).toLowerCase();
  if (!seats.length || seats.length > 4 || !seats.every((s) => SEAT_RE.test(s))) return json({ error: 'invalid' }, 400);
  if (!EMAIL_RE.test(email) || !clean(b.name) || b.consent !== true) return json({ error: 'invalid' }, 400);
  const guests = (Array.isArray(b.guests) ? b.guests : []).slice(0, seats.length - 1).map((g) => clean(g, 60).split(/\s+/)[0]);
  if (guests.length !== seats.length - 1 || guests.some((g) => !g)) return json({ error: 'invalid' }, 400);
  const fc27 = (Array.isArray(b.fc27) ? b.fc27 : []).slice(0, 4).map((f) => ({ name: clean(f.name, 60), under16: !!f.under16 }));
  const payload = { seats, email, name: clean(b.name, 120), guests, fc27, newsletter: !!b.newsletter, lang: LANGS.includes(b.lang) ? b.lang : 'en', ref: clean(b.ref, 40) };
  const out = await idem(env, b.idem && `book:${clean(b.idem, 80)}`, () => script(env, 'book', payload));
  if (out.error) return json(out, out.error === 'taken' || out.error === 'cap' || out.error === 'closed' ? 409 : 502);
  return json(out);
}
