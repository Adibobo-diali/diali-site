import { json, readJson, script, turnstile, rateLimit, idem, ip, EMAIL_RE, clean } from './_lib.js';
// POST /api/form — contact, partner and club forms → Sheet "Messages" tab → email to Outlook. Never says "sent" unless it was.
export async function onRequestPost({ request, env }) {
  let b; try { b = await readJson(request); } catch { return json({ error: 'invalid' }, 400); }
  if (b.website) return json({ ok: true }); // honeypot
  if (!(await rateLimit(env, 'form:' + ip(request), 5, 3600))) return json({ error: 'rate_limited' }, 429);
  if (!(await turnstile(env, b.turnstile, ip(request)))) return json({ error: 'captcha' }, 403);
  const email = clean(b.email).toLowerCase();
  const form = ['contact', 'partner', 'club'].includes(b.form) ? b.form : 'contact';
  if (!EMAIL_RE.test(email) || !clean(b.name) || !clean(b.message, 4000)) return json({ error: 'invalid' }, 400);
  const types = ['Grant', 'Club', 'Event', 'Sponsorship', 'Not sure yet'];
  const payload = {
    form, source: clean(b.source, 40), name: clean(b.name, 120), email, organisation: clean(b.organisation, 160),
    type: form === 'club' ? 'Club' : types.includes(b.type) ? b.type : '', seats: form === 'club' ? Math.min(10, Math.max(1, Number(b.seats) || 0)) : '',
    message: clean(b.message, 4000), ref: clean(b.ref, 40), lang: clean(b.lang, 5),
  };
  const out = await idem(env, b.idem && `form:${clean(b.idem, 80)}`, () => script(env, 'form', payload));
  return json(out, out.ok ? 200 : 502);
}
