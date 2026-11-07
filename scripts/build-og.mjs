// 1200×630 Open Graph images from the graded stills with a text overlay (run: node scripts/build-og.mjs).
import sharp from 'sharp';
import fs from 'node:fs/promises';
const root = new URL('..', import.meta.url).pathname;
const items = [
  ['default', 'film/home_01_tunnel_desktop', 'Seen. Ready. Chosen.', 'DIALI vzw · Youth sport in Gent'],
  ['home', 'film/home_01_tunnel_desktop', 'Seen. Ready. Chosen.', 'The Mind Behind the Game · Sun 20 Dec 2026 · Gentbrugge'],
  ['conference', 'film/conf_01_penalty_desktop', 'The Mind Behind the Game', 'Sun 20 Dec 2026 · De Felix, Gentbrugge · Registration only · limited seats'],
  ['seats', 'film/conf_05_venue_cinema_hall', 'Choose your seat', 'The Mind Behind the Game · Sun 20 Dec 2026 · Gentbrugge'],
  ['fc27', 'film/conf_06_fc27_reveal_desktop', 'FC 27 tournament', '16 players · knockout · Sun 20 Dec 2026 · Gentbrugge'],
];
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
await fs.mkdir(root + 'public/og', { recursive: true });
const logo = await sharp(root + 'public/logo/diali-mark-white.png').resize({ width: 90 }).png().toBuffer();
for (const [name, src, title, sub] of items) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0.35" stop-color="#050a1a" stop-opacity="0"/><stop offset="1" stop-color="#050a1a" stop-opacity="0.92"/></linearGradient></defs>
    <rect width="1200" height="630" fill="url(#g)"/>
    <text x="64" y="500" font-family="Cormorant Garamond, Georgia, serif" font-size="76" fill="#ffffff">${esc(title)}</text>
    <text x="64" y="560" font-family="Inter, Arial, sans-serif" font-size="28" fill="#f2d98a">${esc(sub)}</text>
  </svg>`;
  await sharp(root + `media-src/${src}.png`).resize(1200, 630, { fit: 'cover' })
    .composite([{ input: Buffer.from(svg) }, { input: logo, top: 48, left: 64 }])
    .jpeg({ quality: 82, mozjpeg: true }).toFile(root + `public/og/${name}.jpg`);
}
console.log('og done');
