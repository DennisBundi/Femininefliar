import { CartDrawer } from "./CartDrawer";
import { useCart } from "@/hooks/useCart";
import { useEffect } from "react";

// Full-page equivalent for a direct /cart link (e.g. shared from WhatsApp); reuses the drawer UI, forced open.
export function CartPage() {
  const setOpen = useCart((s) => s.setOpen);
  useEffect(() => { setOpen(true); }, [setOpen]);
  return <main className="min-h-[60vh]"><CartDrawer /></main>;
}
