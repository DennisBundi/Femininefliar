const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "254796489610";

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
