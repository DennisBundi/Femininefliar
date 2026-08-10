import { useProducts } from "@/hooks/useProducts";
import { ProductGrid } from "../catalog/ProductGrid";

export function NewArrivals() {
  const products = useProducts((s) => s.products);
  const isLoading = useProducts((s) => s.isLoading);
  const newest = [...products].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 8);

  return (
    <section className="bg-burgundy-tint px-8 py-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-serif text-3xl">New arrivals</h2>
        <p className="mb-8 mt-1 text-sm text-ink/60">Fresh in this week, ready to ship</p>
        {isLoading ? (
          <p className="text-sm text-ink/60">Loading new arrivals…</p>
        ) : (
          <ProductGrid products={newest} />
        )}
      </div>
    </section>
  );
}
