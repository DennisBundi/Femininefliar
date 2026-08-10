import { useOrders } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";
import { priceLabel } from "@/lib/mockData";

function Bar({ label, value, max, sublabel }: { label: string; value: number; max: number; sublabel: string }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="mb-1.5 flex justify-between text-xs"><span>{label}</span><span>{sublabel}</span></div>
      <div className="h-2.5 overflow-hidden rounded-full bg-blush-soft">
        <div className="h-full rounded-full bg-burgundy" style={{ width: `${max ? (value / max) * 100 : 0}%` }} />
      </div>
    </div>
  );
}

export function ReportsPage() {
  const orders = useOrders((s) => s.orders);
  const products = useProducts((s) => s.products);

  const online = orders.filter((o) => o.channel === "online").reduce((n, o) => n + o.totalKes, 0);
  const pos = orders.filter((o) => o.channel === "pos").reduce((n, o) => n + o.totalKes, 0);
  const maxChannel = Math.max(online, pos, 1);

  const top = [...products].sort((a, b) => b.unitsSold - a.unitsSold).slice(0, 5);
  const maxSold = Math.max(...top.map((p) => p.unitsSold), 1);

  return (
    <div>
      <div className="mb-6"><h2 className="text-2xl">Reports</h2><p className="text-sm text-ink/60">Where the sales are coming from</p></div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded bg-white p-5 shadow-sm">
          <h3 className="mb-3.5 text-sm font-semibold">Revenue by channel</h3>
          <Bar label="Online" value={online} max={maxChannel} sublabel={priceLabel(online)} />
          <Bar label="POS (in-person)" value={pos} max={maxChannel} sublabel={priceLabel(pos)} />
        </div>
        <div className="rounded bg-white p-5 shadow-sm">
          <h3 className="mb-3.5 text-sm font-semibold">Top products</h3>
          {top.map((p) => (
            <Bar key={p.id} label={p.name} value={p.unitsSold} max={maxSold} sublabel={`${p.unitsSold} sold`} />
          ))}
        </div>
      </div>
    </div>
  );
}
