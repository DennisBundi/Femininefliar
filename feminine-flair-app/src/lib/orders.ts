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
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([
      {
        customer_name: input.customerName,
        phone: input.phone,
        email: input.email || null,
        address: input.address || null,
        delivery_mode: input.deliveryMode,
        total_kes: input.totalKes,
        channel: "online",
      },
    ])
    .select()
    .single();

  if (orderError) throw orderError;

  const { error: itemsError } = await supabase.from("order_items").insert(
    input.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId,
      quantity: item.quantity,
      price_kes: item.priceKes,
    }))
  );

  if (itemsError) throw itemsError;

  return { orderId: order.id };
}
