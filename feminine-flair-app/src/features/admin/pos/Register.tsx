import { useMemo, useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useOrders } from "@/hooks/useOrders";
import { priceLabel } from "@/lib/mockData";
import { ProductThumb } from "@/components/shared/ProductThumb";
import { ReceiptPrinter } from "./ReceiptPrinter";

interface TicketLine { productId: string; name: string; priceKes: number; qty: number }

// Confirmed flow: search product → add → cash or card → done.
export function Register() {
  const products = useProducts((s) => s.products);
  const fetchProducts = useProducts((s) => s.fetchAll);
  const addPosSale = useOrders((s) => s.addPosSale);

  const [query, setQuery] = useState("");
  const [ticket, setTicket] = useState<TicketLine[]>([]);
  const [method, setMethod] = useState<"cash" | "card">("cash");
  const [receipt, setReceipt] = useState<{ lines: TicketLine[]; total: number; method: "cash" | "card" } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const results = useMemo(
    () => (query.trim() ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())) : products),
    [products, query]
  );
  const total = ticket.reduce((n, l) => n + l.qty * l.priceKes, 0);

  function addToTicket(productId: string, name: string, priceKes: number) {
    setTicket((t) => {
      const existing = t.find((l) => l.productId === productId);
      if (existing) return t.map((l) => (l.productId === productId ? { ...l, qty: l.qty + 1 } : l));
      return [...t, { productId, name, priceKes, qty: 1 }];
    });
  }
  function setQty(productId: string, qty: number) {
    setTicket((t) => t.map((l) => (l.productId === productId ? { ...l, qty: Math.max(1, qty) } : l)));
  }

  async function completeSale() {
    if (!ticket.length || isSubmitting) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await addPosSale({
        totalKes: total,
        items: ticket.map((l) => ({ productId: l.productId, quantity: l.qty, priceKes: l.priceKes })),
      });
      await fetchProducts(); // refresh stock/unitsSold, decremented server-side by the sale
      setReceipt({ lines: ticket, total, method });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete sale — please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function startNewSale() {
    setTicket([]);
    setQuery("");
    setReceipt(null);
    setError(null);
  }

  return (
    <div>
      <div className="mb-6"><h2 className="text-2xl">Point of sale</h2><p className="text-sm text-ink/60">Search a product, add it to the ticket, take payment</p></div>

      {receipt ? (
        <ReceiptPrinter lines={receipt.lines} total={receipt.total} method={receipt.method} onNewSale={startNewSale} />
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products by name…"
              className="mb-3.5 w-full rounded border border-blush-soft px-4 py-3.5 text-sm"
            />
            <div className="flex flex-col gap-2">
              {results.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded bg-white p-2.5 shadow-sm">
                  <ProductThumb product={p} className="h-[50px] w-10 flex-shrink-0 rounded" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-ink/60">{priceLabel(p.priceKes)} · {p.stock} in stock</p>
                  </div>
                  <button
                    onClick={() => addToTicket(p.id, p.name, p.priceKes)}
                    className="rounded bg-burgundy px-3.5 py-1.5 text-xs font-bold text-white"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="sticky top-6 rounded bg-white p-5 shadow-sm">
            <div className="mb-3 text-sm font-bold">Current sale</div>
            <div className="mb-3 min-h-[60px]">
              {ticket.length === 0 && <p className="text-xs text-ink/60">No items yet — search and add products to start a sale.</p>}
              {ticket.map((l) => (
                <div key={l.productId} className="flex items-center gap-2.5 border-b border-blush-soft py-2 text-xs last:border-0">
                  <div className="flex-1">
                    <div>{l.name}</div>
                    <div className="inline-flex scale-90 items-center rounded border border-blush-soft">
                      <button onClick={() => setQty(l.productId, l.qty - 1)} className="h-6 w-6">−</button>
                      <span className="w-6 text-center">{l.qty}</span>
                      <button onClick={() => setQty(l.productId, l.qty + 1)} className="h-6 w-6">+</button>
                    </div>
                  </div>
                  <div>{priceLabel(l.priceKes * l.qty)}</div>
                </div>
              ))}
            </div>
            <div className="mb-3.5 flex justify-between border-t border-blush-soft py-3 text-base font-bold text-burgundy">
              <span>Total</span><span>{priceLabel(total)}</span>
            </div>
            <div className="mb-3.5 flex gap-2">
              <button onClick={() => setMethod("cash")} className={`flex-1 rounded border py-2.5 text-xs ${method === "cash" ? "border-burgundy bg-burgundy text-white" : "border-blush-soft"}`}>Cash</button>
              <button onClick={() => setMethod("card")} className={`flex-1 rounded border py-2.5 text-xs ${method === "card" ? "border-burgundy bg-burgundy text-white" : "border-blush-soft"}`}>Card / Paystack</button>
            </div>
            {error && <p className="mb-2 text-xs text-red-500">{error}</p>}
            <button
              onClick={completeSale}
              disabled={isSubmitting}
              className="w-full rounded bg-burgundy py-3.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Completing sale…" : "Complete sale"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
