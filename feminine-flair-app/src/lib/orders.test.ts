import { describe, it, expect, vi } from "vitest";
import { createOrder } from "./orders";

describe("createOrder", () => {
  it("inserts the order then its line items, returning the client-generated order id", async () => {
    const orderInsert = vi.fn().mockResolvedValue({ error: null });
    const itemsInsert = vi.fn().mockResolvedValue({ error: null });

    const from = vi.fn((table: string) => {
      if (table === "orders") return { insert: orderInsert };
      if (table === "order_items") return { insert: itemsInsert };
      throw new Error(`unexpected table ${table}`);
    });

    vi.doMock("@/lib/supabase", () => ({ supabase: { from } }));
    const { createOrder: createOrderFresh } = await import("./orders");

    const result = await createOrderFresh({
      customerName: "Faith Wanjiru",
      phone: "0722000101",
      email: "",
      address: "Kilimani, Nairobi",
      deliveryMode: "delivery",
      totalKes: 3500,
      items: [{ productId: "p1", quantity: 1, priceKes: 3200 }],
    });

    // No RETURNING/`.select()` involved: the anon role has no SELECT policy
    // on orders, so the id must be generated client-side and inserted directly.
    expect(result.orderId).toMatch(/^[0-9a-f-]{36}$/);
    expect(orderInsert).toHaveBeenCalledWith([
      {
        id: result.orderId,
        customer_name: "Faith Wanjiru",
        phone: "0722000101",
        email: null,
        address: "Kilimani, Nairobi",
        delivery_mode: "delivery",
        total_kes: 3500,
        channel: "online",
      },
    ]);
    expect(itemsInsert).toHaveBeenCalledWith([
      { order_id: result.orderId, product_id: "p1", quantity: 1, price_kes: 3200 },
    ]);
  });
});
