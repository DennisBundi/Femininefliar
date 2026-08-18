import { describe, it, expect, beforeAll } from "vitest";
import { createClient } from "@supabase/supabase-js";

// Requires: `supabase start` and
// `supabase functions serve paystack-webhook --no-verify-jwt --env-file supabase/functions/.env.local`
// running locally first. See README.md's "Testing the webhook" section for the env file this
// reads PAYSTACK_SECRET_KEY_TEST from.

const SUPABASE_URL = "http://127.0.0.1:54321";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY_TEST!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function signBody(body: string, secret: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-512" }, false, ["sign"]);
  const sigBuffer = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return Array.from(new Uint8Array(sigBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Completes a real Paystack test-mode charge against `reference` using Paystack's published test
// Visa card. This account/card combination settles synchronously without an OTP step — if that
// ever changes, this throws with Paystack's response body, which is the signal to add an OTP
// submission step (POST /charge/submit_otp) here.
async function completeTestCharge(reference: string, amountKobo: number) {
  const res = await fetch("https://api.paystack.co/charge", {
    method: "POST",
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      email: "integration-test@example.com",
      amount: amountKobo,
      reference,
      card: { number: "4084084084084081", cvv: "408", expiry_month: "12", expiry_year: "30" },
    }),
  });
  const json = await res.json();
  if (json?.data?.status !== "success") {
    throw new Error(`Test charge did not settle synchronously: ${JSON.stringify(json)}`);
  }
}

describe("paystack-webhook integration", () => {
  let orderId: string;
  let productId: string;

  beforeAll(async () => {
    const { data: product } = await supabase.from("products").select("id, stock, units_sold").eq("slug", "amara-wrap-dress").single();
    productId = product!.id;

    const { data: order } = await supabase
      .from("orders")
      .insert({ customer_name: "Integration Test", phone: "0700000000", delivery_mode: "pickup", total_kes: 3200 })
      .select()
      .single();
    orderId = order!.id;

    await supabase.from("order_items").insert({ order_id: orderId, product_id: productId, quantity: 1, price_kes: 3200 });

    // Mirrors the real checkout flow (PaystackButton.tsx passes the order id as the Paystack
    // reference) — completing a real test-mode charge under that same reference is what lets the
    // webhook's server-to-server verify call against Paystack's API actually succeed below.
    await completeTestCharge(orderId, 320000);
  });

  it("flips the order to paid and decrements stock when Paystack confirms the charge", async () => {
    const body = JSON.stringify({ event: "charge.success", data: { reference: orderId, amount: 320000, status: "success" } });
    const signature = await signBody(body, PAYSTACK_SECRET_KEY);

    const res = await fetch(`${SUPABASE_URL}/functions/v1/paystack-webhook`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-paystack-signature": signature },
      body,
    });

    expect(res.status).toBe(200);

    const { data: updatedOrder } = await supabase.from("orders").select("status").eq("id", orderId).single();
    expect(updatedOrder!.status).toBe("paid");

    const { data: updatedProduct } = await supabase.from("products").select("stock").eq("id", productId).single();
    expect(updatedProduct!.stock).toBeLessThan(12);
  });

  it("does not double-decrement stock when Paystack redelivers the same webhook", async () => {
    // Same order/reference as the previous test — simulates Paystack retrying a delivery
    // (e.g. after a timeout) for a charge that was already fully processed. This is exactly
    // the case Task 9's atomic mark_order_paid_and_decrement_stock function exists to guard.
    const { data: beforeRetry } = await supabase.from("products").select("stock").eq("id", productId).single();

    const body = JSON.stringify({ event: "charge.success", data: { reference: orderId, amount: 320000, status: "success" } });
    const signature = await signBody(body, PAYSTACK_SECRET_KEY);

    const res = await fetch(`${SUPABASE_URL}/functions/v1/paystack-webhook`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-paystack-signature": signature },
      body,
    });

    expect(res.status).toBe(200);

    const { data: afterRetry } = await supabase.from("products").select("stock").eq("id", productId).single();
    expect(afterRetry!.stock).toBe(beforeRetry!.stock);
  });
});
