import { supabase } from "@/lib/supabase";
import type { CustomerSummary } from "@/lib/mockData";

// Covers both account-holders and guest checkouts (guest orders never populate `customers`, only
// the order row itself) — aggregating by phone number captures both in one admin view. POS
// "Walk-in" sales (no phone collected) are excluded — they're not identifiable customers, and
// lumping every walk-in together as one row would be misleading.
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

export interface CustomerProfile {
  fullName: string;
  email: string | null;
  phone: string | null;
}

// Lets checkout pre-fill from a signed-in customer's last-used details. No row yet (e.g. signed up
// but never checked out) is a normal case, not an error — return null rather than throwing.
export async function fetchMyProfile(customerId: string): Promise<CustomerProfile | null> {
  const { data, error } = await supabase
    .from("customers")
    .select("full_name, email, phone")
    .eq("id", customerId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return { fullName: data.full_name, email: data.email, phone: data.phone };
}
