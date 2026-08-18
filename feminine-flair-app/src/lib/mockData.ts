// Demo data mirroring Feminine_Flair_UXUI_Mockup.html so the app is interactive out of the box.
// Replace each of these with the matching Supabase query once the database is live — the shapes
// below match the `Product` / `Order` / `Customer` types exactly.
import type { Review } from "@/types/review";

export const LOW_STOCK_THRESHOLD = 4;

// Matches the categories seeded in supabase/seed.sql — used by the shop filter bar and the
// admin product form.
export const CATEGORIES = ["Dresses", "Tops & Blouses", "Bottoms", "Outerwear", "Shoes & Bags", "Jewelry"];

export const REVIEWS_SEED: Review[] = [
  { id: "r1", productId: "1", customerName: "Faith W.", rating: 5, comment: "Fits true to size and the wrap tie is so easy to adjust. Wore it to a wedding and got so many compliments.", verifiedPurchase: true, createdAt: "2026-07-28" },
  { id: "r2", productId: "1", customerName: "Cynthia N.", rating: 4, comment: "Lovely fabric, slightly long on me (I'm 5'2\") but nothing a tailor couldn't fix.", verifiedPurchase: true, createdAt: "2026-07-20" },
  { id: "r3", productId: "1", customerName: "Brenda K.", rating: 5, comment: "My favourite Feminine Flair piece so far. Ordering the burgundy one next.", verifiedPurchase: false, createdAt: "2026-07-15" },
  { id: "r4", productId: "2", customerName: "Grace M.", rating: 5, comment: "The ankara print is even nicer in person. Good weight, doesn't feel cheap.", verifiedPurchase: true, createdAt: "2026-07-29" },
  { id: "r5", productId: "2", customerName: "Purity A.", rating: 4, comment: "Runs a little snug at the shoulders, sized up and it's perfect now.", verifiedPurchase: true, createdAt: "2026-07-22" },
  { id: "r6", productId: "3", customerName: "Aisha K.", rating: 5, comment: "Beading is sturdy, not a single loose bead after two months of use.", verifiedPurchase: true, createdAt: "2026-07-18" },
  { id: "r7", productId: "4", customerName: "Naomi O.", rating: 4, comment: "Comfortable for an all-day event, palazzo cut is flattering.", verifiedPurchase: true, createdAt: "2026-07-10" },
  { id: "r8", productId: "5", customerName: "Winnie C.", rating: 5, comment: "Warm enough for early morning matatu rides but still looks sharp for the office.", verifiedPurchase: true, createdAt: "2026-07-25" },
  { id: "r9", productId: "5", customerName: "Diana M.", rating: 5, comment: "Excellent tailoring on the shoulders. Worth every shilling.", verifiedPurchase: false, createdAt: "2026-07-05" },
  { id: "r10", productId: "6", customerName: "Sharon L.", rating: 4, comment: "Comfortable block heel, good for standing all day at work.", verifiedPurchase: true, createdAt: "2026-07-12" },
];

export function reviewsFor(productId: string): Review[] {
  return REVIEWS_SEED.filter((r) => r.productId === productId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function ratingSummary(productId: string): { avg: number; count: number } {
  const reviews = reviewsFor(productId);
  if (!reviews.length) return { avg: 0, count: 0 };
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return { avg: Math.round(avg * 10) / 10, count: reviews.length };
}

export interface CustomerSummary {
  name: string;
  phone: string;
  orders: number;
  totalSpentKes: number;
  wishlistCount: number;
  followedUp?: boolean;
}

export function priceLabel(n: number) {
  return `KES ${n.toLocaleString()}`;
}

export function whenLabel(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString("en-KE", { day: "numeric", month: "short" });
}
