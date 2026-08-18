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

## Testing

```bash
npm test                   # unit/component tests (vitest)
npm run test:integration   # integration tests that need the local Supabase stack running
```

### Testing the webhook

`supabase/functions/paystack-webhook/webhook.integration.test.ts` exercises the deployed edge
function end-to-end against a real Paystack test-mode charge — it does not mock Paystack, since
the function's own security model re-verifies every charge server-to-server before trusting it.

1. Start the local stack: `supabase start`
2. Create `supabase/functions/.env.local` (gitignored):
   ```
   PAYSTACK_SECRET_KEY=sk_test_your_paystack_test_secret_key
   ```
3. Serve the function: `supabase functions serve paystack-webhook --no-verify-jwt --env-file supabase/functions/.env.local`
4. In a second terminal:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=<service_role key from `supabase status`> \
   PAYSTACK_SECRET_KEY_TEST=sk_test_your_paystack_test_secret_key \
   npm run test:integration
   ```

The test creates its own order and completes a real Paystack test-mode charge against it (via
Paystack's test Visa card, `4084084084084081`) before invoking the webhook, so no manual charge
setup is needed — just a valid `sk_test_...` key with card charging enabled on the account.

**Known local-environment gotcha:** if `supabase functions serve` immediately fails with a worker
boot error like `invalid peer certificate: UnknownIssuer` while importing from `deno.land` or
`registry.npmjs.org`, Docker isn't trusting your network's TLS-intercepting proxy (common on
corporate networks or with some antivirus/SSL-inspection software) — the container can't complete
any outbound HTTPS request. This blocks edge function execution entirely regardless of the code.
Fix it by trusting that proxy's root CA in Docker Desktop, or run on a network without SSL
inspection (e.g. CI).
