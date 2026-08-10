import { useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { priceLabel } from "@/lib/mockData";
import { StatusUpdater } from "./StatusUpdater";

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-[#f7e6c8] text-[#8a5a10]",
  processing: "bg-[#dbe6f5] text-[#1e4d8f]",
  shipped: "bg-[#e2dbf5] text-[#5a3a99]",
  delivered: "bg-[#dcf0dc] text-[#256c25]",
  paid: "bg-[#dcf0dc] text-[#256c25]",
};

export function OrderTable() {
  const orders = useOrders((s) => s.orders);
  const advanceStatus = useOrders((s) => s.advanceStatus);
  const [channel, setChannel] = useState<"all" | "online" | "pos">("all");

  const list = channel === "all" ? orders : orders.filter((o) => o.channel === channel);

  return (
    <div>
      <div className="mb-6"><h2 className="text-2xl">Orders</h2><p className="text-sm text-ink/60">Every sale, online and in person</p></div>
      <div className="mb-4 flex gap-2">
        {(["all", "online", "pos"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setChannel(c)}
            className={`rounded-full border px-4 py-1.5 text-xs capitalize ${channel === c ? "border-burgundy bg-burgundy text-white" : "border-blush-soft"}`}
          >
            {c === "all" ? "All channels" : c}
          </button>
        ))}
      </div>
      <div className="rounded bg-white p-5 shadow-sm">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-blush-soft text-[11px] uppercase text-ink/60">
              <th className="py-2 text-left">Order</th><th className="text-left">Customer</th><th className="text-left">Channel</th><th className="text-left">Status</th><th className="text-left">Total</th><th className="text-left">When</th><th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id} className="border-b border-blush-soft">
                <td className="py-2.5">#{o.id}</td>
                <td>{o.customerName}</td>
                <td className="capitalize">{o.channel}</td>
                <td><span className={`rounded-full px-2 py-0.5 text-[10.5px] ${STATUS_COLOR[o.status]}`}>{o.status}</span></td>
                <td>{priceLabel(o.totalKes)}</td>
                <td className="capitalize text-ink/60">{o.when}</td>
                <td><StatusUpdater status={o.status} onAdvance={() => advanceStatus(o.id)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
