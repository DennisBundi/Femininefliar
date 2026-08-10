import { priceLabel } from "@/lib/mockData";

export interface ReceiptLine { name: string; qty: number }

export function ReceiptPrinter({ lines, total, method, onNewSale }: {
  lines: ReceiptLine[];
  total: number;
  method: "cash" | "card";
  onNewSale: () => void;
}) {
  return (
    <div className="rounded bg-white p-10 text-center shadow-sm">
      <div className="mx-auto mb-3.5 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#dcf0dc] text-2xl text-[#256c25]">✓</div>
      <h3 className="mb-2 text-xl">Sale complete</h3>
      <p className="mb-5 text-sm text-ink/60">
        {lines.map((l) => `${l.qty} × ${l.name}`).join(", ")} — {priceLabel(total)} paid by {method}
      </p>
      <button onClick={onNewSale} className="rounded bg-burgundy px-6 py-3 text-sm font-semibold text-white">
        Start new sale
      </button>
    </div>
  );
}
