-- Admin read/write access to orders, gated by is_admin() (migration 0005) rather than plain
-- "authenticated", since a future customer-account login would use the same auth.users table.
create policy "admins can read orders" on orders for select using (is_admin());
create policy "admins can update orders" on orders for update using (is_admin());

grant select, update on orders to authenticated;

-- POS "complete sale": marks a pos order paid and decrements stock, mirroring the webhook's
-- mark_order_paid_and_decrement_stock (migration 0004) but reachable by an admin's own client
-- session instead of only the trusted webhook. Scoped to channel = 'pos' and gated by is_admin()
-- inside the function itself (not just a GRANT) so a customer session can never call this to mark
-- their own online order paid for free.
create or replace function admin_complete_pos_sale(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_admin() then
    raise exception 'not authorized';
  end if;

  update orders set status = 'paid' where id = p_order_id and channel = 'pos';

  update products p
  set stock = greatest(0, p.stock - oi.quantity),
      units_sold = p.units_sold + oi.quantity
  from order_items oi
  where oi.order_id = p_order_id
    and oi.product_id = p.id;
end;
$$;

revoke all on function admin_complete_pos_sale(uuid) from public;
grant execute on function admin_complete_pos_sale(uuid) to authenticated;
