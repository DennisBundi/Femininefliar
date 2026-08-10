# Feminine Flair — Frontend Architecture & UX/UI Plan

Prepared for Faith Minga · Prepared by Dennis Bundi · August 2026

Companion reference to `Feminine_Flair_Scope_of_Work.docx` and the `Feminine_Flair_UXUI_Mockup.html` concept.

**The structure below is now a real scaffold** at `./feminine-flair-app` — every folder and file listed in section 4 exists on disk with typed stubs and TODO comments marking where real logic (Supabase queries, Paystack calls, cart state) plugs in. Run `npm install` inside that folder to pull the dependencies, then `npm run dev`.

## 1. Brand foundations

| Token | Value | Usage |
|---|---|---|
| Burgundy (primary) | `#630625` | Header, buttons, price text, footer |
| Burgundy dark | `#4A041C` | Hover states, announcement bar |
| Baby pink (secondary) | `#F5B7BD` | Accents, category tiles, badges |
| Pink tint | `#FBE4E8` | Section backgrounds, hover fills |
| Ink (text) | `#241417` | Body copy |
| Paper (background) | `#FFFDFD` | Page background |

Typography: a serif display face (Cormorant Garamond or similar, matching the FF wordmark) for headings and product names; a clean grotesque sans (Manrope) for body copy and UI labels. Logo: the interlocking "FF" monogram, used as a favicon, header mark, and loading-state motif.

Brand touchpoints already live: Instagram (@feminine_flair_ke), TikTok (@feminine_flair_ke0), Facebook. Physical store: Simara Mall, 4th Floor, F-23, Nairobi, Kenya. WhatsApp business line: +254 796 489 610.

**Type scale** — the serif/sans pairing is applied consistently at these sizes; use these rather than picking new font sizes ad hoc:

| Role | Class | Typeface |
|---|---|---|
| Hero / page-level heading | `font-serif text-3xl`–`text-4xl` | Cormorant Garamond |
| Section heading | `font-serif text-2xl` | Cormorant Garamond |
| Sub-heading / card title | `text-base font-semibold` – `text-lg` | Manrope |
| Body copy | `text-sm` | Manrope |
| Secondary / meta text | `text-xs text-ink/60` | Manrope |
| Micro-copy (badges, eyebrows) | `text-[11px]`–`text-[11.5px]` | Manrope |

Colors follow the same discipline: burgundy/blush (plus `ink` and `paper`) for all chrome, buttons, and headings; the only sanctioned exceptions are semantic status colors (order pipeline pills, low-stock warnings, verified-purchase badges) and the WhatsApp button's official brand green — both needed for scannability, not decoration.

## 2. Information architecture

**Customer-facing storefront**
- `/` — Home (hero, category tiles, new arrivals, social strip)
- `/shop` — Category / catalog listing (filters: category, size, color, price)
- `/product/:slug` — Product detail (gallery, variants, add to cart, related items)
- `/cart` — Cart (also available as a slide-out drawer from any page)
- `/checkout` — Checkout (address, delivery, Paystack payment)
- `/account`, `/account/orders`, `/account/wishlist` — Customer account area
- `/about`, `/contact` — Brand story, store location, WhatsApp

**Admin dashboard** (auth-gated, separate route tree)
- `/admin` — Overview (sales snapshot, recent orders)
- `/admin/products` — Product & variant management
- `/admin/orders` — Order management & fulfillment
- `/admin/customers` — Customer records
- `/admin/pos` — Point-of-sale register
- `/admin/reports` — Sales reporting across online + POS

## 3. Key UX principles for a "premium" feel

Generous whitespace and a restrained two-color palette rather than busy multi-color UI. Serif display type for anything editorial (product names, section headers) paired with a quiet sans for functional UI. Micro-interactions with intent: hover-lift on product cards, a slide-in cart drawer instead of a jarring page redirect, a quiet toast confirmation on "add to bag" rather than a popup alert. A persistent but unobtrusive WhatsApp entry point (floating action button, brand green, bottom-right) for the segment of customers who still prefer to close a sale over chat. Real store presence surfaced in the footer and contact page (address, map link, social icons) so the online marketplace reads as an extension of the physical shop, not a disconnected storefront.

## 4. React project structure

