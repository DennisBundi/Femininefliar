import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useProducts } from "@/hooks/useProducts";
import { useOrders } from "@/hooks/useOrders";
import { useToast } from "@/hooks/useToast";
// import { payWithPaystack } from "@/lib/paystack"; // wire this in once VITE_PAYSTACK_PUBLIC_KEY is set

interface PaystackButtonProps {
  customerName: string;
  disabled: boolean;
  onAttemptWhileInvalid: () => void;
}

export function PaystackButton({ customerName, disabled, onAttemptWhileInvalid }: PaystackButtonProps) {
  const { lines, subtotal, deliveryMode, clear } = useCart();
  const recordSale = useProducts((s) => s.recordSale);
  const addOrder = useOrders((s) => s.addOrder);
  const showToast = useToast((s) => s.show);
  const navigate = useNavigate();

  function handlePay() {
    if (disabled) {
      // Surface every validation error at once rather than silently doing nothing on click.
      onAttemptWhileInvalid();
      showToast("Check the highlighted fields before paying");
      return;
    }
    if (!lines.length) return;
    const delivery = deliveryMode === "pickup" ? 0 : 300;
    const total = subtotal() + delivery;

    // TODO: replace this block with payWithPaystack({...}) and only run the lines below
    // (recordSale / addOrder / clear) inside its onSuccess callback, once Paystack confirms payment.
    lines.forEach((line) => recordSale(line.product.id, line.qty));
    addOrder({ customerName: customerName.trim() || "Online customer", channel: "online", status: "pending", totalKes: total, when: "today" });

    showToast("Payment successful — order confirmed!");
    clear();
    setTimeout(() => navigate("/"), 1400);
  }

  return (
    <button
      onClick={handlePay}
      aria-disabled={disabled}
      className={`mt-4 flex w-full items-center justify-center gap-2 rounded py-4 text-sm font-bold text-white ${
        disabled ? "cursor-not-allowed bg-burgundy/40" : "bg-burgundy hover:bg-burgundy-dark"
      }`}
    >
      Pay with Paystack
    </button>
  );
}
