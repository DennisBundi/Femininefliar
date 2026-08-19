import { describe, it, expect, vi, beforeEach } from "vitest";

beforeEach(() => vi.resetModules());

describe("fetchCustomerSummaries", () => {
  function mockOrders(data: unknown[]) {
    const select = vi.fn().mockResolvedValue({ data, error: null });
    const from = vi.fn(() => ({ select }));
    vi.doMock("@/lib/supabase", () => ({ supabase: { from } }));
  }

  it("aggregates orders per phone number into a customer summary, sorted by total spend", async () => {
    mockOrders([
      { customer_name: "Faith Wanjiru", phone: "0722000101", total_kes: 3500 },
      { customer_name: "Faith Wanjiru", phone: "0722000101", total_kes: 2200 },
      { customer_name: "Grace Muthoni", phone: "0733000102", total_kes: 5100 },
      { customer_name: "Walk-in", phone: "", total_kes: 1600 },
    ]);
    const { fetchCustomerSummaries } = await import("./customers");

    const customers = await fetchCustomerSummaries();

    expect(customers).toEqual([
      { name: "Faith Wanjiru", phone: "0722000101", orders: 2, totalSpentKes: 5700, wishlistCount: 0 },
      { name: "Grace Muthoni", phone: "0733000102", orders: 1, totalSpentKes: 5100, wishlistCount: 0 },
    ]);
  });

  it("excludes orders with no phone number (POS walk-ins)", async () => {
    mockOrders([{ customer_name: "Walk-in", phone: "", total_kes: 1600 }]);
    const { fetchCustomerSummaries } = await import("./customers");

    const customers = await fetchCustomerSummaries();
    expect(customers.find((c) => c.name === "Walk-in")).toBeUndefined();
  });
});

describe("fetchMyProfile", () => {
  it("maps the customers row to a CustomerProfile", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: { full_name: "Faith Wanjiru", email: "faith@example.com", phone: "0722000101" },
      error: null,
    });
    const eq = vi.fn(() => ({ maybeSingle }));
    const select = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ select }));
    vi.doMock("@/lib/supabase", () => ({ supabase: { from } }));
    const { fetchMyProfile } = await import("./customers");

    const profile = await fetchMyProfile("user-123");

    expect(eq).toHaveBeenCalledWith("id", "user-123");
    expect(profile).toEqual({ fullName: "Faith Wanjiru", email: "faith@example.com", phone: "0722000101" });
  });

  it("returns null when the customer has no profile row yet", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    const eq = vi.fn(() => ({ maybeSingle }));
    const select = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ select }));
    vi.doMock("@/lib/supabase", () => ({ supabase: { from } }));
    const { fetchMyProfile } = await import("./customers");

    expect(await fetchMyProfile("user-123")).toBeNull();
  });
});
