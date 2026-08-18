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

export interface ProductInput {
  name: string;
  slug: string;
  category: string;
  priceKes: number;
  description?: string;
  images: string[];
  colors: string[];
  sizes: string[];
  stock: number;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .insert([
      {
        name: input.name,
        slug: input.slug,
        category: input.category,
        price_kes: input.priceKes,
        description: input.description || null,
        images: input.images,
        colors: input.colors,
        sizes: input.sizes,
        stock: input.stock,
      },
    ])
    .select()
    .single();
  if (error) throw error;
  return toProduct(data, []);
}

export async function updateProduct(id: string, input: ProductInput): Promise<void> {
  const { error } = await supabase
    .from("products")
    .update({
      name: input.name,
      slug: input.slug,
      category: input.category,
      price_kes: input.priceKes,
      description: input.description || null,
      images: input.images,
      colors: input.colors,
      sizes: input.sizes,
      stock: input.stock,
    })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function updateStock(id: string, stock: number): Promise<void> {
  const { error } = await supabase.from("products").update({ stock }).eq("id", id);
  if (error) throw error;
}
