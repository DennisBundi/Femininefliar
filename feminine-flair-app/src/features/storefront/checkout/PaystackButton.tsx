import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import { createOrder } from "@/lib/orders";
import { payWithPaystack } from "@/lib/paystack";
import { useOrderStatus } from "@/hooks/useOrderStatus";

interface PaystackButtonProps {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  disabled: boolean;
  onAttemptWhileInvalid: () => void;
}

export function PaystackButton({ customerName, phone, email, address, disabled, onAttemptWhileInvalid }: PaystackButtonProps) {
  const { lines, subtotal, deliveryMode, clear } = useCart();
  const showToast = useToast((s) => s.show);
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const status = useOrderStatus(orderId);

  useEffect(() => {
    if (status === "paid") {
      showToast("Payment confirmed — order placed!");
      clear();
      setTimeout(() => navigate("/"), 1400);
    }
  }, [status, showToast, clear, navigate]);

  async function handlePay() {
    if (disabled) {
      onAttemptWhileInvalid();
      showToast("Check the highlighted fields before paying");
      return;
    }
    if (!lines.length || isSubmitting) return;

    const delivery = deliveryMode === "pickup" ? 0 : 300;
    const total = subtotal() + delivery;

    setIsSubmitting(true);
    try {
      const { orderId: newOrderId } = await createOrder({
        customerName: customerName.trim() || "Online customer",
        phone,
        email,
        address,
        deliveryMode,
        totalKes: total,
        items: lines.map((line) => ({ productId: line.product.id, quantity: line.qty, priceKes: line.product.priceKes })),
      });
      setOrderId(newOrderId);

      payWithPaystack({
        email: email || "orders@feminineflair.co.ke",
        amountKobo: total * 100,
        reference: newOrderId,
        onSuccess: () => showToast("Confirming your payment…"),
        onClose: () => showToast("Payment cancelled — your cart is still here, try again when ready."),
      });
    } catch (err) {
      showToast("Something went wrong creating your order — please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <button
      onClick={handlePay}
      aria-disabled={disabled}
      className={`mt-4 flex w-full items-center justify-center gap-2 rounded py-4 text-sm font-bold text-white ${
        disabled ? "cursor-not-allowed bg-burgundy/40" : "bg-burgundy hover:bg-burgundy-dark"
      }`}
    >
      {isSubmitting ? "Processing…" : "Pay with Paystack"}
    </button>
  );
}
