# Feminine Flair — Launch Foundation: Full Schema + Real Checkout/Payment

Prepared 2026-08-10. Companion to `Feminine_Flair_Frontend_Architecture.md` and
`Feminine_Flair_UIUX_Audit.md` (one level up from `feminine-flair-app/`).

## Goal

Get Feminine Flair able to take a **real order with a real Paystack payment**
from a customer browsing real product data — the fastest path to the business
actually launching. Admin dashboard, POS, customer accounts/login, wishlist
automation, reviews UI, and product search are explicitly deferred to later
passes; they are not required to take the first real payment.

## Scope decision

Two things were deliberately decoupled:

- **Schema**: built in full now (see below), covering every table the
  architecture doc calls for — products, orders, customers, wishlist,
  reviews, transactions. This is a one-time cost and Postgres migrations are
  cheap to write but annoying to retrofit around live data, so it's done
  once, correctly, up front.
- **Wiring** (actual query code + UI hooked to real data): only the
  storefront read path and the checkout/payment flow. Everything else gets
  its table and RLS policy now, but no application code yet — so the next
  pass (admin, reviews, wishlist follow-ups, accounts) is additive, not a
  migration.

## 1. Data model (Supabase / Postgres)

All tables use RLS. Public anon key gets read-only access to catalog tables
and insert-only access to order-creation tables; nothing about order status
or stock is writable from the client.

| Table | Columns | Notes |
|---|---|---|
| `categories` | `id, name, slug` | |
| `products` | `id, slug, name, category_id, price_kes, description, images text[], colors text[], sizes text[], stock, units_sold, created_at` | Mirrors `types/product.ts` `Product` exactly |
| `product_variants` | `id, product_id, size, color, stock` | Optional; only populated for products needing per-combination stock |
| `customers` | `id, full_name, email, phone` | No auth yet — row created lazily from checkout if useful, not login-gated |
| `customer_addresses` | `id, customer_id, label, details` | Split from `customers` — a customer can have multiple addresses |
| `orders` | `id, customer_id nullable, customer_name, phone, email, address, delivery_mode, channel, status, total_kes, paystack_reference, created_at` | `customer_id` nullable — guest checkout stays fully supported |
| `order_items` | `id, order_id, product_id, quantity, price_kes` | |
| `transactions` | `id, order_id, paystack_reference, amount_kes, status, raw_payload jsonb, created_at` | Separate from `orders` so webhook retries/reconciliation don't clobber order state directly |
| `reviews` | `id, product_id, customer_name, rating, comment, verified_purchase, created_at` | Table + RLS only, no UI wired this pass |
| `wishlist_items` | `id, customer_id, product_id, created_at` | Table + RLS only; the scheduled follow-up edge function from the architecture doc is a later pass |

RLS summary:
- `categories`, `products`, `product_variants`: public `select`.
- `orders`, `order_items`: public `insert` only (anon key), no `select`/`update` — status changes happen server-side only, via the webhook/edge function using the service role.
- `customers`, `customer_addresses`, `reviews`, `wishlist_items`: RLS defined now to match their eventual access pattern (customer-scoped / public-read-on-verified-review), even though nothing queries them yet.

## 2. Storefront read path

Replace `PRODUCTS_SEED` in `useProducts` (`src/hooks/useProducts.ts`) with a
TanStack Query-backed fetch: `supabase.from("products").select("*, product_variants(*)")`.
Keep the store's external shape (`products`, `lowStock()`) unchanged so
`ProductGrid`, `ShopPage`, `HomePage`, and `ProductDetailPage` don't need
changes beyond removing the mock import. Same pattern for `categories`.

Add loading/empty states on these pages — currently N/A because everything
is synchronous in-memory data (per the UI/UX audit); becomes necessary the
moment a real network call is in the path.

## 3. Checkout & order creation

`getCheckoutErrors` (`src/lib/validation.ts`) and the controlled-input wiring
already in `CheckoutPage.tsx` stay as-is — that part of the audit's gap list
is already closed. On submit: insert a `pending` order + its `order_items`
rows via the Supabase client, get back the generated order id, then pass
that id to Paystack as the transaction reference/metadata.

This replaces `PaystackButton.tsx`'s current behavior, which marks the sale
"successful," decrements stock, and creates the order **entirely
client-side with no real charge** — that gap is the main thing blocking a
real launch.

## 4. Payment confirmation

Paystack Inline JS popup runs client-side with the public key. The client
**never marks its own order paid** — that would be spoofable by anyone who
can read the frontend code. Instead:

1. Client creates the `pending` order + items, opens Paystack Inline with
   that order's id as the reference.
2. A Supabase edge function is registered as the Paystack webhook. It
   verifies the event signature, re-verifies the charge against Paystack's
   server-side verify API (never trusts the webhook payload alone), then:
   - updates the matching `orders.status → paid` and writes a row to
     `transactions`,
   - calls a Postgres function that atomically decrements
     `products.stock` / increments `units_sold` for every line item in a
     single transaction, so two simultaneous buyers of the last unit can't
     both succeed.
3. The client subscribes (Supabase Realtime, or a short poll) to that one
   order row and shows "payment confirmed" once `status` flips to `paid`.

## 5. Error handling

If the Paystack popup is closed, fails, or times out, the order stays
`pending`, the cart is preserved (not cleared), and the customer sees a
retry option — replacing today's behavior, which always shows a false
"Payment successful" toast regardless of what actually happened. Stock is
only ever decremented inside the atomic, webhook-triggered Postgres
function — never optimistically on the client.

## Explicitly out of scope for this build

Admin dashboard, POS, customer login/accounts, wishlist follow-up
automation, reviews UI, product search. These keep running on mock data /
stay unwired. Their tables and RLS policies exist from section 1, so wiring
them later is additive work, not a schema change.
