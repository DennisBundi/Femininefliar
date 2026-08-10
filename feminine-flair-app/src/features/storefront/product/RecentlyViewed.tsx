import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { useProducts } from "@/hooks/useProducts";
import { ProductGrid } from "../catalog/ProductGrid";

export function RecentlyViewed({ excludeProductId }: { excludeProductId: string }) {
  const ids = useRecentlyViewed((s) => s.productIds);
  const products = useProducts((s) => s.products);
  const items = ids
    .filter((id) => id !== excludeProductId)
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (!items.length) return null;

  return (
    <section className="mt-16">
      <h2 className="mb-6 font-serif text-2xl">Recently viewed</h2>
      <ProductGrid products={items} />
    </section>
  );
}
