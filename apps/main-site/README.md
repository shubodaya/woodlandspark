# Main Public Site

Future subdomain: `www.woodlandspark.com`

The public Vite/React site currently runs from the repository root so the production Cloudflare Pages build stays stable while the project is being split into app workspaces.

Workspace plan:
- Move root `src`, `public`, `index.html`, `vite.config.js`, `tailwind.config.js` and related config into `apps/main-site`.
- Keep shared content exports under a shared package or `packages/content`.
- Keep admin, shifts, foodorder and staff apps out of the public navbar.
- Keep all browser testing routes on the main site origin while subdomains are prepared.

Current root commands:

```bash
npm run dev
npm run build
```
