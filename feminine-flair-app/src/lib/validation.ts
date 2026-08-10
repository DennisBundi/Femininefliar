export interface CheckoutForm {
  fullName: string;
  phone: string;
  email: string;
  address: string;
}

const KENYAN_PHONE = /^(?:\+254|254|0)(7|1)\d{8}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function getCheckoutErrors(form: CheckoutForm, deliveryMode: "delivery" | "pickup"): Partial<Record<keyof CheckoutForm, string>> {
  const errors: Partial<Record<keyof CheckoutForm, string>> = {};

  if (!form.fullName.trim()) {
    errors.fullName = "Enter the name for this order.";
  } else if (form.fullName.trim().length < 2) {
    errors.fullName = "That name looks too short.";
  }

  if (!form.phone.trim()) {
    errors.phone = "Enter a phone number so we can reach you about delivery.";
  } else if (!KENYAN_PHONE.test(form.phone.replace(/\s/g, ""))) {
    errors.phone = "Enter a valid Kenyan number, e.g. 07XX XXX XXX or +254 7XX XXX XXX.";
  }

  if (form.email.trim() && !EMAIL.test(form.email.trim())) {
    errors.email = "That email address doesn't look right.";
  }

  if (deliveryMode === "delivery" && !form.address.trim()) {
    errors.address = "Enter a delivery address.";
  }

  return errors;
}
