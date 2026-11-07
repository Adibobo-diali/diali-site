// Homepage film (free version 5.2): breathing loop → walk-out canvas sequence → hub with four tunnels
// (dive, photo, back + spin) → the door → spin back → team → rise and ending.
// Native scroll drives one GSAP timeline (scrub 0.6). No scroll hijacking.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FrameSequence } from './frames.js';
import { Clip } from './clip.js';
import { countdown } from './api.js';
gsap.registerPlugin(ScrollTrigger);

const cfg = window.DIALI_FILM;
const root = document.querySelector('[data-film]');
const lite = document.documentElement.classList.contains('lite');
const $ = (s) => root.querySelector(s);
const $$ = (s) => [...root.querySelectorAll(s)];

// ---------- things that work in every mode ----------
const modal = document.querySelector('[data-team-modal]');
document.querySelector('[data-team-open]')?.addEventListener('click', () => modal.showModal());
document.querySelector('[data-team-close]')?.addEventListener('click', () => modal.close());
modal?.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });

const cd = root.querySelector('[data-countdown]');
if (cd) { const t = () => (cd.querySelector('strong').textContent = countdown(cd.dataset.countdown)); t(); setInterval(t, 30000); }

function track(name) {
  try { navigator.sendBeacon?.('/api/track', JSON.stringify({ e: name, p: location.pathname, t: Date.now() })); } catch {}
}
document.querySelectorAll('[data-cta]').forEach((a) => a.addEventListener('click', () => track('cta_' + a.dataset.cta)));

// The door: a real link; the swing + gold bloom play before navigating.
const doorLink = root.querySelector('[data-door-link]');
doorLink?.addEventListener('click', (e) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
  e.preventDefault();
  track('door_enter');
  const href = doorLink.getAttribute('href');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  try { sessionStorage.setItem('diali-door', '1'); } catch {}
  document.documentElement.classList.add('vt-gold');
  const bloom = $('[data-bloom]');
  if (reduce || lite) { gsap.to(bloom, { opacity: 1, duration: 0.2, onComplete: () => (location.href = href) }); return; }
  $('[data-door]').classList.add('is-open');
  gsap.to(bloom, { opacity: 1, duration: 0.7, ease: 'power2.in', delay: 0.15, onComplete: () => (location.href = href) });
});

// Fill in the deferred stage images on the first scroll, or once the page is idle.
let filled = false;
const fill = () => {
  if (filled) return; filled = true;
  document.querySelectorAll('[data-deferred]').forEach((pic) => {
    pic.querySelectorAll('source[data-srcset]').forEach((s) => { s.srcset = s.dataset.srcset; });
    const im = pic.querySelector('img[data-src]'); if (im) im.src = im.dataset.src;
  });
};
addEventListener('scroll', fill, { once: true, passive: true });
addEventListener('load', () => setTimeout(() => (window.requestIdleCallback || setTimeout)(fill), 2500), { once: true });
if (lite) fill();

if (!lite) init();
else {
  const end = root.querySelector('.layer--ending img');
  if (end) root.querySelector('.chapter--ending')?.style.setProperty('--ending-bg', `url(${end.currentSrc || end.src})`);
}

