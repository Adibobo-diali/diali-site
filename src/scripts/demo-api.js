// PREVIEW ONLY. Simulates the booking API in this browser so the flow can be tested
// before the Apps Script copy is connected. Nothing is sent and nobody is emailed.
const KEY = 'diali-demo-v1';
const ROWS = ['B', 'C', 'D', 'E', 'F', 'G'];
const PER_ROW = 20;
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || null; } catch { return null; } };
const save = (d) => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {} };
function db() {
  let d = load();
  if (!d) {
    // Seed with a few taken seats so the map looks realistic.
    const taken = {};
    ['B5', 'B6', 'B7', 'B8', 'B11', 'B12', 'C3', 'C4', 'C9', 'C10', 'C15'].forEach((s) => (taken[s] = 'seed'));
    d = { taken, bookings: {}, waitlist: [], messages: [], fc27: { formTotal: 0, signups: [], slots: Array(16).fill(null), rounds: [], history: [] } };
    save(d);
  }
  return d;
}
const lastRowIdx = (row) => ROWS.indexOf(row);
function compute() {
  const d = db();
  const now = Date.now();
  const waves = (window.DIALI?.waves || []).map((w) => ({ ...w, open: new Date(w.opens).getTime() <= now }));
  const openWaves = waves.filter((w) => w.open);
  const cur = openWaves[openWaves.length - 1];
  const lastRow = cur ? (cur.rows.match(/([A-G])\s*$/) || [])[1] : null;
  const openRows = lastRow ? ROWS.slice(0, lastRowIdx(lastRow) + 1) : [];
  let left = 0;
  openRows.forEach((r) => { for (let i = 1; i <= PER_ROW; i++) if (!d.taken[r + i]) left++; });
  let total = 0; ROWS.forEach((r) => { for (let i = 1; i <= PER_ROW; i++) if (!d.taken[r + i]) total++; });
  const next = waves.find((w) => !w.open);
  const waitlistOnly = now >= new Date(window.DIALI?.waitlistFrom).getTime();
  const over = now > new Date(window.DIALI?.end).getTime();
  return { demo: true, currentWave: cur?.n || 0, openRows, seatsLeft: left, totalLeft: total, nextWave: next?.n || null, nextWaveAt: next?.opens || null, allFull: total === 0, waitlistOnly, over, taken: Object.keys(d.taken), rows: ROWS, perRow: PER_ROW, fc27Count: d.fc27.signups.length + (d.fc27.formTotal || 0) };
}
const tok = () => Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export async function handle(method, path, body = {}) {
  await wait(350);
  const d = db();
  const url = new URL(path, location.origin);
  const p = url.pathname;
  if (p === '/api/state') return compute();
  if (p === '/api/book') {
    const s = compute();
    if (s.over) return { error: 'over' };
    if (s.waitlistOnly) return { error: 'waitlist_only' };
    const seats = body.seats || [];
    if (!seats.length || seats.length > 4) return { error: 'invalid' };
    const email = String(body.email || '').trim().toLowerCase();
    const already = Object.values(d.bookings).filter((b) => b.email === email && !b.released).reduce((n, b) => n + b.seats.length, 0);
    if (already + seats.length > 6) return { error: 'cap', already };
    const closed = seats.filter((x) => !s.openRows.includes(x[0]));
    if (closed.length) return { error: 'closed', seats: closed };
    const taken = seats.filter((x) => d.taken[x]);
    if (taken.length) return { error: 'taken', taken };
    const token = tok();
    const id = 'D' + (Object.keys(d.bookings).length + 101);
    seats.forEach((x) => (d.taken[x] = id));
    d.bookings[token] = { id, token, email, name: body.name, guests: body.guests || [], seats, lang: body.lang, ref: body.ref || '', fc27: body.fc27 || [], at: new Date().toISOString() };
    (body.fc27 || []).forEach((f) => d.fc27.signups.push({ name: f.name, under16: !!f.under16, source: 'booking', booking: id }));
    save(d);
    return { ok: true, booking: d.bookings[token] };
  }
  if (p === '/api/manage' && method === 'GET') {
    const b = d.bookings[url.searchParams.get('token')];
    return b ? { ok: true, booking: b } : { error: 'not_found' };
  }
  if (p === '/api/manage' && method === 'POST') {
    const b = d.bookings[body.token];
    if (!b) return { error: 'not_found' };
    if (body.reconfirm) { b.reconfirmed = true; save(d); return { ok: true }; }
    const rel = body.seats && body.seats.length ? body.seats : b.seats;
    rel.forEach((x) => { if (d.taken[x] === b.id) delete d.taken[x]; });
    b.seats = b.seats.filter((x) => !rel.includes(x));
    if (!b.seats.length) b.released = true;
    save(d);
    return { ok: true, booking: b };
  }
  if (p === '/api/waitlist' || p === '/api/notify') { d.waitlist.push({ ...body, at: Date.now(), kind: p }); save(d); return { ok: true, position: d.waitlist.length }; }
  if (p === '/api/form') { d.messages.push({ ...body, at: Date.now() }); save(d); return { ok: true, demo: true }; }
  if (p === '/api/fc27') { const f = d.fc27; return { ok: true, count: f.signups.length + (f.formTotal || 0), slots: f.slots, rounds: f.rounds }; }
  if (p.startsWith('/api/admin/')) return adminDemo(p.split('/').pop(), body, d);
  return { error: 'not_found' };
}

