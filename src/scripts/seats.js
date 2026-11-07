// One-step seat booking: wave bar, seat map (desktop grid, mobile row strips), best available,
// list alternative, details, FC 27 ticks, consent, atomic confirm, every state designed.
import { getState, book, joinWaitlist, notifyWave, countdown, isDemo } from './api.js';
import { t as tr } from './i18n-booking.js';

const C = window.DIALI_BOOK;
const MAX = C.maxPer || 4;
const q = (s, r = document) => r.querySelector(s);
const qa = (s, r = document) => [...r.querySelectorAll(s)];
const params = new URLSearchParams(location.search);
const ref = params.get('ref') || sessionStorage.getItem('diali-ref') || '';
let lang = (params.get('lang') || localStorage.getItem('diali-lang') || (navigator.language || 'en').slice(0, 2)).toLowerCase();
if (!['en', 'nl', 'fr'].includes(lang)) lang = 'en';
const t = (k, v) => tr(lang, k, v);

let state = null;
const selected = [];   // seat ids in pick order, e.g. 'D7'
const mobile = () => matchMedia('(max-width: 760px)').matches;
let openRow = null;

// ---------- language ----------
const langSel = q('[data-lang]');
langSel.value = lang;
langSel.addEventListener('change', () => { lang = langSel.value; try { localStorage.setItem('diali-lang', lang); } catch {} document.documentElement.lang = lang; applyI18n(); render(); });
function applyI18n() { qa('[data-i]').forEach((el) => (el.textContent = t(el.dataset.i))); }
document.documentElement.lang = lang;
applyI18n();

// ---------- state ----------
async function load(force) {
  state = await getState(force);
  if (isDemo()) { const n = q('[data-demo-note]'); n.hidden = false; n.textContent = t('demo'); }
  render();
}
function seatStatus(id) {
  const row = id[0];
  if (!state.openRows.includes(row)) return 'closed';
  if (state.taken.includes(id)) return 'taken';
  return 'free';
}

// ---------- rendering ----------
function render() {
  const s = state;
  const status = q('[data-wave-status]');
  qa('[data-wave]').forEach((li) => { const open = new Date(li.dataset.opens) <= new Date(); li.classList.toggle('is-open', open); li.classList.toggle('is-current', s && Number(li.dataset.wave) === s.currentWave); });
  if (!s || s.error) return showState('error');
  if (s.over) return showState('over');
  if (s.waitlistOnly) return showState('waitlistOnly');
  if (s.allFull) return showState('allFull');
  if (!s.currentWave) { status.textContent = t('waveNotOpen', { n: s.nextWave, t: countdown(s.nextWaveAt) }); return showState('notOpen'); }
  if (s.seatsLeft === 0 && s.nextWave) { status.textContent = t('waveFull', { n: s.currentWave, m: s.nextWave, t: countdown(s.nextWaveAt) }); showState('waveFull', true); }
  else { status.textContent = `Wave ${s.currentWave} of 3 · ${s.seatsLeft} ${t('seats')} ${t('available')}`; q('[data-state-panel]').hidden = true; }
  q('[data-booking]').hidden = false;
  renderMap(); renderSelection(); renderList();
}
function showState(kind, keepMap) {
  const p = q('[data-state-panel]'), text = q('[data-state-text]'), btn = q('[data-state-btn]'), form = q('[data-state-form]');
  p.hidden = false; q('[data-booking]').hidden = !keepMap;
  form.hidden = false; q('[data-howmany]').hidden = false; form.dataset.kind = kind;
  const s = state || {};
  if (kind === 'error') { text.innerHTML = `${t('errNet')} <button class="btn btn--outline btn--small" type="button" data-reload>${t('retry')}</button> ${t('errMail')} <a href="mailto:${C.email}">${C.email}</a>.`; form.hidden = true; q('[data-reload]').onclick = () => load(true); q('[data-wave-status]').textContent = window.DIALI?.fallback || 'Limited seats'; return; }
  if (kind === 'over') { text.textContent = t('over'); form.hidden = true; q('[data-wave-status]').textContent = ''; return; }
  if (kind === 'notOpen') { text.textContent = t('waveNotOpen', { n: s.nextWave, t: countdown(s.nextWaveAt) }); btn.textContent = t('notify'); q('[data-howmany]').hidden = true; return; }
  if (kind === 'waveFull') { text.textContent = t('waveFull', { n: s.currentWave, m: s.nextWave, t: countdown(s.nextWaveAt) }); btn.textContent = t('notify'); q('[data-howmany]').hidden = true; return; }
  text.textContent = t(kind === 'allFull' ? 'allFull' : 'waitlistOnly'); btn.textContent = t('join');
  p.id = 'waitlist';
}
q('[data-state-form]').addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.currentTarget, email = f.email.value.trim(), st = q('[data-state-status]');
  const err = q('#st-email-err');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { err.textContent = t('errEmail'); f.email.setAttribute('aria-invalid', 'true'); f.email.focus(); return; }
  err.textContent = ''; f.email.removeAttribute('aria-invalid');
  const body = { email, seats: Number(f.n.value), lang, ref, kind: f.dataset.kind };
  const res = f.dataset.kind === 'notOpen' || f.dataset.kind === 'waveFull' ? await notifyWave(body) : await joinWaitlist(body);
  st.hidden = false;
  st.textContent = res.ok ? (isDemo() ? t('demo') : t('sent')) : `${t('errNet')} ${t('errMail')} ${C.email}`;
  st.className = res.ok ? 'form-status' : 'form-status form-status--error';
});

