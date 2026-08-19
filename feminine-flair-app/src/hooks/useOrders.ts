import { create } from "zustand";
import type { Order, OrderStatus } from "@/types/order";
import { fetchOrders, updateOrderStatus, completePosSale, type PosSaleInput } from "@/lib/queries/orders";

interface OrdersState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  advanceStatus: (id: string) => Promise<void>;
  addPosSale: (input: PosSaleInput) => Promise<void>;
  today: () => Order[];
}

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "processing",
  processing: "shipped",
  shipped: "delivered",
};

export const useOrders = create<OrdersState>((set, get) => ({
  orders: [],
  isLoading: false,
  error: null,
  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const orders = await fetchOrders();
      set({ orders, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to load orders", isLoading: false });
    }
  },
  advanceStatus: async (id) => {
    const order = get().orders.find((o) => o.id === id);
    const next = order && NEXT_STATUS[order.status];
    if (!next) return;
    await updateOrderStatus(id, next);
    set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status: next } : o)) }));
  },
  addPosSale: async (input) => {
    await completePosSale(input);
    await get().fetchAll();
  },
  today: () => {
    const todayStr = new Date().toDateString();
    return get().orders.filter((o) => new Date(o.when).toDateString() === todayStr);
  },
}));
