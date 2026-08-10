import { useMemo, useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { priceLabel } from "@/lib/mockData";
import { placeholderGradient } from "@/lib/placeholder";
import { Link } from "react-router-dom";

// Newest 6 products by createdAt, 3 visible at a time. Arrow/dot navigation only — no autoplay
// (confirmed with the client: it shouldn't distract someone mid-read).
export function HeroProductCarousel() {
  const products = useProducts((s) => s.products);
  const [page, setPage] = useState(0);

  const newest6 = useMemo(
    () => [...products].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 6),
    [products]
  );

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-bold tracking-wide text-burgundy/70">NEWEST ARRIVALS</span>
        <div className="flex items-center gap-2.5">
          <button
            aria-label="Previous products"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-burgundy shadow-sm"
          >
            ‹
          </button>
          <div className="flex gap-1.5">
            {[0, 1].map((i) => (
              <button
                key={i}
                aria-label={`Show products ${i === 0 ? "1 to 3" : "4 to 6"}`}
                onClick={() => setPage(i)}
                className={`h-1.5 w-1.5 rounded-full ${page === i ? "bg-burgundy" : "bg-blush"}`}
              />
            ))}
          </div>
          <button
            aria-label="Next products"
            onClick={() => setPage((p) => Math.min(1, p + 1))}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-burgundy shadow-sm"
          >
            ›
          </button>
        </div>
      </div>
      <div className="overflow-hidden rounded">
        <div
          className="flex transition-transform duration-300"
          style={{ width: "200%", transform: `translateX(-${page * 50}%)` }}
        >
          {newest6.map((p) => (
            <Link key={p.id} to={`/product/${p.slug}`} className="box-border w-[16.6667%] px-1.5">
              <div className="mb-2 aspect-[3/4] rounded" style={{ background: placeholderGradient(p.id) }} />
              <p className="text-xs font-semibold">{p.name}</p>
              <p className="text-xs font-bold text-burgundy">{priceLabel(p.priceKes)}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
