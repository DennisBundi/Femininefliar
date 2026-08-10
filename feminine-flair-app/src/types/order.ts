export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "paid";
export type OrderChannel = "online" | "pos";

export interface OrderItem {
  productId: string;
  quantity: number;
  priceKes: number;
}

export interface Order {
  id: number;
  customerName: string;
  channel: OrderChannel;
  status: OrderStatus;
  totalKes: number;
  when: "today" | "yesterday" | string; // ISO date once this comes from Supabase
  items?: OrderItem[];
  paystackReference?: string;
}
