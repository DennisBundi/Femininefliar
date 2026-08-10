import { Link } from "react-router-dom";

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/feminine_flair_ke" },
  { label: "TikTok", href: "https://www.tiktok.com/@feminine_flair_ke0" },
  { label: "Facebook", href: "https://www.facebook.com/share/1BTd8BnB2q/" },
];

export function Footer() {
  return (
    <footer className="bg-ink px-8 py-14 text-sm text-white/80">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-9 md:grid-cols-4">
        <div>
          <p className="mb-2 font-serif text-xl text-white">FF Feminine Flair</p>
          <p>Women's clothing and accessories, curated in Nairobi and shipped across Kenya.</p>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-wide text-blush">Shop</p>
          <ul className="space-y-2">
            <li><Link to="/shop">All products</Link></li>
            <li><Link to="/about">Our story</Link></li>
            <li><Link to="/returns">Returns &amp; exchanges</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-wide text-blush">Follow</p>
          <ul className="space-y-2">
            {SOCIALS.map((s) => (
              <li key={s.label}><a href={s.href} target="_blank" rel="noreferrer">{s.label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-wide text-blush">Visit the shop</p>
          <p>Simara Mall, 4th Floor, F-23, Nairobi, Kenya</p>
          <p className="mt-2">+254 796 489 610</p>
          <span className="mt-3 inline-block rounded bg-white/10 px-2 py-1 text-xs">Secured checkout · Paystack</span>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl justify-between border-t border-white/10 pt-5 text-xs text-white/50">
        <span>© 2026 Feminine Flair. All rights reserved.</span>
        <span>
          Nairobi, Kenya · <Link to="/admin" className="underline">Admin</Link>
        </span>
      </div>
    </footer>
  );
}