function seatButton(id, n) {
  const st = seatStatus(id);
  const sel = selected.includes(id);
  const b = document.createElement('button');
  b.type = 'button'; b.className = `seat seat--${sel ? 'sel' : st}`; b.dataset.seat = id;
  b.textContent = n;
  b.setAttribute('aria-pressed', sel ? 'true' : 'false');
  b.setAttribute('aria-label', `${t('row')} ${id[0]}, ${t('seat')} ${n}, ${sel ? t('selected') : t(st === 'free' ? 'available' : st)}`);
  if (st !== 'free' && !sel) b.disabled = true;
  return b;
}
function renderMap() {
  const host = q('[data-rows]'); host.innerHTML = '';
  const per = state.perRow;
  // Row A: reserved for guests, never selectable.
  const a = document.createElement('div'); a.className = 'row-line row-line--reserved';
  a.innerHTML = `<span class="row-name">A</span><span class="reserved-band">${t('reserved')}</span>`;
  host.appendChild(a);
  state.rows.forEach((r) => {
    const line = document.createElement('div'); line.className = 'row-line';
    const free = Array.from({ length: per }, (_, i) => `${r}${i + 1}`).filter((id) => seatStatus(id) === 'free').length;
    const closed = !state.openRows.includes(r);
    if (mobile()) {
      const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'row-toggle';
      btn.setAttribute('aria-expanded', openRow === r ? 'true' : 'false');
      const selN = selected.filter((s) => s[0] === r).length;
      btn.innerHTML = `<span class="row-name">${r}</span><span>${closed ? t('closed') : `${free} ${t('available')}`}${selN ? ` · ${selN} ${t('selected').toLowerCase()}` : ''}</span><span aria-hidden="true">${openRow === r ? '–' : '+'}</span>`;
      btn.disabled = closed && !selN;
      btn.onclick = () => { openRow = openRow === r ? null : r; renderMap(); q(`[data-strip="${r}"] .seat:not([disabled])`)?.focus(); };
      line.appendChild(btn);
      if (openRow === r) {
        const strip = document.createElement('div'); strip.className = 'strip'; strip.dataset.strip = r;
        for (let i = 1; i <= per; i++) strip.appendChild(seatButton(`${r}${i}`, i));
        line.appendChild(strip);
      }
    } else {
      const name = document.createElement('span'); name.className = 'row-name'; name.textContent = r; line.appendChild(name);
      const seats = document.createElement('div'); seats.className = 'seats-line';
      for (let i = 1; i <= per; i++) { seats.appendChild(seatButton(`${r}${i}`, i)); if (i === per / 2) { const g = document.createElement('span'); g.className = 'aisle'; seats.appendChild(g); } }
      line.appendChild(seats);
      const name2 = name.cloneNode(true); line.appendChild(name2);
    }
    host.appendChild(line);
  });
}
q('[data-rows]').addEventListener('click', (e) => {
  const b = e.target.closest('[data-seat]'); if (!b || b.disabled) return;
  toggle(b.dataset.seat);
  q(`[data-seat="${b.dataset.seat}"]`)?.focus();
});
// Arrow keys move across the grid.
q('[data-rows]').addEventListener('keydown', (e) => {
  const b = e.target.closest('[data-seat]'); if (!b) return;
  const id = b.dataset.seat, r = id[0], n = Number(id.slice(1)), rows = state.rows;
  let next = null;
  if (e.key === 'ArrowRight') next = `${r}${n + 1}`;
  if (e.key === 'ArrowLeft') next = `${r}${n - 1}`;
  if (e.key === 'ArrowDown') next = `${rows[rows.indexOf(r) + 1] || r}${n}`;
  if (e.key === 'ArrowUp') next = `${rows[rows.indexOf(r) - 1] || r}${n}`;
  const el = next && q(`[data-seat="${next}"]`);
  if (el) { e.preventDefault(); el.focus(); }
});
function toggle(id) {
  const i = selected.indexOf(id);
  if (i >= 0) selected.splice(i, 1);
  else { if (selected.length >= MAX) selected.shift(); selected.push(id); }
  q('[data-seats-err]').textContent = '';
  renderMap(); renderSelection(); renderList();
}
// Best available ×N: the frontmost open row with N adjacent free seats, closest to the centre.
qa('[data-best]').forEach((b) => b.addEventListener('click', () => {
  const n = Number(b.dataset.best), per = state.perRow, mid = (per + 1) / 2;
  let best = null;
  for (const r of state.openRows) {
    for (let s = 1; s + n - 1 <= per; s++) {
      const ids = Array.from({ length: n }, (_, k) => `${r}${s + k}`);
      if (n > 1 && s <= per / 2 && s + n - 1 > per / 2) continue; // don't split across the aisle
      if (ids.every((id) => seatStatus(id) === 'free')) {
        const d = Math.abs(s + (n - 1) / 2 - mid);
        if (!best || d < best.d) best = { ids, d };
      }
    }
    if (best) break;
  }
  if (!best) { const free = state.openRows.flatMap((r) => Array.from({ length: per }, (_, i) => `${r}${i + 1}`)).filter((id) => seatStatus(id) === 'free'); best = { ids: free.slice(0, n) }; }
  selected.splice(0, selected.length, ...best.ids);
  if (mobile()) openRow = best.ids[0]?.[0] || null;
  renderMap(); renderSelection(); renderList();
}));
function renderList() {
  const sel = q('[data-list-seat]'); if (!sel) return;
  sel.innerHTML = state.openRows.flatMap((r) => Array.from({ length: state.perRow }, (_, i) => `${r}${i + 1}`))
    .filter((id) => seatStatus(id) === 'free' && !selected.includes(id))
    .map((id) => `<option value="${id}">${t('row')} ${id[0]}, ${t('seat')} ${id.slice(1)}</option>`).join('');
}
q('[data-list-add]').addEventListener('click', () => { const v = q('[data-list-seat]').value; if (v) toggle(v); });

