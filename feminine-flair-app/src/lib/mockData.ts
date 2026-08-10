// Demo data mirroring Feminine_Flair_UXUI_Mockup.html so the app is interactive out of the box.
// Replace each of these with the matching Supabase query (see comments in each store) once the
// database is live — the shapes below match the `Product` / `Order` / `Customer` types exactly.
import type { Order } from "@/types/order";
import type { Review } from "@/types/review";

export const LOW_STOCK_THRESHOLD = 4;

export const ORDERS_SEED: Order[] = [
  { id: 1042, customerName: "Faith W.", channel: "online", status: "delivered", totalKes: 3200, when: "today" },
  { id: 1041, customerName: "Grace M.", channel: "pos", status: "paid", totalKes: 1800, when: "today" },
  { id: 1040, customerName: "Aisha K.", channel: "online", status: "processing", totalKes: 5400, when: "today" },
  { id: 1039, customerName: "Walk-in", channel: "pos", status: "paid", totalKes: 2900, when: "yesterday" },
  { id: 1038, customerName: "Naomi O.", channel: "online", status: "pending", totalKes: 3600, when: "yesterday" },
];

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

export const CUSTOMERS_SEED: CustomerSummary[] = [
  { name: "Faith W.", phone: "+254 722 000 101", orders: 4, totalSpentKes: 14200, wishlistCount: 2 },
  { name: "Grace M.", phone: "+254 733 000 102", orders: 2, totalSpentKes: 5100, wishlistCount: 0 },
  { name: "Aisha K.", phone: "+254 711 000 103", orders: 3, totalSpentKes: 9800, wishlistCount: 1 },
  { name: "Naomi O.", phone: "+254 700 000 104", orders: 1, totalSpentKes: 3600, wishlistCount: 3 },
];

export function priceLabel(n: number) {
  return `KES ${n.toLocaleString()}`;
}
