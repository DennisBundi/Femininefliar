import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { searchProducts } from "@/lib/search";
import { FilterBar, ShopFilters } from "./FilterBar";
import { ProductGrid } from "./ProductGrid";

export function ShopPage() {
  const products = useProducts((s) => s.products);
  const [searchParams] = useSearchParams();
  const categoryFromLink = searchParams.get("category");
  const query = searchParams.get("q") ?? "";

  const [filters, setFilters] = useState<ShopFilters>({
    categories: new Set(categoryFromLink ? [categoryFromLink] : []),
    sizes: new Set(),
    colors: new Set(),
    maxPriceKes: 6000,
  });
  const [sort, setSort] = useState<"newest" | "price-asc" | "price-desc">("newest");

  const filtered = useMemo(() => {
    const base = query ? searchProducts(products, query) : products;
    let list = base.filter((p) => {
      if (filters.categories.size && !filters.categories.has(p.category)) return false;
      if (filters.sizes.size && !(p.sizes.length === 0 || p.sizes.some((s) => filters.sizes.has(s)))) return false;
      if (filters.colors.size && !p.colors.some((c) => filters.colors.has(c))) return false;
      if (p.priceKes > filters.maxPriceKes) return false;
      return true;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.priceKes - b.priceKes);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.priceKes - a.priceKes);
    return list;
  }, [products, filters, sort, query]);

  return (
    <main className="mx-auto max-w-6xl px-8 py-8">
      <div className="mb-6 text-xs text-ink/60">Home / Shop</div>
      <div className="mb-2 flex items-end justify-between">
        <div>
          <h2 className="font-serif text-3xl">{query ? `Results for "${query}"` : "Shop all"}</h2>
          <p className="text-sm text-ink/60">{filtered.length} pieces</p>
        </div>
      </div>
      <FilterBar filters={filters} onChange={setFilters} sort={sort} onSortChange={setSort} />
      {filtered.length === 0 ? (
        <p className="py-8 text-sm text-ink/60">
          {query
            ? `No pieces match "${query}" — try a different word, or browse by category below.`
            : "No pieces match those filters yet — try widening your budget or clearing a filter."}
        </p>
      ) : (
        <ProductGrid products={filtered} />
      )}
    </main>
  );
}
