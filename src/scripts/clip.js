// Scroll-scrubbed video for the continuous film take.
// One seek in flight at a time: while the browser decodes, newer targets just replace the pending one,
// so fast scrolling never builds a backlog. Works forward and in reverse (rewinds out of a tunnel).
export class Clip {
  constructor(video, src) {
    this.v = video; this.target = 0; this.busy = false; this.ready = false;
    video.muted = true; video.playsInline = true; video.preload = 'auto';
    video.src = src;
    video.addEventListener('seeked', () => { this.busy = false; this.flush(); });
    video.addEventListener('loadeddata', () => { this.ready = true; this.flush(); }, { once: true });
    // iOS Safari only paints seeked frames after the video has played once.
    const unlock = () => { const p = video.play(); if (p) p.then(() => video.pause()).catch(() => {}); };
    addEventListener('touchstart', unlock, { once: true, passive: true });
    addEventListener('scroll', unlock, { once: true, passive: true });
  }
  set(t) { this.target = Math.max(0, t); this.flush(); }
  flush() {
    const v = this.v;
    if (this.busy || !this.ready) return;
    if (Math.abs(v.currentTime - this.target) < 1 / 48) return;
    this.busy = true;
    v.currentTime = this.target;
  }
  destroy() { this.v.removeAttribute('src'); this.v.load(); }
}
