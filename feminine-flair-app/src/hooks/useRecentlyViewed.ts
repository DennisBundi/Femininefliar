import { create } from "zustand";

const MAX_ITEMS = 8;

interface RecentlyViewedState {
  productIds: string[];
  record: (id: string) => void;
}

// In-memory only, same convention as the other Zustand stores in this app (cart/wishlist/etc.) —
// swap for a `recently_viewed` table keyed by customer_id once auth/Supabase is wired up so it
// survives across sessions/devices.
export const useRecentlyViewed = create<RecentlyViewedState>((set, get) => ({
  productIds: [],
  record: (id) => {
    const withoutId = get().productIds.filter((p) => p !== id);
    set({ productIds: [id, ...withoutId].slice(0, MAX_ITEMS) });
  },
}));
