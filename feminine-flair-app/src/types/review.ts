export interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number; // 1–5
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string; // ISO date
}
