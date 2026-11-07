// Frame-sequence loader for scrubbed canvas films.
// Bounded concurrency, LRU of decoded ImageBitmaps (closed on eviction), abort on fast jumps,
// directional prefetch, limited retries with backoff, DPR capped at 2, cover-fit drawing.
export class FrameSequence {
  constructor({ base, count, version, pad = 4, ext = 'webp', concurrency = 6, cacheSize, canvas, focusX = 0.5 }) {
    this.base = base; this.count = count; this.version = version; this.pad = pad; this.ext = ext;
    this.max = concurrency; this.cacheSize = cacheSize || (matchMedia('(max-width: 760px)').matches ? 60 : 120);
    this.canvas = canvas; this.ctx = canvas.getContext('2d', { alpha: false });
    this.cache = new Map();      // index -> ImageBitmap (Map keeps insertion order = LRU)
    this.pending = new Map();    // index -> AbortController
    this.queue = [];
    this.current = 0; this.dir = 1; this.focusX = focusX; this.scale = 1;
    this.drawn = -1; this.destroyed = false;
    this.resize = this.resize.bind(this);
    addEventListener('resize', this.resize, { passive: true });
    addEventListener('orientationchange', this.resize);
    this.resize();
  }
  url(i) { return `${this.base}/frame-${String(i).padStart(this.pad, '0')}.${this.ext}?v=${this.version}`; }
  resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const r = this.canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
    if (this.canvas.width !== w || this.canvas.height !== h) { this.canvas.width = w; this.canvas.height = h; this.drawn = -1; this.draw(this.current); }
  }
  touch(i, bmp) {
    this.cache.delete(i); this.cache.set(i, bmp);
    while (this.cache.size > this.cacheSize) {
      const [k, old] = this.cache.entries().next().value;
      if (Math.abs(k - this.current) < 4) { this.cache.delete(k); this.cache.set(k, old); break; }
      this.cache.delete(k); old.close?.();
    }
  }
  async fetchFrame(i, attempt = 0) {
    if (this.cache.has(i) || this.pending.has(i) || this.destroyed) return;
    const ac = new AbortController();
    this.pending.set(i, ac);
    try {
      const res = await fetch(this.url(i), { signal: ac.signal });
      if (!res.ok) throw new Error('http ' + res.status);
      const blob = await res.blob();
      const bmp = await createImageBitmap(blob);
      if (this.destroyed) { bmp.close?.(); return; }
      this.touch(i, bmp);
      if (i === this.current) this.draw(i);
    } catch (e) {
      if (e.name !== 'AbortError' && attempt < 2) setTimeout(() => { this.pending.delete(i); this.fetchFrame(i, attempt + 1); }, 400 * 2 ** attempt);
    } finally {
      if (this.pending.get(i) === ac) this.pending.delete(i);
      this.pump();
    }
  }
  pump() {
    while (this.pending.size < this.max && this.queue.length) this.fetchFrame(this.queue.shift());
  }
  plan(i) {
    // The frame needed now first, then neighbours in the scroll direction.
    const want = [i];
    for (let k = 1; k <= 14; k++) { want.push(i + k * this.dir); if (k <= 4) want.push(i - k * this.dir); }
    const valid = want.filter((n) => n >= 0 && n < this.count && !this.cache.has(n));
    // Abort requests that are now far away (fast jumps).
    for (const [n, ac] of this.pending) if (Math.abs(n - i) > 24) { ac.abort(); this.pending.delete(n); }
    this.queue = valid.filter((n) => !this.pending.has(n));
    this.pump();
  }
  set(index) {
    const i = Math.max(0, Math.min(this.count - 1, Math.round(index)));
    if (i !== this.current) this.dir = i > this.current ? 1 : -1;
    this.current = i;
    this.plan(i);
    this.draw(i);
  }
  nearest(i) {
    if (this.cache.has(i)) return i;
    for (let k = 1; k < 12; k++) { if (this.cache.has(i - k * this.dir)) return i - k * this.dir; if (this.cache.has(i + k * this.dir)) return i + k * this.dir; }
    return -1;
  }
  draw(i) {
    const n = this.nearest(i);
    if (n < 0) return false;
    if (n === this.drawn && !this.dirtyScale) return true;
    const bmp = this.cache.get(n);
    const cw = this.canvas.width, ch = this.canvas.height;
    const s = Math.max(cw / bmp.width, ch / bmp.height) * this.scale;
    const dw = bmp.width * s, dh = bmp.height * s;
    const dx = (cw - dw) * this.focusX, dy = (ch - dh) / 2;
    this.ctx.fillStyle = '#050a1a'; this.ctx.fillRect(0, 0, cw, ch);
    this.ctx.drawImage(bmp, dx, dy, dw, dh);
    this.drawn = n; this.dirtyScale = false;
    return true;
  }
  setScale(s) { if (s !== this.scale) { this.scale = s; this.dirtyScale = true; this.draw(this.current); } }
  ready(i = 0) { return this.cache.has(i); }
  async preload(i = 0) { this.plan(i); return new Promise((res) => { const t = setInterval(() => { if (this.cache.has(i) || this.destroyed) { clearInterval(t); res(); } }, 50); setTimeout(() => { clearInterval(t); res(); }, 8000); }); }
  destroy() {
    this.destroyed = true;
    for (const ac of this.pending.values()) ac.abort();
    for (const b of this.cache.values()) b.close?.();
    this.cache.clear(); this.pending.clear();
    removeEventListener('resize', this.resize); removeEventListener('orientationchange', this.resize);
  }
}
