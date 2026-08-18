import { supabase } from "@/lib/supabase";
import type { CustomerSummary } from "@/lib/mockData";

// There's no populated `customers` table yet — guest checkout stores customer info directly on
// each order, and no code path upserts a customers row. Derive the admin's customer list by
// aggregating real orders per phone number instead. POS "Walk-in" sales (no phone collected) are
// excluded — they're not identifiable customers, and lumping every walk-in together as one row
// would be misleading.
export async function fetchCustomerSummaries(): Promise<CustomerSummary[]> {
  const { data, error } = await supabase.from("orders").select("customer_name, phone, total_kes");
  if (error) throw error;

  const byPhone = new Map<string, CustomerSummary>();
  for (const row of data ?? []) {
    if (!row.phone) continue;
    const existing = byPhone.get(row.phone);
    if (existing) {
      existing.orders += 1;
      existing.totalSpentKes += row.total_kes;
    } else {
      byPhone.set(row.phone, {
        name: row.customer_name,
        phone: row.phone,
        orders: 1,
        totalSpentKes: row.total_kes,
        // wishlist_items has no customer linkage yet (guest checkout, no accounts) — always 0
        // until customer accounts + real wishlist persistence exist.
        wishlistCount: 0,
      });
    }
  }

  return [...byPhone.values()].sort((a, b) => b.totalSpentKes - a.totalSpentKes);
}
