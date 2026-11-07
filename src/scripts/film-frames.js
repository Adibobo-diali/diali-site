// Scroll-scrubbed film drawn on a canvas from frame atlases (several frames tiled in one WebP).
// Smoother than seeking a <video>: any frame is ready as soon as its atlas is decoded,
// forward and in reverse, and the scroll position between two frames is drawn as a cross-fade.
// Atlases load ahead in the scroll direction; a small LRU of decoded bitmaps bounds memory.
export class FrameFilm {
  constructor({ canvas, base, frames, fps, cols, rows, version, ext = 'webp', cacheSize = 8, concurrency = 3, focusX = 0.5 }) {
    Object.assign(this, { canvas, base, frames, fps, cols, rows, version, ext, cacheSize, max: concurrency, focusX });
    this.per = cols * rows; this.atlases = Math.ceil(frames / this.per);
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.cache = new Map(); this.pending = new Map(); this.queue = [];
    this.f = 0; this.dir = 1; this.drawnKey = ''; this.destroyed = false;
    this.resize = this.resize.bind(this);
    addEventListener('resize', this.resize, { passive: true });
    this.resize();
    this.plan(0);
  }
  url(a) { return `${this.base}/atlas-${String(a).padStart(3, '0')}.${this.ext}?v=${this.version}`; }
  resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2); const r = this.canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) { this.canvas.width = w; this.canvas.height = h; this.drawnKey = ''; this.draw(); }
  }
  keep(a, bmp) {
    this.cache.delete(a); this.cache.set(a, bmp);
    const cur = Math.floor(this.f / this.per);
    for (const [k, old] of this.cache) {
      if (this.cache.size <= this.cacheSize) break;
      if (Math.abs(k - cur) <= 1) continue; // never drop the atlas on screen or its neighbours
      this.cache.delete(k); old.close?.();
    }
  }
  async load(a, attempt = 0) {
    if (this.cache.has(a) || this.pending.has(a) || this.destroyed) return;
    const ac = new AbortController(); this.pending.set(a, ac);
    try {
      const res = await fetch(this.url(a), { signal: ac.signal });
      if (!res.ok) throw new Error('http ' + res.status);
      const bmp = await createImageBitmap(await res.blob());
      if (this.destroyed) { bmp.close?.(); return; }
      this.keep(a, bmp); this.drawnKey = ''; this.draw();
    } catch (e) {
      if (e.name !== 'AbortError' && attempt < 2) setTimeout(() => { this.pending.delete(a); this.load(a, attempt + 1); }, 500 * 2 ** attempt);
    } finally {
      if (this.pending.get(a) === ac) this.pending.delete(a);
      this.pump();
    }
  }
  pump() { while (this.pending.size < this.max && this.queue.length) this.load(this.queue.shift()); }
  plan(f) {
    const a = Math.floor(f / this.per); const want = [a];
    for (let k = 1; k < this.cacheSize - 1; k++) { want.push(a + k * this.dir); if (k <= 1) want.push(a - k * this.dir); }
    for (const [n, ac] of this.pending) if (Math.abs(n - a) > this.cacheSize) { ac.abort(); this.pending.delete(n); }
    this.queue = want.filter((n) => n >= 0 && n < this.atlases && !this.cache.has(n) && !this.pending.has(n));
    this.pump();
  }
  set(t) {
    const f = Math.max(0, Math.min(this.frames - 1, t * this.fps));
    if (Math.abs(f - this.f) > 0.001) this.dir = f > this.f ? 1 : -1;
    const moved = Math.floor(f / this.per) !== Math.floor(this.f / this.per);
    this.f = f;
    if (moved || !this.cache.has(Math.floor(f / this.per))) this.plan(f);
    this.draw();
  }
  // Nearest loaded frame to i, searching back along the travel direction first.
  have(i) {
    for (let k = 0; k < this.per * 3; k++) {
      for (const n of [i - k * this.dir, i + k * this.dir]) if (n >= 0 && n < this.frames && this.cache.has(Math.floor(n / this.per))) return n;
    }
    return -1;
  }
  blit(i, alpha) {
    const bmp = this.cache.get(Math.floor(i / this.per)); const j = i % this.per;
    const fw = bmp.width / this.cols, fh = bmp.height / this.rows;
    const sx = (j % this.cols) * fw, sy = Math.floor(j / this.cols) * fh;
    const cw = this.canvas.width, ch = this.canvas.height;
    const s = Math.max(cw / fw, ch / fh); const dw = fw * s, dh = fh * s;
    this.ctx.globalAlpha = alpha;
    this.ctx.drawImage(bmp, sx, sy, fw, fh, (cw - dw) * this.focusX, (ch - dh) / 2, dw, dh);
  }
  draw() {
    const i0 = Math.floor(this.f); const frac = this.f - i0;
    const a = this.have(i0); if (a < 0) return;
    const b = a === i0 && frac > 0.02 && i0 + 1 < this.frames && this.cache.has(Math.floor((i0 + 1) / this.per)) ? i0 + 1 : -1;
    const key = `${a}|${b}|${b < 0 ? 0 : frac.toFixed(2)}|${this.canvas.width}`;
    if (key === this.drawnKey) return;
    this.drawnKey = key;
    this.blit(a, 1);
    if (b >= 0) this.blit(b, frac);
    this.ctx.globalAlpha = 1;
  }
  destroy() {
    this.destroyed = true;
    for (const ac of this.pending.values()) ac.abort();
    for (const b of this.cache.values()) b.close?.();
    this.cache.clear(); this.pending.clear();
    removeEventListener('resize', this.resize);
  }
}
