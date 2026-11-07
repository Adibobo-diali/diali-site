// Build-time access to the YAML content files, with validation: a bad value fails the build.
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { z } from 'astro/zod';
import media from '../data/media.json';

const read = (f: string) => YAML.parse(fs.readFileSync(path.join(process.cwd(), 'src/content', f), 'utf8'));

const Wave = z.object({ n: z.number(), opens: z.coerce.date(), rows: z.string(), last_row: z.string() });
const QA = z.object({ q: z.string(), a: z.string() });
export const event = z.object({
  title: z.string(), line: z.string(), summary: z.string(), mode: z.enum(['upcoming', 'past']),
  start: z.coerce.date(), end: z.coerce.date(), doors: z.string(), date_label: z.string(), date_chip: z.string(), programme_label: z.string(),
  venue: z.object({ name: z.string(), street: z.string(), postcode: z.string(), city: z.string(), maps: z.string().url() }),
  language: z.string(), public_seats: z.number(), max_per_booking: z.number(), max_per_email: z.number(), waitlist_only_from: z.coerce.date(),
  waves: z.array(Wave).min(1), seat_rows: z.array(z.string()), seats_per_row: z.number(), reserved_rows: z.array(z.string()),
  api_url: z.string(), fallback_text: z.string(), waitlist_text: z.string(), audience: z.string(),
  questions: z.array(z.object({ title: z.string(), text: z.string(), star: z.tuple([z.number(), z.number()]) })).length(4),
  doubt_words: z.array(z.string()), faq: z.array(QA),
}).parse(read('event.yaml'));
export const fc27 = z.object({
  title: z.string(), sub: z.string(), waitlist_form: z.string().url(), places: z.number(), format: z.string(), show_count_from: z.number(),
  prize_text: z.string(), prize_partner_confirmed: z.boolean(), no_guarantee: z.string(), share_text: z.string(), why: z.string(), format_details: z.array(z.string()), schedule: z.array(z.object({ time: z.string(), what: z.string() })), faq: z.array(QA),
}).parse(read('fc27.yaml'));
export const home = read('home.yaml');
export const film = read('film.yaml');

export const PREVIEW = (import.meta.env.PUBLIC_PREVIEW ?? '1') === '1';
export const EMAIL = 'Dialivzw@outlook.com';
export const LEGAL = 'Registered in Aalst · Reg. no. 1013473618 · VAT BE1013473618';

type M = { w: number; h: number; widths: number[]; base: string };
const M = media as Record<string, M>;
export function img(key: string, sizes = '100vw') {
  const m = M[key];
  if (!m) throw new Error(`Unknown media key: ${key}`);
  const set = (ext: string) => m.widths.map(w => `${m.base}-${w}.${ext} ${w}w`).join(', ');
  const mid = m.widths.find(w => w >= 1080) ?? m.widths[m.widths.length - 1];
  return { avif: set('avif'), webp: set('webp'), src: `${m.base}-${mid}.webp`, w: m.w, h: m.h, sizes, jpg: `${m.base}.jpg`, base: m.base, widths: m.widths };
}
export const isTBC = (s?: string) => !s || /TO CONFIRM/i.test(s);
