import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { fetchMyOrders } from "@/lib/queries/orders";
import { priceLabel, whenLabel } from "@/lib/mockData";
import type { Order } from "@/types/order";

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-[#f7e6c8] text-[#8a5a10]",
  processing: "bg-[#dbe6f5] text-[#1e4d8f]",
  shipped: "bg-[#e2dbf5] text-[#5a3a99]",
  delivered: "bg-[#dcf0dc] text-[#256c25]",
  paid: "bg-[#dcf0dc] text-[#256c25]",
};

export function OrderHistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setIsLoading(true);
    fetchMyOrders(user.id)
      .then(setOrders)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load orders"))
      .finally(() => setIsLoading(false));
  }, [user]);

  if (authLoading) return <main className="mx-auto max-w-3xl px-8 py-12" />;

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-8 py-12 text-center">
        <p className="mb-4 text-sm text-ink/60">Sign in to see your order history.</p>
        <Link to="/account/login" className="text-sm font-semibold text-burgundy underline">Sign in</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-8 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-3xl">Your orders</h2>
        <button onClick={() => supabase.auth.signOut()} className="text-xs text-ink/60 underline">
          Sign out
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-ink/60">Loading…</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-ink/60">No orders yet — your past orders will show up here.</p>
      ) : (
        <div className="divide-y divide-blush-soft rounded bg-white shadow-sm">
          {orders.map((o) => (
            <div key={o.id} className="flex items-center justify-between px-5 py-4 text-sm">
              <div>
                <p className="font-semibold">Order #{o.id.slice(0, 8)}</p>
                <p className="text-xs text-ink/60">{whenLabel(o.when)}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-1 text-[11px] ${STATUS_COLOR[o.status]}`}>{o.status}</span>
                <span className="font-semibold">{priceLabel(o.totalKes)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
