begin;
select plan(3);

insert into categories (name, slug) values ('Dresses', 'dresses');
insert into products (id, slug, name, category, price_kes, stock, units_sold)
values ('11111111-1111-1111-1111-111111111111', 'test-dress', 'Test Dress', 'Dresses', 1000, 10, 0);

insert into orders (id, customer_name, phone, delivery_mode, total_kes)
values ('22222222-2222-2222-2222-222222222222', 'Test Customer', '0700000000', 'pickup', 3000);

insert into order_items (order_id, product_id, quantity, price_kes)
values ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 3, 1000);

select decrement_stock_for_order('22222222-2222-2222-2222-222222222222');

select is(
  (select stock from products where id = '11111111-1111-1111-1111-111111111111'),
  7,
  'stock decrements by the ordered quantity'
);
select is(
  (select units_sold from products where id = '11111111-1111-1111-1111-111111111111'),
  3,
  'units_sold increments by the ordered quantity'
);

-- A second order for more than what remains must floor at zero, not go negative.
insert into orders (id, customer_name, phone, delivery_mode, total_kes)
values ('33333333-3333-3333-3333-333333333333', 'Test Customer 2', '0711111111', 'pickup', 999000);
insert into order_items (order_id, product_id, quantity, price_kes)
values ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 999, 1000);

select decrement_stock_for_order('33333333-3333-3333-3333-333333333333');

select is(
  (select stock from products where id = '11111111-1111-1111-1111-111111111111'),
  0,
  'stock floors at zero rather than going negative'
);

select * from finish();
rollback;
