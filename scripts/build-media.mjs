// Builds responsive AVIF/WebP from media-src into public/media. Never upscales.
// Film stills are already graded (scripts/grade.sh). Real photos get the photo treatment: saturation 0.85.
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.join(root, 'public/media');
const WIDTHS = [640, 1080, 1600, 2400];
const manifest = {};
async function build(dir, opts = {}) {
  const src = path.join(root, 'media-src', dir);
  await fs.mkdir(path.join(out, dir), { recursive: true });
  for (const f of await fs.readdir(src)) {
    const name = f.replace(/\.[^.]+$/, '');
    const input = sharp(path.join(src, f)).rotate();
    const meta = await input.metadata();
    const w0 = meta.width;
    const widths = [...new Set(WIDTHS.filter(w => w < w0).concat([Math.min(w0, 2400)]))].sort((a, b) => a - b);
    const entry = { w: w0, h: meta.height, widths, base: `/media/${dir}/${name}` };
    for (const w of widths) {
      let p = sharp(path.join(src, f)).rotate().resize({ width: w, withoutEnlargement: true });
      if (opts.photo) p = p.modulate({ saturation: 0.85 });
      if (opts.logo) { await p.clone().png().toFile(path.join(out, dir, `${name}-${w}.png`)); }
      await p.clone().webp({ quality: opts.photo ? 74 : 72 }).toFile(path.join(out, dir, `${name}-${w}.webp`));
      if (!opts.logo) await p.clone().avif({ quality: 50, effort: 4 }).toFile(path.join(out, dir, `${name}-${w}.avif`));
    }
    const sm = await sharp(path.join(src, f)).rotate().resize({ width: 1080, withoutEnlargement: true });
    if (!opts.logo) await (opts.photo ? sm.modulate({ saturation: 0.85 }) : sm).jpeg({ quality: 78, mozjpeg: true }).toFile(path.join(out, dir, `${name}.jpg`));
    manifest[`${dir}/${name}`] = entry;
  }
}
await build('film');
await build('photos', { photo: true });
await build('partners', { logo: true });
await fs.writeFile(path.join(root, 'src/data/media.json'), JSON.stringify(manifest, null, 1));
console.log(Object.keys(manifest).length, 'media entries');