function init() {
  const mobile = () => matchMedia('(max-width: 760px)').matches;
  let isMobile = mobile();

  // Loop video: choose the frame set for this viewport before anything is requested.
  const video = $('[data-loop]');
  function setVideo() {
    const base = isMobile ? video.dataset.srcMobile : video.dataset.srcDesktop;
    // Reuse the image the <picture> already chose, so the poster is never fetched twice.
    const pic = $('.layer--breathe .poster img');
    if (pic?.currentSrc) video.poster = pic.currentSrc;
    video.innerHTML = `<source src="${base}.webm" type="video/webm"><source src="${base}.mp4" type="video/mp4">`;
    video.load(); video.play?.().catch(() => {});
  }
  setVideo();


  // Continuous take (5.3): one scroll-scrubbed video. Falls back to the 5.2 stills + canvas when absent.
  const C = cfg.clip; const clipEl = $('[data-clip]');
  const useClip = !!(C && clipEl);
  const seg = {};
  if (useClip) { let t = 0; C.segments.forEach((x) => { seg[x.id] = { s: t, d: x.d, e: t + x.d }; t += x.d; }); }
  const vt = { t: 0 };
  let clip = null;
  function makeClip() {
    if (!useClip) return;
    clip?.destroy();
    clipEl.poster = isMobile ? C.poster_mobile : C.poster_desktop;
    clip = new Clip(clipEl, `${isMobile ? C.mobile : C.desktop}?v=${C.version}`);
  }
  makeClip();

  // Canvas sequence
  const canvas = $('[data-canvas]');
  let seq = null;
  function makeSeq() {
    if (useClip) return;
    seq?.destroy();
    const f = cfg.frames;
    seq = new FrameSequence({ base: isMobile ? f.mobile : f.desktop, count: f.count, version: f.version, canvas });
    seq.plan(0);
  }
  makeSeq();

  // Hub camera
  const stage = root.querySelector('.stage');
  const hub = $('[data-hub]');
  const T = cfg.tunnels;
  const cam = { x: 0.5, y: 0.53, s: 1 };
  let W = 0, H = 0, hw = 0, hh = 0;
  function measure() {
    W = stage.clientWidth; H = stage.clientHeight;
    hw = Math.max(W, H * cfg.hubAspect); hh = hw / cfg.hubAspect;
    hub.style.width = hw + 'px'; hub.style.height = hh + 'px';
  }
  function camT() {
    const S = cam.s;
    let tx = W / 2 - cam.x * hw * S, ty = H / 2 - cam.y * hh * S;
    tx = Math.min(0, Math.max(W - hw * S, tx)); ty = Math.min(0, Math.max(H - hh * S, ty));
    return { tx, ty, S };
  }
  function mouthRect(k) {
    if (useClip) return { x: W * 0.44, y: H * 0.36, w: W * 0.12, h: H * 0.3 }; // the opening doors, centre frame
    const { tx, ty, S } = camT(); const t = T[k];
    return { x: tx + (t.x - t.w / 2) * hw * S, y: ty + (t.y - t.h / 2) * hh * S, w: t.w * hw * S, h: t.h * hh * S };
  }
  const panels = {};
  $$('[data-photo]').forEach((el) => (panels[el.dataset.photo] = { el, p: 0, o: 0, push: 1 }));
  const door = { el: $('[data-door]'), p: 0, o: 0 };
  function targetRect(kind) {
    if (kind === 'door') { const w = isMobile ? W * 0.62 : Math.min(W * 0.3, H * 0.4); const h = w * 1.55; return { x: (W - w) / 2, y: (H - h) / 2 - H * 0.04, w, h }; }
    const w = isMobile ? W * 0.9 : W * 0.6; const h = Math.min(w / 1.6, H * 0.62); return { x: isMobile ? (W - w) / 2 : W * 0.36, y: isMobile ? H * 0.16 : (H - h) / 2, w, h };
  }
  const lerp = (a, b, t) => a + (b - a) * t;
  function placePanel(el, k, p, kind) {
    const a = mouthRect(k), b = targetRect(kind);
    const r = { x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p), w: lerp(a.w, b.w, p), h: lerp(a.h, b.h, p) };
    el.style.transform = `translate3d(${r.x}px, ${r.y}px, 0)`;
    el.style.width = r.w + 'px'; el.style.height = r.h + 'px';
  }
  function render() {
    if (clip) clip.set(vt.t);
    const { tx, ty, S } = camT();
    hub.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${S})`;
    for (const [k, pn] of Object.entries(panels)) {
      pn.el.style.opacity = pn.o;
      if (pn.o > 0) { placePanel(pn.el, k, pn.p, 'photo'); pn.el.style.setProperty('--push', pn.push); pn.el.style.setProperty('--glow-b', lerp(2.2, 1, Math.min(1, pn.p * 1.4))); }
    }
    door.el.style.opacity = door.o;
    if (door.o > 0) placePanel(door.el, 'conferences', door.p, 'door');
  }

  // ---------- the timeline ----------
  let tl, st;
  const chapters = $$('[data-chapter]');
  function build() {
    tl?.kill(); st?.kill();
    measure();
    const beats = cfg.beats.map((b) => ({ ...b, d: isMobile ? b.vhMobile : b.vh }));
    let t = 0; const at = {};
    beats.forEach((b) => { at[b.id] = { s: t, d: b.d, e: t + b.d }; t += b.d; });
    const total = t;
    root.style.setProperty('--film-h', `${total + 100}vh`);
    const sDive = isMobile ? 4.2 : 5.2, sSpin = 1.3;
    const order = ['workshop', 'tournaments', 'scouting', 'conferences'];

    Object.assign(cam, { x: 0.5, y: 0.53, s: 1.5 });
    Object.values(panels).forEach((p) => Object.assign(p, { p: 0, o: 0, push: 1 }));
    Object.assign(door, { p: 0, o: 0 }); door.el.classList.remove('is-open');

    tl = gsap.timeline({ paused: true, defaults: { ease: 'none' }, onUpdate: render });
    const L = (n) => root.querySelector(`[data-layer="${n}"]`);
    const dip = $('[data-dip]'), bloom = $('[data-bloom]');
    tl.set({}, {}, total); // make the timeline exactly `total` long

    // Chapters: in (0.6 s feel), hold, out before the handover.
    const chap = (id, s, d, inAt = 0.12, outAt = 0.82) => {
      const el = root.querySelector(`[data-chapter="${id}"]`); if (!el) return;
      if (id !== 'breathe') { tl.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: d * 0.12, ease: 'power2.out' }, s + d * inAt); }
      if (outAt < 1) tl.to(el, { opacity: 0, y: -12, duration: d * 0.1, ease: 'power2.in' }, s + d * outAt);
    };

    // 1 Breathe: the exit light grows.
    const B = at.breathe;
    tl.fromTo(L('breathe'), { '--breathe-b': 0.72 }, { '--breathe-b': 1, duration: B.d }, B.s);
    tl.fromTo($('[data-exit-glow]'), { opacity: 0 }, { opacity: 0.85, duration: B.d }, B.s);
    tl.to('[data-chapter="breathe"]', { opacity: 0, y: -16, duration: B.d * 0.25, ease: 'power2.in' }, B.s + B.d * 0.68);

    if (useClip) {
      hub.style.visibility = 'hidden'; // the video carries the stadium; the hub layer only hosts the photo panels
      const V = (from, to, start, dur, ease = 'none') => tl.fromTo(vt, { t: from }, { t: to, duration: dur, ease, immediateRender: false }, start);
      const eps = 0.03;
      // 2 Run-out: from the breathing loop's first frame, fly down the tunnel and out onto the pitch.
      const R = at.runout;
      tl.set(L('runout'), { opacity: 1 }, R.s); tl.set(L('breathe'), { opacity: 0 }, R.s + 0.01);
      V(0, seg.tunnel.e - eps, R.s, R.d);
      // 3 Hub: glide over the centre circle to face the four tunnels.
      const Hb = at.hub;
      tl.set(L('hub'), { opacity: 1 }, Hb.s);
      V(seg.hub.s, seg.hub.e - eps, Hb.s, Hb.d * 0.8, 'sine.inOut');
      chap('hub', Hb.s, Hb.d, 0.15, 0.85);
      // 4-7 Each tunnel: dive in, the doors open, the photo comes through; then rewind back out to the hub.
      order.forEach((k, idx) => {
        const A = at[k]; const D = seg[k]; const O = seg[k + 'O'];
        const end = (O || D).e - eps;
        V(D.s, end, A.s, A.d * 0.55, 'power1.inOut');
        if (k === 'conferences') {
          chap(k, A.s, A.d, 0.5, 0.92);
        } else {
          const pn = panels[k];
          tl.fromTo(pn, { p: 0, o: 0 }, { p: 1, o: 1, duration: A.d * 0.3, ease: 'power2.out' }, A.s + A.d * 0.5);
          tl.to(pn, { push: 1.08, duration: A.d * 0.2 }, A.s + A.d * 0.8);
          chap(k, A.s, A.d, 0.55, 0.92);
        }
        const S = at[idx < 3 ? `spin${idx + 1}` : 'spinback'];
        if (k !== 'conferences') tl.to(panels[k], { o: 0, p: 0.4, duration: S.d * 0.25, ease: 'power1.in' }, S.s);
        V(end, D.s, S.s + S.d * 0.1, S.d * 0.8, 'power1.inOut');
      });
      const SB = at.spinback;
      chap('spinback', SB.s, SB.d, 0.1, 0.7);
      tl.to(dip, { opacity: 1, duration: SB.d * 0.15, ease: 'power1.in' }, SB.e - SB.d * 0.15);
      // 9 Team: the walk-out, one by one, names landing in title order.
      const Tm = at.team;
      tl.to(dip, { opacity: 0, duration: Tm.d * 0.06 }, Tm.s);
      V(seg.team.s, seg.team.e - eps, Tm.s, Tm.d * 0.92);
      chap('team', Tm.s, Tm.d, 0.12, 0.86);
      $$('[data-chapter="team"] .team-names li').forEach((li, i) => {
        tl.fromTo(li, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: Tm.d * 0.06, ease: 'power2.out' }, Tm.s + Tm.d * (0.16 + i * 0.16));
      });
      tl.to(dip, { opacity: 1, duration: Tm.d * 0.06, ease: 'power1.in' }, Tm.e - Tm.d * 0.06);
      // 10 Rise out of the stadium into the night; the sharp still takes over for the last chapter.
      const E = at.ending;
      tl.to(dip, { opacity: 0, duration: E.d * 0.08 }, E.s);
      tl.set(L('hub'), { opacity: 0 }, E.s);
      V(seg.ending.s, seg.ending.e - eps, E.s, E.d * 0.7, 'sine.out');
      tl.fromTo(L('ending'), { opacity: 0 }, { opacity: 1, duration: E.d * 0.08, immediateRender: false }, E.s + E.d * 0.68);
      chap('ending', E.s, E.d, 0.3, 1);
    } else {
    // 2 Run-out: identical-frame cut into the canvas sequence, then a push-in toward the centre.
    const R = at.runout; const fr = { i: 0 };
    tl.set(L('runout'), { opacity: 1 }, R.s);
    tl.set(L('breathe'), { opacity: 0 }, R.s + 0.01);
    tl.to(fr, { i: cfg.frames.count - 1, duration: R.d * 0.8, onUpdate: () => seq.set(fr.i) }, R.s);
    const push = { s: 1 };
    tl.to(push, { s: 1.14, duration: R.d * 0.2, ease: 'sine.in', onUpdate: () => seq.setScale(push.s) }, R.s + R.d * 0.8);
    tl.to(bloom, { opacity: 1, duration: R.d * 0.1, ease: 'power1.in' }, R.s + R.d * 0.9);

    // 3 Hub: bloom with 10% overlap, enters slightly zoomed, eases back a little.
    const Hb = at.hub;
    tl.set(L('hub'), { opacity: 1 }, Hb.s); tl.set(L('runout'), { opacity: 0 }, Hb.s + 0.01);
    tl.to(bloom, { opacity: 0, duration: Hb.d * 0.14, ease: 'power1.out' }, Hb.s);
    if (isMobile) {
      tl.fromTo(cam, { x: T.conferences.x, s: 1.15 }, { x: T.workshop.x, s: 1, duration: Hb.d, ease: 'sine.inOut' }, Hb.s);
    } else {
      tl.fromTo(cam, { x: 0.5, y: 0.53, s: 1.5 }, { s: 1, duration: Hb.d * 0.7, ease: 'sine.out' }, Hb.s);
    }
    chap('hub', Hb.s, Hb.d, 0.15, 0.85);

    // 4–7 Tunnels: dive, photo or door at the end, back up and spin on the spot.
    order.forEach((k, idx) => {
      const A = at[k]; const t0 = T[k];
      tl.to(cam, { x: t0.x, y: t0.y, s: sDive, duration: A.d * 0.4, ease: 'power2.inOut' }, A.s);
      if (k === 'conferences') {
        tl.fromTo(door, { p: 0, o: 0 }, { p: 1, o: 1, duration: A.d * 0.3, ease: 'power2.out' }, A.s + A.d * 0.2);
        chap(k, A.s, A.d, 0.35, 0.88);
      } else {
        const pn = panels[k];
        tl.fromTo(pn, { p: 0, o: 0 }, { p: 1, o: 1, duration: A.d * 0.32, ease: 'power2.out' }, A.s + A.d * 0.22);
        tl.to(pn, { push: 1.08, duration: A.d * 0.46 }, A.s + A.d * 0.54);
        chap(k, A.s, A.d, 0.4, 0.86);
      }
      const spinId = idx < 3 ? `spin${idx + 1}` : 'spinback';
      const S = at[spinId];
      if (k !== 'conferences') {
        tl.to(panels[k], { o: 0, p: 0.4, duration: S.d * 0.3, ease: 'power1.in' }, S.s);
        const next = T[order[idx + 1]];
        tl.to(cam, { x: t0.x, y: 0.53, s: sSpin, duration: S.d * 0.4, ease: 'power2.out' }, S.s);
        tl.to(cam, { x: next.x, duration: S.d * 0.6, ease: 'sine.inOut' }, S.s + S.d * 0.4);
      }
    });

    // 8 Spin back past all four lit tunnels, then an ink dip.
    const SB = at.spinback;
    tl.to(door, { o: 0, p: 0.3, duration: SB.d * 0.2 }, SB.s);
    tl.to(cam, { s: 1.15, y: 0.53, duration: SB.d * 0.25, ease: 'power2.out' }, SB.s);
    tl.to(cam, { x: T.workshop.x, duration: SB.d * 0.55, ease: 'power1.inOut' }, SB.s + SB.d * 0.2);
    tl.call(() => $$('.mouth').forEach((m) => m.classList.toggle('is-lit', tl.time() >= SB.s && tl.time() < SB.e)), null, SB.s);
    chap('spinback', SB.s, SB.d, 0.1, 0.7);
    tl.to(dip, { opacity: 1, duration: SB.d * 0.2, ease: 'power1.in' }, SB.e - SB.d * 0.2);

    // 9 Team: from the ink, a slow push-in.
    const Tm = at.team;
    tl.set(L('team'), { opacity: 1 }, Tm.s); tl.set(L('hub'), { opacity: 0 }, Tm.s + 0.01);
    tl.to(dip, { opacity: 0, duration: Tm.d * 0.08 }, Tm.s);
    tl.fromTo(L('team'), { scale: 1 }, { scale: 1.12, duration: Tm.d, ease: 'none' }, Tm.s);
    chap('team', Tm.s, Tm.d, 0.12, 0.86);
    // Walk-out order follows the titles: Founder, Co-founder, Head of Football, Head of Marketing & Events.
    // Each name lands after "their" step, one per scroll stretch (per-person footage slots in here later).
    $$('[data-chapter="team"] .team-names li').forEach((li, i) => {
      tl.fromTo(li, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: Tm.d * 0.06, ease: 'power2.out' }, Tm.s + Tm.d * (0.16 + i * 0.16));
    });
    tl.to(dip, { opacity: 1, duration: Tm.d * 0.08, ease: 'power1.in' }, Tm.e - Tm.d * 0.08);

    // 10 Rise and ending: slow upward drift and zoom-out, the last chapter holds.
    const E = at.ending;
    tl.set(L('ending'), { opacity: 1 }, E.s); tl.set(L('team'), { opacity: 0 }, E.s + 0.01);
    tl.to(dip, { opacity: 0, duration: E.d * 0.08 }, E.s);
    tl.fromTo(L('ending'), { scale: 1.28, yPercent: -6 }, { scale: 1, yPercent: 0, duration: E.d * 0.75, ease: 'sine.out' }, E.s);
    chap('ending', E.s, E.d, 0.3, 1);

    } // end 5.2 path

    // Preload and decode the next layers ahead of time.
    tl.call(() => seq?.plan(0), null, B.s + B.d * 0.5);
    tl.call(() => root.querySelectorAll('[data-layer="hub"] img, [data-photo] img').forEach((i) => i.decode?.().catch(() => {})), null, at.runout.s + at.runout.d * 0.5);
    tl.call(() => root.querySelectorAll('[data-layer="team"] img, [data-layer="ending"] img').forEach((i) => { i.loading = 'eager'; i.decode?.().catch(() => {}); }), null, at.scouting.s);

    st = ScrollTrigger.create({
      trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.6, animation: tl,
      onUpdate: (self) => { syncInert(); root.classList.toggle('is-done', self.progress > 0.995); },
      invalidateOnRefresh: true,
    });
    render(); syncInert();
  }
  function syncInert() {
    chapters.forEach((c) => { const vis = parseFloat(getComputedStyle(c).opacity) > 0.4; c.toggleAttribute('inert', !vis); c.setAttribute('aria-hidden', vis ? 'false' : 'true'); });
  }
  build();

  // Keep the first frame ready before the cut; the poster stays visible meanwhile.
  seq?.preload(0);

  let rt;
  addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => {
      const m = mobile();
      if (m !== isMobile) { isMobile = m; setVideo(); makeSeq(); makeClip(); }
      const p = st?.progress || 0; build(); ScrollTrigger.refresh(); measure(); render();
      if (p) st.scroll(st.start + (st.end - st.start) * p);
    }, 150);
  }, { passive: true });
}
