import { createClient } from "npm:@supabase/supabase-js@2";
import { verifyPaystackSignature, parseChargeEvent } from "./verify.ts";

const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  const body = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  const isValid = await verifyPaystackSignature(body, signature, PAYSTACK_SECRET_KEY);
  if (!isValid) {
    return new Response("Invalid signature", { status: 401 });
  }

  const event = parseChargeEvent(body);
  if (!event) {
    // Not a charge.success event (e.g. a different Paystack event type) — acknowledge and ignore.
    return new Response("Ignored", { status: 200 });
  }

  // Never trust the webhook payload's amount/status alone — re-verify server-to-server.
  // A network-level failure or a non-2xx from Paystack's own API is transient — return 500 so
  // Paystack retries. Only a definitive "this charge did not succeed" response from Paystack
  // itself is a 200 (no retry needed).
  let verifyRes: Response;
  try {
    verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${event.data.reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
    });
  } catch {
    return new Response("Failed to reach Paystack verify API", { status: 500 });
  }

  if (!verifyRes.ok) {
    return new Response("Paystack verify API returned an error", { status: 500 });
  }

  const verifyJson = await verifyRes.json();
  if (verifyJson?.data?.status !== "success") {
    return new Response("Charge not verified as successful", { status: 200 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const orderId = event.data.reference;

  // Atomic: flips orders.status to "paid" AND decrements stock in one Postgres transaction, or
  // does neither. Returns false if this order was already paid (idempotent no-op on retry) —
  // in that case skip the transaction insert too, since it would just duplicate the audit row.
  const { data: didTransition, error: transitionError } = await supabase.rpc(
    "mark_order_paid_and_decrement_stock",
    { p_order_id: orderId }
  );

  if (transitionError) {
    return new Response(`Failed to mark order paid: ${transitionError.message}`, { status: 500 });
  }

  if (!didTransition) {
    return new Response("Already processed", { status: 200 });
  }

  const { error: transactionError } = await supabase.from("transactions").insert({
    order_id: orderId,
    paystack_reference: orderId,
    amount_kes: Math.round(verifyJson.data.amount / 100),
    status: "success",
    raw_payload: verifyJson.data,
  });

  if (transactionError) {
    // Order is already correctly paid and stock is already correctly decremented (the atomic
    // step above succeeded) — only the audit-log row failed. Don't return 500 here: that would
    // make Paystack retry a delivery that already succeeded, and the retry would immediately
    // hit the idempotency no-op above and still never record the transaction. Surface the
    // failure in the response body for operator visibility instead.
    return new Response(`Order paid but failed to record transaction: ${transactionError.message}`, { status: 200 });
  }

  return new Response("OK", { status: 200 });
});
