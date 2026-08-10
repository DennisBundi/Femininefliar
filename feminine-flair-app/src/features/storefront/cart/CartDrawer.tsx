import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { priceLabel } from "@/lib/mockData";

export function CartDrawer() {
  const { lines, isOpen, setOpen, incrementLine, decrementLine, removeItem, subtotal } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-ink/40 transition-opacity ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
      />
      <div className={`fixed inset-y-0 right-0 z-[61] flex w-[400px] flex-col bg-white transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between border-b border-blush-soft px-6 py-[22px]">
          <h3 className="text-xl">Your bag ({lines.reduce((n, l) => n + l.qty, 0)})</h3>
          <button onClick={() => setOpen(false)} aria-label="Close cart">×</button>
        </div>

        <div className="flex-1 space-y-[18px] overflow-y-auto px-6 py-[18px]">
          {lines.length === 0 && <p className="py-5 text-sm text-ink/60">Your bag is empty.</p>}
          {lines.map((line) => (
            <div key={line.product.id} className="flex gap-3.5">
              <div className="h-[88px] w-[70px] flex-shrink-0 rounded" style={{ background: `linear-gradient(150deg,#F5B7BD,#630625)` }} />
              <div className="flex-1">
                <p className="text-sm font-semibold">{line.product.name}</p>
                <p className="mb-2 text-xs text-ink/60">{line.product.category}</p>
                <div className="inline-flex items-center rounded border border-blush-soft">
                  <button onClick={() => decrementLine(line.product.id)} className="h-[26px] w-[26px]">−</button>
                  <span className="w-[26px] text-center text-xs">{line.qty}</span>
                  <button onClick={() => incrementLine(line.product.id)} className="h-[26px] w-[26px]">+</button>
                  <button onClick={() => removeItem(line.product.id)} className="ml-2 px-1 text-ink/50">✕</button>
                </div>
              </div>
              <div className="whitespace-nowrap text-sm font-bold text-burgundy">{priceLabel(line.product.priceKes * line.qty)}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-blush-soft px-6 py-5">
          <div className="mb-4 flex justify-between text-sm">
            <span>Subtotal</span>
            <b className="text-lg text-burgundy">{priceLabel(subtotal())}</b>
          </div>
          <Link
            to="/checkout"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 rounded bg-burgundy py-4 text-center text-sm font-bold text-white hover:bg-burgundy-dark"
          >
            Checkout with Paystack
          </Link>
          <p className="mt-2.5 text-center text-[11px] text-ink/60">Cards & mobile money accepted · PCI-compliant</p>
        </div>
      </div>
    </>
  );
}
