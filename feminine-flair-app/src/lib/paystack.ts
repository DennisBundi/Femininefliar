// Thin wrapper around the Paystack Inline popup.
// Docs: https://paystack.com/docs/payments/accept-payments/

declare global {
  interface Window {
    PaystackPop?: any;
  }
}

interface PaystackParams {
  email: string;
  amountKobo: number; // Paystack expects the smallest currency unit
  reference: string;
  onSuccess: (reference: string) => void;
  onClose?: () => void;
}

export function payWithPaystack({ email, amountKobo, reference, onSuccess, onClose }: PaystackParams) {
  if (!window.PaystackPop) {
    console.error("Paystack inline script not loaded");
    return;
  }
  const handler = window.PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email,
    amount: amountKobo,
    ref: reference,
    callback: (res: { reference: string }) => onSuccess(res.reference),
    onClose,
  });
  handler.openIframe();
}
