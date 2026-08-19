import { create } from "zustand";
import type { Product } from "@/types/product";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  type ProductInput,
} from "@/lib/queries/products";
import { LOW_STOCK_THRESHOLD } from "@/lib/mockData";

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  setStock: (id: string, stock: number) => Promise<void>;
  addProduct: (input: ProductInput) => Promise<void>;
  editProduct: (id: string, input: ProductInput) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  lowStock: () => Product[];
}

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
  setStock: async (id, stock) => {
    const next = Math.max(0, stock);
    await updateStock(id, next);
    set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, stock: next } : p)) }));
  },
  addProduct: async (input) => {
    const product = await createProduct(input);
    set((s) => ({ products: [product, ...s.products] }));
  },
  editProduct: async (id, input) => {
    await updateProduct(id, input);
    set((s) => ({
      products: s.products.map((p) =>
        p.id === id
          ? { ...p, ...input, priceKes: input.priceKes, description: input.description ?? undefined }
          : p
      ),
    }));
  },
  removeProduct: async (id) => {
    await deleteProduct(id);
    set((s) => ({ products: s.products.filter((p) => p.id !== id) }));
  },
  lowStock: () => get().products.filter((p) => p.stock <= LOW_STOCK_THRESHOLD),
}));
