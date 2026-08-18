import { Link, NavLink, Outlet } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const NAV = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/customers", label: "Customers" },
  { to: "/admin/pos", label: "POS" },
  { to: "/admin/reports", label: "Reports" },
];

// Persistent sidebar shell for every /admin/* route. The storefront Header/Footer/WhatsApp button
// are hidden while any admin route is active — see the route guard note in app/router.tsx.
export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#f7f3f4]">
      <aside className="flex w-[216px] flex-shrink-0 flex-col bg-ink px-[18px] py-6 text-[#cbb9bc]">
        <div className="mb-7 font-serif text-xl text-white">
          FF <span className="text-blush">Admin</span>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded px-3 py-2.5 text-sm ${isActive ? "bg-burgundy text-white" : "hover:bg-white/5 hover:text-white"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link to="/" className="border-t border-[#3a2b2e] pt-4 text-xs text-[#a8969a] hover:text-white">
          ← Back to store
        </Link>
        <button
          onClick={() => supabase.auth.signOut()}
          className="mt-2 text-left text-xs text-[#a8969a] hover:text-white"
        >
          Sign out
        </button>
      </aside>
      <div className="flex-1 overflow-x-hidden px-10 py-8">
        <Outlet />
      </div>
    </div>
  );
}
