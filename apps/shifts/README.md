# Woodlands Shifts Workspace

Future subdomain: `shifts.woodlandspark.com`

The current shift/rota experience is served by the main Woodlands app at:

- `/shifts`
- `/staff`

The source DutyOrbit project was copied into this workspace for migration reference only. The copied implementation files are kept locally under `D:\websites\woodlands\apps\shifts` and ignored from the production commit until they are reviewed and adapted.

Current production path:
- Staff and rota pages use the shared Woodlands API and database.
- Sensitive staff documents and payslips are represented by secure placeholders only.
- No real employee personal data or payroll documents are stored.

Run from the project root:

```powershell
npm run dev
```
