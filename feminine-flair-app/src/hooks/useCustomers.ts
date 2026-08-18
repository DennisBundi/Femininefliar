import { create } from "zustand";
import type { CustomerSummary } from "@/lib/mockData";
import { fetchCustomerSummaries } from "@/lib/queries/customers";
import { useToast } from "./useToast";

interface CustomersState {
  customers: CustomerSummary[];
  isLoading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  markFollowedUp: (name: string) => void;
}

// TODO: markFollowedUp is still local-only (no follow_ups table yet) — dead in practice today
// since wishlistCount is always 0 until real customer accounts + wishlist persistence exist
// (see fetchCustomerSummaries), so the "Follow up" button that depends on it never renders.
export const useCustomers = create<CustomersState>((set) => ({
  customers: [],
  isLoading: false,
  error: null,
  fetchAll: async () => {
    set({ isLoading: true, error: null });
    try {
      const customers = await fetchCustomerSummaries();
      set({ customers, isLoading: false });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : "Failed to load customers", isLoading: false });
    }
  },
  markFollowedUp: (name) => {
    set((s) => ({ customers: s.customers.map((c) => (c.name === name ? { ...c, followedUp: true } : c)) }));
    useToast.getState().show(`WhatsApp reminder queued for ${name}`);
  },
}));
