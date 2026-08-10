import { reviewsFor, ratingSummary } from "@/lib/mockData";
import { StarRating } from "@/components/shared/StarRating";

export function ReviewList({ productId }: { productId: string }) {
  const reviews = reviewsFor(productId);
  const { avg, count } = ratingSummary(productId);

  return (
    <section id="reviews" className="mt-16 max-w-2xl scroll-mt-24">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-serif text-2xl">Reviews</h2>
        <StarRating avg={avg} count={count} size="md" />
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-ink/60">This piece doesn't have any reviews yet — be the first to share how it fit.</p>
      ) : (
        <ul className="space-y-5">
          {reviews.map((r) => (
            <li key={r.id} className="border-b border-blush-soft pb-5">
              <div className="mb-1 flex items-center gap-2 text-xs">
                <span className="text-burgundy" aria-hidden="true">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                <span className="font-semibold">{r.customerName}</span>
                {r.verifiedPurchase && (
                  <span className="rounded-full bg-[#dcf0dc] px-2 py-0.5 text-[10px] font-semibold text-[#256c25]">
                    Verified purchase
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed text-ink/80">{r.comment}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
