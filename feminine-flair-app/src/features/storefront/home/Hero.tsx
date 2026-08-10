import { Link } from "react-router-dom";
import { HeroProductCarousel } from "./HeroProductCarousel";

// Soft-pink mood (confirmed direction) — headline + CTA on top, carousel of the 6 newest products below
export function Hero() {
  return (
    <section className="bg-blush-soft px-8 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-xs tracking-widest text-burgundy/70">NEW SEASON · NAIROBI, KENYA</p>
            <h1 className="font-serif text-4xl text-burgundy">Dress in your own flair.</h1>
          </div>
          <Link to="/shop" className="whitespace-nowrap rounded bg-burgundy px-6 py-3.5 text-sm font-semibold text-blush-soft hover:bg-burgundy-dark">
            Shop the collection
          </Link>
        </div>
        <HeroProductCarousel />
      </div>
    </section>
  );
}
