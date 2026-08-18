import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useToast } from "@/hooks/useToast";
import { priceLabel, ratingSummary } from "@/lib/mockData";
import { StarRating } from "@/components/shared/StarRating";
import { ProductGallery } from "./ProductGallery";
import { VariantPicker } from "./VariantPicker";
import { RelatedProducts } from "./RelatedProducts";
import { ReviewList } from "./ReviewList";
import { RecentlyViewed } from "./RecentlyViewed";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

export function ProductDetailPage() {
  const { slug } = useParams();
  const product = useProducts((s) => s.products.find((p) => p.slug === slug));
  const isLoading = useProducts((s) => s.isLoading);
  const addItem = useCart((s) => s.addItem);
  const wished = useWishlist((s) => (product ? s.has(product.id) : false));
  const toggleWish = useWishlist((s) => s.toggle);
  const showToast = useToast((s) => s.show);
  const recordView = useRecentlyViewed((s) => s.record);
  const [qty, setQty] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<"details" | "delivery">("details");

  useEffect(() => {
    if (product) recordView(product.id);
  }, [product, recordView]);

  if (isLoading) return <main className="px-8 py-16 text-center text-ink/60">Loading…</main>;
  if (!product) return <main className="px-8 py-16 text-center text-ink/60">Product not found.</main>;

  const { avg, count } = ratingSummary(product.id);

  return (
    <main className="mx-auto max-w-6xl px-8 py-6">
      <div className="mb-4 text-xs text-ink/60">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / {product.category} / {product.name}
      </div>
      <div className="grid grid-cols-1 gap-[52px] md:grid-cols-2">
        <ProductGallery product={product} />
        <div>
          <p className="mb-1.5 text-xs uppercase tracking-wide text-ink/60">{product.category}</p>
          <h1 className="mb-2.5 font-serif text-3xl">{product.name}</h1>
          {count > 0 ? (
            <a href="#reviews" className="mb-2 inline-block hover:underline">
              <StarRating avg={avg} count={count} />
            </a>
          ) : (
            <p className="mb-2 text-[11px] text-ink/50">No reviews yet</p>
          )}
          <p className="mb-[26px] text-xl font-bold text-burgundy">{priceLabel(product.priceKes)}</p>

          <VariantPicker colors={product.colors} sizes={product.sizes} />

          <div className="my-[22px]">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide">Quantity</h4>
            <div className="inline-flex items-center rounded border border-blush-soft">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-7 w-7">−</button>
              <span className="w-7 text-center text-xs">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="h-7 w-7">+</button>
            </div>
          </div>

          <div className="mb-3.5 flex gap-3">
            <button
              onClick={() => { addItem(product, qty); showToast("Added to bag"); }}
              className="flex-1 rounded bg-burgundy py-3.5 text-sm font-semibold text-white hover:bg-burgundy-dark"
            >
              Add to bag
            </button>
            <button
              onClick={() => toggleWish(product.id)}
              className={`h-[52px] w-[52px] rounded border border-blush-soft ${wished ? "text-burgundy" : "text-ink/50"}`}
              aria-label="Toggle wishlist"
            >
              ♡
            </button>
          </div>
          <p className="mb-7 text-xs text-ink/60">
            Free delivery within Nairobi on orders over KES 5,000 · Pickup available at Simara Mall, 4th Floor
          </p>

          <div className="border-t border-blush-soft">
            <button
              onClick={() => setOpenAccordion(openAccordion === "details" ? ("" as any) : "details")}
              className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold"
            >
              Details & care <span>{openAccordion === "details" ? "−" : "+"}</span>
            </button>
            {openAccordion === "details" && (
              <p className="pb-[18px] text-sm leading-relaxed text-ink/60">
                Woven in a soft, breathable blend. Wrap silhouette with adjustable tie waist. Hand wash cold, hang to dry.
              </p>
            )}
          </div>
          <div className="border-t border-blush-soft">
            <button
              onClick={() => setOpenAccordion(openAccordion === "delivery" ? ("" as any) : "delivery")}
              className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold"
            >
              Delivery & returns <span>{openAccordion === "delivery" ? "−" : "+"}</span>
            </button>
            {openAccordion === "delivery" && (
              <p className="pb-[18px] text-sm leading-relaxed text-ink/60">
                Nairobi delivery in 1–2 days, countrywide in 2–4 days. Exchanges accepted within 7 days of
                delivery, unworn and tagged. <Link to="/returns" className="text-burgundy underline">Full returns policy →</Link>
              </p>
            )}
          </div>
        </div>
      </div>

      <ReviewList productId={product.id} />
      <RelatedProducts currentProductId={product.id} category={product.category} />
      <RecentlyViewed excludeProductId={product.id} />
    </main>
  );
}
