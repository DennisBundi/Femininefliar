import { useCustomers } from "@/hooks/useCustomers";
import { priceLabel } from "@/lib/mockData";

export function CustomerTable() {
  const customers = useCustomers((s) => s.customers);
  const isLoading = useCustomers((s) => s.isLoading);
  const error = useCustomers((s) => s.error);
  const markFollowedUp = useCustomers((s) => s.markFollowedUp);

  return (
    <div>
      <div className="mb-6"><h2 className="text-2xl">Customers</h2><p className="text-sm text-ink/60">Order history and wishlist follow-ups</p></div>
      <div className="rounded bg-white p-5 shadow-sm">
        {isLoading ? (
          <p className="py-6 text-center text-xs text-ink/60">Loading customers…</p>
        ) : error ? (
          <p className="py-6 text-center text-xs text-red-500">{error}</p>
        ) : customers.length === 0 ? (
          <p className="py-6 text-center text-xs text-ink/60">No customers yet.</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-blush-soft text-[11px] uppercase text-ink/60">
                <th className="py-2 text-left">Customer</th><th className="text-left">Phone</th><th className="text-left">Orders</th><th className="text-left">Total spent</th><th className="text-left">Wishlist</th><th></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.phone} className="border-b border-blush-soft">
                  <td className="py-2.5">{c.name}</td>
                  <td>{c.phone}</td>
                  <td>{c.orders}</td>
                  <td>{priceLabel(c.totalSpentKes)}</td>
                  <td>{c.wishlistCount} item{c.wishlistCount === 1 ? "" : "s"}</td>
                  <td>
                    {c.wishlistCount > 0 && (
                      <button
                        onClick={() => markFollowedUp(c.name)}
                        className={`rounded px-2.5 py-1 text-[11px] font-bold ${c.followedUp ? "bg-[#dcf0dc] text-[#256c25]" : "bg-burgundy text-white"}`}
                      >
                        {c.followedUp ? "Sent ✓" : "Follow up"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
