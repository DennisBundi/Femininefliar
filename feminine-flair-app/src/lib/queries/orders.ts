import { supabase } from "@/lib/supabase";
import type { Order, OrderStatus } from "@/types/order";
import type { Database } from "@/types/database";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];

function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    customerName: row.customer_name,
    channel: row.channel as Order["channel"],
    status: row.status as OrderStatus,
    totalKes: row.total_kes,
    when: row.created_at,
    paystackReference: row.paystack_reference ?? undefined,
  };
}

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toOrder);
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
}

export interface PosSaleInput {
  totalKes: number;
  items: { productId: string; quantity: number; priceKes: number }[];
}

// Inserts a pending POS order + its line items, then marks it paid and decrements stock via
// admin_complete_pos_sale (migration 0006) — that RPC checks is_admin() itself, so this only
// succeeds for a logged-in admin session.
export async function completePosSale(input: PosSaleInput): Promise<string> {
  const orderId = crypto.randomUUID();

  const { error: orderError } = await supabase.from("orders").insert([
    {
      id: orderId,
      customer_name: "Walk-in",
      phone: "",
      delivery_mode: "pickup",
      channel: "pos",
      total_kes: input.totalKes,
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

  const { error: rpcError } = await supabase.rpc("admin_complete_pos_sale", { p_order_id: orderId });
  if (rpcError) throw rpcError;

  return orderId;
}
