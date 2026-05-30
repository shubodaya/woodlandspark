# Woodlands Foodorder Workspace

Future subdomain: `foodorder.woodlandspark.com`

The current food browsing experience is served by the main Woodlands app at:

- `/foodorder`
- `/visiting/food-drink`

The source OrderCircuit project was copied into this workspace for migration reference only. The copied implementation files are kept locally under `D:\websites\woodlands\apps\foodorder` and ignored from the production commit until they are reviewed and adapted.

Current production path:
- Menu browsing uses the shared Woodlands API and database.
- Online ordering and payment processing are not connected.
- No customer payment data is collected.

Run from the project root:

```powershell
npm run dev
```
