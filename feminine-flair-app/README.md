# Feminine Flair — storefront & admin

React + TypeScript + Vite + Tailwind. See `/Feminine_Flair_Frontend_Architecture.md`
(one level up) for the full architecture and UX plan this scaffold implements.

## Getting started
```
npm install
cp .env.example .env   # fill in Supabase, Paystack, WhatsApp values
npm run dev
```

## Structure
- `src/features/storefront/*` — customer-facing pages (home, catalog, product, cart, checkout, account)
- `src/features/admin/*` — admin dashboard (products, orders, customers, POS, reports)
- `src/components/shared/*` — Header, Footer, WhatsAppButton, Toast (used across both)
- `src/components/ui/*` — shadcn/ui primitives (button, dialog, drawer) — add via `npx shadcn-ui@latest add <component>`
- `src/lib/*` — thin wrappers around Supabase, Paystack, and the WhatsApp deep link
