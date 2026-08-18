import { useState, type FormEvent } from "react";
import type { Product } from "@/types/product";
import type { ProductInput } from "@/lib/queries/products";
import { useProducts } from "@/hooks/useProducts";
import { useToast } from "@/hooks/useToast";
import { CATEGORIES } from "@/lib/mockData";

function slugify(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseList(value: string) {
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export function ProductForm({ product, onClose }: { product?: Product; onClose: () => void }) {
  const addProduct = useProducts((s) => s.addProduct);
  const editProduct = useProducts((s) => s.editProduct);
  const showToast = useToast((s) => s.show);

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [category, setCategory] = useState(product?.category ?? CATEGORIES[0]);
  const [priceKes, setPriceKes] = useState(String(product?.priceKes ?? ""));
  const [stock, setStock] = useState(String(product?.stock ?? "0"));
  const [description, setDescription] = useState(product?.description ?? "");
  const [imageUrl, setImageUrl] = useState(product?.images[0] ?? "");
  const [colors, setColors] = useState(product?.colors.join(", ") ?? "");
  const [sizes, setSizes] = useState(product?.sizes.join(", ") ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const input: ProductInput = {
      name: name.trim(),
      slug: slug.trim(),
      category,
      priceKes: Number(priceKes),
      description: description.trim() || undefined,
      images: imageUrl.trim() ? [imageUrl.trim()] : [],
      colors: parseList(colors),
      sizes: parseList(sizes),
      stock: Math.max(0, Number(stock)),
    };

    if (!input.name || !input.slug || !Number.isFinite(input.priceKes) || input.priceKes < 0) {
      setError("Name, URL slug, and a valid price are required.");
      return;
    }

    setSubmitting(true);
    try {
      if (product) {
        await editProduct(product.id, input);
        showToast("Product updated");
      } else {
        await addProduct(input);
        showToast("Product added");
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save product — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <form onSubmit={handleSubmit} className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded bg-white p-7 shadow-lg">
        <h3 className="mb-5 text-xl">{product ? "Edit product" : "Add product"}</h3>

        <label className="mb-3.5 block">
          <span className="mb-1.5 block text-xs text-ink/60">Name</span>
          <input
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full rounded border border-blush-soft px-3 py-2.5 text-sm"
          />
        </label>

        <label className="mb-3.5 block">
          <span className="mb-1.5 block text-xs text-ink/60">URL slug</span>
          <input
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
            className="w-full rounded border border-blush-soft px-3 py-2.5 text-sm"
          />
        </label>

        <div className="mb-3.5 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-xs text-ink/60">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded border border-blush-soft px-3 py-2.5 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs text-ink/60">Price (KES)</span>
            <input
              required
              type="number"
              min={0}
              value={priceKes}
              onChange={(e) => setPriceKes(e.target.value)}
              className="w-full rounded border border-blush-soft px-3 py-2.5 text-sm"
            />
          </label>
        </div>

        <label className="mb-3.5 block">
          <span className="mb-1.5 block text-xs text-ink/60">Stock</span>
          <input
            required
            type="number"
            min={0}
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full rounded border border-blush-soft px-3 py-2.5 text-sm"
          />
        </label>

        <label className="mb-3.5 block">
          <span className="mb-1.5 block text-xs text-ink/60">Photo URL</span>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://…"
            className="w-full rounded border border-blush-soft px-3 py-2.5 text-sm"
          />
        </label>

        <div className="mb-3.5 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1.5 block text-xs text-ink/60">Colors (hex, comma-separated)</span>
            <input
              value={colors}
              onChange={(e) => setColors(e.target.value)}
              placeholder="#630625, #F5B7BD"
              className="w-full rounded border border-blush-soft px-3 py-2.5 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs text-ink/60">Sizes (comma-separated)</span>
            <input
              value={sizes}
              onChange={(e) => setSizes(e.target.value)}
              placeholder="S, M, L"
              className="w-full rounded border border-blush-soft px-3 py-2.5 text-sm"
            />
          </label>
        </div>

        <label className="mb-4 block">
          <span className="mb-1.5 block text-xs text-ink/60">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded border border-blush-soft px-3 py-2.5 text-sm"
          />
        </label>

        {error && <p className="mb-4 text-xs text-red-500">{error}</p>}

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded border border-blush-soft py-2.5 text-sm font-semibold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 rounded bg-burgundy py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Saving…" : product ? "Save changes" : "Add product"}
          </button>
        </div>
      </form>
    </div>
  );
}
