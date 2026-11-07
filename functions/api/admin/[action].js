import { json, readJson, script, adminEmail, clean } from '../_lib.js';
// /api/admin/* sits behind Cloudflare Access (one-time PIN). We double-check the authenticated email here.
const ACTIONS = ['bookings', 'checkin', 'block', 'offer', 'fc27', 'fc27-form-total', 'fc27-draw', 'fc27-win', 'fc27-undo'];
export async function onRequestPost({ request, env, params }) {
  const who = adminEmail(request, env);
  if (!who) return json({ error: 'forbidden' }, 403);
  const action = params.action;
  if (!ACTIONS.includes(action)) return json({ error: 'not_found' }, 404);
  let b = {}; try { b = await readJson(request); } catch {}
  if (action === 'block' && (!Array.isArray(b.seats) || b.seats.length > 10)) return json({ error: 'max_10' }, 400);
  if (action === 'fc27-draw') b.names = (b.names || []).slice(0, 16).map((n) => clean(n, 30));
  const out = await script(env, 'admin:' + action, { ...b, by: who });
  return json(out, out.error ? 400 : 200);
}
