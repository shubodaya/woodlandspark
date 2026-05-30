# Woodlands Staff Portal

Future subdomain: `staff.woodlandspark.com`

Purpose: employee-facing portal for staff services. This is separate from `admin.woodlandspark.com`, which is only for website/content management.

Current implementation:
- `/staff` is served by the main Woodlands app.
- Staff login uses the shared auth API and role protection.
- Staff dashboard, announcements, staff documents, rota links and payslip-safe placeholders are backed by SQLite locally and D1 in Cloudflare.
- Manager/employer views are role-gated.

Suggested roles:
- `employee`
- `supervisor`
- `manager`
- `payroll-admin`
- `super-admin`

Payslip security TODOs:
- Secure authentication and MFA.
- Role-based access control.
- Private file storage.
- Audit logs for every payslip view/download.
- Payroll/Sage HR integration.
- No hard-coded real employee data, emails, passwords or payslips.

Only non-sensitive sample content is allowed until payroll integration is formally designed.
