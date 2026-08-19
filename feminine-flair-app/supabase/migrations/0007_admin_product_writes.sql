-- Admin write access to products (catalog management in ProductTable/ProductForm). Same
-- is_admin()-gated pattern as orders (migration 0006) — a future customer session must never be
-- able to edit the catalog just by being logged in.
create policy "admins can insert products" on products for insert with check (is_admin());
create policy "admins can update products" on products for update using (is_admin());
create policy "admins can delete products" on products for delete using (is_admin());

grant insert, update, delete on products to authenticated;
