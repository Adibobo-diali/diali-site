// PREVIEW ONLY: turns dist/ into preview-dist/, a self-contained copy that works from any sub-path
// (e.g. a private claude.ai preview link): root-absolute URLs become relative to a per-page <base>,
// page links point at index.html files, and AVIF variants are dropped to keep the file count low.
import fs from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const src = path.join(root, 'dist'), out = path.join(root, 'preview-dist');
await fs.rm(out, { recursive: true, force: true });
await fs.cp(src, out, { recursive: true });
// Preview hosts reserve names starting with "_": serve Astro's bundle folder as assets/.
await fs.rename(path.join(out, '_astro'), path.join(out, 'assets'));

const walk = async (d) => (await Promise.all((await fs.readdir(d, { withFileTypes: true })).map((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)])))).flat();
let files = await walk(out);
// Drop AVIF and unused JPG fallbacks, and the API-only / server files.
for (const f of files) if (/\.avif$/.test(f) || /\/media\/.*\.jpg$/.test(f) || /_redirects$|_headers$/.test(f)) await fs.rm(f);
// The 5.3 film plays from one video; the 5.2 canvas frames are not used, so they stay out of the preview.
await fs.rm(path.join(out, 'frames'), { recursive: true, force: true });
// Preview only: modern browsers use woff2, the copy is Latin only, and the host refuses .ics files.
for (const f of await walk(out)) if (/\.woff$/.test(f) || /(cyrillic|greek|vietnamese)[^/]*\.woff2$/.test(f) || /\.ics$/.test(f)) await fs.rm(f);
files = await walk(out);
const pageDirs = new Set(files.filter((f) => f.endsWith('index.html')).map((f) => path.relative(out, path.dirname(f)).replace(/\\/g, '/')));
const assetRoots = ['media/', 'frames/', 'film/', 'video/', 'logo/', 'brand/', 'og/', 'styleguide/before', 'assets/', 'favicon.ico', 'the-mind-behind-the-game.ics', 'api/'];

function fixUrl(u) {
  // u starts with "/" (no protocol-relative)
  if (u.startsWith('//')) return u;
  let p = u.slice(1);
  if (p.startsWith('api/')) return '/' + p; // keep absolute: fails → in-browser demo
  if (assetRoots.some((a) => p.startsWith(a))) return p;
  const m = p.match(/^([^?#]*)([?#].*)?$/);
  let pathPart = (m[1] || '').replace(/\/$/, ''), rest = m[2] || '';
  if (pathPart === '') return 'index.html' + rest;
  if (pageDirs.has(pathPart)) return pathPart + '/index.html' + rest;
  if (pathPart === '404') return '404.html';
  return p;
}
const ATTR = /((?:href|src|poster|content|action|data-src-desktop|data-src-mobile)=")(\/[^"]*)"/g;
const SRCSET = /(srcset=")([^"]*)"/g;
const JSSTR = /(["'`])(\/(?:media|frames|film|video|logo|brand|og|seats|fc27|events|news|clubs|contact|privacy|our-programs|become-a-sponsor|the-mind-behind-the-game|admin|styleguide)[^"'`\s]*)\1/g;
const JSTPL = /`\/(seats\/(?:confirmed|manage))\?/g;
const CSSURL = /url\((\/[^)]+)\)/g;

for (const f of files) {
  if (!/\.(html|js|css|json)$/.test(f)) continue;
  let s = (await fs.readFile(f, 'utf8')).replace(/_astro\//g, 'assets/');
  if (f.endsWith('.html')) {
    s = s.replace(/<source type="image\/avif"[^>]*>/g, '');
    s = s.replace(ATTR, (_, a, u) => a + fixUrl(u) + '"');
    s = s.replace(SRCSET, (_, a, v) => a + v.split(',').map((x) => { const t = x.trim(); return t.startsWith('/') ? fixUrl(t.split(' ')[0]) + (t.includes(' ') ? ' ' + t.split(' ').slice(1).join(' ') : '') : t; }).join(', ') + '"');
    const rel = path.relative(out, path.dirname(f)).replace(/\\/g, '/');
    const depth = rel ? rel.split('/').length : 0;
    const base = depth ? '../'.repeat(depth) : './';
    const self = rel ? rel + '/index.html' : (path.basename(f) === 'index.html' ? 'index.html' : path.basename(f));
    s = s.replace(/href="#([^"]*)"/g, (_, h) => `href="${self}#${h}"`);
    s = s.replace('<head>', `<head><base href="${base}">`);
  }
  s = s.replace(JSTPL, (_, p) => '`' + p + '/index.html?');
  s = s.replace(JSSTR, (_, q, u) => q + fixUrl(u) + q);
  s = f.endsWith('.css') ? s.replace(/url\(\/assets\//g, 'url(./') : s.replace(CSSURL, (_, u) => `url(${fixUrl(u)})`);
  await fs.writeFile(f, s);
}
// Video base paths are concatenated with extensions at runtime: keep them relative.
const all = await walk(out);
console.log('preview files:', all.length);
