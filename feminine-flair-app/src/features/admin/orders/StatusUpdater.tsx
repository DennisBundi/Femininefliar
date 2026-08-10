import type { OrderStatus } from "@/types/order";

const NEXT: Partial<Record<OrderStatus, OrderStatus>> = { pending: "processing", processing: "shipped", shipped: "delivered" };

export function StatusUpdater({ status, onAdvance }: { status: OrderStatus; onAdvance: () => void }) {
  const next = NEXT[status];
  if (!next) return null;
  return (
    <button onClick={onAdvance} className="rounded border border-burgundy px-2.5 py-1 text-[11px] font-semibold text-burgundy">
      Mark {next}
    </button>
  );
}
