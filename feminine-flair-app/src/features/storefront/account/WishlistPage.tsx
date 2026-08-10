import { useWishlist } from "@/hooks/useWishlist";
import { useProducts } from "@/hooks/useProducts";
import { ProductGrid } from "../catalog/ProductGrid";

// Not part of the confirmed mockup yet (only the header counter + toast were designed) — this is a
// straightforward first pass so the /account/wishlist route isn't empty; revisit once a full
// wishlist-page design is confirmed.
export function WishlistPage() {
  const productIds = useWishlist((s) => s.productIds);
  const products = useProducts((s) => s.products).filter((p) => productIds.has(p.id));

  return (
    <main className="mx-auto max-w-6xl px-8 py-12">
      <h2 className="mb-6 font-serif text-3xl">Your wishlist</h2>
      {products.length === 0 ? (
        <p className="text-sm text-ink/60">Nothing saved yet — tap the heart on any product to add it here.</p>
      ) : (
        <ProductGrid products={products} />
      )}
    </main>
  );
}
