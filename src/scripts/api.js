// Client for the DIALI booking API (/api/*, Cloudflare Pages Functions → Apps Script + Sheet).
// In a preview build without a backend, it falls back to a clearly labelled in-browser demo.
import * as demo from './demo-api.js';

const cfg = () => window.DIALI || {};
let useDemo = null;

async function call(method, path, body) {
  if (useDemo) return demo.handle(method, path, body);
  try {
    const res = await fetch(path, {
      method, headers: body ? { 'content-type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout ? AbortSignal.timeout(25000) : undefined,
    });
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) throw new Error('no-api');
    const data = await res.json();
    useDemo = false;
    if (!res.ok && !data.error) data.error = 'server';
    return data;
  } catch (e) {
    if (cfg().demo && (e.message === 'no-api' || e.name === 'TypeError')) {
      useDemo = true;
      return demo.handle(method, path, body);
    }
    return { error: e.name === 'TimeoutError' ? 'timeout' : 'network' };
  }
}
export const isDemo = () => useDemo === true;

// State is cached for 5 s across the page (and the sticky bar).
let cache = null, cacheAt = 0, inflight = null;
export async function getState(force = false) {
  if (!force && cache && Date.now() - cacheAt < 5000) return cache;
  if (inflight) return inflight;
  inflight = call('GET', cfg().api || '/api/state').then((s) => {
    inflight = null;
    if (s && !s.error) { cache = s; cacheAt = Date.now(); }
    return s;
  });
  return inflight;
}
export const book = (b) => call('POST', '/api/book', b);
export const joinWaitlist = (b) => call('POST', '/api/waitlist', b);
export const notifyWave = (b) => call('POST', '/api/notify', b);
export const sendForm = (b) => call('POST', '/api/form', b);
export const getBooking = (token) => call('GET', `/api/manage?token=${encodeURIComponent(token)}`);
export const release = (b) => call('POST', '/api/manage', b);
export const reconfirm = (token) => call('POST', '/api/manage', { token, reconfirm: true });
export const fc27State = () => call('GET', '/api/fc27');
export const admin = (action, b) => call('POST', `/api/admin/${action}`, b);

export function countdown(to) {
  let ms = new Date(to) - Date.now();
  if (ms <= 0) return 'now';
  const d = Math.floor(ms / 864e5); ms -= d * 864e5;
  const h = Math.floor(ms / 36e5); ms -= h * 36e5;
  const m = Math.floor(ms / 6e4);
  return d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// One label used by the sticky bar and wave bars.
export function stateLabel(s) {
  const c = cfg();
  if (!s || s.error) return { text: c.fallback || 'Limited seats', href: '/seats' };
  if (s.over) return { text: 'Thank you for coming', href: '/the-mind-behind-the-game' };
  if (s.waitlistOnly || s.allFull) return { text: c.waitlist || 'Join the waitlist', href: '/seats#waitlist' };
  if (s.currentWave && s.seatsLeft > 0) return { text: `Wave ${s.currentWave} · ${s.seatsLeft} seats left`, href: '/seats' };
  if (s.nextWaveAt) return { text: `Wave ${s.nextWave} opens in ${countdown(s.nextWaveAt)}`, href: '/seats' };
  return { text: c.fallback || 'Limited seats', href: '/seats' };
}
