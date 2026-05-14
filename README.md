# OnVex Web Development

Internal ops dashboard and client portal for OnVex Web Development.

This repo contains:

- **`/` (Next.js app)** — the production application: admin dashboard at `/admin/*` and customer portal at `/portal/*`.
- **`/prototype/index.html`** — the original single-file HTML prototype, kept for design reference.
- **`/supabase/migrations/*.sql`** — database schema and Row Level Security policies.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind v4)
- **Supabase** — Postgres + Auth + RLS
- **Stripe** — billing and subscriptions
- **Resend** — transactional email
- **Vercel** — hosting

## Quick start

1. Copy the env template and fill in your keys:
   ```bash
   cp .env.example .env.local
   ```
2. Install dependencies and run the dev server:
   ```bash
   npm install
   npm run dev
   ```
3. Apply the database migrations in Supabase (see `SETUP.md`).

Open <http://localhost:3000>. You'll be redirected to `/login` until you have an account.

See `SETUP.md` for the full step-by-step setup, including Supabase, Stripe webhooks, Resend, and Vercel deploy.

## Project structure

```
src/
  app/
    (auth)/                 login, signup, forgot/reset password + server actions
    admin/                  staff dashboard (sidebar layout)
    portal/                 client portal (tab layout)
    auth/callback/          Supabase OAuth/magic-link callback
    api/stripe/webhook/     Stripe webhook handler
  components/               shared UI (brand, sidebar, page-stub, forms)
  lib/
    supabase/               browser, server, and middleware clients + types
    stripe.ts               Stripe SDK singleton
    email.ts                Resend wrapper
    nav.ts                  admin + portal navigation
  middleware.ts             session refresh + RBAC route protection
supabase/migrations/        SQL: schema + RLS
prototype/                  original static prototype (design reference)
```

## Roles

- **`owner`** — full admin, can change roles of others
- **`staff`** — full admin minus role management
- **`customer`** — sees only their own client's data via `/portal/*`

New signups default to `customer`. Promote yourself to `owner` directly in the Supabase SQL editor:

```sql
update public.profiles set role = 'owner' where email = 'you@onvex.dev';
```

## Status

Scaffolded. Auth + RBAC + layouts + all routes exist. Most page bodies are stubs (`<PageStub />`) — replace them with real implementations one at a time using the prototype as the target design.
