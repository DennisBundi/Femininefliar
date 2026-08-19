import { Link } from "react-router-dom";
import type { Product } from "@/types/product";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";
import { priceLabel, ratingSummary } from "@/lib/mockData";
import { ProductThumb } from "@/components/shared/ProductThumb";
import { StarRating } from "@/components/shared/StarRating";

export function ProductCard({ product }: { product: Product }) {
  const wished = useWishlist((s) => s.has(product.id));
  const toggleWish = useWishlist((s) => s.toggle);
  const addItem = useCart((s) => s.addItem);
  const showToast = useToast((s) => s.show);
  const { avg, count } = ratingSummary(product.id);

  return (
    <Link to={`/product/${product.slug}`} className="group cursor-pointer">
      <div className="relative mb-3.5 aspect-[3/4] overflow-hidden rounded">
        <ProductThumb product={product} className="absolute inset-0 h-full w-full" />
        <button
          onClick={(e) => { e.preventDefault(); toggleWish(product.id); }}
          className={`absolute right-2.5 top-2.5 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-white shadow ${wished ? "text-burgundy" : "text-ink/50"}`}
          aria-label="Toggle wishlist"
        >
          ♡
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            addItem(product, 1);
            showToast("Added to bag");
          }}
          className="absolute inset-x-2.5 bottom-2.5 rounded bg-burgundy py-2.5 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100"
        >
          + Quick add
        </button>
      </div>
      <p className="text-[11.5px] text-ink/60">{product.category}</p>
      <p className="text-sm font-semibold">{product.name}</p>
      {count > 0 && <StarRating avg={avg} count={count} />}
      <p className="text-sm font-bold text-burgundy">{priceLabel(product.priceKes)}</p>
    </Link>
  );
}
