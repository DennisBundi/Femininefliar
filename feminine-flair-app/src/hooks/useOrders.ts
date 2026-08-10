import { create } from "zustand";
import type { Order, OrderStatus } from "@/types/order";
import { ORDERS_SEED } from "@/lib/mockData";

interface OrdersState {
  orders: Order[];
  nextId: number;
  addOrder: (order: Omit<Order, "id">) => void;
  advanceStatus: (id: number) => void;
  today: () => Order[];
}

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "processing",
  processing: "shipped",
  shipped: "delivered",
};

// TODO: replace ORDERS_SEED with a Supabase query ordered by created_at desc; addOrder becomes an
// insert (called from the Paystack success callback for online, or on POS "Complete sale"); the
// Paystack webhook is the source of truth for `status` moving out of "pending" for online orders.
export const useOrders = create<OrdersState>((set, get) => ({
  orders: ORDERS_SEED,
  nextId: 1043,
  addOrder: (order) =>
    set((s) => ({ orders: [{ ...order, id: s.nextId }, ...s.orders], nextId: s.nextId + 1 })),
  advanceStatus: (id) =>
    set((s) => ({
      orders: s.orders.map((o) => (o.id === id && NEXT_STATUS[o.status] ? { ...o, status: NEXT_STATUS[o.status]! } : o)),
    })),
  today: () => get().orders.filter((o) => o.when === "today"),
}));
