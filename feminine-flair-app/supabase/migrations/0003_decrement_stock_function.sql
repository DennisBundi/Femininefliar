create or replace function decrement_stock_for_order(p_order_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update products p
  set stock = greatest(0, p.stock - oi.quantity),
      units_sold = p.units_sold + oi.quantity
  from order_items oi
  where oi.order_id = p_order_id
    and oi.product_id = p.id;
end;
$$;

-- Concurrency guarantee: the single UPDATE ... FROM statement above takes row
-- locks on every matching product row within one statement, so two
-- concurrent calls against overlapping products serialize automatically —
-- there's no separate read-then-write step for a race to land between.

revoke all on function decrement_stock_for_order(uuid) from public;
grant execute on function decrement_stock_for_order(uuid) to service_role;
