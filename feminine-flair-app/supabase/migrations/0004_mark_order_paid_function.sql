create or replace function mark_order_paid_and_decrement_stock(p_order_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  did_transition boolean;
begin
  update orders
  set status = 'paid',
      paystack_reference = p_order_id::text
  where id = p_order_id
    and status = 'pending';

  did_transition := found;

  if did_transition then
    update products p
    set stock = greatest(0, p.stock - oi.quantity),
        units_sold = p.units_sold + oi.quantity
    from order_items oi
    where oi.order_id = p_order_id
      and oi.product_id = p.id;
  end if;

  return did_transition;
end;
$$;

revoke all on function mark_order_paid_and_decrement_stock(uuid) from public;
grant execute on function mark_order_paid_and_decrement_stock(uuid) to service_role;
