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
  const verifyRes = await fetch(`https://api.paystack.co/transaction/verify/${event.data.reference}`, {
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
  });
  const verifyJson = await verifyRes.json();
  if (!verifyRes.ok || verifyJson?.data?.status !== "success") {
    return new Response("Charge not verified as successful", { status: 200 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const orderId = event.data.reference;

  // Idempotency guard: only an order still in 'pending' gets flipped to
  // 'paid'. `.select("id")` forces PostgREST to return the rows it actually
  // updated, so we can tell a genuine first-time success (1 row) apart from
  // a retried/duplicate webhook delivery hitting an order that's already
  // 'paid' (0 rows) — a plain update-with-no-error can't distinguish those,
  // since PostgREST reports no error either way. Without this check, a
  // retried delivery would fall through and double-run the stock decrement
  // below.
  const { data: updatedOrders, error: orderUpdateError } = await supabase
    .from("orders")
    .update({ status: "paid", paystack_reference: orderId })
    .eq("id", orderId)
    .eq("status", "pending")
    .select("id");

  if (orderUpdateError) {
    return new Response(`Failed to update order: ${orderUpdateError.message}`, { status: 500 });
  }

  if (!updatedOrders || updatedOrders.length === 0) {
    // Already processed by an earlier delivery of this webhook (or the
    // order doesn't exist / isn't pending) — acknowledge without re-running
    // the transaction insert or stock decrement.
    return new Response("Order already processed or not found", { status: 200 });
  }

  await supabase.from("transactions").insert({
    order_id: orderId,
    paystack_reference: orderId,
    amount_kes: Math.round(verifyJson.data.amount / 100),
    status: "success",
    raw_payload: verifyJson.data,
  });

  const { error: stockError } = await supabase.rpc("decrement_stock_for_order", { p_order_id: orderId });
  if (stockError) {
    return new Response(`Order marked paid but stock decrement failed: ${stockError.message}`, { status: 500 });
  }

  return new Response("OK", { status: 200 });
});