// Selection panel, guest names and FC 27 ticks (one per name).
const guestsHost = q('[data-guests]');
const kept = { names: {}, fc: {}, u16: {} };
function fcBlock(i) {
  return `<label class="check fc-check"><input type="checkbox" data-fc="${i}" ${kept.fc[i] ? 'checked' : ''}/><span>${t('fcPlay')}</span></label>
    <div class="fc-more" ${kept.fc[i] ? '' : 'hidden'} data-fc-more="${i}">
      <label class="check"><input type="checkbox" data-u16="${i}" ${kept.u16[i] ? 'checked' : ''}/><span>${t('fcU16')}</span></label>
      <p class="small muted" style="margin:0">${t('fcNote')}</p>
    </div>`;
}
function renderSelection() {
  const list = q('[data-sel-list]');
  list.innerHTML = selected.length ? selected.map((id) => `<li><span>${t('row')} ${id[0]}, ${t('seat')} ${id.slice(1)}</span><button type="button" class="linkish" data-unsel="${id}">${t('remove')}</button></li>`).join('') : `<li class="muted">${t('none')}</li>`;
  qa('[data-unsel]').forEach((b) => (b.onclick = () => toggle(b.dataset.unsel)));
  // keep typed names
  qa('[data-guest]').forEach((inp) => (kept.names[inp.dataset.guest] = inp.value));
  guestsHost.innerHTML = selected.slice(1).map((id, k) => `
    <div class="field">
      <label for="g-${k + 1}">${t('guest')} ${id[0]}${id.slice(1)}</label>
      <input class="input" id="g-${k + 1}" data-guest="${k + 1}" autocomplete="off" value="${(kept.names[k + 1] || '').replace(/"/g, '&quot;')}" required />
      <p class="error" id="g-${k + 1}-err"></p>
      ${fcBlock(k + 1)}
    </div>`).join('');
  q('[data-fc-for="0"]').innerHTML = fcBlock(0);
  qa('[data-fc]').forEach((c) => (c.onchange = () => { kept.fc[c.dataset.fc] = c.checked; q(`[data-fc-more="${c.dataset.fc}"]`).hidden = !c.checked; }));
  qa('[data-u16]').forEach((c) => (c.onchange = () => (kept.u16[c.dataset.u16] = c.checked)));
  q('[data-confirm]').textContent = selected.length ? `${t('confirm')} (${selected.length})` : t('confirm');
}

