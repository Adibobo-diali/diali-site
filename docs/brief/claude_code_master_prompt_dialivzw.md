# MASTER PROMPT: build the complete new dialivzw.eu

You are the **creative director, marketing director, web designer and lead developer** for **DIALI vzw**, a Belgian, volunteer-run youth sport non-profit (registered in Aalst, active in Gent). Build the complete new website from scratch: identity system, every page, every form, the booking flow, the cinematic homepage and the mobile experience. Then deliver a preview that is ready to replace the current Odoo site.

This prompt is self-contained. Where something isn't covered here, these sources decide, in this order:
1. The "Final concept (panel)" tab of the concept document: https://claude.ai/artifact/WzGU9mjRfJjmU5nSrhLJgW#25c7b553-57d8. Adnan approved all 8 decisions in it.
2. `claude_code_brief_dialivzw_redesign.md` (assets, scenes, tokens).
3. `COPY_for_website.md` inside the asset package.

**Updated 6 Nov (after Adnan's review):** the homepage camera flow, the Conferences door, the vision wording, the conference star → spotlight sequence, the three FC 27 features, the Programs proof and the four partnership types in this prompt are the latest decisions. Where they differ from the concept document, **this prompt wins**.

---

## PART 1 — The brief in one page

**Who DIALI is:** a youth-led non-profit that harnesses the power of sport to empower young people, especially those who rarely get the chance, through **exposure, mindset and real opportunities**. Football is where DIALI works today; every sport is the long-term direction.

**What the site must do, in order of priority until 20 Dec 2026:**
1. Fill the conference **"The Mind Behind the Game"** (Sun 20 Dec 2026, De Felix, Braemkasteelstraat 33-35, Gentbrugge; doors 10:00, programme 10:30–13:30 incl. break and networking). **Registration only, limited seats.** Visitors book through the seat picker. Seats open in waves:

   | Wave | Opens | Rows |
   |---|---|---|
   | 1 | 5 Nov | B–C (open now) |
   | 2 | 19 Nov | up to E |
   | 3 | 3 Dec | up to G |

   There are 120 public seats. Row A is reserved for invited guests.
2. Get **clubs** to book blocks of seats for their players, coaches and parents.
3. Fill the **FC 27 tournament** waiting list.
4. Turn visitors into **partners/sponsors** and **contacts**.
5. After 20 Dec: keep people for the next event (newsletter) and win partners.

**Audiences and what each must find within 10 seconds:**
- **Young players (13–30):** what's in it for me, the date, and how to get a seat.
- **Parents:** is it serious and safe, who runs it, and is it worth their child's Sunday morning.
- **Clubs and coaches:** a block-booking offer and proof that DIALI is credible.
- **Sponsors and partners:** the audience, the track record, and how to start talking.
- **EU/JINT funders:** correct visibility for Sport for Solidarity.

**Positioning:**
- **Promise:** *DIALI gives young players what training doesn't: exposure, mindset and real opportunities, and we show the proof.*
- **DIALI tagline:** **"Seen. Ready. Chosen."** (exposure, mindset, opportunity).
- **Conference line:** **"The game is won here first."**

**Voice (hard rules):**
1. Speak to players as "you"; give parents, clubs and funders calm, plain facts.
2. Short sentences. No hype words such as elite, world-class, annual or the best, unless they can be proven.
3. Every claim carries a number, a name or a date. If it can't, cut it.
4. **Never write:** "free", "free entry", "FIFA tournament", "four elite voices", a speaker count, or any seat number except the live count. **Write:** "Registration only · limited seats" and "FC 27 tournament".
5. Never present AI footage as a real DIALI event or person. Never promise a trial, a contract or a scout's attention.

**Facts you may use (nothing else; anything else is marked `TO CONFIRM`):**
- **Spot The Spark** (March 2026): a talent identification workshop with 20+ young people and 4 experts: an elite scout (KV Mechelen), an academy director (Royal Knokke FC), an ex-professional footballer and an elite coach.
- **Dream Big Tournament I** (September 2024, Blaarmersen, Gent): players aged 13–18.
- **Dream Big Tournament II** (July 2025): invitation-only 11v11, academies from across Benelux plus a DIALI Team, with scouts, academy directors and coaches present.
- **The Digital Playbook** (April 2026): a sport and technology workshop.
- **Scouting:** a partner trial at Cultural Leonesa (Spain).
  - Quote 1: *"DIALI gave me the opportunity to go on a professional trial at Cultural Leonesa Academy in Spain."* (Kelly Boateng, athlete)
  - Quote 2: *"It is always a pleasure to travel from Spain to Belgium to scout some top talents, giving them real opportunities at Cultural Leonesa!"* (Victor France Eliano, International Academy Director)
- **Team:**

  | Name | Role | Background |
  |---|---|---|
  | Adnan Salifu | Founder | MSc Sports Management, UAB with the Johan Cruyff Institute; licensed FIFA agent |
  | El Mustafa Karar | Co-founder | |
  | Godwill Moraka | Head of Football | ex-England futsal; coached KMSK Deinze U16, RFC Wetteren U19, St-Martens-Latem U21 and EFPA |
  | Raphael De Somviele | Head of Marketing & Events | founder of the Ballin-Cup |

- **Values:** Enjoyment & Hard Work · Meritocracy · Accountability · Belief in Potential · Athletes First.
- **Sport for Solidarity:** co-funded by the **European Solidarity Corps**, with **JINT**. Timeline: workshop (done, 20+ young people) → conference (20 Dec 2026) → FC 27 tournament (after the conference). JINT approved this plan.
- **Did NOT happen; never mention:** the DIALI Inter Cup and the Future of Sport Summit.
- **Contact:** Dialivzw@outlook.com (plus info@dialivzw.eu once forwarding is set up). Registered in Aalst; reg. no. 1013473618; VAT BE1013473618.
- **Confirmed speaker:** Stallone Limbombe only.
- **FC 27 waiting list:** https://forms.cloud.microsoft/r/mFYPr7w48d

---

## PART 2 — Identity and design system

**Mood:** a dark, premium, cinematic sports documentary. Calm confidence, a stadium at night, the quiet before walking out. It must look like no other Belgian youth organisation.

**Tokens** (one global stylesheet, written up in `DESIGN.md` and shown on `/styleguide`, which is `noindex`):

| Token | Value |
|---|---|
| ink | #050a1a (page background, the "dip" colour) |
| navy | #0b1530 |
| gold | #d9b45a |
| light gold | #f2d98a |
| ivory | #fff4d8 |
| white | #ffffff |
| muted text | rgba(255,255,255,.72) |

**Type:**
- Headings: Cormorant Garamond 500/600, **only at 28 px and up**. Body text and any heading below 28 px: Inter 400/500/600.
- Fluid scale from display to small (clamp).
- Eyebrows: Inter caps, 0.18em tracking, gold.

**Components:**
- buttons at least 48 px tall: primary gold, secondary outline, text link
- date chip
- glass panel (navy 70%, 1 px gold hairline, blur)
- stat tile (Cormorant number with an Inter label)
- quote block (gold opening mark, attribution in small caps)
- ticket card
- timeline
- FAQ accordion
- form fields (labels above, errors in text, 2 px light-gold focus ring)
- footer

**Photo treatment for real photos:** saturation 0.85, a navy gradient over the bottom 40%, a shared 4% grain, 6 px radius. Real people then sit inside the cinematic world.

**Logo:** use the existing DIALI logo from the current site. Never redraw it.

**Colour-grade all generated media once with ffmpeg:**
- black point #050a1a
- highlights toward #f2d98a
- greens about −25%
- 4% grain

Export posters and hand-off stills from the decoded video frames. This fixes the colour jumps Adnan complained about.

---

## PART 3 — Global experience

**Header (desktop and mobile):**
- **Fixed to the top for the whole site**, mounted outside the pinned film, so it never disappears.
- Desktop: DIALI logo and wordmark (one line, never wrapping) · Conference · FC 27 · Programs · Events · News · Partners · Contact · gold **Reserve your seat**.
- Mobile: logo and wordmark on the left, hamburger on the right.
- **Glass state** over the film: an ink gradient, about 70% at the top fading to transparent, with no hard line. It must stay legible over the **brightest** frames (floodlights, tunnel flare, spotlight).
- **Solid state** after the film: ink at 90–95%, `backdrop-filter: blur(10px)` plus the `-webkit-` prefix, and a gold hairline.
  - It turns solid when the film section's bottom edge reaches the header's bottom edge, and turns back to glass when you scroll up.
  - Recompute on scroll (passive listener), resize, orientation change and load.
  - Toggle a single class; transition only background, border and blur (300 ms). Never animate layout.
  - Reduced motion switches instantly.
  - The open mobile menu is always solid.
- **Mobile menu:** a full-screen ink panel with the links, Reserve, the email address and a close button.
  - Focus trap and return focus, Esc closes, it closes after a link is chosen, scroll lock while open.
  - Touch targets 44 × 44 px; respect the safe areas.
- **Sticky mobile action bar:** shows the live state ("Wave 2 · 31 seats left →" / "Wave 3 opens in 3d 4h" / "Join the waitlist"), with a 5-second cached API and the fallback "Limited seats".
  - Hidden on `/seats`, on forms and over the seat block. It must never collide with the header or the chapter copy.
- Anchors use `scroll-padding-top` = header height + 12 px. A "Skip the tour" link sits on every film page.

**Footer (all pages):**
- Logo and the line "Seen. Ready. Chosen."
- A mini event card (date, venue, Reserve).
- Columns: Conference, FC 27, Programs, Events, News, Partners, Clubs, Contact.
- Email; "Registered in Aalst · Reg. no. 1013473618 · VAT BE1013473618".
- The **Sport for Solidarity / European Solidarity Corps / JINT** block, with the correct EU emblem and the exact "Co-funded by the European Union" wording and disclaimer. **Check JINT's visibility rules before finalising.**
- Privacy and social links (`TO CONFIRM` which accounts exist).
- **No IBAN** (it moves to Partners), no Odoo placeholders, no "Powered by Odoo".
- Mobile: two columns, then one.

**Motion system (applies everywhere):**
1. One fixed `.stage` (100svh) with stacked layers; `html`, `body` and the stage are all ink. Text scrolls above the stage.
2. GSAP and ScrollTrigger, scrub 0.6. No scroll hijacking: native scroll works in both directions.
3. Text enters with opacity 0→1 and y 24→0 over 0.6 s, and leaves before each scene handover.
4. Handovers:
   - Continuous shots cut on the identical decoded frame.
   - Different palettes join through a 100% ink dip over the last and first 8% of the two scenes.
   - Never crossfade colour to colour.
5. Preload and `decode()` the next layer at 50% of the current scene; swap only once it is painted.
6. Scrubbed motion uses **canvas image sequences**, never `video.currentTime`. Loops stay as `<video muted autoplay loop playsinline>` with a poster.
7. Page-to-page navigation uses a 250 ms ink View Transition.
8. Lite mode (`prefers-reduced-motion`, Save-Data, `deviceMemory` ≤ 2): graded stills in normal page flow with 200 ms fades, and **no sequence downloads**. Understanding DIALI must never depend on the film.

**Budgets (mobile, mid-range Android on 4G):**
- First screen ≤ 450 KB; JS ≤ 70 KB gzipped.
- LCP ≤ 2.0 s; INP ≤ 150 ms; CLS ≤ 0.05.
- Each page ≤ 3 MB, not counting progressively loaded frames, whose weight you report separately.
- Images: AVIF/WebP with srcset 640/1080/1600/2400.

**Accessibility:** WCAG 2.2 AA.
- One H1 per page; real alt text on every photo.
- Decorative video is `aria-hidden`; any video with speech gets captions.
- The seat map has a list/keyboard alternative and an `aria-live` status.
- Hidden copy never takes focus or clicks.

**SEO and sharing:**
- Unique titles and meta descriptions for every page, using the voice rules (e.g. "The Mind Behind the Game · Sun 20 Dec 2026 · Gentbrugge | DIALI").
- A 1200×630 Open Graph image per page, built at build time from the graded stills plus a text overlay.
- Structured data: Organization/NGO, Event (startDate 2026-12-20T10:30+01:00, doorTime 10:00, location De Felix, eventAttendanceMode offline, offers `TO CONFIRM`), and FAQPage.
- Sitemap and robots. English only at launch; booking flow and emails in EN/NL/FR.

**Privacy and analytics:**
- Cloudflare Web Analytics, which is cookieless, so there is **no consent banner**.
- Store `ref` (club code) and `lang` on each booking.
- The privacy notice names the processors: Cloudflare, Google (Apps Script/Sheets), Resend, Microsoft Forms.
- Booking requires "13 or older, or a parent books for you"; extra seats take first names only; the newsletter opt-in is a separate, unticked box.
- Bookings are purged on 20 Jan 2027; messages are kept 12 months.
- Photos of minors only with documented consent, and never with names.

**Stack and editing:**
- Astro (static) on **Cloudflare Pages**, with Pages Functions for `/api/*`: Turnstile, a honeypot, rate limits, idempotency keys.
- Booking system of record until 20 Dec: the **existing Google Apps Script + Google Sheet**. Work on a copy first; the old Odoo seat page must keep working for rollback.
- Mail via **Resend** from `noreply@send.dialivzw.eu`, reply-to Outlook. Cloudflare DNS and Email Routing (`info@dialivzw.eu` → Outlook).
- **Adnan edits everything in Pages CMS** (browser, typed and validated fields):
  - `event.yaml`: dates, times, venue, waves, `mode: upcoming|past`, live/fallback texts
  - `speakers/*.md` with a `published` toggle
  - `fc27.yaml`
  - `programmes/`, `events/`, `news/`, `partners/`, `team/`, `home.yaml`, `film.yaml`

  A failed build never goes live. Media files have fixed names, so they can be swapped without code changes.
- **Monitoring:** UptimeRobot on `/`, `/seats` and the state API; a nightly Sheet backup to Drive.

---

## PART 4 — Page by page

### 4.1 Home `/`

**Job:** explain DIALI in 10 seconds, prove it, and send people to Reserve, Clubs or Partner.

**A. The cinematic film** (pinned canvas, piecewise scroll timeline in `film.yaml`):
- Built **only from the video concepts DIALI already has** (see Part 5): the breathing tunnel loop, the walk-out clip, the stadium, the four-tunnel hub, the team walk-out and the centre-circle ending.
- **Do not invent new scenes or a new location.** The camera grammar is fixed (agreed with Adnan on 6 Nov): **follow-cam out of the tunnel → a slight pull-back that shows the four tunnels → one dive per tunnel → back up to the centre circle and spin on the spot to the next tunnel → the team walks out toward the camera → rise, 180° turn, aerial reveal.**
- **Launch with the free version (5.2):** existing assets plus web motion only. The full continuous flight (5.3) comes after a credit top-up and drops in through `film.yaml` without code changes.

Beats in order:

| # | Beat | What the camera does | Copy and actions |
|---|---|---|---|
| 1 | **Breathe** | The DIALI 20 player breathes in the dark pro tunnel. The exit light grows as you scroll. | Frame 1 already shows: date chip **"Sun 20 Dec · De Felix, Gentbrugge"** · **"Breathe."** → H1 **"Seen. Ready. Chosen."** · line *"DIALI harnesses the power of sport to empower youth, through exposure, mindset and real opportunities."* · **Reserve your seat** · Skip the tour · a subtle scroll cue. |
| 2 | **The run-out (follow-cam)** | The player runs out onto the floodlit pitch. The camera follows close behind him, like drone footage, all the way to the centre of the pitch. Then it pulls back **a little, not too far**, so all four tunnel mouths are in view. | Proof strip: **"4 events since 2024 · 20+ young people at Spot The Spark · 4 experts · 1 partner trial in Spain"** |
| 3 | **Events tunnel** | One scroll and the camera zooms into the Events tunnel. The **real photo waits at the far end, like the exit light**, then comes alive with a slow push-in. | The tunnel name and one fact appear beside the photo: **Events** · "Spot The Spark · 20+ young people, 4 experts · What scouts really look for." → *See our events* (`/events`) |
| 3b | **Back to the centre, spin** | The camera backs up to the centre circle and **spins on the spot** to face the next tunnel. It never flies all the way back out. | No copy — let the motion lead. |
| 4 | **Tournaments tunnel** | The same dive, photo and push-in, then back up and spin. | **Tournaments** · "Dream Big I & II · Next up: the FC 27 tournament, 20 Dec." → *FC 27 tournament* (`/fc27`) |
| 5 | **Scouting tunnel** | The same dive, photo and push-in, then back up and spin. | **Scouting** · the Kelly Boateng quote + "A real pathway, never a promise." → *How scouting works* (`/our-programs#scouting`) |
| 6 | **Conferences tunnel: the door** | The camera dives into the last tunnel. At the end there is no photo but a **closed door labelled "Conference room"**, with warm light leaking around its edges. | **Conferences** · "The Mind Behind the Game · Sun 20 Dec" with a countdown, and one button under the door: **Enter the conference**. **On click:** the door swings open, warm light pours out and the visitor lands on `/the-mind-behind-the-game` (see "The door" below). **If they keep scrolling instead:** the camera backs out to the centre circle. *Reserve your seat* is **not** on this beat; it stays in the header and menu. |
| 7 | **Spin back to the main tunnel** | From the centre circle the camera spins on the spot past all four tunnels, now all lit (this replaces the old separate "All four lit" beat), and stops facing the main tunnel the player came out of. | Optional one-liner: "The whole of DIALI, at once." |
| 8 | **The team walks out** | The four team members walk out of that same tunnel **toward the camera**, side by side. | Their names and roles appear beside them (from `team/`). A **More about our team** link opens a modal with the real portraits and short bios. |
| 9 | **Rise, 180°, reveal** | The camera rises over the team, turns 180°, climbs in reverse and reveals the lit stadium from above. | The mission line · **Register for The Mind Behind the Game** · **Partner with us** |

**Faces in the team beat:**
- **Full take (5.3):** the team are **backlit silhouettes with their faces in shadow**. Never generate recognisable "staff" faces; the real people appear only in the real portraits in the modal.
- **Free version (5.2):** use the existing team still (seen from behind) with a slow push-in, and show the names and roles over it.

**The door (Conferences):**
- The door is built in the web layer in **both** versions, because a video can't branch. An HTML/CSS door (two leaves, navy with a gold hairline and a brass-like handle) is drawn over the end of the Conferences tunnel. The **"Conference room"** plate is real text, never generated lettering.
- **On click:** the leaves swing open with a 3D `rotateY` (about 700 ms), a light-gold glow floods the screen (the same bloom as the H2 → H3 handover), and the conference page loads underneath. Its penalty hero (C1) fades in out of that light. Use the View Transitions API where supported; otherwise do a plain navigation behind the bloom.
- **Accessibility:** the button is a real link (`<a href="/the-mind-behind-the-game">`), and Enter triggers the same animation. With reduced motion: no swing, just a 200 ms fade.
- **Analytics:** count clicks on "Enter the conference" as their own event, so you can see whether the door converts better than the menu.

**Every tunnel is a door (links are mandatory):**
- Each tunnel beat has a real, keyboard-focusable link, and the tunnel mouths in the pull-back view are links too. Hover or focus brightens the glow and shows "Enter →". The targets come from `film.yaml`:

  | Tunnel | Links to |
  |---|---|
  | **Conferences** | **`/the-mind-behind-the-game`**, through the door ("Enter the conference") |
  | Events | `/events` (with the Spot The Spark card) |
  | Tournaments | `/fc27` (the FC 27 tournament page) |
  | Scouting | `/our-programs#scouting` |

- The same links appear in the lite / reduced-motion version as four normal cards. The Conferences card's button reads **Enter the conference**.

**B. Sections after the film** (normal page flow, solid header):
1. **Our vision** (`id="vision"`; `/about-us` redirects here):
   - Eyebrow "Our vision". H2, in Adnan's wording (verbatim): **"DIALI harnesses the power of sport to empower youth, through exposure, mindset and real opportunities."**
   - Directly underneath, verbatim: *"to become a catalyst for youth empowerment by unlocking global opportunities through sports."*
   - **Remove** the old "Talent is everywhere. Opportunity isn't." heading and the separate Mission/Vision statements (they now are the heading and the line under it).
   - Three pillars, each with one line and one proof:
     - **Exposure**: tournaments in front of scouts
     - **Mindset**: workshops and the conference
     - **Opportunity**: the partner trial in Spain
   - Label "Today: football · Tomorrow: every sport".
2. **Values:** five tiles with a one-line meaning each.
3. **Proof quotes:** Kelly Boateng and Victor France Eliano as quote blocks over the graded scouting photo.
4. **Sport for Solidarity:** a band with the timeline (Workshop ✓ → Conference 20 Dec → FC 27 tournament), the EU emblem and the exact wording.
5. **For clubs:** a teaser: **"Bring your team."** "Book a block of seats." → `/clubs`.
6. **Contact block:** "Ask us anything." with a form (name, email, question). See 4.10.

The team now lives inside the film (beat 8, with its modal) and the ending is beat 9, so neither is repeated here. There is no separate partner-logo strip on Home; partner logos live on the Partners page.

**Post-20-Dec mode:** the film panel switches to "Next up: to be announced" plus a newsletter signup, and the main CTA becomes Partner with us.

### 4.2 Conference `/the-mind-behind-the-game`

**Job:** turn interest into a seat. It must be self-contained so it can be archived after 20 Dec. **Reserve is visible from the first second.**

**Arrival:** visitors who come through the homepage door land inside the light-gold bloom, and the penalty hero (row 1) fades in out of it. Direct visitors see row 1 straight away.

| # | Scene | Copy |
|---|---|---|
| 1 | **The noise:** the DIALI 20 player stands over a penalty in a packed stadium. Doubt words appear around him: "Don't miss." "Everyone is watching." "What if I fail?" "Too young." "Not good enough?" | H1 **"The Mind Behind the Game"** · "A youth sport conference on mindset, mental performance and wellbeing. Sun 20 Dec 2026 · Gentbrugge · Registration only · limited seats" · **Reserve your seat** |
| 2 | **Into the mind:** zoom into the golden particle head. | **"The game is won here first."** |
| 3 | **Questions on the table:** four glowing stars inside the head. **One continuous camera path:** wide → star 1 → 2 → 3 → 4, about 900 ms per move, with the active star glowing brighter. No pull-back to wide at the end; row 4 continues from star 4. Star centres as fractions of the image (dark padding above the image so star 1 can be centred): 1 (0.411, 0.185) top of head · 2 (0.302, 0.426) back · 3 (0.404, 0.380) centre · 4 (0.500, 0.407) eyes. | Intro: "Possible topics, not a fixed programme." Then the 4 questions and explanations from COPY: getting to the top · being told no · who looks after the mind · social media. |
| 4 | **Star → spotlight:** after star 4, the last star grows until it fills the screen and becomes the **spotlight on Stallone's chair** (chair 2 of four on the dark stage). | **"First voice confirmed: Stallone Limbombe"** (photo and one line `TO CONFIRM`) · "More voices to be announced." |
| 5 | **Pull back over the hall:** the camera pulls back from the stage over the rows of cinema-hall seats, and the date, time and venue appear. | Ticket-style card: Sun 20 Dec 2026 · Doors 10:00 · 10:30–13:30, break and networking included · De Felix, Braemkasteelstraat 33-35, Gentbrugge (postcode `TO CONFIRM`) · Maps link · Add to calendar · wave timeline · live seats left · "Who is it for: players, parents, coaches and anyone who loves the game." Language: English `TO CONFIRM`. |
| 6 | **Stay for the game:** the camera pulls back from the penalty to reveal it is on a screen in front of a teenager holding a controller. If the framing doesn't line up, use an ink dip. | **"Then the game: FC 27 tournament."** "16 players · knockout · straight after the conference." → *FC 27 tournament* page · *Join the waiting list* |
| 7 | **Your seat:** the seat picker block (live wave bar + "Choose your seat"). | "Choose your seat" → `/seats`. Clubs: "Booking for a team?" → `/clubs` |
| 8 | **FAQ** with FAQPage JSON-LD. | Do I need to register? (Yes, every seat is booked, registration only.) Can parents come? (Yes.) How many seats can I book? (Up to 4.) What if I can't come? (Release your seat from your confirmation email.) Accessibility? (`TO CONFIRM`.) Parking/public transport? (`TO CONFIRM`.) |

### 4.3 FC 27 tournament `/fc27` (NEW page, shareable for gamers)

**Job:** fill the waiting list, explain the rules simply, and drive gamers to book a conference seat. **Only attendees who check in can play.**

**Hero:** the FC 27 reveal still (the teen with a controller, the DIALI 20 penalty on the screen).
- H1 **"FC 27 tournament"**. Sub: *"The mind under pressure, tested live. Straight after The Mind Behind the Game, Sun 20 Dec 2026, De Felix, Gentbrugge."*
- Primary: **Join the waiting list** (https://forms.cloud.microsoft/r/mFYPr7w48d, new tab). Secondary: **Reserve your conference seat**.

**"How it works"** as four steps:
1. **Reserve a conference seat.** Only attendees can play.
2. **Sign up to play.** Tick **"I want to play FC 27"** when you book your seat, or join the waiting list (name, email, and whether you are under 16).
3. **Check in on the day.** The 16 places go to signed-up players who check in.
4. **Play.** Knockout, one winner.

**Rules card:**
- 16 players · knockout · check-in required · the winner must be present to receive the prize · "a prize for the winner" (no amount until the sponsor is confirmed).
- Players under 16 need a parent or guardian's permission, given at check-in.
- Format details (match length, settings, controllers provided?) are `TO CONFIRM`.

**No-guarantee line next to every sign-up button and the tick box:** *"Signing up does not guarantee a place. The 16 places go to registered attendees who check in on the day."*

**Three features that make the page work (all approved 6 Nov):**

1. **Live bracket** (`id="bracket"`, 16 slots, knockout tree; on phones, one round per swipe-free vertical column):
   - **Before the event:** 16 empty slots plus the sign-up count. The count is the number of FC 27 tick-box sign-ups in the Sheet **plus** the Microsoft Form total, which a team member types into admin (there is no Forms API; never estimate it). **Show the number only once it reaches 8**; below that, show just "16 places". A low number puts people off.
   - **On the day:** a team member runs it from `/admin/fc27` on a phone. They place the checked-in players into the slots (a "random draw" button does it in one tap), then advance each match with **one tap on the winner**, with an undo for the last tap. The public bracket refreshes every 15 s from the cached state API, without reloading the page.
   - **Names shown:** first name and initial only, or a nickname the player chooses at check-in (many players are minors).
   - **After the event:** the winner is shown with "a prize for the winner", and the bracket stays as an archive.
   - **Storage:** an "FC27" tab in the same Sheet (slot, display name, round, winner flag, source: booking/form).
2. **Challenge a friend** (shown right after someone signs up, on the seat confirmation and on this page):
   - A ready-made message: **"I'm in. Are you?"** + *"FC 27 tournament at The Mind Behind the Game, Sun 20 Dec, Gentbrugge. 16 places."* + a link to `/fc27?ref=share`.
   - Buttons: **WhatsApp** (`https://wa.me/?text=…`), **Instagram** (the Web Share API on phones; otherwise "Copy message" and open Instagram, because Instagram has no web share-with-text) and **Copy link**.
   - Count shares and `ref=share` arrivals in analytics.
3. **Tick box in the seat booking:** **"I want to play FC 27"** (see 4.4). People who booked before the tick box existed keep the Microsoft Form, and get the link in their emails.

**Also on the page:**
- **Why a game at a mindset conference:** "Everything you hear in the morning, you use in the afternoon: pressure, focus, bouncing back."
- **Partner slot:** "Prize partner wanted" → Partners (only until a prize partner is confirmed).
- **FAQ:** Do I need my own controller? (`TO CONFIRM`) · Can I play if I didn't sign up? (Only if places are left after check-in.) · Is there an age limit? (`TO CONFIRM`; under-16s need permission.)

**Wording:** never "FIFA". No EA or game logos, and no real game interface on screen.

### 4.4 Seats `/seats`, plus `/seats/confirmed` and `/seats/manage`

**Job:** a one-step booking that feels effortless and fair. The old "register first, then pick a seat" two-step flow is gone. The Microsoft Form stays only behind the printed QR code.

**Flow:**
1. **Wave bar:** "Wave 1 of 3 · 39 seats left" (live). Closed waves greyed, with their opening dates.
2. **Seat map:** a "Stage" label at the top.
   - Row A shown with dashed gold and the label "Reserved for guests"; not selectable.
   - Desktop: the full grid.
   - **Mobile: tap a row to expand it into a strip of 44 px seats**, so there is no sideways swiping.
   - A "Best available ×N" button. A list/keyboard alternative.
3. **Your details:** email, your name, and one first name per extra seat (up to 4 seats per booking; 6 per email in total).
4. **Consent:** "I'm 13 or older, or a parent is booking for me" (required) and "Keep me posted about future DIALI events" (optional, unticked).
5. **FC 27 (optional):** a tick box **"I want to play FC 27"** next to each name (the booker and each guest). When ticked, a second tick appears: "I'm under 16" (permission is given at check-in), plus the no-guarantee line from 4.3. Ticked names go to the "FC27" tab of the Sheet with `source: booking`, and count toward the bracket's sign-up number.
6. **Confirm:** the button shows "Holding your seats…" (25 s timeout). Turnstile runs invisibly.

**States** (design every one):
- wave not open yet (countdown + "email me when it opens")
- wave full, next wave coming
- everything full (waitlist: email + number of seats)
- a seat taken while choosing (it flashes, "Pick another", the rest of the selection is kept)
- email already booked or over the cap
- network/server error (retry + email fallback)
- waitlist-only from 15 Dec
- event over (thank-you archive)

**Confirmation page:**
- A ticket card: **"You're in. Row D, seat 7."**, the names, date, doors 10:00, venue and a map link.
- **Add to calendar** (.ics + Google).
- **FC 27:** if anyone ticked the box, "You're on the FC 27 list" + the check-in rule + the **Challenge a friend** share block (4.3). If nobody ticked it, a short "Want to play FC 27?" with a link to `/fc27`.
- **Manage or release your seats** (token link).
- "Share that you're coming" (a simple share link; an image card comes later).

**Emails** (Resend, in the booking's language EN/NL/FR):
- **Confirmation:** subject "Your seat for The Mind Behind the Game, Sun 20 Dec". Includes the .ics, the manage link, and an FC 27 line ("You're on the list" or "Want to play? Sign up here" → `/fc27`).
- **13 Dec:** "Still coming?" one-click reconfirmation. Unconfirmed seats are released on 15 Dec.
- **19 Dec:** a reminder with the route and doors 10:00.
- The 13 Dec and 19 Dec emails also carry the FC 27 sign-up link, so **people who booked before the tick box existed** see it. They keep using the Microsoft Form.
- **Waitlist joined.**
- **Seat offered:** a 24 h claim link.

**Rules engine (Apps Script + Sheet; edit on a copy first):**
- Waves open automatically from `opens_at`, and the API returns `nextWaveAt`.
- `LockService` check-then-write, so no double booking (verify whether this already exists).
- Cancel tokens, a check-in column, a Gmail-off flag (mail goes via Resend).
- `ref` is stored for club links.
- An "FC27" tab: sign-ups from the tick box, the Microsoft Form total typed in by admin, and the bracket state.

**Admin `/admin`** (Cloudflare Access, one-time PIN to Adnan's email):
- search by name/email, check-in tap, **block booking for clubs (up to about 10)**, waitlist offers, CSV export
- a printable alphabetical door list
- check-in decides FC 27 eligibility
- **`/admin/fc27`**, built for a phone: the sign-up count field (Microsoft Form total), the checked-in list, a "random draw" into the 16 slots, **one tap per winner** to advance, and undo. Add the team member who runs the tournament to the Cloudflare Access policy (their email `TO CONFIRM`).

**`/seats-privacy`:** a short, clear notice for the booking data.

### 4.5 Our Programs `/our-programs`

**Job:** show depth and credibility for parents, clubs and funders.

**Banner:** the four-tunnel hub still. H1 **"Four ways in."** Sub: *"Every programme is free to take part in and built around one idea: talent is universal, opportunity is not."* (`TO CONFIRM` that every programme is free.)

**Four blocks** (real photo, what it is, who it's for, what happened, CTA):

| Programme | What it is | Who it's for | Proof | CTA |
|---|---|---|---|---|
| **Talent Identification & Development** | workshops with direct access to scouts, coaches and ex-pros | players 16–30, coaches and aspiring sports professionals | Spot The Spark, 20+ young people, 4 experts | Events |
| **Education & Career Pathways** | the business, science and technology of sport | | The Digital Playbook, April 2026 | Events |
| **Community & Solidarity** | **Sport for Solidarity**: a workshop, The Mind Behind the Game conference and the FC 27 tournament, co-funded by the European Solidarity Corps, with JINT | | the workshop (done) → the conference and FC 27 on 20 Dec | Partner with us |
| **Tournaments & Scouting** (section `id="scouting"`, the target of the homepage Scouting tunnel) | Dream Big I and II; a planned international youth tournament (never "annual") | | the Cultural Leonesa partner trial | FC 27 tournament / Clubs |

**"What we're building next"** (inside the Community & Solidarity block, visibly labelled as a plan): open days and school partnerships. They don't exist yet, so never show them as running or past, and never give them dates or numbers.

**Then:**
- **"A commitment to inclusion":** transport, accessibility and equipment covered where needed; partnerships in underserved neighbourhoods.
- **Sport for Solidarity band:** the exact EU wording and emblem, and the timeline.
- **No fees line:** do **not** add a "does not charge players" line anywhere (removed on 6 Nov).

### 4.6 Events `/events` and `/events/[slug]`

- H1 **"What we've done. What's next."**
- **Upcoming:** a large card for The Mind Behind the Game (and FC 27).
- **Past** (real photos only):
  - Spot The Spark (March 2026)
  - The Digital Playbook (April 2026)
  - Dream Big Tournament II (July 2025)
  - Dream Big Tournament I (September 2024)
- **Each event page:** what happened, who took part, the facts from COPY, a photo gallery (consent rules apply), and "Next up" at the end.
- **Empty state:** "Next event announced soon" plus a newsletter signup.
- **Never list** the Inter Cup or the Summit.

### 4.7 News `/news` and `/news/[slug]` (H1 **"Stories from the pitch."**)

- A featured story plus a grid of cards: 16:9 photo, a date eyebrow, the title.
- Articles are set in a readable 68ch column.
- **Seed content:** the conference announcement (registration-only wording), the Spot The Spark recap and the Dream Big II recap.
- **After 20 Dec:** "The Answers", one post per conference question.
- Player stories only with written consent.

### 4.8 Partners `/become-a-sponsor/partner` (+ `#partners`)

**Job:** turn interest into a conversation.

- H1 **"Put your name where young players look."**
- **Who you reach:** **the youth, their parents and clubs.** No age range, no city, no invented numbers; add the event attendance figures once they are known. **Delete the old "50+/150+/200+" table.**
- **Four ways to partner** (four cards; each says what it means and gives a real example):

  | Type | What it means | Example |
  |---|---|---|
  | **Grant partnership** | Public or foundation funding for a programme | European Solidarity Corps, with JINT (Sport for Solidarity) |
  | **Club partnership** | A club that opens doors for young players, such as trials and exchanges | Cultural Leonesa (the partner trial in Spain) |
  | **Event partnership** | An organisation that co-hosts or supports one of our events | Alfa Cool (spelled A-L-F-A Cool; one line on what they did `TO CONFIRM`) |
  | **Sponsorship** | Support with money or goods (gear, venue, services, prizes) | the FC 27 prize partner slot, while it is open |

  There are no named packages and no "price on request". The old "Question partner" and "Seat-row partner" ideas are dropped everywhere.
- **Current and past partners:** logos, only those that are real and approved.
- **Transparency:** *"Sport for Solidarity is co-funded by the European Solidarity Corps, with JINT. Partnerships fund what grants don't."* EU visibility is kept; partner logos are never larger than the EU emblem.
- **Form:** name, email, **company or organisation (optional)**, **partnership type** (a select: Grant · Club · Event · Sponsorship · Not sure yet; preselected when the visitor came from one of the four cards), and a free box **"Your question or idea"**. It goes through the same `/api/form` pipeline, with the type in its own column.
- **Bank details for direct support:** the IBAN in small print here only.

### 4.9 Clubs `/clubs` (unlisted; reached through each club's email link)

- H1 **"Bring your team."**
- Copy: *"Book a block of seats for your players, coaches and parents. Tell us how many people are coming, up to 10, and we'll reserve the seats together and handle the rest."*
- The same form as Partners, with the company field labelled **"Club"**, the partnership-type select hidden (fixed to "Club"), and an added field **"Number of seats (up to 10)"**.
- Reads `?ref=` and stores it with the submission and any later bookings.
- The conference card plus FC 27: "Your players can also join the FC 27 tournament."

### 4.10 Contact `/contact` (`/contactus` redirects here)

- H1 **"Ask us anything."**
- **Form: name, email, question. Nothing else.** Turnstile and a honeypot.
- On success the form becomes: "Thanks, we'll reply within [`TO CONFIRM`, e.g. 2 working days]."
- On failure: "Something went wrong. Email us at Dialivzw@outlook.com."
- Next to the form: the email in plain text, "Registered in Aalst · Reg. no. 1013473618", a "Partnerships →" link and a "Booking question? See the FAQ" link.
- Submissions go to `/api/form` → the Sheet's "Messages" tab → Resend → Outlook. **Never show "sent" when nothing was sent.**

### 4.11 Privacy `/privacy`, 404, legal

- **Privacy:** plain-language, covering the processors, purposes, retention, minors, rights and contact.
- **404:** the centre circle at night. **"Offside. This page isn't on the pitch."** Buttons: Home and Reserve your seat.
- No cookie banner, because there are no cookies. Say so in the privacy notice.

---

## PART 5 — The films, built from DIALI's existing video concepts

**Rule:** use only the scenes, stills and clips already made and approved:
- the asset package: https://d2ol7oe51mr4n9.cloudfront.net/user_3Kgyh5s9gJVl33y7k64SkkxEcrz/c57b2878-61a8-4cab-a9ac-556c8d82d890.zip
- the reference walkthrough film: https://d2ol7oe51mr4n9.cloudfront.net/user_3Kgyh5s9gJVl33y7k64SkkxEcrz/84ac1cae-2cdd-4f19-aed5-bf5ca1acf11d.mp4

**No new locations, no new story, no new characters.** The job is to make these scenes feel like **one continuous film** instead of separate pictures. That was Adnan's complaint about the first attempt: "different colour, not synchronized".

### 5.1 The existing scenes (file names from the package `README.txt`)

| # | Scene | Existing asset | Status |
|---|---|---|---|
| H1 | Breathing player, pro tunnel, white DIALI 20 jersey | `video/hero_breathing_desktop` and `video/hero_breathing_mobile` (seamless loops), stills `img/home_01_tunnel_*` | Approved |
| H2 | Walk-out from tunnel to floodlit stadium | `video/walkout_tunnel_to_stadium` (1.43 MB, 1 keyframe; convert to a canvas sequence), end still `img/home_02_stadium_from_tunnel` | Approved |
| H3 | The four lit tunnels (hub, 21:9) | `img/home_03_four_tunnels_hub` | Approved; the dives, the spins on the spot and the real photos are web motion |
| H4 | All four lit | the same hub, full view | Folded into the spin back (beat 7): all four glow during the pan |
| H5 | Team walk-out (four Black men, from behind) | `img/home_05_team_walkout_standin` | Approved for the free version (seen from behind, names over it). The full take (5.3) turns it into backlit silhouettes walking toward the camera |
| H6 | Centre circle ending | `img/home_06_centre_circle_ending` | Regrade the sunset sky to navy night |
| C1 | Penalty, DIALI 20, packed stadium | `img/conf_01_penalty_desktop` / `_mobile` | Approved |
| C2–C3 | Golden particle head, four glowing stars | `img/conf_02_inside_the_mind_stars` | Approved, with the star coordinates |
| C4 | Four chairs, spotlight on chair 2 (Stallone) | `img/conf_04_voices_stage` | Approved |
| C5 | Cinema hall (details) | `img/conf_05_venue_cinema_hall` | Approved |
| C6 | Pull-back to a teenager with a controller (FC 27) | `img/conf_06_fc27_reveal_desktop` / `_mobile` | Approved |
| P | Pitch banner for the other pages | `img/pages_banner_pitch` | Approved |

### 5.2 Making them one continuous film (free; do this first)

1. **One grade for everything** (ffmpeg): black point #050a1a, highlights toward #f2d98a, greens about −25%, 4% grain, applied to every still, poster and clip.
   - Pull the step-out (H2 end) exposure down.
   - Regrade the hub (H3) from green-black to navy.
   - Turn the H6 sunset into a navy night sky.
   - Measured problems to fix: the hero poster is about 1.5 levels brighter than its video's first frame, and the walk-out end frame differs from its hand-off still (RMSE 3.4%). **Export every poster and hand-off still from the decoded video frames.**
2. **The handover between each pair of scenes:**

   | Join | Handover |
   |---|---|
   | H1 → H2 | Cut on the identical frame (the walk-out starts from the hero frame; measured clean, RMSE 0.5%). The walk-out clip is the follow-cam; after it ends, a slow web push-in on its end still carries the follow toward the centre |
   | H2 → H3 | Light-gold floodlight bloom with 10% overlap. The hub enters slightly zoomed in, then eases back **a little** until all four tunnels are in view |
   | Hub → tunnel dive | Continuous: zoom on the hub toward that tunnel's mask. The real photo fades up inside the mouth as its bright end, grows to about 60% of the screen and gets a slow push-in |
   | Tunnel → back and spin | Continuous: zoom back out to about 1.3× (never the full width) and pan sideways across the 21:9 hub to the next tunnel. On the flat still this reads as turning on the spot |
   | Conferences dive → door | Continuous zoom; the HTML door sits in the tunnel mouth as its end |
   | Door click → conference page | The door swing + light-gold bloom → C1 fades in out of the light |
   | Hub → team (spin back) | A fast pan across all four tunnels with every glow on, then an ink dip into the team still (the main tunnel isn't in the hub still) |
   | Team → H6 | Ink dip, then a slow upward drift and zoom-out on H6 standing in for the rise |
   | C1 → C2 | Zoom into the player's head, then an ink dip into the particle head |
   | C3 → C4 | **Star → spotlight:** scale star 4's glow until it fills the screen with light gold, then reveal C4 with its spotlight centred where the star was. Both are gold on ink, so this is a matched light, not a colour-to-colour fade |
   | C4 → C5 | **Pull-back over the seats:** C4 is placed inside the stage area of C5, then the camera zooms out over the rows of seats. If the framing doesn't line up, use an ink dip |
   | C5 → C6 | Ink dip, then the penalty shown framed |
   | C1 framing → C6 | Pull-back: the penalty image is placed exactly inside the screen area of C6, then the camera zooms out |

   **Never** crossfade colour to colour. The next layer must be decoded before the swap.
3. **Web motion on the stills** (CSS transforms and canvas; no new video):
   - the tunnel dives, the photo push-ins and the sideways "spin" pans on the hub (H3)
   - the HTML door and its swing
   - slow push-ins and parallax on H5, H6, C4 and C5
   - the star-to-star camera path on C2–C3, and the star → spotlight growth
   - the C4 → C5 and C1 → C6 pull-backs
   - drifting haze and grain layers as a shared overlay
   - a gentle spotlight "breath" (opacity pulse) on C4

   The result already plays as one film without spending a credit.

### 5.3 The homepage as ONE continuous take (three chained ~15 s clips)

This is the premium version of the homepage film, made **after a credit top-up**. It turns DIALI's **existing scenes** into one unbroken first-person camera move that follows the agreed grammar (follow-cam out of the tunnel, a dive into each tunnel, a spin on the spot at the centre circle, the team walking toward the camera), then ends with the **180° turn and aerial reveal of the stadium**.
- The scenes, the player, the kit, the tunnels and the team stay exactly as approved. The existing stills are the **references** for every clip.
- The free version in 5.2 is the launch version and stays as the fallback and lite mode.

**Credits:**
- Earlier estimate: **140–200 credits** including repairs. The balance on 6 Nov was about 6.6 credits. **Don't start until Adnan confirms a top-up.**
- **Check the live model schema, the balance and a `get_cost` preflight for all three clips and both reference stills together** before submitting anything.
- If the total isn't covered, stop, tell Adnan the exact number of credits needed, and wait. **Never buy credits or change the plan.**
- Extension jobs can cost more than the preflight says, because they also process the input clip. Check the balance after every job and log the actual use.
- Use the Higgsfield MCP only. If it isn't callable, say so once and continue with 5.2.

**Physical logic:** all of it happens in one place, the modern pro stadium of our stills. The camera never cuts and never teleports; every change of space is flown through an opening. The architecture matches the stills throughout: navy padded tunnel walls, brushed steel handrails, LED strip ceiling, the modern bowl, plain dark advertising boards.
- Each of the Events, Tournaments and Scouting tunnels ends in a **bright, even exit glow**. The website masks the real photo into that glow, so it must be clean and flat.
- The Conferences tunnel ends in a **closed double door with warm light around its edges and no lettering**. The website draws its own door and "Conference room" plate over it, and the click animation is web, not video.

#### Visual Story of the take (present it at the first review point)

| Scene | Visual story | Website copy |
|---|---|---|
| H1 — Breathe | Clip A, 0–2.5 s: the camera holds behind the DIALI 20 player in the dark tunnel; his shoulders rise and fall. | Date chip · "Breathe." · "Seen. Ready. Chosen." · mission line · Reserve your seat · Skip the tour |
| Transition — Run-out | 2.5–6.5 s: the player runs out. The camera follows close behind him at shoulder height, out through the tunnel mouth under flaring floodlights, and stays on his back to the centre circle, where he runs on out of frame. | No copy — let the motion lead. |
| H2 — Four ways in | 6.5–8 s: at the centre the camera rises to about 3 m and eases back a few metres, just enough to hold all four tunnel mouths in frame. | Proof strip |
| H3a — Events | 8–10.5 s: pushes straight into the Events tunnel toward its bright exit glow and holds. | The real photo is masked into the glow · "Events" + one fact + link |
| Transition — Back and spin | 10.5–12.5 s: backs up to the centre circle. 12.5–15 s: **yaws on the spot** to face Tournaments. | No copy — let the motion lead. |
| H3b — Tournaments | Clip B, 0–2.5 s: the same dive and hold. 2.5–4.5 s: back up. 4.5–6 s: spin on the spot to Scouting. | Photo · "Tournaments" + fact + link |
| H3c — Scouting | 6–8.5 s: the same dive and hold. 8.5–10.5 s: back up. 10.5–11.5 s: spin to Conferences. | Photo · "Scouting" + quote + link |
| H3d — Conferences, the door | 11.5–14 s: dives into the last tunnel and stops about a metre from the closed double door, warm light at its edges, and holds. 14–15 s: begins to back out. | HTML door + "Conference room" + **Enter the conference** |
| Transition — Spin back | Clip C, 0–1.5 s: backs out to the centre circle. 1.5–4 s: spins on the spot past all four lit tunnels and stops facing the main tunnel the player came out of. | Optional "The whole of DIALI, at once." |
| H5 — The team | 4–8 s: the four team members walk out of the main tunnel **toward the camera**, side by side, **backlit, faces in deep shadow**. The camera drifts slowly backwards in front of them. | Names and roles · More about our team |
| H6 — The rise | 8–10 s: the camera rises and passes over their heads toward the main stand. | Mission line |
| Transition — 180° turn | 10–11.5 s: still moving, the camera **yaws 180°** to look back across the pitch, with the team below. | No copy — let the motion lead. |
| H7 — The reveal | 11.5–15 s: flies **backwards and climbs** over the main stand roof. The whole lit stadium appears, connected to access roads with car light trails, a car park, a ring road, neighbouring buildings and city lights. It ends high and still. | **Register for The Mind Behind the Game** · Partner with us · "Sport for Solidarity · co-funded by the European Solidarity Corps, with JINT" |

After the table, explain the route briefly and how scrolling brings in, holds and removes the copy. Scroll pacing (below) stretches the short segments, so 45 s of footage is enough. Only if a segment is unusably rushed after inspection, propose a fourth extension to Adnan with its exact cost; never add one without his OK.

#### Fly it like a real pilot

A camera on a straight rail reads as a dolly, not a flight. Write every manoeuvre the way an FPV pilot flies:
- **Vary the speed:** slow for the player, each tunnel hold, the door and the team; fast on the run-out and when backing out of a tunnel.
- **Bank and drift sideways** on the run-out and around the team, then curve back.
- **Spin on the spot** at the centre circle: a clean yaw in place with a tiny altitude drift. It is a real pilot move, not a cut.
- **Yaw to look at what matters** (each lit tunnel, the team) while still travelling.
- **S-curves** on the run-out and over the pitch.
- **Respect the stadium:** no flying through stands or walls; turns happen in open space or through openings.
- **Time every manoeuvre** with second ranges, e.g. "10.5–12.5 s: backs straight out of the tunnel to the centre circle; 12.5–15 s: yaws right on the spot to face the next tunnel".

#### The turn and the reveal must be physically correct

- The camera only shows what is really there in each direction.
- To reveal the stadium, the camera **yaws 180° while still moving** to face back across the pitch, then **flies backwards and climbs**. It never flies forward and sees the same stadium ahead of it.
- The final aerial places the stadium realistically: an access road and car park, a main road with moving traffic, neighbouring buildings and city lights at night (a Flemish city edge). **Never** a stadium floating in an empty field.

#### Generate as one chained take

- **Reference stills (about 2 credits each), generated first:**
  - **Door still:** the end of the existing navy tunnel with a closed double door, warm light around its edges, no lettering. Made from `home_01_tunnel_desktop`, keeping its architecture.
  - **Reveal still:** a high night aerial of the same stadium from behind the main stand, with the lit bowl, the roads, the car park and city lights. Made from the hub and stadium stills, keeping their architecture.
- **Clip A (~15 s, H1 → Events → spin):** image-to-video (e.g. Seedance 2.5 `omni_reference`) with **`home_01_tunnel_desktop` as `start_image`**, and the walk-out end still and the hub as image references.
- **Clip B (~15 s, Tournaments → Scouting → the door):** **video extension** of clip A (e.g. Seedance 2.5 `video_extension`, `extension_mode: forward`), with the hub and the door still as image references.
- **Clip C (~15 s, spin back → team → rise → 180° → reveal):** extension of clip B, with the team still and the **reveal still** as image references.
- Extension continues the same camera, lighting and speed from the previous clip's last frame. **Never** generate separate scenes and hide the joins with crossfades.
- Generate in order. **Inspect each clip before starting the next.** Keep job IDs, and fetch existing results before resubmitting anything. A pending job is not a failed job. Keep building the website while clips render.

**Prompt wording that matters:**
- **Never write "drone", "quadcopter" or "UAV".** Write instead: *"one single continuous first-person camera move, no cuts; the camera itself is flying; nothing flying or hovering is ever visible in frame."* ("Like drone footage" is the brief to you, never a word in the prompt.)
- *"The player is only ever seen from behind. The four team members walk toward the camera backlit, their faces in deep shadow and never readable. Nobody changes, appears or disappears. The DIALI and 20 lettering on the jersey stays sharp and unchanged."*
- Give each segment timed manoeuvres, and say what is visible through the next opening (the exit glow, the door).
- Lighting: cool navy shadows, warm gold floodlights, 24 mm look, slight grain.
- *"No text, no logos, no crests, no sponsor boards, no signage lettering, no door signs, no competition stars, no brand badges."*
- Decline presets that don't match; write the prompt literally.

**Inspect every clip (FFmpeg):**
- a contact sheet at 1–2 fps, which you view
- cut detection with `select='gt(scene,0.3)'`, which must find nothing
- zoom into the tunnel mouth, each tunnel's exit glow (clean enough for the photo mask?), each spin on the spot, the door, the team's faces (still in shadow?), the 180° turn and the final seconds
- compare the last frame of each clip with the first frame of the next

Check for: stray drones or flying objects, people or cars appearing from nowhere, logos or lettering, a warping jersey, readable faces, tunnels changing position between spins, impossible geography, and jumps in position, scale or light.

**Repair instead of regenerating:**
- Trim to clean frames, then upload the trimmed clip (`media_upload` → PUT → `media_confirm`) and extend from it.
- For a small artefact: cut the stretch, run a text video edit (e.g. "remove the small flying object from every frame; keep everything else identical"), splice it back, and note any softer section.
- Extend from a clean tail.
- No open-ended regeneration loops; keep every asset that is already useful.

**Stitch one master:**
- Normalize each segment: `scale=1920:1080:flags=lanczos,fps=24,format=yuv420p,setsar=1`.
- Hard concat where clips came straight from an extension; `xfade=transition=fade:duration=0.125` only where a repaired piece meets an original.
- Apply the 5.2 grade. Run cut detection again and view a contact sheet of the whole master.
- Extract the desktop and mobile frame sequences and the manifest (5.5).
- **Mobile crop check:** the player's back on the run-out, all four tunnel mouths in the pull-back (pan if needed), each exit glow and its photo panel, the door, all four team members, the 180° turn and the whole stadium in the final aerial must stay inside the centre crop (per-beat `focusX`).

**Pacing of the take** (`film.yaml`, desktop / mobile vh). It replaces the free-version Home pacing when the take is live.

| Beat | Desktop | Mobile |
|---|---|---|
| Breathe hold | 80 | 45 |
| Run-out (follow-cam) | 120 | 90 |
| Ease back, four tunnels | 50 | 40 |
| Photo tunnel dive + photo hold (×3) | 3 × (40 + 60) | 3 × (30 + 45) |
| Back up + spin on the spot (×3) | 3 × 50 | 3 × 40 |
| Conferences dive + door hold | 40 + 80 | 30 + 60 |
| Out + spin back past all four | 70 | 55 |
| Team walks toward the camera | 120 | 90 |
| Rise over the team | 50 | 40 |
| **180° turn (its own beat)** | 70 | 55 |
| Reverse climb + reveal | 120 | 90 |
| Final hold | 60 | 40 |

### 5.4 Conference bridge clips (optional, after the homepage take)

Each one is a 5 s Kling 3.0 std clip, sound off (~7.5 credits). It uses an **existing still as `start_image` and the next existing still as `end_image`**, so it joins two approved scenes exactly. In priority order:

| Priority | Bridge | Start → end | Motion prompt (summary) |
|---|---|---|---|
| 1 | **Pull-back to FC 27 (C1 → C6)** | `conf_01_penalty_desktop` → `conf_06_fc27_reveal_desktop` | The camera pulls straight back out of the stadium image, revealing it is on a large screen in a dark room, with a teenager holding a controller in the foreground. |
| 2 | **Into the mind (C1 → C2)** | `conf_01_penalty_desktop` → `conf_02_inside_the_mind_stars` | The camera pushes toward the player's head; the stadium dissolves into darkness and golden particle threads forming a head. |
| 3 | **Spotlight loop (C4)** | `conf_04_voices_stage` as start and end | Haze drifts slowly in the single spotlight beam; the camera barely moves; a seamless loop. |
| 4 | **Star → spotlight (C3 → C4)** | a crop of `conf_02_inside_the_mind_stars` centred on star 4 → `conf_04_voices_stage` | The star swells into a soft gold light that becomes the spotlight beam over chair 2. |
| 5 | **Over the seats (C4 → C5)** | `conf_04_voices_stage` → `conf_05_venue_cinema_hall` | The camera pulls back from the stage and rises over the rows of seats. |

The same prompt rules, inspection, repair and grading as 5.3 apply. Convert each bridge to desktop and mobile sequences and log the credits used.

### 5.4b Pacing (desktop / mobile vh)

**Conference:**

| Beat | Desktop | Mobile |
|---|---|---|
| Door arrival (bloom → C1) | 40 | 30 |
| C1 noise | 140 | 100 |
| Into the mind | 80 | 60 |
| Star path (4 stops) | 4 × 70 | 4 × 50 |
| Star → spotlight | 60 | 45 |
| C4 voices | 120 | 90 |
| Pull-back over the seats + C5 details | 60 + 100 | 45 + 80 |
| C6 pull-back | 120 | 90 |

**Home, free version (5.2), the launch version:** Breathe hold 80/45 · run-out 120/90 · bloom + ease back 50/40 · photo tunnel zoom + photo hold 3 × (40 + 60) / 3 × (30 + 45) · back + spin pan 3 × 50 / 3 × 40 · Conferences zoom + door hold 40 + 80 / 30 + 60 · spin-back pan + ink dip 40/30 · team 120/90 · rise and ending 120 + 60 / 90 + 40.

Tune all of these after real scrolling tests. If you couldn't test interactively, say pacing is **unverified**.

### 5.5 Working process, review points and frame engineering

These rules are carried over from Adnan's fly-through and mobile prompts and adapted to the existing scenes.

**Mode: guided-light.** There are exactly two short review points; after them, build without waiting:
1. **Visual Story review.** Before writing any film code or spending any credit, present the **Visual Story** table (format below), then a short explanation of how scrolling brings in, holds and removes each chapter's copy, then the scroll pacing plan (5.3 and 5.4b).
2. **Style tile + graded stills review.** Show `/styleguide` and before/after frames of the colour grade.

If Adnan doesn't answer within the session, continue with your recommendation and record it. Never re-ask anything this prompt or the concept document already answers.

**Visual Story table.** Use exactly these three columns: **Scene · Visual story · Website copy**. Fill it from the existing scenes and the copy in 4.1 and 4.2. Transitions get their own rows with "No copy — let the motion lead". Example rows:

| Scene | Visual story | Website copy |
|---|---|---|
| H1 — Breathe | The DIALI 20 player breathes in the dark pro tunnel; the exit glow brightens as you scroll. | Date chip · "Breathe." · H1 "Seen. Ready. Chosen." · mission line · Reserve your seat · Skip the tour |
| Transition — Run-out | Exact-frame cut into the walk-out; the camera follows close behind him out under the floodlights to the centre of the pitch. | No copy — let the motion lead. |
| H3a — Events | A gold bloom into the hub, a slight ease back to show all four tunnels, then a dive into Events; the real photo waits at the end like the exit light and comes alive. | "Events" + one fact + link (`/events`) |
| Transition — Back and spin | Back up to the centre circle and spin on the spot to the next tunnel. | No copy — let the motion lead. |
| H3d — Conferences | Dive to the closed "Conference room" door. | **Enter the conference** → door swings open → `/the-mind-behind-the-game` |
| … | … | … |

**Style tile** (`/styleguide`, editable HTML/CSS using the real tokens): the DIALI logo as supplied (never redrawn), the palette, heading and body type, the buttons, links, date chip, glass panel, stat tile, quote block, ticket card, a sample programme card, and the photo and imagery treatment. Keep the source assets, prompts and the reason for each choice in `docs/production-note.md`.

**Frame sequences and manifest.** For every scrubbed clip (the walk-out and any bridge clip):

```
ffmpeg -i <clip>.mp4 -an -vf "fps=20,scale=1440:-2:flags=lanczos" -c:v libwebp -quality 78 -start_number 0 frames/desktop/<scene>/frame-%04d.webp
ffmpeg -i <clip>.mp4 -an -vf "fps=20,crop=ih*9/16:ih:<x from focusX>:0" -c:v libwebp -quality 78 -start_number 0 frames/mobile/<scene>/frame-%04d.webp
```

- Use 18–24 fps. Also try AVIF and keep whichever is smaller. Never upscale.
- Per scene, write a `manifest.json` with: the actual frame count, fps, dimensions, the naming pattern, the poster, and a `version` that is appended to every frame URL for cache-busting.
- Verify the first, middle and last frames and every referenced path before integrating.

**The frame loader** (one module, used by every film):
- The pinned canvas maps scroll to frames through the piecewise beat timeline in `film.yaml`: each beat has `vh`, `vhMobile`, `from`/`to`, `hold`, `chapter`, `focusX`, and the tunnel photo mask values (`maskX/Y/W/H` per tunnel).
- Copy fades in, holds and fades out within its beats. The first chapter is visible at rest; the last one holds at the end.
- **Show the poster immediately.** Load the frame needed now first, then nearby frames in the scroll direction.
- **Bound concurrent requests** (about 6) and **decoded-frame memory** (an LRU of about 60 bitmaps on mobile, 120 on desktop).
- **Abort obsolete requests** on fast scrolls, **call `close()` on evicted ImageBitmaps**, and retry a limited number of times with backoff.
- Handle fast jumps, reverse scrolling, resize, orientation change and high-DPI displays (DPR capped at 2).
- Never block the page while frames load; the rest of the site stays usable.
- Motion rendering is fully separate from the HTML. Copy, buttons and nav stay real, crisp, selectable and keyboard-accessible, and hidden copy is `inert`.
- No scroll hijacking. A "Skip the tour" link is on every film.
- **Reduced motion and constrained devices:** each chapter is shown over its graded still in normal page flow, and **no frames are fetched**. If loading fails, a usable poster stays on screen.

**Validation of the films:**
- Each beat reaches its intended frame, chapters appear on their beats, and the final hold works.
- Scroll forward and backward with ordinary scrolling at all the desktop and phone sizes in Part 8.
- If interactive scroll testing isn't available, report pacing as **unverified**. Don't claim it is smooth because the build compiles.
- Where network inspection is available, confirm which frame set each viewport requests.
- Report measured asset sizes separately from measured loading speed.

## PART 6 — Mobile (same site, same footage, framed for the phone)

- **No new video for mobile.** Draw the canvas with cover fit: `scale=max(cw/fw,ch/fh)`, centred, with the backing store at the viewport × DPR (capped at 2), recomputed on resize and orientation change.
- **Check the centre ~45% of every beat.** These must stay in: the player's DIALI 20 back (H1, the run-out, C1), the tunnel mouth (H2), all four tunnel mouths in the pull-back (pan sideways if they don't fit), each tunnel's photo at the end of its dive, the door with its "Conference room" plate and **Enter the conference** button, each spin on the spot (pan, never squash), all four team members with their names, the centre circle and the reveal (H6), the active star and the star → spotlight growth (C3), the spotlit chair (C4), the seats in the pull-back (C5) and the teenager plus the screen (C6). Fix with a per-beat `focusX`, eased between beats. Report anything that can't be rescued.
- **Phones load only the portrait frame set; desktops only the landscape set.** Decide before any frame is requested; on crossing the breakpoint, cancel old requests and release their bitmaps.
- **Mobile hero:** glass header, "Breathe." + **"Seen. Ready. Chosen."**, the date chip, one gold **Reserve your seat**, a scroll cue. Nothing else.
- **During the film:** one short heading per chapter, at the bottom over a soft ink scrim, clear of the subject and of the header. Body copy and actions come back at the ending (H6).
- **Every section reflows to one column:**
  - seat rows as strips
  - full-width form fields and buttons
  - card grids at one column
  - the four programmes and the timelines stacked (connector lines dropped)
  - image bands with text at the bottom over a scrim
  - footer at two columns, then one
- **No horizontal overflow anywhere.**

---

## PART 7 — Redirects, launch and switch

**301 redirects** (`_redirects`):

| Old URL | New URL |
|---|---|
| `/about-us` | `/#vision` |
| `/contactus` | `/contact` |
| `/sponsors-partners-current-previous` | `/become-a-sponsor/partner#partners` |
| `/blog*` | `/news` |
| the conference news posts | `/news/the-mind-behind-the-game` |
| `/event/the-mind-behind-the-game-7/*` | `/the-mind-behind-the-game` |
| `/event/{spot-the-spark-4, the-digital-playbook…-1, diali-dream-big-tournament-i-6, -ii-5}/*` | `/events/{slug}` |
| the Inter Cup and Summit URLs | `/events` |
| `/event`, `/event/*/ics` | `/events` |
| `/web/login` | `/` |
| bare domain | `www` |

`/seats`, `/seats-privacy`, `/the-mind-behind-the-game`, `/our-programs`, `/events`, `/become-a-sponsor/partner` and `/privacy` keep their URLs, because they are already in emails and print.

**Phases:**
- **P0, now:** the text fixes on the current Odoo site:
  - remove "free / 140 / 200 seats / four elite voices"
  - fix the Contact Us link
  - change the workshop count to 20+
  - unpublish the Summit and Inter Cup
  - change "annual" to "planned"
  - fix the meta descriptions
- **P1, by 13 Nov:** tokens and style tile, header and footer, CMS, Contact/Partners/Clubs/Privacy/404/News/Events/Programs/FC 27, forms, redirects, the colour grade; move the nameservers to Cloudflare (copy every DNS record first).
- **P2, by 18 Nov (critical path):** the seat flow on a **copy** of the Sheet and script, the emails, admin, and a load test with 40 simultaneous bookings.
- **P3, by 21 Nov:** the cinematic Home and Conference pages with the existing assets, lite mode, and device tests.
- **Go/no-go, Sat 21 Nov:** Adnan tests on his phone; the budgets are met; the booking/cancel/waitlist loop works. Otherwise use the **8 Dec** fallback.
- **Switch, Tue 24 Nov, 09:00:**
  - On Mon 23 Nov: TTL down to 60 s, deploy the script changes live, check the old seat page still works, and email any Odoo event registrants the `/seats` link.
  - On Tue 24 Nov: point the new front end at the live script, add the domains, check that the counts match, make one live booking and cancel it, run a redirect test, and unpublish the Odoo register page.
  - **Rollback:** point www back to Odoo (about 1 min). The Sheet is shared, so no booking can be lost. Keep Odoo for 30 days.
- **P4, after Adnan confirms a credit top-up:** the Part 5.3 continuous homepage take (door and reveal stills, three chained clips with the follow-cam, tunnel dives, spins on the spot, the team toward the camera, the 180° turn and aerial reveal), then the 5.4 conference bridge clips. Each replaces its free 5.2 version through `film.yaml`.

**Publish only to the Cloudflare Pages preview URL** until the go/no-go. Never switch the domain without Adnan's explicit OK.

---

## PART 8 — Checks and hand-off

**Test at:** desktop 1440 × 900 and 1920 × 1080; phones 360 × 740, 375 × 812, 390 × 844 and 430 × 932, in portrait and landscape.

**Verify:**
- Every film beat reaches its frame; copy appears on its beats; the final hold works.
- The header switches between glass and solid in both scroll directions and is legible over the brightest frames.
- The menu works: focus, Esc, scroll lock; anchor offsets are right.
- Forms really submit, and their errors show.
- The seat flow works in all its states, with both the email and admin views.
- The redirects all work.
- Reduced motion and load-failure behaviour are correct.
- No horizontal scroll.
- Lighthouse/WebPageTest numbers are measured against the budgets.
- Where network inspection is possible, confirm which frame set each viewport requests.

Report measured sizes separately from measured speeds, and list what you checked and what you didn't.

**Hand-off package:**
- the preview link
- `/styleguide` and `DESIGN.md`
- the logo files used
- all graded stills and clips, the frame sequences with manifest (and, after P4, the reveal reference still, the original clips, the stitched and graded master, and the bridge clips)
- the content files
- a one-page **"How to edit your site"** guide for Adnan: change a date, publish a speaker, switch to `mode: past`, add a news post, see bookings, export the door list
- a short production note: decisions, `TO CONFIRM` items still open, prompts, job IDs, repairs, **credits used** and known limitations

No credentials or temporary signed URLs go in any package.

**Never:** invent facts or testimonials; show minors' photos without consent; touch the live booking Sheet except through the planned switch; publish publicly before the go/no-go; buy credits.

Keep going until the site is complete or a concrete dependency blocks you. Show finished work, not repeated plans. Ask Adnan only what this prompt marks `TO CONFIRM`, in **one** grouped message.
