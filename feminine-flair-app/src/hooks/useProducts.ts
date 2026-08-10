import { create } from "zustand";
import type { Product } from "@/types/product";
import { fetchProducts } from "@/lib/queries/products";
import { LOW_STOCK_THRESHOLD } from "@/lib/mockData";

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  setStock: (id: string, stock: number) => void;
  recordSale: (id: string, qty: number) => void; // decrements stock + increments unitsSold together
  lowStock: () => Product[];
}

// Client-side setStock/recordSale still exist for the (currently mock-data-backed,
// unwired-this-pass) admin/POS views. Real checkout stock decrements happen
// server-side via decrement_stock_for_order, never through these.
export const useProducts = create<ProductsState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const products = await fetchProducts();
      set({ products, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to load products", isLoading: false });
    }
  },
  setStock: (id, stock) =>
    set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, stock: Math.max(0, stock) } : p)) })),
  recordSale: (id, qty) =>
    set((s) => ({
      products: s.products.map((p) =>
        p.id === id ? { ...p, stock: Math.max(0, p.stock - qty), unitsSold: p.unitsSold + qty } : p
      ),
    })),
  lowStock: () => get().products.filter((p) => p.stock <= LOW_STOCK_THRESHOLD),
}));
