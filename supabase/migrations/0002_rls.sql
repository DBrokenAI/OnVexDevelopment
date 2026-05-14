-- OnVex Web Development — Row Level Security policies
-- Run after 0001_init.sql

-- ---------- helper functions (security definer; bypass RLS) ----------
create or replace function public.current_role()
returns public.app_role
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.current_role() in ('owner', 'staff'), false);
$$;

create or replace function public.is_owner()
returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.current_role() = 'owner', false);
$$;

create or replace function public.is_member_of_client(target_client_id uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.client_members
    where client_id = target_client_id and user_id = auth.uid()
  );
$$;

-- ---------- enable RLS on every table ----------
alter table public.profiles         enable row level security;
alter table public.clients          enable row level security;
alter table public.client_members   enable row level security;
alter table public.sites            enable row level security;
alter table public.leads            enable row level security;
alter table public.conversations    enable row level security;
alter table public.messages         enable row level security;
alter table public.invoices         enable row level security;
alter table public.tasks            enable row level security;
alter table public.time_entries     enable row level security;
alter table public.notifications    enable row level security;

-- ---------- profiles ----------
drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read on public.profiles for select
  using (id = auth.uid() or public.is_staff());

drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

drop policy if exists profiles_owner_admin on public.profiles;
create policy profiles_owner_admin on public.profiles for all
  using (public.is_owner()) with check (public.is_owner());

-- ---------- clients ----------
drop policy if exists clients_staff_all on public.clients;
create policy clients_staff_all on public.clients for all
  using (public.is_staff()) with check (public.is_staff());

drop policy if exists clients_member_read on public.clients;
create policy clients_member_read on public.clients for select
  using (public.is_member_of_client(id));

-- ---------- client_members ----------
drop policy if exists client_members_staff_all on public.client_members;
create policy client_members_staff_all on public.client_members for all
  using (public.is_staff()) with check (public.is_staff());

drop policy if exists client_members_self_read on public.client_members;
create policy client_members_self_read on public.client_members for select
  using (user_id = auth.uid());

-- ---------- sites ----------
drop policy if exists sites_staff_all on public.sites;
create policy sites_staff_all on public.sites for all
  using (public.is_staff()) with check (public.is_staff());

drop policy if exists sites_member_read on public.sites;
create policy sites_member_read on public.sites for select
  using (public.is_member_of_client(client_id));

-- ---------- leads (staff only) ----------
drop policy if exists leads_staff_all on public.leads;
create policy leads_staff_all on public.leads for all
  using (public.is_staff()) with check (public.is_staff());

-- ---------- conversations + messages ----------
drop policy if exists conversations_staff_all on public.conversations;
create policy conversations_staff_all on public.conversations for all
  using (public.is_staff()) with check (public.is_staff());

drop policy if exists conversations_member_read on public.conversations;
create policy conversations_member_read on public.conversations for select
  using (public.is_member_of_client(client_id));

drop policy if exists messages_staff_all on public.messages;
create policy messages_staff_all on public.messages for all
  using (public.is_staff()) with check (public.is_staff());

drop policy if exists messages_member_read on public.messages;
create policy messages_member_read on public.messages for select
  using (exists (
    select 1 from public.conversations c
    where c.id = conversation_id and public.is_member_of_client(c.client_id)
  ));

drop policy if exists messages_member_send on public.messages;
create policy messages_member_send on public.messages for insert
  with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id and public.is_member_of_client(c.client_id)
    )
  );

-- ---------- invoices ----------
drop policy if exists invoices_staff_all on public.invoices;
create policy invoices_staff_all on public.invoices for all
  using (public.is_staff()) with check (public.is_staff());

drop policy if exists invoices_member_read on public.invoices;
create policy invoices_member_read on public.invoices for select
  using (public.is_member_of_client(client_id));

-- ---------- tasks (staff only) ----------
drop policy if exists tasks_staff_all on public.tasks;
create policy tasks_staff_all on public.tasks for all
  using (public.is_staff()) with check (public.is_staff());

-- ---------- time entries ----------
drop policy if exists time_entries_self on public.time_entries;
create policy time_entries_self on public.time_entries for all
  using (user_id = auth.uid() or public.is_staff())
  with check (user_id = auth.uid() or public.is_staff());

-- ---------- notifications ----------
drop policy if exists notifications_self on public.notifications;
create policy notifications_self on public.notifications for select
  using (user_id = auth.uid());

drop policy if exists notifications_self_update on public.notifications;
create policy notifications_self_update on public.notifications for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists notifications_staff_create on public.notifications;
create policy notifications_staff_create on public.notifications for insert
  with check (public.is_staff());
