# Woodlands Family Theme Park

Modern React + Vite + Tailwind redesign for Woodlands Family Theme Park with route-based public pages, ticket reservations, admin/staff/shifts portals, cafe menu browsing, newsletter capture and local assets.

Production target: `https://woodlandspark.shubodaya.dev`

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

1. Create Cloudflare resources:

```powershell
npx wrangler d1 create woodlandspark-db
npx wrangler r2 bucket create woodlandspark-media
```

2. Copy the created D1 `database_id` into `wrangler.toml`.

3. Set secrets in Cloudflare Pages:

```powershell
npx wrangler pages secret put ADMIN_BOOTSTRAP_TOKEN --project-name woodlandspark
```

4. Apply schema and seed public content:

```powershell
npm run cf:d1:migrate
npm run cf:d1:seed
```

5. Build and deploy:

```powershell
npm run build
npm run cf:deploy
```

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
