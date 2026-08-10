begin;
select plan(8);

select has_table('public', 'products', 'products table exists');
select has_table('public', 'orders', 'orders table exists');
select ok(
  (select relrowsecurity from pg_class where oid = 'public.orders'::regclass),
  'RLS is enabled on orders'
);
select ok(
  (select relrowsecurity from pg_class where oid = 'public.transactions'::regclass),
  'RLS is enabled on transactions'
);

set role anon;
select lives_ok(
  $$ select * from products $$,
  'anon can select from products'
);
select throws_ok(
  $$ select * from orders $$,
  '42501',
  null,
  'anon cannot select from orders'
);
select throws_ok(
  $$ insert into orders (customer_name, phone, delivery_mode, total_kes, status) values ('Test', '0700000000', 'pickup', 1000, 'paid') $$,
  '42501',
  null,
  'anon cannot create an order with a non-pending status'
);
select lives_ok(
  $$ insert into orders (customer_name, phone, delivery_mode, total_kes, status) values ('Test', '0700000000', 'pickup', 1000, 'pending') $$,
  'anon can create an order with pending status'
);

select * from finish();
rollback;
