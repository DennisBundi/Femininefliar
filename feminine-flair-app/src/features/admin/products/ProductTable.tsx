import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useToast } from "@/hooks/useToast";
import { priceLabel } from "@/lib/mockData";
import { LOW_STOCK_THRESHOLD } from "@/lib/mockData";
import { ProductThumb } from "@/components/shared/ProductThumb";
import { ProductForm } from "./ProductForm";
import type { Product } from "@/types/product";

export function ProductTable() {
  const products = useProducts((s) => s.products);
  const isLoading = useProducts((s) => s.isLoading);
  const error = useProducts((s) => s.error);
  const setStock = useProducts((s) => s.setStock);
  const removeProduct = useProducts((s) => s.removeProduct);
  const showToast = useToast((s) => s.show);
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(p: Product) {
    if (!window.confirm(`Delete "${p.name}"? This can't be undone.`)) return;
    setDeletingId(p.id);
    try {
      await removeProduct(p.id);
      showToast("Product deleted");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div><h2 className="text-2xl">Products</h2><p className="text-sm text-ink/60">Manage listings and stock levels</p></div>
        <button
          onClick={() => setEditing("new")}
          className="rounded bg-burgundy px-[18px] py-2.5 text-xs font-semibold text-white"
        >
          + Add product
        </button>
      </div>
      <div className="rounded bg-white p-5 shadow-sm">
        {isLoading ? (
          <p className="py-6 text-center text-xs text-ink/60">Loading products…</p>
        ) : error ? (
          <p className="py-6 text-center text-xs text-red-500">{error}</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-blush-soft text-[11px] uppercase text-ink/60">
                <th className="py-2"></th><th className="text-left">Product</th><th className="text-left">Category</th><th className="text-left">Price</th><th className="text-left">Stock</th><th className="text-left">Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const status = p.stock === 0 ? { label: "Out of stock", cls: "bg-[#fbe4d8] text-[#a3401d]" }
                  : p.stock <= LOW_STOCK_THRESHOLD ? { label: "Low stock", cls: "bg-[#fbe4d8] text-[#a3401d]" }
                  : { label: "In stock", cls: "bg-[#dcf0dc] text-[#256c25]" };
                return (
                  <tr key={p.id} className="border-b border-blush-soft">
                    <td className="py-2.5"><ProductThumb product={p} className="h-[42px] w-[34px] rounded" /></td>
                    <td>
                      <button onClick={() => setEditing(p)} className="text-left font-semibold hover:underline">
                        {p.name}
                      </button>
                    </td>
                    <td>{p.category}</td>
                    <td>{priceLabel(p.priceKes)}</td>
                    <td>
                      <div className="inline-flex items-center gap-1.5">
                        <button onClick={() => setStock(p.id, p.stock - 1)} className="h-[22px] w-[22px] rounded border border-blush-soft text-xs">−</button>
                        <span>{p.stock}</span>
                        <button onClick={() => setStock(p.id, p.stock + 1)} className="h-[22px] w-[22px] rounded border border-blush-soft text-xs">+</button>
                      </div>
                    </td>
                    <td><span className={`rounded-full px-2 py-0.5 text-[10.5px] ${status.cls}`}>{status.label}</span></td>
                    <td>
                      <button
                        onClick={() => handleDelete(p)}
                        disabled={deletingId === p.id}
                        className="text-[11px] text-red-500 hover:underline disabled:opacity-50"
                      >
                        {deletingId === p.id ? "Deleting…" : "Delete"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <ProductForm
          product={editing === "new" ? undefined : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
