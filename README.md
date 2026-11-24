# OnVex Web Development

An internal operations dashboard and client portal for a small web development agency. Staff manage clients, sites, leads, billing, and tasks from `/admin`; the agency's customers log in to `/portal` to follow their project, message the team, and view invoices.

The repo holds two things:

- **A Next.js application** (`src/`, `supabase/`) with working authentication, role-based access control, a full Postgres schema with Row Level Security, and a working task manager. Most other pages are placeholders (see [Status](#status-and-limitations)).
- **A clickable static prototype** (`prototype/index.html`) that shows the full intended product, admin and customer views, with hardcoded mock data. It is the design target for the app.

**Prototype demo:** <https://dbrokenai.github.io/OnVexDevelopment/prototype/> (static HTML, mock data only; not the Next.js app)

## What it does

### Authentication (functional)

- Email/password sign up, login, logout, forgot password, and reset password, implemented as Next.js Server Actions against Supabase Auth.
- Form input validated on the server with Zod; field-level errors are returned to the forms through `useActionState`.
- Email-confirmation links land on `/auth/callback`, which exchanges the code for a session.
- The forgot-password action returns the same response whether or not the email exists, so it cannot be used to enumerate accounts.

### Roles and access control (functional)

| Role | Access |
| --- | --- |
| `owner` | Full admin; the only role allowed to change other users' roles |
| `staff` | Full admin, minus role management |
| `customer` | Client portal only; sees only data for clients they are a member of |

Access is enforced in three layers:

1. **Request proxy** (`src/proxy.ts`): refreshes the Supabase session cookie, redirects unauthenticated requests to `/login?next=...`, and bounces customers out of `/admin` and staff out of `/portal`.
2. **Server layouts**: `admin/layout.tsx` and `portal/layout.tsx` re-check the profile role before rendering.
3. **Postgres Row Level Security**: every table has RLS enabled, so the rules hold even if the UI checks are bypassed.

### Admin dashboard

- **Overview** (functional): live counts of clients, sites, leads, and invoices queried from Supabase.
- **Tasks** (functional): create, complete/reopen, and delete tasks through Server Actions. Tasks are grouped by an urgency level computed from the due date (overdue, today, soon, this week, later, no date). A month calendar view shows tasks per day, with previous/next navigation via URL parameters; clicking a day opens the list view with that date prefilled in the new-task form.
- **Sites, Clients, Leads, Messages, Field Mode, Billing, Reports, Campaigns, Time, Team, Docs/SOPs, Notifications, Settings**: routed and in the navigation, but placeholder pages.

### Client portal

- Layout, navigation, role gate, and sign-out are in place.
- **Home, Project, Messages, Billing, Updates, Requests, Reports, Referrals, Help**: placeholder pages.

### Billing (partial)

- `POST /api/stripe/webhook` verifies the Stripe signature against the raw request body and recognises invoice and subscription events. Writing those events to the database is not implemented yet.
- The `invoices` table already carries `stripe_invoice_id` and `stripe_subscription_id` columns for that step.

## How it is built

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16.2.6 (App Router, Server Components, Server Actions), React 19.2.4 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, CSS custom properties for the colour palette |
| Database and auth | Supabase (Postgres, Auth, RLS) via `@supabase/ssr` 0.10 and `@supabase/supabase-js` 2 |
| Validation | Zod 4 |
| Payments | Stripe SDK 22 |
| Email | Resend 6 |
| Linting | ESLint 9 with `eslint-config-next` |

Engineering decisions visible in the code:

- **Token verification, not cookie trust.** The proxy and server helpers call `supabase.auth.getUser()`, which validates the token with Supabase, rather than `getSession()`.
- **Authorization in the database.** `supabase/migrations/0002_rls.sql` defines `security definer` helper functions (`is_staff()`, `is_owner()`, `is_member_of_client()`) and per-table policies: staff have full access, customers get read access scoped through a `client_members` join table, leads and tasks are staff-only, and customers can only insert messages into conversations belonging to their own client.
- **No self-promotion.** The profile update policy lets users edit their own row but rejects any change to their own `role`.
- **Profiles created by trigger.** A Postgres trigger on `auth.users` creates the matching `profiles` row at sign up, defaulting to `customer`.
- **Schema covers the whole product.** Eleven tables (profiles, clients, client_members, sites, leads, conversations, messages, invoices, tasks, time_entries, notifications), with `updated_at` triggers and indexes on the message and notification lookups.
- **Server-first data flow.** Pages read data in Server Components; mutations are Server Actions that call `revalidatePath`. Client components are limited to forms and interactive rows.
- **Webhook hygiene.** The Stripe route runs on the Node.js runtime, reads the raw body, and rejects requests with a missing or invalid signature before doing anything else.
- **Security headers** set globally in `next.config.ts`: HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`.
- **Lazy SDK clients.** Stripe and Resend clients are created on first use and fail with a clear error if their key is missing.

## Running it locally

Requires Node 20+ and a Supabase project. Stripe and Resend accounts are needed only for the webhook and email helper.

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

Environment variables (see `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `RESEND_API_KEY`, `RESEND_FROM`
- `NEXT_PUBLIC_SITE_URL`

Apply the two SQL files in `supabase/migrations/` in order, sign up at `/signup`, then promote your account to `owner` in the Supabase SQL editor. New accounts are `customer` by default.

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

Full step-by-step instructions (Supabase URL configuration, Stripe webhook forwarding, Resend, Vercel deploy, and a security checklist) are in [SETUP.md](SETUP.md).

To view the prototype, open `prototype/index.html` in a browser. It has no build step.

## Project structure

```
src/
  app/
    (auth)/                 login, signup, forgot/reset password + server actions
    admin/                  staff dashboard (sidebar layout); tasks/ is the built-out feature
    portal/                 client portal (tab layout)
    auth/callback/          Supabase code-exchange callback
    api/stripe/webhook/     Stripe webhook handler
  components/               brand, sidebar, top bar, portal nav, page stub, ui/ primitives
    tasks/                  task row, new-task form, calendar, list/calendar toggle
  lib/
    supabase/               browser, server, and proxy clients + hand-written DB types
    tasks.ts                task queries
    tasks-actions.ts        task server actions (create, set status, delete)
    urgency.ts              due date -> urgency level, labels, and styles
    stripe.ts               Stripe SDK singleton
    email.ts                Resend wrapper
    nav.ts                  admin + portal navigation definitions
  proxy.ts                  session refresh + role-based route protection
supabase/migrations/        0001_init.sql (schema), 0002_rls.sql (RLS policies)
prototype/                  static single-file prototype (design reference)
public/demo.html            earlier snapshot of the prototype
```

## Status and limitations

This is an early-stage build, not a finished product.

- **Working end to end:** authentication flows, role-based routing, database schema and RLS policies, the admin overview counts, and the admin task manager (list and calendar).
- **Placeholder pages:** 13 admin sections and all 9 portal sections render a "Coming soon" stub. Their tables and policies exist; the UI and queries do not.
- **Stripe:** the webhook verifies and acknowledges events but does not persist them. There is no checkout, subscription management, or invoice UI.
- **Email:** the Resend wrapper exists but nothing calls it yet. Auth emails are sent by Supabase.
- **`SUPABASE_SERVICE_ROLE_KEY`** is listed in the env template but not used by any code yet.
- **Tasks:** the client, site, assignee, and description columns exist in the schema but the form only sets title, due date, and priority. There is no task editing beyond status.
- **Prototype:** all names, invoices, and figures in it are mock data. Only its task list persists, to the browser's `localStorage`.
- **No automated tests** and no CI configuration.
- **Open items from the security checklist in SETUP.md:** rate limiting on auth endpoints, CAPTCHA/2FA, and a Content Security Policy header.
- Database types in `src/lib/supabase/types.ts` are hand-written and cover only `profiles`, `clients`, and `tasks`.
