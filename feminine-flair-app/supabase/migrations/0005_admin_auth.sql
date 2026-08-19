-- Admin authorization. A row here is what makes a signed-in Supabase Auth user an admin — being
-- authenticated is not enough by itself, since a future customer-account login (see
-- src/features/storefront/account/LoginPage.tsx) would use the same auth.users table and must
-- never gain admin-dashboard access just by being logged in.
create table admins (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

alter table admins enable row level security;

-- A signed-in user may check only their own admin status directly (used by the frontend route
-- guard to distinguish "logged in" from "logged in and an admin").
create policy "a user can check their own admin row" on admins for select using (id = auth.uid());

-- security definer + fixed search_path: the function must see the admins table regardless of the
-- caller's own row-level access, so table-level RLS is bypassed deliberately, not disabled.
create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from admins where id = auth.uid());
$$;

revoke all on function is_admin() from public;
grant execute on function is_admin() to authenticated;

grant select on admins to authenticated;
