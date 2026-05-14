# OnVex Web Development — Dashboard Prototype

Internal ops dashboard and client portal prototype for OnVex Web Development.

## What this is

A clickable HTML prototype of the OnVex management dashboard, showing both:

- **Admin view** — internal dashboard for managing sites, clients, billing, messages, campaigns, tasks, notifications, and settings
- **Customer view** — client-facing portal where clients see their site status, message us, view invoices, and submit requests

Use the pill switcher at the top of the page to flip between the two views.

## Live demo

Once deployed to GitHub Pages, this will be live at:
`https://[your-username].github.io/[repo-name]`

## How to run locally

This is a single HTML file with no build step or dependencies. Just open `index.html` in any browser.

```bash
# From the project folder
open index.html
```

Or right-click → Open With → your preferred browser.

## Stack notes

This is a static prototype only — all data is hardcoded. The real production app is planned to use:

- **Next.js** for the frontend
- **Supabase** for auth, database (Postgres), and realtime messaging
- **Stripe** for billing and recurring subscriptions
- **BetterStack or UptimeRobot** for site monitoring
- **Resend** for transactional email

## Brand

- **Name:** OnVex Web Development
- **Location:** Phoenix, AZ
- **Colors:** Warm desert palette (burnt sienna accent, cream backgrounds, deep navy ink)
- **Fonts:** Instrument Serif (display), Inter Tight (body), JetBrains Mono (data)

## Status

Prototype — not yet a functional application. All client names, invoices, and data are mock data for design and demo purposes.
