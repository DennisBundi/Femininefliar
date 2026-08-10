import { supabase } from "@/lib/supabase";
import type { Product } from "@/types/product";
import type { Database } from "@/types/database";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type VariantRow = Database["public"]["Tables"]["product_variants"]["Row"];

function toProduct(row: ProductRow, variants: VariantRow[]): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.category,
    priceKes: row.price_kes,
    description: row.description ?? undefined,
    images: row.images,
    colors: row.colors,
    sizes: row.sizes,
    stock: row.stock,
    unitsSold: row.units_sold,
    createdAt: row.created_at,
    variants: variants.length
      ? variants.map((v) => ({ id: v.id, size: v.size ?? undefined, color: v.color ?? undefined, stock: v.stock }))
      : undefined,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => toProduct(row, row.product_variants ?? []));
}
