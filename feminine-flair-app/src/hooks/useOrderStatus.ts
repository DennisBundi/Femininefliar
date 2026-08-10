import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { OrderStatus } from "@/types/order";

export function useOrderStatus(orderId: string | null): OrderStatus | null {
  const [status, setStatus] = useState<OrderStatus | null>(null);

  useEffect(() => {
    if (!orderId) {
      setStatus(null);
      return;
    }

    let cancelled = false;

    supabase
      .from("orders")
      .select("status")
      .eq("id", orderId)
      .single()
      .then(({ data }) => {
        if (!cancelled && data) setStatus(data.status as OrderStatus);
      });

    const channel = supabase
      .channel(`order-status-${orderId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${orderId}` },
        (payload: { new: { status: OrderStatus } }) => setStatus(payload.new.status)
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  return status;
}
