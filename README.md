# Woodlands Family Theme Park

Modern React + Vite + Tailwind redesign for Woodlands Family Theme Park with route-based public pages, ticket reservations, admin and staff operations, cafe menu browsing, newsletter capture and local assets.

Production target: `https://webdesignproject12.pages.dev`

Cloudflare Pages project: `webdesignproject12`

## Stack

- Frontend: React, Vite, Tailwind CSS.
- Production hosting: Cloudflare Pages.
- Production API: Cloudflare Pages Functions in `functions/`.
- Production database: Cloudflare D1 using `schema.sql` and `migrations/`.
- Production media/documents: Cloudflare R2 via `MEDIA_BUCKET`.
- Local development API: Express + SQLite in `server/`.

## Development

```powershell
cd D:\websites\woodlands
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

`npm run dev` starts the local API and Vite frontend together. The frontend proxies `/api` and `/uploads` internally, so the browser only needs the Vite site.

By default, `npm run db:seed` does not create users or passwords. Create local users through the protected first-admin setup flow, or use `tools/create-local-admin.mjs` with private values supplied from your own password manager or shell environment. Do not commit or document real credentials.

## Staff Rota

Rota/shifts now live inside the Staff Portal:

```text
http://127.0.0.1:5173/staff/rota
http://127.0.0.1:5173/staff/rota/schedule
http://127.0.0.1:5173/staff/rota/calendar
http://127.0.0.1:5173/staff/rota/shifts
http://127.0.0.1:5173/staff/rota/assignments
http://127.0.0.1:5173/staff/rota/timesheets
http://127.0.0.1:5173/staff/rota/team
http://127.0.0.1:5173/staff/rota/employees
http://127.0.0.1:5173/staff/rota/reports
http://127.0.0.1:5173/staff/rota/settings
```

The old `/shifts` route redirects users to `/staff/rota`.

The staff rota workspace uses the DutyOrbit-style full-page workflow inside the Woodlands staff portal: rota overview, schedule planner, monthly calendar, shift list, inline edit/delete, saved or custom work locations, break minutes, paid-break flag, staff assignment, timesheets, team board, employee rota directory, reports, settings and department/team filtering. Admins can use the Admin dashboard rota tile to enter the same staff rota workspace while remaining signed in as an admin.

Role access:

- `staff`: view own assigned rota.
- `supervisor`: view team rota.
- `manager`: create, edit and assign shifts.
- `admin` / `super_admin`: full rota access.

## Account Setup

Local first admin:

- Set `ADMIN_BOOTSTRAP_TOKEN` privately in the shell that starts `npm run dev`.
- Open `/admin/setup`.
- Enter the private setup token and the first administrator details.
- After one `admin` or `super_admin` exists, `/admin/setup` is disabled.

Production first admin:

- Set `ADMIN_BOOTSTRAP_TOKEN` as a Cloudflare Pages secret.
- Open `/admin/setup`.
- Enter the private bootstrap token and a 14+ character admin password.
- The setup endpoint refuses to create another admin after one admin exists.

Staff accounts:

- Sign in at `/admin/login` as `admin` or `super_admin`.
- Go to `/admin/users`.
- Use the Users tab to create staff, supervisor, manager and payroll-admin accounts.
- The admin user form queues a staff invite link for `/staff/invite/:token`; staff set their password before using `/staff/login`.
- If `EMAIL_WEBHOOK_URL` is configured, the invite payload is sent to that provider. Without a provider, the invite is stored in `email_outbox` and the admin screen shows the private invite link for manual sending.
- Password reset actions force the user to choose a new 14+ character password on next login.

## Production Setup

Cloudflare production is currently deployed through Wrangler:

- Project: `webdesignproject12`
- Repository: `shubodaya/woodlandspark`
- Production branch: `main`
- Build command: `npm run build`
- Output directory: `dist`
- D1 binding: `DB` -> `woodlandspark-db`
- R2 binding: `MEDIA_BUCKET` -> `woodlandspark-media`

The new `webdesignproject12` Pages project is not GitHub-linked yet. Deploy manually with `npm run cf:deploy`, or connect the project to the GitHub repository in the Cloudflare Pages dashboard if automatic deployments from `main` are required.

Latest verified production deployment:

- Source: current `main` deployment.
- Deployment refresh requested: `2026-06-02 21:30:38 +01:00`.
- Public URL: `https://webdesignproject12.pages.com`
- Cloudflare Pages fallback URL: `https://webdesignproject12.pages.dev`
- Status: deployed successfully with SPA route fallback, D1 binding and R2 binding.

Custom domain status:

- `webdesignproject12.pages.com` must be added to the Pages project as a custom domain before it can serve traffic.
- Cloudflare Pages default project hostnames use the `pages.dev` domain. The requested `pages.com` hostname requires domain ownership/DNS access.
- Required DNS record in the authoritative DNS zone for `pages.com` or the delegated subdomain:

```text
type: CNAME
name: webdesignproject12
target: webdesignproject12.pages.dev
```

Add the CNAME in the Cloudflare dashboard or with a DNS-scoped Cloudflare API token, then Cloudflare Pages should validate the custom domain.

1. Cloudflare resources already created:

```powershell
woodlandspark-db
woodlandspark-media
```

2. If the D1 database is recreated, copy the new `database_id` into `wrangler.toml`.

3. Set secrets in Cloudflare Pages:

```powershell
npx wrangler pages secret put ADMIN_BOOTSTRAP_TOKEN --project-name webdesignproject12
```

4. Apply schema and seed public content:

```powershell
npm run cf:d1:migrate
npm run cf:d1:seed
```

5. Build locally before pushing:

```powershell
npm run build
```

Deployment should run through the Cloudflare GitHub integration after pushing to `main`.

6. Create the first production admin through `https://webdesignproject12.pages.com/admin/setup` using the private `ADMIN_BOOTSTRAP_TOKEN`. Do not publish the token, email or password.

Disable or rotate `ADMIN_BOOTSTRAP_TOKEN` after the first admin is created.

## Cloudflare Files

- `wrangler.toml` defines Pages output, D1 and R2 bindings.
- `schema.sql` is the complete D1 schema.
- `migrations/0001_initial.sql` is the deployable D1 migration.
- `seed-production-safe.sql` contains public content only and no users or passwords.
- `seed-local.sql` contains public content plus non-sensitive local example rows.
- `.dev.vars.example` lists required local Pages Functions variables.
- `functions/api/[[path]].js` implements the D1-backed API.
- `functions/media/[[path]].js` serves R2 media objects.

## Admin Editing

The admin portal is at `/admin` after login. The navigation tabs expose create, save and delete actions for:

- users and staff invites
- pages, hero images and nested page sections
- events
- opening times
- FAQs
- media records and uploads
- document links
- newsletter subscribers
- ticket types
- rota/shifts

Content tabs now show edit controls and a live preview side by side where there is public-facing output, including users, pages, events, opening times, FAQs, media, documents, newsletter subscribers and ticket types.

Public pages fetch published CMS page records from `/api/pages`, so database edits to page titles, summaries, hero media paths and content sections can be reflected on the website without changing code.

## Important Boundaries

- Do not modify `D:\websites\dutyorbit`.
- Do not modify `D:\websites\ordercircuit`.
- Keep website CMS/admin and staff/payroll functionality separate.
- No real payments are connected.
- No real payslip files are stored.
- Do not commit `.dev.vars`, `.env`, SQLite files, uploads, logs, `node_modules` or `dist`.
