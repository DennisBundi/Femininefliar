import { Link } from "react-router-dom";

export function AboutPage() {
  return (
    <main>
      <section
        className="flex h-[280px] items-end bg-gradient-to-br from-blush to-burgundy px-8 py-10 text-white"
        aria-hidden="true"
      >
        <h1 className="font-serif text-4xl">Our story</h1>
      </section>

      <div className="mx-auto max-w-2xl px-8 py-12">
        <div className="mb-4 text-xs text-ink/60"><Link to="/">Home</Link> / About</div>

        <div className="space-y-6 text-sm leading-relaxed text-ink/80">
          <p>
            Feminine Flair started as a single rail of dresses at Simara Mall — founder Faith Minga
            sourcing pieces she couldn't find anywhere else in Nairobi and styling friends who stopped
            by the shop. Today it's grown into a full wardrobe: dresses, tops, outerwear, shoes, bags,
            and jewelry, still curated the same way — one piece at a time, chosen because it deserves
            to be worn, not just stocked.
          </p>
          <p>
            Every collection is put together with the Kenyan woman in mind: fabrics that hold up to
            Nairobi's weather, silhouettes that move from the office to a wedding to a Sunday brunch,
            and prices that respect what you're actually willing to spend on a piece you'll wear for years.
          </p>
          <p>
            We're a small team, which means the person who helps you at the shop counter is often the
            same person packing your online order. If a size runs differently than expected, or a color
            looks different in person, message us — we'd rather sort it out over WhatsApp than have you
            stuck with something that doesn't feel like you.
          </p>

          <div className="rounded bg-blush-soft p-5">
            <h2 className="mb-2 font-serif text-lg text-ink">Visit us</h2>
            <p>Simara Mall, 4th Floor, F-23, Nairobi, Kenya</p>
            <p className="mt-1">
              WhatsApp: <a className="text-burgundy underline" href="https://wa.me/254796489610">+254 796 489 610</a>
            </p>
          </div>

          <p>
            <Link to="/shop" className="font-semibold text-burgundy hover:underline">Shop the full collection →</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
