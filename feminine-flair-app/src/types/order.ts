export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "paid";
export type OrderChannel = "online" | "pos";

export interface OrderItem {
  productId: string;
  quantity: number;
  priceKes: number;
}

export interface Order {
  id: string;
  customerName: string;
  channel: OrderChannel;
  status: OrderStatus;
  totalKes: number;
  when: string; // ISO date (orders.created_at)
  items?: OrderItem[];
  paystackReference?: string;
}
