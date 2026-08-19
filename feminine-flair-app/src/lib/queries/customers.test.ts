import { describe, it, expect, vi } from "vitest";
import { fetchCustomerSummaries } from "./customers";

vi.mock("@/lib/supabase", () => {
  const select = vi.fn().mockResolvedValue({
    data: [
      { customer_name: "Faith Wanjiru", phone: "0722000101", total_kes: 3500 },
      { customer_name: "Faith Wanjiru", phone: "0722000101", total_kes: 2200 },
      { customer_name: "Grace Muthoni", phone: "0733000102", total_kes: 5100 },
      { customer_name: "Walk-in", phone: "", total_kes: 1600 },
    ],
    error: null,
  });
  const from = vi.fn(() => ({ select }));
  return { supabase: { from } };
});

describe("fetchCustomerSummaries", () => {
  it("aggregates orders per phone number into a customer summary, sorted by total spend", async () => {
    const customers = await fetchCustomerSummaries();

    expect(customers).toEqual([
      { name: "Faith Wanjiru", phone: "0722000101", orders: 2, totalSpentKes: 5700, wishlistCount: 0 },
      { name: "Grace Muthoni", phone: "0733000102", orders: 1, totalSpentKes: 5100, wishlistCount: 0 },
    ]);
  });

  it("excludes orders with no phone number (POS walk-ins)", async () => {
    const customers = await fetchCustomerSummaries();
    expect(customers.find((c) => c.name === "Walk-in")).toBeUndefined();
  });
});
