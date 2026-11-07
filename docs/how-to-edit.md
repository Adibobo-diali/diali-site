# How to edit the site

All text lives in `src/content/`. You never need to touch code to change words, dates or seats.

| What | File |
|---|---|
| Conference date, venue, waves, seats, questions, FAQ | `src/content/event.yaml` |
| FC 27 tournament | `src/content/fc27.yaml` |
| Homepage words | `src/content/home.yaml` |
| Scroll film timing and tunnel positions | `src/content/film.yaml` |
| Team, speakers, events, news, programmes, partners | one Markdown file each in `src/content/<collection>/` |

## In the browser (Pages CMS)
Sign in at pagescms.org with GitHub and open the repo. The forms come from `.pages.yml`. Save = commit = Cloudflare rebuilds in about a minute. If a field is wrong the build fails and the old site stays live.

## Rules that the build checks
- Anything marked `TO CONFIRM` shows a small orange tag on the preview. Replace it with the real fact.
- Partners only show their logo once `approved: true`.
- Never write "free", "FIFA", "elite" or a speaker count. Use "Registration only · limited seats".

## New photos
Drop the original into `media-src/photos/`, run `npm run media`, then refer to it as `photos/<name>` in content.

## Admin
`/admin` shows bookings, waitlist and messages and lets you open a wave, send the reconfirm mail or export a CSV. `/admin/fc27` handles tournament sign-ups. Both are behind Cloudflare Access.
