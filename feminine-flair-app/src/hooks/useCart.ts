import { create } from "zustand";
import type { Product } from "@/types/product";

interface CartLine {
  product: Product;
  qty: number;
  size?: string;
  color?: string;
}

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  deliveryMode: "delivery" | "pickup";
  addItem: (product: Product, qty?: number) => void;
  incrementLine: (productId: string) => void;
  decrementLine: (productId: string) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  setDeliveryMode: (mode: "delivery" | "pickup") => void;
  count: () => number;
  subtotal: () => number;
}

// TODO: persist to localStorage, and sync with Supabase for logged-in customers
export const useCart = create<CartState>((set, get) => ({
  lines: [],
  isOpen: false,
  deliveryMode: "delivery",
  addItem: (product, qty = 1) =>
    set((s) => {
      const existing = s.lines.find((l) => l.product.id === product.id);
      if (existing) {
        return { lines: s.lines.map((l) => (l.product.id === product.id ? { ...l, qty: l.qty + qty } : l)), isOpen: true };
      }
      return { lines: [...s.lines, { product, qty }], isOpen: true };
    }),
  incrementLine: (productId) =>
    set((s) => ({ lines: s.lines.map((l) => (l.product.id === productId ? { ...l, qty: l.qty + 1 } : l)) })),
  decrementLine: (productId) =>
    set((s) => ({ lines: s.lines.map((l) => (l.product.id === productId ? { ...l, qty: Math.max(1, l.qty - 1) } : l)) })),
  removeItem: (productId) => set((s) => ({ lines: s.lines.filter((l) => l.product.id !== productId) })),
  clear: () => set({ lines: [] }),
  setOpen: (open) => set({ isOpen: open }),
  setDeliveryMode: (mode) => set({ deliveryMode: mode }),
  count: () => get().lines.reduce((n, l) => n + l.qty, 0),
  subtotal: () => get().lines.reduce((n, l) => n + l.qty * l.product.priceKes, 0),
}));
