-- =============================================================================
-- 0001_profiles
--
-- The profiles table and the authorization foundation for everything after it.
-- See docs/DATABASE.md sections 3 and 5.
--
-- NON-DESTRUCTIVE: this migration only creates. It drops nothing and alters no
-- existing data.
-- =============================================================================

-- --- Enum --------------------------------------------------------------------

create type public.user_role as enum ('customer', 'admin');

-- --- Table -------------------------------------------------------------------

create table public.profiles (
  id               uuid primary key references auth.users (id) on delete cascade,
  email            text not null,
  full_name        text,
  avatar_url       text,
  role             public.user_role not null default 'customer',
  marketing_opt_in boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on column public.profiles.role is
  'Authorization source of truth. NEVER read roles from auth.users.raw_user_meta_data - that column is user-writable and would allow trivial self-promotion to admin.';

alter table public.profiles enable row level security;

-- --- updated_at --------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- --- Profile creation on signup ----------------------------------------------
-- security definer: the signing-up user has no rights on public.profiles yet.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- --- Admin check -------------------------------------------------------------
-- security definer is required: this function is called from the RLS policies
-- on profiles itself. Running as the table owner means the inner SELECT is not
-- subject to those policies, which would otherwise recurse infinitely.
--
-- The pinned search_path is not optional. Without it a hostile search_path can
-- redirect the table lookup to an attacker-controlled table.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- --- Role escalation guard ---------------------------------------------------
-- Layer 2 of 2. Layer 1 is the column-level REVOKE at the bottom of this file.
--
-- auth.uid() is null for the service-role client and for SQL run directly in
-- the Supabase dashboard. Both are already trusted, and the dashboard path is
-- how the first admin gets promoted.

create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin() then
    raise exception 'profiles.role may only be changed by an administrator';
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_role_escalation
  before update on public.profiles
  for each row execute function public.prevent_role_escalation();

-- --- Row Level Security ------------------------------------------------------

create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

create policy "profiles_select_admin"
  on public.profiles for select
  to authenticated
  using (public.is_admin());

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "profiles_update_admin"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Deliberately absent:
--   INSERT - rows are created by the handle_new_user trigger only.
--   DELETE - profiles die with their auth.users row via ON DELETE CASCADE.
--   Any policy for anon - profiles are never publicly readable.

-- --- Column grants -----------------------------------------------------------
-- Stops a signed-in user PATCHing their own role through the REST API.

revoke update (role) on public.profiles from authenticated;
revoke update (role) on public.profiles from anon;
