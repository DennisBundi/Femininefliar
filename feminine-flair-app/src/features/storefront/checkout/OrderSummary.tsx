import { useCart } from "@/hooks/useCart";
import { priceLabel } from "@/lib/mockData";

export function OrderSummary() {
  const { lines, subtotal, deliveryMode } = useCart();
  const delivery = deliveryMode === "pickup" ? 0 : 300;
  const total = subtotal() + delivery;

  return (
    <div className="sticky top-24 rounded bg-blush-soft p-[22px]">
      <h3 className="mb-3.5 text-base font-semibold">Order summary</h3>
      {lines.map((line) => (
        <div key={line.product.id} className="mb-3.5 flex gap-3 text-xs">
          <div className="h-14 w-11 flex-shrink-0 rounded" style={{ background: "linear-gradient(150deg,#F5B7BD,#630625)" }} />
          <div>
            <p className="font-semibold">{line.product.name} × {line.qty}</p>
            <p className="text-ink/60">{priceLabel(line.product.priceKes * line.qty)}</p>
          </div>
        </div>
      ))}
      <div className="flex justify-between border-t border-burgundy/10 py-2 text-sm">
        <span>Subtotal</span><span>{priceLabel(subtotal())}</span>
      </div>
      <div className="flex justify-between border-t border-burgundy/10 py-2 text-sm">
        <span>Delivery</span><span>{delivery ? priceLabel(delivery) : "Free (pickup)"}</span>
      </div>
      <div className="flex justify-between border-t border-burgundy/10 py-2 text-base font-bold text-burgundy">
        <span>Total</span><span>{priceLabel(total)}</span>
      </div>
    </div>
  );
}
