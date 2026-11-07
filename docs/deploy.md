# Deploying the new DIALI site

Nothing here has been run yet. Every step needs Adnan's accounts and his go-ahead. The current site (Odoo, www.dialivzw.eu) stays untouched until the switch day.

## 1. Code home (GitHub)
1. Create an empty private repo, e.g. `diali-site`, on github.com.
2. Push this folder (without `node_modules`, `dist`, `preview-dist`).
3. `media-src/` holds the master images (34 MB). Commit it, or keep it in Drive and run `npm run media` locally before a build.

## 2. Cloudflare Pages (preview first)
1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick the repo.
2. Build command `npm run build`, output `dist`, Node 20.
3. Environment variable `PUBLIC_PREVIEW=1` on the preview branch (adds noindex + the "Preview" tag). Set `PUBLIC_PREVIEW=0` on production only on switch day.
4. KV: `npx wrangler kv namespace create DIALI_KV`, then bind it as `DIALI_KV` (see `wrangler.toml`).
5. Secrets (Settings → Variables, encrypted): `APPS_SCRIPT_URL`, `APPS_SCRIPT_SECRET`, `TURNSTILE_SECRET`, `ADMIN_EMAILS`.
6. Turnstile: create a widget for `dialivzw-site.pages.dev` and `www.dialivzw.eu`; put the site key in `src/lib/site.ts`.

## 3. Admin protection (Cloudflare Access)
Zero Trust → Access → Applications → Self-hosted → path `/admin*` and `/api/admin*` → allow only the emails in `ADMIN_EMAILS` (one-time PIN). The functions also check the `cf-access-authenticated-user-email` header.

## 4. Apps Script (booking backend)
1. Make a **copy** of the live booking Sheet first. Test on the copy.
2. Extensions → Apps Script → add `apps-script/DialiV2.gs` as a new file. Do not edit the existing `doPost` except one line at its top:
   `if (body && body.v === 2) return handleV2_(body);`
3. Script properties: `V2_SECRET` (same value as `APPS_SCRIPT_SECRET`), `RESEND_KEY`, `FROM_EMAIL`, `ADMIN_EMAIL`.
4. Run `setupV2()` once. It creates the tabs (Bookings, Waitlist, Messages, FC27, Analytics) and the hourly + nightly triggers.
5. Deploy → New deployment → Web app, execute as me, access anyone. Put its URL in `APPS_SCRIPT_URL`.
6. Only after the copy works end to end: repeat on the live Sheet (the "planned switch").

## 5. Domain switch (only with Adnan's explicit OK)
1. Lower the DNS TTL of `www` to 300 s two days before.
2. Cloudflare Pages → Custom domains → add `www.dialivzw.eu`.
3. Redirect bare `dialivzw.eu` → `https://www.dialivzw.eu` (Bulk redirect or a Page Rule).
4. Old Odoo URLs are mapped in `public/_redirects`.
5. Set `PUBLIC_PREVIEW=0`, redeploy, submit `sitemap.xml` in Search Console.
6. Rollback: point `www` back to Odoo. Keep Odoo running for 30 days.
