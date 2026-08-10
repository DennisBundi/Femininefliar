import { Link } from "react-router-dom";

const CATEGORIES = ["Dresses", "Tops & Blouses", "Bottoms", "Outerwear", "Shoes & Bags", "Jewelry"];

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-6xl px-8 py-12">
      <h2 className="mb-8 font-serif text-3xl">Shop by category</h2>
      <div className="grid grid-cols-3 gap-4 lg:grid-cols-6">
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            to={`/shop?category=${encodeURIComponent(c)}`}
            className="group relative aspect-[3/4] overflow-hidden rounded bg-gradient-to-br from-blush to-burgundy transition-transform hover:-translate-y-1"
          >
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/35 to-transparent p-3 font-serif text-white">
              {c}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
