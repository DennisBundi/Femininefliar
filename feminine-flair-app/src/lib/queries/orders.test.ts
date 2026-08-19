import { describe, it, expect, vi, beforeEach } from "vitest";

const ROW = {
  id: "o1",
  customer_name: "Faith Wanjiru",
  phone: "0722000101",
  email: null,
  address: null,
  delivery_mode: "delivery",
  channel: "online",
  status: "paid",
  total_kes: 3500,
  paystack_reference: "o1",
  created_at: "2026-08-15T10:00:00Z",
  customer_id: null,
};

describe("fetchOrders", () => {
  it("maps Supabase order rows to the Order shape the app expects", async () => {
    vi.resetModules();
    vi.doMock("@/lib/supabase", () => {
      const order = vi.fn().mockResolvedValue({ data: [ROW], error: null });
      const select = vi.fn(() => ({ order }));
      const from = vi.fn(() => ({ select }));
      return { supabase: { from } };
    });
    const { fetchOrders } = await import("./orders");

    const orders = await fetchOrders();

    expect(orders).toEqual([
      {
        id: "o1",
        customerName: "Faith Wanjiru",
        channel: "online",
        status: "paid",
        totalKes: 3500,
        when: "2026-08-15T10:00:00Z",
        paystackReference: "o1",
      },
    ]);
  });
});

describe("updateOrderStatus", () => {
  it("updates the order's status by id", async () => {
    vi.resetModules();
    const eq = vi.fn().mockResolvedValue({ error: null });
    const update = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ update }));
    vi.doMock("@/lib/supabase", () => ({ supabase: { from } }));
    const { updateOrderStatus } = await import("./orders");

    await updateOrderStatus("o1", "processing");

    expect(from).toHaveBeenCalledWith("orders");
    expect(update).toHaveBeenCalledWith({ status: "processing" });
    expect(eq).toHaveBeenCalledWith("id", "o1");
  });

  it("throws when Supabase reports an error", async () => {
    vi.resetModules();
    const eq = vi.fn().mockResolvedValue({ error: { message: "permission denied" } });
    const update = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ update }));
    vi.doMock("@/lib/supabase", () => ({ supabase: { from } }));
    const { updateOrderStatus } = await import("./orders");

    await expect(updateOrderStatus("o1", "processing")).rejects.toEqual({ message: "permission denied" });
  });
});

describe("completePosSale", () => {
  beforeEach(() => vi.resetModules());

  it("inserts the order and its items, then calls admin_complete_pos_sale with the new order id", async () => {
    const orderInsert = vi.fn().mockResolvedValue({ error: null });
    const itemsInsert = vi.fn().mockResolvedValue({ error: null });
    const rpc = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn((table: string) => {
      if (table === "orders") return { insert: orderInsert };
      if (table === "order_items") return { insert: itemsInsert };
      throw new Error(`unexpected table ${table}`);
    });
    vi.doMock("@/lib/supabase", () => ({ supabase: { from, rpc } }));
    const { completePosSale } = await import("./orders");

    const orderId = await completePosSale({
      totalKes: 1600,
      items: [{ productId: "p1", quantity: 2, priceKes: 800 }],
    });

    expect(orderInsert).toHaveBeenCalledWith([
      { id: orderId, customer_name: "Walk-in", phone: "", delivery_mode: "pickup", channel: "pos", total_kes: 1600 },
    ]);
    expect(itemsInsert).toHaveBeenCalledWith([{ order_id: orderId, product_id: "p1", quantity: 2, price_kes: 800 }]);
    expect(rpc).toHaveBeenCalledWith("admin_complete_pos_sale", { p_order_id: orderId });
  });

  it("throws if the RPC call fails, without swallowing the error", async () => {
    const from = vi.fn((table: string) => {
      if (table === "orders") return { insert: vi.fn().mockResolvedValue({ error: null }) };
      if (table === "order_items") return { insert: vi.fn().mockResolvedValue({ error: null }) };
      throw new Error(`unexpected table ${table}`);
    });
    const rpc = vi.fn().mockResolvedValue({ error: { message: "not authorized" } });
    vi.doMock("@/lib/supabase", () => ({ supabase: { from, rpc } }));
    const { completePosSale } = await import("./orders");

    await expect(completePosSale({ totalKes: 100, items: [] })).rejects.toEqual({ message: "not authorized" });
  });
});
