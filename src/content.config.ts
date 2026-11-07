import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const md = (dir: string) => glob({ pattern: '**/*.md', base: `./src/content/${dir}` });

export const collections = {
  team: defineCollection({ loader: md('team'), schema: z.object({ name: z.string(), role: z.string(), photo: z.string(), order: z.number() }) }),
  speakers: defineCollection({ loader: md('speakers'), schema: z.object({ name: z.string(), line: z.string(), photo: z.string().optional(), chair: z.number().min(1).max(4), published: z.boolean(), order: z.number() }) }),
  events: defineCollection({ loader: md('events'), schema: z.object({ title: z.string(), kind: z.string(), date: z.coerce.date(), date_label: z.string(), place: z.string(), photo: z.string(), gallery: z.array(z.string()).default([]), facts: z.array(z.string()), summary: z.string(), order: z.number() }) }),
  news: defineCollection({ loader: md('news'), schema: z.object({ title: z.string(), date: z.coerce.date(), photo: z.string(), photo_is_ai: z.boolean().default(false), featured: z.boolean().default(false), excerpt: z.string() }) }),
  programmes: defineCollection({ loader: md('programmes'), schema: z.object({ title: z.string(), anchor: z.string(), what: z.string(), who: z.string(), proof: z.string(), photo: z.string(), cta: z.object({ label: z.string(), href: z.string() }), cta2: z.object({ label: z.string(), href: z.string() }).optional(), next: z.array(z.string()).optional(), order: z.number() }) }),
  partners: defineCollection({ loader: md('partners'), schema: z.object({ name: z.string(), logo: z.string(), type: z.string(), approved: z.boolean(), order: z.number() }) }),
};
