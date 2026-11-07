// Form handling: inline validation, honeypot, idempotency key, honest success/failure states.
import { sendForm, isDemo } from './api.js';

const EMAIL = 'Dialivzw@outlook.com';
const params = new URLSearchParams(location.search);
const ref = params.get('ref') || sessionStorage.getItem('diali-ref') || '';
if (params.get('ref')) try { sessionStorage.setItem('diali-ref', params.get('ref')); } catch {}

function setErr(form, field, msg) {
  const el = form.elements[field]; if (!el) return;
  const err = document.getElementById(el.id + '-err');
  el.setAttribute('aria-invalid', msg ? 'true' : 'false');
  if (err) { err.textContent = msg || ''; el.setAttribute('aria-describedby', err.id); }
}
function validate(form) {
  let ok = true; const f = form.elements;
  const req = (n, m) => { if (f[n] && f[n].required && !String(f[n].value).trim()) { setErr(form, n, m); ok = false; } else setErr(form, n, ''); };
  req('name', 'Please tell us your name.');
  if (f.email) { const v = f.email.value.trim(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { setErr(form, 'email', 'Please enter a valid email address, like name@example.com.'); ok = false; } else setErr(form, 'email', ''); }
  if (f.organisation && f.organisation.required) req('organisation', 'Please tell us your club.');
  if (f.seats) { const n = Number(f.seats.value); if (!(n >= 1 && n <= 10)) { setErr(form, 'seats', 'Choose between 1 and 10 seats.'); ok = false; } else setErr(form, 'seats', ''); }
  req('message', 'Please write your question.');
  return ok;
}
document.querySelectorAll('form[data-form]').forEach((form) => {
  const status = form.querySelector('[data-status]');
  const btn = form.querySelector('button[type=submit]');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!validate(form)) { form.querySelector('[aria-invalid=true]')?.focus(); return; }
    if (form.elements.website?.value) return; // honeypot
    btn.disabled = true; btn.textContent = 'Sending…'; status.hidden = true;
    const data = Object.fromEntries(new FormData(form));
    delete data.website;
    const body = { ...data, form: form.dataset.form, source: form.dataset.source, ref, lang: document.documentElement.lang, idem: crypto.randomUUID?.() || String(Math.random()), turnstile: form.querySelector('[name="cf-turnstile-response"]')?.value || '' };
    const res = await sendForm(body);
    btn.disabled = false; btn.textContent = 'Send';
    status.hidden = false;
    if (res.ok) {
      status.className = 'form-status';
      status.innerHTML = isDemo()
        ? '<strong>Preview only: nothing was sent.</strong> On the live site this message goes to DIALI and you get a reply by email.'
        : '<strong>Thanks, we got your message.</strong> We\'ll reply within <span class="tbc">To confirm</span> working days.';
      [...form.elements].forEach((el) => { if (el.name && el.type !== 'hidden' && el.tagName !== 'SELECT') el.value = ''; });
    } else {
      status.className = 'form-status form-status--error';
      status.innerHTML = `Something went wrong. Email us at <a href="mailto:${EMAIL}">${EMAIL}</a>.`;
    }
    status.focus?.();
  });
});
// Preselect partnership type from a card link (?type=Grant or #form-grant)
const t = params.get('type');
if (t) document.querySelectorAll('[data-type-select]').forEach((s) => { [...s.options].forEach((o) => { if (o.text.toLowerCase().startsWith(t.toLowerCase())) s.value = o.text; }); });