function adminDemo(action, body, d) {
  const f = d.fc27;
  const list = () => Object.values(d.bookings).filter((b) => !b.released);
  if (action === 'bookings') return { ok: true, bookings: list(), waitlist: d.waitlist, messages: d.messages };
  if (action === 'checkin') { const b = Object.values(d.bookings).find((x) => x.id === body.id); if (b) { b.checkedIn = !b.checkedIn; save(d); } return { ok: true }; }
  if (action === 'fc27') return { ok: true, ...f, checkedIn: f.signups.filter((s) => (Object.values(d.bookings).find((b) => b.id === s.booking) || {}).checkedIn) };
  if (action === 'fc27-form-total') { f.formTotal = Number(body.total) || 0; save(d); return { ok: true }; }
  if (action === 'fc27-draw') {
    const names = (body.names || []).slice(0, 16).sort(() => Math.random() - .5);
    f.slots = Array.from({ length: 16 }, (_, i) => names[i] || null); f.rounds = [f.slots.slice()]; f.history = []; save(d); return { ok: true, slots: f.slots, rounds: f.rounds };
  }
  if (action === 'fc27-win') {
    const { round, match } = body; f.history.push(JSON.stringify(f.rounds));
    const winner = f.rounds[round][match * 2 + body.side];
    if (!f.rounds[round + 1]) f.rounds[round + 1] = Array(f.rounds[round].length / 2).fill(null);
    f.rounds[round + 1][match] = winner; save(d); return { ok: true, rounds: f.rounds };
  }
  if (action === 'fc27-undo') { const h = f.history.pop(); if (h) f.rounds = JSON.parse(h); save(d); return { ok: true, rounds: f.rounds }; }
  if (action === 'block') {
    const taken = (body.seats || []).filter((x) => d.taken[x]);
    if (taken.length) return { error: 'taken', taken };
    const id = 'C' + (Object.keys(d.bookings).length + 101), token = tok();
    body.seats.forEach((x) => (d.taken[x] = id));
    d.bookings[token] = { id, token, email: body.email, name: body.club, guests: [], seats: body.seats, ref: body.ref, lang: 'en', fc27: [], block: true };
    save(d); return { ok: true };
  }
  if (action === 'offer') { const w = d.waitlist[body.index]; if (w) w.offered = Date.now(); save(d); return { ok: !!w }; }
  if (action === 'reset') { localStorage.removeItem(KEY); return { ok: true }; }
  return { error: 'not_found' };
}
