import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { useProducts } from "@/hooks/useProducts";
import { useAuth } from "@/hooks/useAuth";
import { searchProducts } from "@/lib/search";
import { priceLabel } from "@/lib/mockData";
import { ProductThumb } from "@/components/shared/ProductThumb";
import logo from "@/assets/logo.png";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/shop", label: "Shop", end: false },
  { to: "/about", label: "About", end: false },
];

function SearchBox({ onNavigate }: { onNavigate: () => void }) {
  const products = useProducts((s) => s.products);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const results = searchProducts(products, query).slice(0, 5);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  function goToFullResults() {
    if (!query.trim()) return;
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
    onNavigate();
  }

  return (
    <div ref={boxRef} className="relative w-full max-w-xs">
      <input
        type="search"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === "Enter") goToFullResults(); }}
        placeholder="Search dresses, tops, jewelry…"
        aria-label="Search products"
        className="w-full rounded-full border border-blush-soft bg-white/80 px-4 py-2 text-xs placeholder:text-ink/40"
      />
      {open && query.trim() && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-30 w-full min-w-[260px] rounded border border-blush-soft bg-white p-2 shadow-lg">
          {results.length === 0 ? (
            <p className="p-3 text-xs text-ink/60">No pieces match "{query}" — try a different name or category.</p>
          ) : (
            <>
              {results.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.slug}`}
                  onClick={() => { setOpen(false); setQuery(""); onNavigate(); }}
                  className="flex items-center gap-3 rounded p-2 text-xs hover:bg-blush-soft/40"
                >
                  <ProductThumb product={p} className="h-10 w-8 flex-shrink-0 rounded" />
                  <span className="flex-1">
                    <span className="block font-semibold">{p.name}</span>
                    <span className="block text-ink/60">{p.category} · {priceLabel(p.priceKes)}</span>
                  </span>
                </Link>
              ))}
              <button onClick={goToFullResults} className="mt-1 w-full rounded py-2 text-center text-xs font-semibold text-burgundy hover:bg-blush-soft/40">
                See all results for "{query}"
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Sticky nav, FF wordmark, search/account/wishlist/cart icons — visual reference: Feminine_Flair_UXUI_Mockup.html
export function Header() {
  const cartCount = useCart((s) => s.count());
  const wishCount = useWishlist((s) => s.count());
  const openCart = useCart((s) => () => s.setOpen(true));
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-blush-soft bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-[76px] max-w-6xl items-center justify-between gap-4 px-8">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-8 w-8 flex-col items-center justify-center gap-1 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className={`h-[1.5px] w-5 bg-ink transition ${menuOpen ? "translate-y-[6.5px] rotate-45" : ""}`} />
          <span className={`h-[1.5px] w-5 bg-ink transition ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`h-[1.5px] w-5 bg-ink transition ${menuOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`} />
        </button>

        <Link to="/" className="flex items-center gap-2.5">
          <img src={logo} alt="" className="h-11 w-auto object-contain mix-blend-multiply" />
          <span className="font-serif text-xl font-semibold tracking-tight text-burgundy">FEMININE FLAIR</span>
        </Link>

        <nav className="hidden gap-8 text-sm md:flex">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => (isActive ? "text-burgundy" : "")}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden flex-1 justify-center md:flex">
          <SearchBox onNavigate={() => setMenuOpen(false)} />
        </div>

        <div className="flex items-center gap-5">
          <Link to={user ? "/account/orders" : "/account/login"} aria-label="Account">
            Account
          </Link>
          <Link to="/account/wishlist" className="relative" aria-label="Wishlist">
            ♡
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-burgundy text-[10px] text-white">
              {wishCount}
            </span>
          </Link>
          <button onClick={openCart} className="relative" aria-label="Cart">
            Bag
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-burgundy text-[10px] text-white">
              {cartCount}
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-blush-soft px-8 py-4 md:hidden">
          <div className="mb-4">
            <SearchBox onNavigate={() => setMenuOpen(false)} />
          </div>
          <nav className="flex flex-col gap-3 text-sm">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => (isActive ? "text-burgundy" : "")}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
