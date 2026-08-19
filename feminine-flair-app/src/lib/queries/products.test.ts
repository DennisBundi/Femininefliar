import { describe, it, expect, vi, beforeEach } from "vitest";

beforeEach(() => vi.resetModules());

const ROW = {
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
};

describe("fetchProducts", () => {
  it("maps Supabase rows to the Product shape the app expects", async () => {
    const order = vi.fn().mockResolvedValue({ data: [{ ...ROW, product_variants: [] }], error: null });
    const select = vi.fn(() => ({ order }));
    const from = vi.fn(() => ({ select }));
    vi.doMock("@/lib/supabase", () => ({ supabase: { from } }));
    const { fetchProducts } = await import("./products");

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

const INPUT = {
  name: "Amara Wrap Dress",
  slug: "amara-wrap-dress",
  category: "Dresses",
  priceKes: 3200,
  images: [] as string[],
  colors: ["#630625"],
  sizes: ["S", "M"],
  stock: 12,
};

describe("createProduct", () => {
  it("inserts the product and returns it mapped to the Product shape", async () => {
    const single = vi.fn().mockResolvedValue({ data: { ...ROW, product_variants: undefined }, error: null });
    const select = vi.fn(() => ({ single }));
    const insert = vi.fn(() => ({ select }));
    const from = vi.fn(() => ({ insert }));
    vi.doMock("@/lib/supabase", () => ({ supabase: { from } }));
    const { createProduct } = await import("./products");

    const product = await createProduct(INPUT);

    expect(insert).toHaveBeenCalledWith([
      {
        name: "Amara Wrap Dress",
        slug: "amara-wrap-dress",
        category: "Dresses",
        price_kes: 3200,
        description: null,
        images: [],
        colors: ["#630625"],
        sizes: ["S", "M"],
        stock: 12,
      },
    ]);
    expect(product.id).toBe("p1");
  });

  it("throws when Supabase reports an error (e.g. duplicate slug)", async () => {
    const single = vi.fn().mockResolvedValue({ data: null, error: { message: "duplicate key value" } });
    const select = vi.fn(() => ({ single }));
    const insert = vi.fn(() => ({ select }));
    const from = vi.fn(() => ({ insert }));
    vi.doMock("@/lib/supabase", () => ({ supabase: { from } }));
    const { createProduct } = await import("./products");

    await expect(createProduct(INPUT)).rejects.toEqual({ message: "duplicate key value" });
  });
});

describe("updateProduct", () => {
  it("updates the product by id", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const update = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ update }));
    vi.doMock("@/lib/supabase", () => ({ supabase: { from } }));
    const { updateProduct } = await import("./products");

    await updateProduct("p1", { ...INPUT, stock: 20 });

    expect(update).toHaveBeenCalledWith(expect.objectContaining({ stock: 20 }));
    expect(eq).toHaveBeenCalledWith("id", "p1");
  });
});

describe("updateStock", () => {
  it("updates only the stock field by id", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const update = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ update }));
    vi.doMock("@/lib/supabase", () => ({ supabase: { from } }));
    const { updateStock } = await import("./products");

    await updateStock("p1", 15);

    expect(update).toHaveBeenCalledWith({ stock: 15 });
    expect(eq).toHaveBeenCalledWith("id", "p1");
  });
});

describe("deleteProduct", () => {
  it("deletes the product by id", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const del = vi.fn(() => ({ eq }));
    const from = vi.fn(() => ({ delete: del }));
    vi.doMock("@/lib/supabase", () => ({ supabase: { from } }));
    const { deleteProduct } = await import("./products");

    await deleteProduct("p1");

    expect(del).toHaveBeenCalled();
    expect(eq).toHaveBeenCalledWith("id", "p1");
  });
});