Recommended stack: **React 18 + TypeScript**, bundled with **Vite**, styled with **Tailwind CSS** (brand tokens as custom theme colors) plus a small set of **shadcn/ui** primitives for accessible building blocks (dialog, drawer, dropdown), **React Router v6** for routing, **TanStack Query** for server state (products, orders), **Zustand** for local UI state (cart, drawer open/close), **Supabase JS client** for auth/data/storage, and the **Paystack Inline JS** popup for checkout.

```
feminine-flair/
├─ public/
│  └─ logo.svg
├─ src/
│  ├─ app/
│  │  ├─ router.tsx                 # route tree (storefront + /admin)
│  │  └─ providers.tsx              # QueryClient, Supabase, Zustand providers
│  │
│  ├─ styles/
│  │  ├─ globals.css
│  │  └─ tailwind.config.ts         # brand color tokens, fonts
│  │
│  ├─ lib/
│  │  ├─ supabase.ts                # Supabase client init
│  │  ├─ paystack.ts                # Paystack inline helper
│  │  └─ whatsapp.ts                # wa.me link builder
│  │
│  ├─ features/
│  │  ├─ storefront/
│  │  │  ├─ home/                   # Hero, CategoryGrid, NewArrivals, SocialStrip
│  │  │  ├─ catalog/                # ShopPage, FilterSidebar, ProductGrid
│  │  │  ├─ product/                # ProductDetail, Gallery, VariantPicker
│  │  │  ├─ cart/                   # CartDrawer, CartPage, useCartStore
│  │  │  ├─ checkout/               # CheckoutPage, PaystackButton, OrderSummary
│  │  │  └─ account/                # Login, OrderHistory, Wishlist
│  │  │
│  │  └─ admin/
│  │     ├─ dashboard/
│  │     ├─ products/                # ProductTable, ProductForm, VariantEditor
│  │     ├─ orders/                  # OrderTable, OrderDetail, StatusUpdater
│  │     ├─ customers/
│  │     ├─ pos/                     # Register, ReceiptPrinter, CashDrawer
│  │     └─ reports/
│  │
│  ├─ components/
│  │  ├─ ui/                        # shadcn primitives (button, dialog, drawer…)
│  │  └─ shared/                    # Header, Footer, WhatsAppButton, Toast
│  │
│  ├─ hooks/                        # useCart, useWishlist, useAuth
│  ├─ types/                        # Product, Order, Customer, Variant
│  └─ main.tsx
│
├─ index.html
├─ tailwind.config.js
├─ package.json
└─ vite.config.ts
```

Rationale: a `features/` split (rather than grouping by component type) keeps storefront and admin concerns isolated so the customer bundle doesn't ship admin-only code, and each feature folder owns its own components, hooks, and API calls. `lib/` centralizes the three external integrations (Supabase, Paystack, WhatsApp) behind small wrapper functions so they're easy to swap or mock in tests.

## 5. Integration specifics

**Paystack** — checkout collects order details, then opens the Paystack Inline popup (card + mobile money); on success, the webhook (Supabase edge function) marks the order paid and triggers the confirmation email/receipt.

**WhatsApp** — a floating action button on every storefront page links to `https://wa.me/254796489610`, optionally pre-filled with a product reference when launched from a product page.

**Physical store** — footer and `/contact` surface the Simara Mall address (4th Floor, F-23, Nairobi) with a map link; POS module in the admin area is used at this location for walk-in sales.

**Social** — Instagram, TikTok, and Facebook icons in the footer and a "shop the feed" strip on the home page link out to the live accounts.

**Wishlist as a follow-up channel** — wishlist adds are tied to the customer record (not just stored client-side), so a saved item becomes a trigger for automated reminders: a WhatsApp or email nudge if the item hasn't sold in N days, a "still interested?" message if it's about to go out of stock, or a low-stock alert. This needs a `wishlist_items` table (customer_id, product_id, created_at) and a scheduled Supabase edge function that scans it daily against stock levels and order history.

## 6. Suggested build order

Foundation (design tokens, routing, Supabase schema, auth) → Storefront read path (home, catalog, product detail) → Cart and checkout (Paystack) → Admin dashboard (products, orders) → POS system → Polish pass (animations, empty/loading/error states, responsive QA).
