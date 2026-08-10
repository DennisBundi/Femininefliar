import { describe, it, expect, vi } from "vitest";
import { createOrder } from "./orders";

describe("createOrder", () => {
  it("inserts the order then its line items, returning the new order id", async () => {
    const orderInsertSelectSingle = vi.fn().mockResolvedValue({ data: { id: "order-123" }, error: null });
    const orderInsertSelect = vi.fn(() => ({ single: orderInsertSelectSingle }));
    const orderInsert = vi.fn(() => ({ select: orderInsertSelect }));

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

    expect(result).toEqual({ orderId: "order-123" });
    expect(orderInsert).toHaveBeenCalledWith([
      {
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
      { order_id: "order-123", product_id: "p1", quantity: 1, price_kes: 3200 },
    ]);
  });
});
