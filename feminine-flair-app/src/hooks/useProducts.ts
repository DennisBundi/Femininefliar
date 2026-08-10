import { create } from "zustand";
import type { Product } from "@/types/product";
import { PRODUCTS_SEED, LOW_STOCK_THRESHOLD } from "@/lib/mockData";

interface ProductsState {
  products: Product[];
  setStock: (id: string, stock: number) => void;
  recordSale: (id: string, qty: number) => void; // decrements stock + increments unitsSold together
  lowStock: () => Product[];
}

// TODO: replace PRODUCTS_SEED with `supabase.from("products").select("*")`, and setStock /
// recordSale with the matching update() calls (ideally inside a Postgres function so stock
// decrements are atomic under concurrent checkouts).
export const useProducts = create<ProductsState>((set, get) => ({
  products: PRODUCTS_SEED,
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
