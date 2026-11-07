# Production note (6 Nov 2026)

## State
- Astro 5 static site, 25 pages, built and checked on desktop (1440) and phone (iPhone 13).
- Private preview: https://claude.ai/artifact/QgomHaQdWdLwUfyKcv7m1m (demo booking runs in the browser; no real Sheet, no emails).
- Not deployed anywhere public. The current site was only read.
- Higgsfield credits used: 0. Film 5.2 is built from the supplied assets only.

## Measured
- Home JS ≈ 55 KB gzip (budget 70). Conference film shares the same GSAP chunk.
- First screen on home (measured in Chromium, before any scroll): 460 KB uncompressed on a phone, 453 KB on desktop; about 330 KB on the wire once Cloudflare compresses text (budget 450). Off-screen film stills load on first scroll or when the page goes idle.
- 0 console errors, 0 horizontal overflow, one H1 per page on all 25 pages.

## Decisions
- Conference-first. No volunteer sign-up form in v1: it splits attention from the one action that matters before 20 Dec (reserve a seat). Partner/club forms stay.
- Grain is a CSS overlay, not baked into video (5 s clip went from 16 MB to under 0.3 MB).
- Seat map is a real accessible grid (row A reserved, rows B–G, 20 per row), max 4 per booking, 6 per email.
- Booking emails via Resend from Apps Script, triggered hourly for wave notices, 13 Dec reconfirm, 15 Dec release, 19 Dec reminder; purge on 20 Jan 2027.

## Limitations
- Film pacing tested in headless Chromium only. Needs a real phone scroll test.
- Preview hosting cannot serve the `.ics` calendar file or the `/api` functions; the preview uses the in-browser demo instead.
- AVIF variants are dropped in the preview bundle (file count limit); the real build ships them.
- Photo-to-event mapping for "digital playbook" is a guess.

## TO CONFIRM
The full grouped list is in the review doc: https://claude.ai/artifact/Rkks22Q7J9VCFAq15ygR5q

## Film 5.4 (2026-11-07)
- The home and conference films are drawn on a canvas from frame atlases (12 fps, 6 frames per WebP, a soft blend between frames), not by seeking a video. Seeking was choppy and fails on hosts without Range support.
- Build: `CLIPS=/mnt/project-files/diali-site/final-stills bash scripts/build-frames.sh`, then copy the frame counts from `public/film/frames.json` and the clip lengths from `public/film/*-segments.txt` into `src/content/film.yaml`. `scripts/encode-film.sh` makes the hero loop and posters from the run-out clip.
- The atlases are not in git yet (see .gitignore). Commit them once the final Seedance footage is approved.
- Phone atlases are about 50 MB for the home film. Target before launch: under 15 MB (fewer frames per second, smaller frames).
