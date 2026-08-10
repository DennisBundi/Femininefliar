import { useProducts } from "@/hooks/useProducts";
import { ProductGrid } from "../catalog/ProductGrid";

export function RelatedProducts({ currentProductId, category }: { currentProductId: string; category: string }) {
  const products = useProducts((s) => s.products);
  const related = products.filter((p) => p.id !== currentProductId && p.category === category).slice(0, 4);
  const fallback = related.length ? related : products.filter((p) => p.id !== currentProductId).slice(0, 4);

  return (
    <section className="mt-16">
      <h2 className="mb-6 font-serif text-2xl">You may also like</h2>
      <ProductGrid products={fallback} />
    </section>
  );
}
