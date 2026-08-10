begin;
select plan(6);

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

select * from finish();
rollback;
