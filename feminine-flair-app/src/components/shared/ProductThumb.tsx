import type { Product } from "@/types/product";
import { placeholderGradient } from "@/lib/placeholder";

// Real photo when the product has one, else the brand-gradient placeholder — used everywhere a
// product thumbnail appears (shop grid, search, POS, admin table, hero carousel).
export function ProductThumb({ product, className }: { product: Pick<Product, "id" | "images" | "name">; className?: string }) {
  const src = product.images?.[0];
  if (src) {
    return <img src={src} alt={product.name} loading="lazy" className={`object-cover ${className ?? ""}`} />;
  }
  return <div className={className} style={{ background: placeholderGradient(product.id) }} />;
}
