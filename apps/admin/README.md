# Woodlands Website Admin Portal

Future subdomain: `admin.woodlandspark.com`

Purpose: authorised Woodlands staff will manage official public website content.

Current implementation:
- `/admin` is served by the main Woodlands app.
- Login uses the shared auth API and role protection.
- Dashboard, content, media, events, opening times, FAQs, documents, subscribers, ticket types and bookings are backed by SQLite locally and D1 in Cloudflare.
- Roles are planned around `admin`, `editor`, `media_manager` and `super_admin`.

TODO:
- Add MFA and staff identity provider integration.
- Add media moderation and licence metadata.
- Add draft/review/publish workflow.
- Expand audit reports for content changes.

Do not expose this app through the public website navbar.
