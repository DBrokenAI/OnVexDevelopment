# OnVex Setup Guide

End-to-end setup: from cloned repo to logged in and running locally, plus a checklist for production deploy.

## 1. Local prerequisites

- Node 20+ (Node 22 or 24 recommended)
- npm 10+
- A Supabase account
- A Stripe account (test mode is fine to start)
- A Resend account (with one verified sending domain)
- A Vercel account (for deploy)

## 2. Install

```bash
npm install
cp .env.example .env.local
```

## 3. Supabase

1. Create a new project at <https://supabase.com/dashboard>.
2. In **Project Settings → API**, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server-only)
3. In **Authentication → URL Configuration**, add:
   - Site URL: `http://localhost:3000` (and your production URL when ready)
   - Redirect URLs: `http://localhost:3000/auth/callback`, plus your production callback.
4. In **Authentication → Email Templates**, point the "Reset password" link at `{{ .SiteURL }}/reset-password`.
5. Apply the migrations. Either:
   - Paste each file in `supabase/migrations/` into the SQL editor in order, **or**
   - Use the Supabase CLI:
     ```bash
     npx supabase link --project-ref <your-project-ref>
     npx supabase db push
     ```
6. Promote your account after signing up:
   ```sql
   update public.profiles set role = 'owner' where email = 'you@onvex.dev';
   ```

## 4. Stripe

1. Grab `Publishable key` and `Secret key` from **Developers → API keys**.
   - Publishable → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret → `STRIPE_SECRET_KEY`
2. Set up the local webhook listener for testing:
   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   Copy the `whsec_...` it prints into `STRIPE_WEBHOOK_SECRET`.
3. In production, register the webhook in the Stripe dashboard pointing at `https://<your-domain>/api/stripe/webhook` and use that `whsec_...` value for the Vercel env var.

## 5. Resend

1. In **Domains**, add and verify your sending domain (e.g. `onvex.dev`).
2. Create an API key in **API Keys** → `RESEND_API_KEY`.
3. Set `RESEND_FROM` to a verified address like `OnVex <noreply@onvex.dev>`.

## 6. Run

```bash
npm run dev
```

Sign up at `/signup`. After confirming your email, promote yourself to `owner` (step 3.6) and you'll land at `/admin`.

## 7. Deploy to Vercel

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Add every variable from `.env.example` to **Project → Settings → Environment Variables**.
4. Update `NEXT_PUBLIC_SITE_URL` to your production URL.
5. Add the production callback URL to Supabase's Redirect URLs list.
6. Register your production Stripe webhook (step 4.3) and put the new `whsec_...` into Vercel.

## Security checklist

- [x] HTTPS-only headers (HSTS, X-Frame-Options, etc.) in `next.config.ts`
- [x] Row Level Security enabled on every table (see `supabase/migrations/0002_rls.sql`)
- [x] `getUser()` (verifies token with Supabase) used in middleware instead of `getSession()`
- [x] `.env.local` ignored in git; `.env.example` committed as template
- [x] Stripe webhook signature verified before processing events
- [x] Forgot-password endpoint never reveals whether an email is registered
- [ ] Add rate limiting on auth endpoints (recommended: Upstash Redis or Supabase Edge functions)
- [ ] Enable Supabase's CAPTCHA / phone-based 2FA for sensitive accounts
- [ ] Add a Content Security Policy header tuned to your asset hosts
- [ ] Rotate any keys committed during development before going live

## Generating Supabase types

The handwritten `src/lib/supabase/types.ts` only covers the columns the app reads directly. Once you're stable, generate full types:

```bash
npx supabase gen types typescript --project-id <id> --schema public > src/lib/supabase/types.ts
```
