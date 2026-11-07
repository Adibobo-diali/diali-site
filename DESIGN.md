# DIALI design system

A dark, cinematic sports documentary: a stadium at night, the quiet before the walk-out. The live style tile is `/styleguide`.

## Colour
| Token | Value | Use |
|---|---|---|
| ink | #050a1a | Page background, film dips |
| navy | #0b1530 | Panels, bands |
| gold | #d9b45a | Actions, eyebrows |
| light gold | #f2d98a | Focus ring, highlights |
| ivory | #fff4d8 | Warm text over photos |
| white / muted | #fff / 72% | Body / secondary text |

## Type
- Football first, premium finish (Adnan, 2026-11-07): display, H1–H3 and big numbers in Big Shoulders Display 700/800
  (H1/H2/display uppercase, condensed like kit lettering). Cormorant Garamond italic 500 is kept for the human voice:
  quotes, the doubt words, the breathing word, testimonials (28 px and up).
- Everything else: Inter 400/500/600, 16 px body, line height 1.6.
- Eyebrows: Inter caps, 0.18em tracking, gold.

## Imagery
- Film stills graded: black point #050a1a, highlights toward #f2d98a, greens −25% (`scripts/grade.sh`).
- Real photos: saturation 0.85, navy gradient over the bottom 40%, shared 4% CSS grain, 6 px radius.
- Logo used exactly as supplied (black keyed out only). Never redrawn.

## Motion
- GSAP ScrollTrigger, scrub 0.6, sticky stage. Film length set per beat in `film.yaml`.
- Lite mode (reduced motion, Save-Data, ≤2 GB memory) shows stills with cross-fades and no frame sequence.

## Components
Header (glass → solid), action bar, ticket card, seat grid, wave bar, timeline, programme card, glass panel, stat, quote, FAQ accordion, EU co-funded block, forms with inline errors.
