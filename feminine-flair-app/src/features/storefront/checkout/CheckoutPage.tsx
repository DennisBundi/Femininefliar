import { useMemo, useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { getCheckoutErrors, type CheckoutForm } from "@/lib/validation";
import { OrderSummary } from "./OrderSummary";
import { PaystackButton } from "./PaystackButton";

type Touched = Partial<Record<keyof CheckoutForm, boolean>>;

export function CheckoutPage() {
  const { deliveryMode, setDeliveryMode } = useCart();
  const [form, setForm] = useState<CheckoutForm>({ fullName: "", phone: "", email: "", address: "" });
  const [touched, setTouched] = useState<Touched>({});

  const errors = useMemo(() => getCheckoutErrors(form, deliveryMode), [form, deliveryMode]);
  const isValid = Object.keys(errors).length === 0;

  function field(name: keyof CheckoutForm) {
    return {
      value: form[name],
      onChange: (e: ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [name]: e.target.value })),
      onBlur: () => setTouched((t) => ({ ...t, [name]: true })),
    };
  }

  function showError(name: keyof CheckoutForm) {
    return touched[name] && errors[name] ? errors[name] : undefined;
  }

  const inputClass = (name: keyof CheckoutForm) =>
    `w-full rounded border px-3 py-2.5 text-sm ${showError(name) ? "border-red-400" : "border-blush-soft"}`;

  return (
    <main className="mx-auto max-w-4xl px-8 py-8">
      <div className="mb-4 text-xs text-ink/60">Home / Checkout</div>
      <div className="grid grid-cols-1 gap-[52px] md:grid-cols-[1fr_360px]">
        <div>
          <h2 className="mb-5 text-2xl">Delivery details</h2>
          <label className="mb-[18px] block">
            <span className="mb-1.5 block text-xs text-ink/60">Full name</span>
            <input {...field("fullName")} className={inputClass("fullName")} placeholder="Faith Wanjiru" aria-invalid={Boolean(showError("fullName"))} />
            {showError("fullName") && <p className="mt-1 text-xs text-red-500">{showError("fullName")}</p>}
          </label>
          <div className="mb-[18px] grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label>
              <span className="mb-1.5 block text-xs text-ink/60">Phone number</span>
              <input {...field("phone")} className={inputClass("phone")} placeholder="07XX XXX XXX" aria-invalid={Boolean(showError("phone"))} />
              {showError("phone") && <p className="mt-1 text-xs text-red-500">{showError("phone")}</p>}
            </label>
            <label>
              <span className="mb-1.5 block text-xs text-ink/60">Email (optional)</span>
              <input {...field("email")} className={inputClass("email")} placeholder="you@email.com" aria-invalid={Boolean(showError("email"))} />
              {showError("email") && <p className="mt-1 text-xs text-red-500">{showError("email")}</p>}
            </label>
          </div>

          <div className="mb-5 flex gap-2.5">
            <button
              onClick={() => setDeliveryMode("delivery")}
              className={`rounded border px-3 py-1.5 text-xs ${deliveryMode === "delivery" ? "border-burgundy bg-burgundy text-white" : "border-blush-soft"}`}
            >
              Deliver to me
            </button>
            <button
              onClick={() => setDeliveryMode("pickup")}
              className={`rounded border px-3 py-1.5 text-xs ${deliveryMode === "pickup" ? "border-burgundy bg-burgundy text-white" : "border-blush-soft"}`}
            >
              Pickup at Simara Mall
            </button>
          </div>

          {deliveryMode === "delivery" ? (
            <label className="mb-[18px] block">
              <span className="mb-1.5 block text-xs text-ink/60">Delivery address</span>
              <input {...field("address")} className={inputClass("address")} placeholder="Street, estate, Nairobi" aria-invalid={Boolean(showError("address"))} />
              {showError("address") && <p className="mt-1 text-xs text-red-500">{showError("address")}</p>}
            </label>
          ) : (
            <p className="mb-[18px] text-xs text-ink/60">
              Ready for pickup within 1 business day at Simara Mall, 4th Floor, F-23, Nairobi.
            </p>
          )}

          <h2 className="mb-4 mt-8 text-2xl">Payment</h2>
          <p className="text-xs text-ink/60">
            You'll be redirected to Paystack's secure checkout to complete payment by card or mobile money.
            Need to return or exchange later? <Link to="/returns" className="text-burgundy underline">See our returns policy</Link>.
          </p>
        </div>

        <div>
          <OrderSummary />
          <PaystackButton
            customerName={form.fullName}
            phone={form.phone}
            email={form.email}
            address={form.address}
            disabled={!isValid}
            onAttemptWhileInvalid={() => setTouched({ fullName: true, phone: true, email: true, address: true })}
          />
          <p className="mt-2.5 text-center text-[11px] text-ink/60">Cards & mobile money accepted · PCI-compliant</p>
        </div>
      </div>
    </main>
  );
}
