// Site chrome: header glass/solid state, mobile menu, sticky action bar, view-transition hint.
import { getState, stateLabel } from './api.js';

const header = document.querySelector('[data-header]');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- Header: glass over the film, solid after it ----
function filmEl() { return document.querySelector('[data-film]') || document.querySelector('[data-hero]'); }
function updateHeader() {
  if (!header) return;
  const menuOpen = document.documentElement.classList.contains('menu-open');
  const f = filmEl();
  let solid = true;
  if (f && !menuOpen) solid = f.getBoundingClientRect().bottom <= header.getBoundingClientRect().bottom;
  if (reduce) header.style.transition = 'none';
  header.classList.toggle('is-solid', solid);
}
let ticking = false;
const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; updateHeader(); updateBar(); }); } };
addEventListener('scroll', onScroll, { passive: true });
addEventListener('resize', onScroll, { passive: true });
addEventListener('orientationchange', onScroll);
addEventListener('load', onScroll);
updateHeader();

// ---- Mobile menu: focus trap, Esc, return focus, scroll lock ----
const menu = document.querySelector('[data-menu]');
const openBtn = document.querySelector('[data-menu-open]');
let lastFocus = null;
function focusables() { return [...menu.querySelectorAll('a[href], button:not([disabled])')]; }
function openMenu() {
  lastFocus = document.activeElement;
  menu.hidden = false; menu.classList.add('is-open');
  document.documentElement.classList.add('menu-open');
  document.body.style.overflow = 'hidden';
  openBtn.setAttribute('aria-expanded', 'true');
  focusables()[1]?.focus();
  updateHeader();
}
function closeMenu() {
  menu.classList.remove('is-open'); menu.hidden = true;
  document.documentElement.classList.remove('menu-open');
  document.body.style.overflow = '';
  openBtn.setAttribute('aria-expanded', 'false');
  (lastFocus || openBtn).focus?.();
  updateHeader();
}
openBtn?.addEventListener('click', openMenu);
menu?.querySelector('[data-menu-close]')?.addEventListener('click', closeMenu);
menu?.addEventListener('click', (e) => { if (e.target.closest('nav a')) closeMenu(); });
document.addEventListener('keydown', (e) => {
  if (!menu?.classList.contains('is-open')) return;
  if (e.key === 'Escape') { e.preventDefault(); closeMenu(); }
  if (e.key === 'Tab') {
    const f = focusables(); const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
matchMedia('(min-width: 1101px)').addEventListener('change', (m) => { if (m.matches && menu?.classList.contains('is-open')) closeMenu(); });

// ---- Sticky mobile action bar ----
const bar = document.querySelector('[data-action-bar]');
const blockers = new Set();
if (bar) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => (en.isIntersecting ? blockers.add(en.target) : blockers.delete(en.target)));
    updateBar();
  }, { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('[data-hide-bar], form, [data-film]').forEach((el) => io.observe(el));
  const refresh = async () => {
    const s = await getState();
    const l = stateLabel(s);
    if (window.DIALI?.mode === 'past') return;
    bar.querySelector('[data-action-text]').textContent = l.text;
    bar.querySelector('[data-action-link]').href = l.href;
  };
  refresh();
  setInterval(() => { if (!document.hidden) refresh(); }, 30000);
}
function updateBar() {
  if (!bar) return;
  const show = blockers.size === 0 && scrollY > 120;
  bar.classList.toggle('is-visible', show);
  bar.toggleAttribute('inert', !show);
}
updateBar();

// ---- Lite-mode detection for video loops ----
if (document.documentElement.classList.contains('lite')) {
  document.querySelectorAll('video[autoplay]').forEach((v) => { v.removeAttribute('autoplay'); v.pause?.(); });
}
