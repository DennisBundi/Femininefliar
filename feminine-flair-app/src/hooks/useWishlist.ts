import { create } from "zustand";
import { useToast } from "./useToast";

interface WishlistState {
  productIds: Set<string>;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  count: () => number;
}

// Each add/remove should also write to a `wishlist_items` row (customer_id, product_id, created_at)
// once auth is wired up — that table is what powers the "still interested?" / back-in-stock
// WhatsApp and email reminders described in Feminine_Flair_Frontend_Architecture.md section 5.
export const useWishlist = create<WishlistState>((set, get) => ({
  productIds: new Set(),
  toggle: (id) => {
    const next = new Set(get().productIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
      useToast.getState().show("Saved to wishlist — we'll follow up if it's about to sell out");
    }
    set({ productIds: next });
  },
  has: (id) => get().productIds.has(id),
  count: () => get().productIds.size,
}));
