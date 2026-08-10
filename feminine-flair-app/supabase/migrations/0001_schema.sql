-- categories: controlled vocabulary for product.category (kept as free text on
-- products for frontend-type compatibility, but constrained by this FK)
create table categories (
  name text primary key,
  slug text not null unique
);

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null references categories(name),
  price_kes integer not null check (price_kes >= 0),
  description text,
  images text[] not null default '{}',
  colors text[] not null default '{}',
  sizes text[] not null default '{}',
  stock integer not null default 0 check (stock >= 0),
  units_sold integer not null default 0 check (units_sold >= 0),
  created_at timestamptz not null default now()
);

create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  size text,
  color text,
  stock integer not null default 0 check (stock >= 0)
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text,
  phone text,
  created_at timestamptz not null default now()
);

create table customer_addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  label text not null,
  details text not null
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id),
  customer_name text not null,
  phone text not null,
  email text,
  address text,
  delivery_mode text not null check (delivery_mode in ('delivery', 'pickup')),
  channel text not null default 'online' check (channel in ('online', 'pos')),
  status text not null default 'pending' check (status in ('pending', 'processing', 'shipped', 'delivered', 'paid')),
  total_kes integer not null check (total_kes >= 0),
  paystack_reference text,
  created_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  quantity integer not null check (quantity > 0),
  price_kes integer not null check (price_kes >= 0)
);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id),
  paystack_reference text not null,
  amount_kes integer not null check (amount_kes >= 0),
  status text not null check (status in ('success', 'failed', 'abandoned')),
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  customer_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  verified_purchase boolean not null default false,
  created_at timestamptz not null default now()
);

create table wishlist_items (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (customer_id, product_id)
);

-- RLS: enabled everywhere, no exceptions.
alter table categories enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table customers enable row level security;
alter table customer_addresses enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table transactions enable row level security;
alter table reviews enable row level security;
alter table wishlist_items enable row level security;

-- Public read on catalog tables.
create policy "public read categories" on categories for select using (true);
create policy "public read products" on products for select using (true);
create policy "public read product_variants" on product_variants for select using (true);
create policy "public read reviews" on reviews for select using (true);

-- Orders/order_items: anon can create, never read or update — status changes
-- and reads happen server-side (webhook, later admin) via service_role, which
-- bypasses RLS entirely. The check on orders.status is deliberate: it stops
-- an anon client from inserting an order that is already 'paid' (or any
-- other non-pending status) via the REST API and skipping payment — every
-- status transition after creation happens exclusively through the
-- service-role webhook.
create policy "anyone can create an order" on orders for insert with check (status = 'pending');
create policy "anyone can create order items" on order_items for insert with check (true);

-- customers, customer_addresses, transactions, wishlist_items: no client-role
-- policies at all this pass — service_role only. Deliberately locked down
-- until accounts/wishlist/admin get wired in a later pass.