// ---------- confirm ----------
function err(el, msg) { const e = q('#' + el.id + '-err'); el.setAttribute('aria-invalid', msg ? 'true' : 'false'); if (e) { e.textContent = msg || ''; if (msg) el.setAttribute('aria-describedby', e.id); } }
const form = q('[data-details]');
let idem = crypto.randomUUID?.() || String(Math.random());
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const boxErr = q('[data-book-error]'); boxErr.hidden = true;
  if (form.website.value) return;
  let ok = true, first = null;
  const mark = (el, m) => { err(el, m); if (m) { ok = false; first = first || el; } };
  if (!selected.length) { q('[data-seats-err]').textContent = t('errSeats'); ok = false; first = first || q('[data-rows] button'); }
  mark(form.email, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.value.trim()) ? '' : t('errEmail'));
  mark(form.name, form.name.value.trim() ? '' : t('errName'));
  qa('[data-guest]').forEach((g) => mark(g, g.value.trim() ? '' : t('errGuest')));
  const consentErr = q('#b-consent-err'); consentErr.textContent = form.consent.checked ? '' : t('errConsent'); if (!form.consent.checked) { ok = false; first = first || form.consent; }
  if (!ok) { first?.focus(); return; }

  const names = [form.name.value.trim(), ...qa('[data-guest]').map((g) => g.value.trim().split(/\s+/)[0])];
  const fc27 = names.map((n, i) => (kept.fc[i] ? { name: n, under16: !!kept.u16[i] } : null)).filter(Boolean);
  const btn = q('[data-confirm]'); btn.disabled = true; btn.textContent = t('holding');
  const res = await book({
    seats: selected.slice(), email: form.email.value.trim(), name: names[0], guests: names.slice(1), fc27,
    consent: true, newsletter: form.newsletter.checked, lang, ref, idem,
    turnstile: q('[name="cf-turnstile-response"]')?.value || '',
  });
  btn.disabled = false; renderSelection();
  if (res.ok) {
    try { sessionStorage.setItem('diali-last-booking', JSON.stringify(res.booking)); } catch {}
    location.href = `/seats/confirmed?token=${encodeURIComponent(res.booking.token)}&lang=${lang}`;
    return;
  }
  boxErr.hidden = false;
  if (res.error === 'taken') {
    const gone = res.taken || [];
    gone.forEach((id) => { const i = selected.indexOf(id); if (i >= 0) selected.splice(i, 1); });
    state = await getState(true);
    render();
    gone.forEach((id) => { const el = q(`[data-seat="${id}"]`); el?.classList.add('flash'); });
    boxErr.textContent = t('errTaken', { seats: gone.join(', ') });
    idem = crypto.randomUUID?.() || String(Math.random());
  } else if (res.error === 'cap') boxErr.textContent = t('errCap', { n: res.already });
  else if (res.error === 'closed') boxErr.textContent = t('errClosed');
  else if (res.error === 'waitlist_only' || res.error === 'over') { await load(true); }
  else if (res.error === 'timeout') boxErr.innerHTML = `${t('errTimeout')} ${t('errMail')} <a href="mailto:${C.email}">${C.email}</a>.`;
  else boxErr.innerHTML = `${t('errNet')} <button type="submit" class="btn btn--outline btn--small">${t('retry')}</button> ${t('errMail')} <a href="mailto:${C.email}">${C.email}</a>.`;
  boxErr.focus?.();
});

let lastMobile = mobile();
addEventListener('resize', () => { if (mobile() !== lastMobile) { lastMobile = mobile(); if (state && !state.error) renderMap(); } }, { passive: true });
load();
setInterval(async () => { if (document.hidden || form.contains(document.activeElement)) return; const s = await getState(true); if (s && !s.error) { state = s; selected.splice(0, selected.length, ...selected.filter((id) => seatStatus(id) === 'free' || !s.taken.includes(id))); render(); } }, 20000);
