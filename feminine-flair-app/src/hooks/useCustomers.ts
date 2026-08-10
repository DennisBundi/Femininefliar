import { create } from "zustand";
import type { CustomerSummary } from "@/lib/mockData";
import { CUSTOMERS_SEED } from "@/lib/mockData";
import { useToast } from "./useToast";

interface CustomersState {
  customers: CustomerSummary[];
  markFollowedUp: (name: string) => void;
}

// TODO: replace CUSTOMERS_SEED with a query joining customers + orders + wishlist_items;
// markFollowedUp should write a row to a `follow_ups` table and trigger the WhatsApp send
// (via a Supabase edge function calling the WhatsApp Business API), not just flip a flag locally.
export const useCustomers = create<CustomersState>((set) => ({
  customers: CUSTOMERS_SEED,
  markFollowedUp: (name) => {
    set((s) => ({ customers: s.customers.map((c) => (c.name === name ? { ...c, followedUp: true } : c)) }));
    useToast.getState().show(`WhatsApp reminder queued for ${name}`);
  },
}));
