-- OnVex Web Development — initial schema
-- Roles: owner, staff, customer
-- Apply with: supabase db push   (or paste into the Supabase SQL editor)

create extension if not exists "pgcrypto";

-- ---------- role enum ----------
do $$ begin
  create type public.app_role as enum ('owner', 'staff', 'customer');
exception when duplicate_object then null; end $$;

-- ---------- helper: updated_at trigger ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- ---------- profiles (extends auth.users) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role public.app_role not null default 'customer',
  avatar_url text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile row when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- clients (OnVex's customers) ----------
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text,
  phone text,
  notes text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger clients_set_updated_at before update on public.clients
  for each row execute function public.set_updated_at();

-- ---------- client_members (which auth users belong to which client) ----------
create table if not exists public.client_members (
  client_id uuid not null references public.clients(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (client_id, user_id)
);

-- ---------- sites ----------
create table if not exists public.sites (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  name text not null,
  url text,
  status text not null default 'live',
  stack text,
  monitor_url text,
  last_deploy_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger sites_set_updated_at before update on public.sites
  for each row execute function public.set_updated_at();

-- ---------- leads (CRM pipeline) ----------
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text,
  phone text,
  source text,
  stage text not null default 'new',
  est_value numeric(10,2),
  notes text,
  assigned_to uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger leads_set_updated_at before update on public.leads
  for each row execute function public.set_updated_at();

-- ---------- conversations + messages ----------
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  subject text,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);
create index if not exists messages_conversation_idx on public.messages(conversation_id, created_at);

-- ---------- invoices ----------
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  number text not null unique,
  amount_cents integer not null,
  currency text not null default 'usd',
  status text not null default 'draft',
  stripe_invoice_id text,
  stripe_subscription_id text,
  due_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger invoices_set_updated_at before update on public.invoices
  for each row execute function public.set_updated_at();

-- ---------- tasks ----------
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  client_id uuid references public.clients(id) on delete set null,
  site_id uuid references public.sites(id) on delete set null,
  assigned_to uuid references auth.users(id) on delete set null,
  status text not null default 'todo',
  priority text not null default 'normal',
  due_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger tasks_set_updated_at before update on public.tasks
  for each row execute function public.set_updated_at();

-- ---------- time entries ----------
create table if not exists public.time_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  description text,
  started_at timestamptz not null,
  ended_at timestamptz,
  duration_seconds integer,
  created_at timestamptz not null default now()
);

-- ---------- notifications ----------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on public.notifications(user_id, created_at desc);
