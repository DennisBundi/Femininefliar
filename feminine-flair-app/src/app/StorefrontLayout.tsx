import { Outlet } from "react-router-dom";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { CartDrawer } from "@/features/storefront/cart/CartDrawer";

// Wraps every customer-facing route. /admin/* uses AdminLayout instead — no storefront chrome there.
export function StorefrontLayout() {
  return (
    <>
      <div className="bg-burgundy-dark px-3 py-2 text-center text-xs tracking-wide text-blush-soft">
        FREE DELIVERY WITHIN NAIROBI ON ORDERS OVER KES 5,000 · VISIT US AT SIMARA MALL, 4TH FLOOR
      </div>
      <Header />
      <Outlet />
      <Footer />
      <WhatsAppButton />
      <CartDrawer />
    </>
  );
}
