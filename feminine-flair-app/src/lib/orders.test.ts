import { describe, it, expect, vi, beforeEach } from "vitest";

beforeEach(() => vi.resetModules());

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

describe("createOrder", () => {
  it("inserts the order then its line items, returning the client-generated order id (guest checkout)", async () => {
    // orders.insert is not followed by .select() — anon has no SELECT grant on orders, so an
    // insert...RETURNING would fail with "permission denied for table orders". The order id is
    // generated client-side and supplied on insert instead of read back.
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

    expect(result.orderId).toMatch(UUID_RE);
    expect(orderInsert).toHaveBeenCalledWith([
      {
        id: result.orderId,
        customer_id: null,
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

  it("links the order to the customer and upserts their profile when signed in", async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    const orderInsert = vi.fn().mockResolvedValue({ error: null });
    const itemsInsert = vi.fn().mockResolvedValue({ error: null });

    const from = vi.fn((table: string) => {
      if (table === "customers") return { upsert };
      if (table === "orders") return { insert: orderInsert };
      if (table === "order_items") return { insert: itemsInsert };
      throw new Error(`unexpected table ${table}`);
    });

    vi.doMock("@/lib/supabase", () => ({ supabase: { from } }));
    const { createOrder: createOrderFresh } = await import("./orders");

    const result = await createOrderFresh({
      customerName: "Faith Wanjiru",
      phone: "0722000101",
      email: "faith@example.com",
      address: "Kilimani, Nairobi",
      deliveryMode: "delivery",
      totalKes: 3500,
      items: [{ productId: "p1", quantity: 1, priceKes: 3200 }],
      customerId: "user-123",
    });

    expect(upsert).toHaveBeenCalledWith({
      id: "user-123",
      full_name: "Faith Wanjiru",
      email: "faith@example.com",
      phone: "0722000101",
    });
    expect(orderInsert).toHaveBeenCalledWith([
      expect.objectContaining({ id: result.orderId, customer_id: "user-123" }),
    ]);
  });
});
