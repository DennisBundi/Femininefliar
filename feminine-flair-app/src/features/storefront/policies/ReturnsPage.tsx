export function ReturnsPage() {
  return (
    <main className="mx-auto max-w-2xl px-8 py-12">
      <div className="mb-4 text-xs text-ink/60">Home / Returns &amp; exchanges</div>
      <h1 className="mb-6 font-serif text-3xl">Returns &amp; exchanges</h1>

      <div className="space-y-6 text-sm leading-relaxed text-ink/80">
        <p>
          We want every Feminine Flair piece to fit right. If something isn't quite it, we accept
          exchanges within <strong>7 days of delivery</strong>, as long as the item is unworn, unwashed,
          and still has its tags attached.
        </p>

        <div>
          <h2 className="mb-2 font-serif text-lg text-ink">How to request an exchange</h2>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Message us on WhatsApp at <a className="text-burgundy underline" href="https://wa.me/254796489610">+254 796 489 610</a> with your order number.</li>
            <li>Bring the item to Simara Mall, 4th Floor, F-23, Nairobi, or arrange a courier pickup.</li>
            <li>We'll confirm the replacement size/item and process it within 1–2 business days.</li>
          </ol>
        </div>

        <div>
          <h2 className="mb-2 font-serif text-lg text-ink">Delivery timelines</h2>
          <p>Nairobi delivery in 1–2 days, countrywide in 2–4 days. Pickup at Simara Mall is ready within 1 business day.</p>
        </div>

        <div>
          <h2 className="mb-2 font-serif text-lg text-ink">What isn't eligible</h2>
          <p>
            Earrings and other pierced jewelry, and any item without its original tags, can't be exchanged
            for hygiene and quality reasons. Sale items are exchange-only, not refundable.
          </p>
        </div>

        <p className="text-ink/60">
          Questions about a specific order? Reach us on WhatsApp and we'll sort it out — no forms, no hold music.
        </p>
      </div>
    </main>
  );
}
