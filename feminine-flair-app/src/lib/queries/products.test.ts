import { describe, it, expect, vi } from "vitest";
import { fetchProducts } from "./products";

vi.mock("@/lib/supabase", () => {
  const order = vi.fn().mockResolvedValue({
    data: [
      {
        id: "p1",
        slug: "amara-wrap-dress",
        name: "Amara Wrap Dress",
        category: "Dresses",
        price_kes: 3200,
        description: null,
        images: [],
        colors: ["#630625"],
        sizes: ["S", "M"],
        stock: 12,
        units_sold: 8,
        created_at: "2026-08-01T00:00:00Z",
        product_variants: [],
      },
    ],
    error: null,
  });
  const select = vi.fn(() => ({ order }));
  const from = vi.fn(() => ({ select }));
  return { supabase: { from } };
});

describe("fetchProducts", () => {
  it("maps Supabase rows to the Product shape the app expects", async () => {
    const products = await fetchProducts();
    expect(products).toEqual([
      {
        id: "p1",
        slug: "amara-wrap-dress",
        name: "Amara Wrap Dress",
        category: "Dresses",
        priceKes: 3200,
        description: undefined,
        images: [],
        colors: ["#630625"],
        sizes: ["S", "M"],
        stock: 12,
        unitsSold: 8,
        createdAt: "2026-08-01T00:00:00Z",
        variants: undefined,
      },
    ]);
  });
});
