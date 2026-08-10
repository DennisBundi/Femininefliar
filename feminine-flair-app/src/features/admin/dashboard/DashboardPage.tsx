import { useOrders } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";
import { priceLabel } from "@/lib/mockData";

export function DashboardPage() {
  const orders = useOrders((s) => s.orders);
  const today = useOrders((s) => s.today());
  const lowStock = useProducts((s) => s.lowStock());
  const todaySales = today.reduce((n, o) => n + o.totalKes, 0);

  return (
    <div>
      <div className="mb-6"><h2 className="text-2xl">Dashboard</h2><p className="text-sm text-ink/60">Today at a glance</p></div>

      <div className="mb-7 grid grid-cols-1 gap-[18px] sm:grid-cols-3">
        <div className="rounded bg-white p-5 shadow-sm">
          <p className="mb-1.5 text-xs text-ink/60">Today's sales</p>
          <p className="text-2xl font-bold text-burgundy">{priceLabel(todaySales)}</p>
        </div>
        <div className="rounded bg-white p-5 shadow-sm">
          <p className="mb-1.5 text-xs text-ink/60">Orders today</p>
          <p className="text-2xl font-bold text-burgundy">{today.length}</p>
        </div>
        <div className="rounded bg-white p-5 shadow-sm">
          <p className="mb-1.5 text-xs text-ink/60">Low stock alerts</p>
          <p className="text-2xl font-bold text-[#a3401d]">{lowStock.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded bg-white p-5 shadow-sm">
          <h3 className="mb-3.5 text-sm font-semibold">Recent orders</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-blush-soft text-[11px] uppercase text-ink/60">
                <th className="py-2 text-left">Order</th><th className="text-left">Customer</th><th className="text-left">Channel</th><th className="text-left">Status</th><th className="text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 6).map((o) => (
                <tr key={o.id} className="border-b border-blush-soft">
                  <td className="py-2.5">#{o.id}</td>
                  <td>{o.customerName}</td>
                  <td className="capitalize">{o.channel}</td>
                  <td><span className="rounded-full bg-[#dcf0dc] px-2 py-0.5 text-[10.5px] text-[#256c25]">{o.status}</span></td>
                  <td>{priceLabel(o.totalKes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded bg-white p-5 shadow-sm">
          <h3 className="mb-3.5 text-sm font-semibold">Low stock alerts</h3>
          {lowStock.length === 0 ? (
            <p className="text-xs text-ink/60">Everything is well stocked.</p>
          ) : (
            lowStock.map((p) => (
              <div key={p.id} className="flex items-center justify-between border-b border-blush-soft py-2.5 text-xs last:border-0">
                <span>{p.name} <span className="text-ink/60">· {p.category}</span></span>
                <span className="rounded-full bg-[#fbe4d8] px-2 py-0.5 font-bold text-[#a3401d]">{p.stock} left</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
