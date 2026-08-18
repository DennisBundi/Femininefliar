import { supabase } from "@/lib/supabase";

export interface CreateOrderInput {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  deliveryMode: "delivery" | "pickup";
  totalKes: number;
  items: { productId: string; quantity: number; priceKes: number }[];
}

export async function createOrder(input: CreateOrderInput): Promise<{ orderId: string }> {
  // Generated client-side rather than read back via .select() after insert: anon has no SELECT
  // grant on orders (by design — order status/PII reads happen server-side only), so an
  // insert...RETURNING would fail with "permission denied for table orders". Supplying the id
  // ourselves sidesteps the read-back entirely.
  const orderId = crypto.randomUUID();

  const { error: orderError } = await supabase.from("orders").insert([
    {
      id: orderId,
      customer_name: input.customerName,
      phone: input.phone,
      email: input.email || null,
      address: input.address || null,
      delivery_mode: input.deliveryMode,
      total_kes: input.totalKes,
      channel: "online",
    },
  ]);

  if (orderError) throw orderError;

  const { error: itemsError } = await supabase.from("order_items").insert(
    input.items.map((item) => ({
      order_id: orderId,
      product_id: item.productId,
      quantity: item.quantity,
      price_kes: item.priceKes,
    }))
  );

  if (itemsError) throw itemsError;

  return { orderId };
}
