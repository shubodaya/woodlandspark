# Woodlands Family Theme Park

Modern React + Vite + Tailwind redesign for Woodlands Family Theme Park with route-based public pages, ticket reservations, admin/staff/shifts portals, cafe menu browsing, newsletter capture and local assets.

Production target: `https://woodlandspark.shubodaya.dev`

Current Cloudflare Pages URL: `https://woodlandspark.pages.dev`

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

Create local users without committing credentials:

```powershell
node tools/create-local-admin.mjs "Woodlands Admin" admin@example.com "use-a-long-private-password" super_admin
node tools/create-local-admin.mjs "Woodlands Staff" staff@example.com "use-a-long-private-password" staff
```

By default, `npm run db:seed` does not create users or passwords. If example local users are needed, set `WOODLANDS_SEED_EXAMPLE_USERS=true` and provide all `WOODLANDS_SEED_*_PASSWORD` environment variables privately before running the seed script.

## Production Setup

Cloudflare production is configured as a GitHub-linked Pages project:

- Project: `woodlandspark`
- Repository: `shubodaya/woodlandspark`
- Production branch: `main`
- Build command: `npm run build`
- Output directory: `dist`
- D1 binding: `DB` -> `woodlandspark-db`
- R2 binding: `MEDIA_BUCKET` -> `woodlandspark-media`

Future pushes to `main` should trigger Cloudflare Pages deployments automatically.

Latest verified production deployment:

- Commit: `d79c18a`
- Pages URL: `https://woodlandspark.pages.dev`
- Status: deployed successfully with SPA route fallback, D1 binding and R2 binding.

Custom domain status:

- `woodlandspark.shubodaya.dev` has been added to the Pages project.
- Cloudflare currently reports the domain as pending because the CNAME record is not set.
- Required DNS record in the `shubodaya.dev` zone:

```text
type: CNAME
name: woodlandspark
target: woodlandspark.pages.dev
```

The local Wrangler OAuth credentials used for this setup can manage Pages, D1 and R2, but were not accepted by the Cloudflare DNS API for zone record creation. Add the CNAME in the Cloudflare dashboard or with a DNS-scoped Cloudflare API token, then Cloudflare Pages should validate the custom domain.

1. Cloudflare resources already created:

```powershell
woodlandspark-db
woodlandspark-media
```

2. If the D1 database is recreated, copy the new `database_id` into `wrangler.toml`.

3. Set secrets in Cloudflare Pages:

```powershell
npx wrangler pages secret put ADMIN_BOOTSTRAP_TOKEN --project-name woodlandspark
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

6. Create the first production admin through the protected bootstrap endpoint:

```powershell
curl -X POST https://woodlandspark.shubodaya.dev/api/setup/first-admin `
  -H "Content-Type: application/json" `
  -H "X-Bootstrap-Token: <ADMIN_BOOTSTRAP_TOKEN>" `
  -d "{\"name\":\"Woodlands Admin\",\"email\":\"admin@example.com\",\"password\":\"use-a-long-private-password\"}"
```

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

## Important Boundaries

- Do not modify `D:\websites\dutyorbit`.
- Do not modify `D:\websites\ordercircuit`.
- Keep website CMS/admin and staff/payroll functionality separate.
- No real payments are connected.
- No real payslip files are stored.
- Do not commit `.dev.vars`, `.env`, SQLite files, uploads, logs, `node_modules` or `dist`.
