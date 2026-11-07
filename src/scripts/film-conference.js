// Conference film: the noise → into the mind → star path (wide → 1 → 2 → 3 → 4) → star becomes the spotlight
// → pull back over the hall → stay for the game (penalty on a screen in front of a teenager).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FrameFilm } from './film-frames.js';
gsap.registerPlugin(ScrollTrigger);

const root = document.querySelector('[data-film]');
const lite = document.documentElement.classList.contains('lite');
const cfg = window.DIALI_CONF;

// Arrival from the homepage door: the page fades in out of the gold bloom.
const arrival = document.querySelector('[data-arrival]');
let fromDoor = false;
try { fromDoor = sessionStorage.getItem('diali-door') === '1'; sessionStorage.removeItem('diali-door'); } catch {}
if (fromDoor && arrival) {
  arrival.classList.add('is-on');
  requestAnimationFrame(() => gsap.to(arrival, { opacity: 0, duration: lite ? 0.2 : 0.9, ease: 'power2.out', delay: 0.1, onComplete: () => arrival.remove() }));
}

if (!lite) init();

function init() {
  const $ = (s) => root.querySelector(s);
  const L = (n) => root.querySelector(`[data-layer="${n}"]`);
  const stage = root.querySelector('.stage');
  const mind = $('[data-mind]'), hall = $('[data-hall]'), screen = $('[data-hall-screen]'), fcwrap = $('[data-fcwrap]');
  const stars = [...root.querySelectorAll('[data-star]')];
  const chapters = [...root.querySelectorAll('[data-chapter]')];
  const mobile = () => matchMedia('(max-width: 760px)').matches;
  let isMobile = mobile(), tl, st, W, H;
  const MIND_AR = 1920 / 1072, HALL_AR = 1920 / 1072;
  const cam = { x: 0.42, y: 0.36, s: 1 };
  const hallK = { k: 1 };
  let mw, mh, rect;

  function measure() {
    W = stage.clientWidth; H = stage.clientHeight;
    mw = Math.max(W, H * MIND_AR); mh = mw / MIND_AR;
    mind.style.width = mw + 'px'; mind.style.height = mh + 'px';
    // Stage area of C5 (the screen at the front of the hall), as fractions of the image.
    const sc = Math.max(W / 1920, H / 1072); const iw = 1920 * sc, ih = 1072 * sc; const ox = (W - iw) / 2, oy = (H - ih) / 2;
    rect = { x: ox + 0.225 * iw, y: oy + 0.22 * ih, w: 0.275 * iw, h: 0.27 * ih };
    Object.assign(screen.style, { left: rect.x + 'px', top: rect.y + 'px', width: rect.w + 'px', height: rect.h + 'px' });
  }
  function render() {
    const S = cam.s;
    const tx = W / 2 - cam.x * mw * S, ty = H / 2 - cam.y * mh * S;
    mind.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${S})`;
    // Hall: k = 1 shows the whole hall; larger k zooms so the stage area fills the screen.
    const k = hallK.k;
    const cx = rect.x + rect.w / 2, cy = rect.y + rect.h / 2;
    hall.style.transformOrigin = `${cx}px ${cy}px`;
    hall.style.transform = `translate3d(${(W / 2 - cx) * ((k - 1) / (kFill() - 1 || 1))}px, ${(H / 2 - cy) * ((k - 1) / (kFill() - 1 || 1))}px, 0) scale(${k})`;
  }
  const kFill = () => Math.max(W / rect.w, H / rect.h);

  // Continuous take for the hall and the FC 27 bridge (5.3); the 5.2 stills stay as the fallback.
  const C = cfg.clip; const clipEl = root.querySelector('[data-clip]');
  const useClip = !!(C && clipEl);
  const seg = {}; const vt = { t: 0 }; let clip = null;
  if (useClip) {
    let t0 = 0; C.segments.forEach((x) => { seg[x.id] = { s: t0, d: x.d, e: t0 + x.d }; t0 += x.d; });
    clip = new FrameFilm({ canvas: clipEl, base: mobile() ? C.mobile : C.desktop, frames: C.frames, fps: C.fps, cols: C.cols, rows: C.rows, version: C.version, cacheSize: mobile() ? 6 : 8 });
  }

  function build() {
    tl?.kill(); st?.kill();
    measure();
    const B = isMobile
      ? { noise: 100, mind: 60, intro: 40, q: 50, spot: 45, voice: 90, pull: 45, hall: 80, fc: 90 }
      : { noise: 140, mind: 80, intro: 50, q: 70, spot: 60, voice: 120, pull: 60, hall: 100, fc: 120 };
    const order = [['noise', B.noise], ['mind', B.mind], ['intro', B.intro], ['q0', B.q], ['q1', B.q], ['q2', B.q], ['q3', B.q], ['spot', B.spot], ['voice', B.voice], ['pull', B.pull], ['hall', B.hall], ['fc27', B.fc]];
    const at = {}; let t = 0;
    order.forEach(([id, d]) => { at[id] = { s: t, d, e: t + d }; t += d; });
    root.style.setProperty('--film-h', `${t + 100}vh`);
    const dip = $('[data-dip]'), bloom = $('[data-bloom]');
    Object.assign(cam, { x: 0.42, y: 0.36, s: 1 });
    hallK.k = kFill();
    tl = gsap.timeline({ paused: true, defaults: { ease: 'none' }, onUpdate: () => { render(); if (clip) clip.set(vt.t); } });
    tl.set({}, {}, t);
    const chap = (id, s, d, a = 0.12, b = 0.82) => {
      const el = root.querySelector(`[data-chapter="${id}"]`); if (!el) return;
      if (id !== 'noise') tl.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: d * 0.15, ease: 'power2.out' }, s + d * a);
      if (b < 1) tl.to(el, { opacity: 0, y: -12, duration: d * 0.12, ease: 'power2.in' }, s + d * b);
    };
    // C1 the noise
    const N = at.noise;
    root.querySelectorAll('.doubt').forEach((el, i) => tl.fromTo(el, { opacity: 0, y: 10 }, { opacity: 0.95, y: 0, duration: N.d * 0.1 }, N.s + N.d * (0.18 + i * 0.1)));
    tl.to('[data-chapter="noise"]', { opacity: 0, y: -16, duration: N.d * 0.12, ease: 'power2.in' }, N.s + N.d * 0.62);
    tl.to('.doubt', { opacity: 0, duration: N.d * 0.08 }, N.s + N.d * 0.8);
    tl.fromTo(L('penalty'), { scale: 1, transformOrigin: isMobile ? '50% 42%' : '50% 45%' }, { scale: 2.4, duration: N.d * 0.3, ease: 'power2.in' }, N.s + N.d * 0.7);
    tl.to(dip, { opacity: 1, duration: N.d * 0.08 }, N.e - N.d * 0.08);
    // C2 into the mind
    const M = at.mind;
    tl.set(L('mind'), { opacity: 1 }, M.s); tl.set(L('penalty'), { opacity: 0 }, M.s + 0.01);
    tl.to(dip, { opacity: 0, duration: M.d * 0.12 }, M.s);
    tl.fromTo(cam, { s: 1.35 }, { s: 1, duration: M.d, ease: 'sine.out' }, M.s);
    chap('mind', M.s, M.d, 0.15, 0.85);
    chap('intro', at.intro.s, at.intro.d, 0.05, 0.85);
    // C3 one continuous star path: wide → 1 → 2 → 3 → 4, active star brighter; no pull-back at the end.
    const sStar = isMobile ? 3.4 : 3.0;
    cfg.questions.forEach((q, i) => {
      const Q = at['q' + i];
      tl.to(cam, { x: q.star[0], y: q.star[1], s: sStar, duration: Q.d * 0.35, ease: 'power2.inOut' }, Q.s);
      tl.to(stars[i], { '--op': 1, '--sc': 1.9, duration: Q.d * 0.25 }, Q.s + Q.d * 0.15);
      if (i < 3) tl.to(stars[i], { '--op': 0.35, '--sc': 1, duration: Q.d * 0.2 }, Q.e);
      chap('q' + i, Q.s, Q.d, 0.3, 0.86);
    });
    // C3 → C4 star → spotlight: star 4 swells to fill the screen with light gold, C4 revealed under it.
    const SP = at.spot;
    tl.to(stars[3], { '--sc': 60, '--op': 1, duration: SP.d * 0.5, ease: 'power2.in' }, SP.s);
    tl.to(bloom, { opacity: 1, duration: SP.d * 0.3, ease: 'power1.in' }, SP.s + SP.d * 0.3);
    tl.set(L('stage'), { opacity: 1 }, SP.s + SP.d * 0.62); tl.set(L('mind'), { opacity: 0 }, SP.s + SP.d * 0.63);
    tl.set(hallK, { k: kFill() }, SP.s + SP.d * 0.62);
    tl.to(bloom, { opacity: 0, duration: SP.d * 0.38, ease: 'power1.out' }, SP.s + SP.d * 0.62);
    if (useClip) {
      // C4 the doors open onto the hall, then a slow push toward the spotlit chair (the first voice).
      const VC = (from, to, start, dur, ease = 'none') => tl.fromTo(vt, { t: from }, { t: to, duration: dur, ease, immediateRender: false }, start);
      const eps = 0.03; const V = at.voice; const P = at.pull; const Hl = at.hall; const F = at.fc27;
      tl.set(L('cclip'), { opacity: 1 }, SP.s + SP.d * 0.62);
      VC(seg.enter.s, seg.enter.e - eps, SP.s + SP.d * 0.62, SP.d * 0.38 + V.d * 0.3, 'sine.inOut');
      VC(seg.push.s, seg.push.e - eps, V.s + V.d * 0.3, V.d * 0.7);
      chap('voice', V.s, V.d, 0.35, 0.88);
      // C5 back out up the aisle to the entrance, the doors close.
      VC(seg.back.s, seg.back.e - eps, P.s, P.d + Hl.d * 0.2, 'sine.inOut');
      chap('hall', Hl.s, Hl.d, 0.2, 0.7);
      VC(seg.close.s, seg.close.e - eps, Hl.s + Hl.d * 0.55, Hl.d * 0.45, 'power1.in');
      // C6 from the dark, pull back out of the number 20 to the penalty taker: then the game.
      VC(seg.twenty.s, seg.twenty.e - eps, F.s, F.d * 0.65, 'sine.inOut');
      chap('fc27', F.s, F.d, 0.55, 1);
    } else {
    // C4 voices: slow push-in on the stage
    const V = at.voice;
    tl.fromTo(hallK, { k: kFill() }, { k: kFill() * 1.06, duration: V.d }, V.s);
    chap('voice', V.s, V.d, 0.1, 0.86);
    // C4 → C5 pull back over the seats
    const P = at.pull;
    tl.to(hallK, { k: 1, duration: P.d + at.hall.d * 0.3, ease: 'power2.inOut' }, P.s);
    chap('hall', at.hall.s, at.hall.d, 0.25, 0.85);
    tl.to(dip, { opacity: 1, duration: at.hall.d * 0.08 }, at.hall.e - at.hall.d * 0.08);
    // C6 stay for the game: start framed on the screen, pull back to the teenager.
    const F = at.fc27;
    tl.set(L('fc27'), { opacity: 1 }, F.s); tl.set(L('stage'), { opacity: 0 }, F.s + 0.01);
    tl.to(dip, { opacity: 0, duration: F.d * 0.08 }, F.s);
    tl.fromTo(fcwrap, { scale: isMobile ? 1.5 : 1.86, transformOrigin: isMobile ? '50% 35%' : '47.7% 37.3%' }, { scale: 1, duration: F.d * 0.6, ease: 'power2.inOut' }, F.s);
    chap('fc27', F.s, F.d, 0.45, 1);
    } // end 5.2 path
    tl.call(() => root.querySelectorAll('img[loading=lazy]').forEach((i) => { i.loading = 'eager'; i.decode?.().catch(() => {}); }), null, M.s);

    st = ScrollTrigger.create({ trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.6, animation: tl, invalidateOnRefresh: true,
      onUpdate: (self) => { sync(); root.classList.toggle('is-done', self.progress > 0.995); } });
    render(); sync();
  }
  function sync() { chapters.forEach((c) => { const v = parseFloat(getComputedStyle(c).opacity) > 0.4; c.toggleAttribute('inert', !v); c.setAttribute('aria-hidden', v ? 'false' : 'true'); }); }
  build();
  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { const p = st?.progress || 0; isMobile = mobile(); build(); ScrollTrigger.refresh(); if (p) st.scroll(st.start + (st.end - st.start) * p); }, 150); }, { passive: true });
}
