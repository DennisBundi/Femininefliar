import { whatsappLink } from "@/lib/whatsapp";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg"
      aria-label="Chat on WhatsApp"
    >
      {/* icon */}
    </a>
  );
}
