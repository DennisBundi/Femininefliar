-- Customer accounts (sign up / sign in). A signed-in customer manages only their own profile row
-- and sees only their own orders — distinct from admin access (migration 0005/0006), which is
-- gated by is_admin() rather than by row ownership.
create policy "customers can view own profile" on customers for select using (id = auth.uid());
create policy "customers can create own profile" on customers for insert with check (id = auth.uid());
create policy "customers can update own profile" on customers for update using (id = auth.uid());

grant select, insert, update on customers to authenticated;

-- Orders already grant select/update to authenticated (migration 0006); this adds the row-level
-- policy so a customer's own orders are visible alongside the existing admin-only policy (RLS
-- policies within a command are OR'd together — this doesn't loosen what admins already have).
create policy "customers can view own orders" on orders for select using (customer_id = auth.uid());
