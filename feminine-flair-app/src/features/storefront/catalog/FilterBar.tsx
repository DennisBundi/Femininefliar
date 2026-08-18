import { useEffect, useRef, useState } from "react";
import { CATEGORIES } from "@/lib/mockData";

export interface ShopFilters {
  categories: Set<string>;
  sizes: Set<string>;
  colors: Set<string>;
  maxPriceKes: number;
}

const SIZES = ["XS", "S", "M", "L", "XL"];
const COLORS = [
  { hex: "#630625", label: "Burgundy" },
  { hex: "#F5B7BD", label: "Blush pink" },
  { hex: "#241417", label: "Black" },
  { hex: "#ffffff", label: "White" },
];
const MAX_BUDGET = 6000;

// Confirmed direction: filters live in a top bar (not a sidebar) — category pills, then a second
// row for size / colour / budget / sort. All four filter live; nothing selected = no restriction.
export function FilterBar({ filters, onChange, sort, onSortChange }: {
  filters: ShopFilters;
  onChange: (next: ShopFilters) => void;
  sort: "newest" | "price-asc" | "price-desc";
  onSortChange: (sort: "newest" | "price-asc" | "price-desc") => void;
}) {
  const [budgetOpen, setBudgetOpen] = useState(false);
  const budgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!budgetOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (budgetRef.current && !budgetRef.current.contains(e.target as Node)) setBudgetOpen(false);
    }
    function onEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setBudgetOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, [budgetOpen]);

  function toggleSet(key: "categories" | "sizes" | "colors", value: string) {
    const next = new Set(filters[key]);
    next.has(value) ? next.delete(value) : next.add(value);
    onChange({ ...filters, [key]: next });
  }

  const activeChips: { label: string; clear: () => void }[] = [
    ...[...filters.categories].map((c) => ({ label: c, clear: () => toggleSet("categories", c) })),
    ...[...filters.sizes].map((s) => ({ label: `Size ${s}`, clear: () => toggleSet("sizes", s) })),
    ...[...filters.colors].map((c) => ({ label: "Colour", clear: () => toggleSet("colors", c) })),
    ...(filters.maxPriceKes < MAX_BUDGET
      ? [{ label: `Up to KES ${filters.maxPriceKes.toLocaleString()}`, clear: () => onChange({ ...filters, maxPriceKes: MAX_BUDGET }) }]
      : []),
  ];

  return (
    <div className="mb-8 border-y border-blush-soft py-4">
      <div className="mb-3.5 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => toggleSet("categories", c)}
            className={`rounded-full border px-4 py-2 text-xs ${
              filters.categories.has(c) ? "border-burgundy bg-burgundy text-white" : "border-blush-soft"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-ink/60">Size</span>
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggleSet("sizes", s)}
              className={`rounded border px-2.5 py-1.5 text-xs ${
                filters.sizes.has(s) ? "border-burgundy bg-burgundy text-white" : "border-blush-soft"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-ink/60">Colour</span>
          {COLORS.map((c) => (
            <button
              key={c.hex}
              title={c.label}
              aria-label={`Filter by ${c.label}`}
              aria-pressed={filters.colors.has(c.hex)}
              onClick={() => toggleSet("colors", c.hex)}
              style={{ background: c.hex, boxShadow: filters.colors.has(c.hex) ? "0 0 0 2px #630625" : "0 0 0 1px #f0dde0" }}
              className="h-5 w-5 rounded-full"
            />
          ))}
        </div>

        <div ref={budgetRef} className="relative">
          <button
            onClick={() => setBudgetOpen((o) => !o)}
            aria-expanded={budgetOpen}
            className="rounded border border-blush-soft px-3 py-1.5 text-xs"
          >
            Budget: up to KES {filters.maxPriceKes.toLocaleString()} ▾
          </button>
          {budgetOpen && (
            <div className="absolute left-0 top-[calc(100%+8px)] z-20 w-56 rounded border border-blush-soft bg-white p-3.5 shadow-lg">
              <input
                type="range"
                min={500}
                max={MAX_BUDGET}
                step={100}
                value={filters.maxPriceKes}
                onChange={(e) => onChange({ ...filters, maxPriceKes: Number(e.target.value) })}
                className="w-full accent-burgundy"
              />
              <div className="mt-1 flex justify-between text-[11px] text-ink/60">
                <span>500</span>
                <span>6,000</span>
              </div>
            </div>
          )}
        </div>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as any)}
          className="ml-auto rounded border border-blush-soft px-3 py-2 text-xs"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>

      {activeChips.length > 0 && (
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-ink/60">Active filters:</span>
          {activeChips.map((chip, i) => (
            <button key={i} onClick={chip.clear} className="rounded bg-blush-soft px-2.5 py-1 text-xs text-burgundy-dark">
              {chip.label} ×
            </button>
          ))}
          <button
            onClick={() => onChange({ categories: new Set(), sizes: new Set(), colors: new Set(), maxPriceKes: MAX_BUDGET })}
            className="text-xs font-semibold text-burgundy underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
