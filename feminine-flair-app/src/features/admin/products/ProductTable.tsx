import { useProducts } from "@/hooks/useProducts";
import { useToast } from "@/hooks/useToast";
import { priceLabel } from "@/lib/mockData";
import { LOW_STOCK_THRESHOLD } from "@/lib/mockData";
import { ProductThumb } from "@/components/shared/ProductThumb";

export function ProductTable() {
  const products = useProducts((s) => s.products);
  const setStock = useProducts((s) => s.setStock);
  const showToast = useToast((s) => s.show);

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div><h2 className="text-2xl">Products</h2><p className="text-sm text-ink/60">Manage listings and stock levels</p></div>
        <button
          onClick={() => showToast("Product form coming next — see the architecture doc for the planned fields")}
          className="rounded bg-burgundy px-[18px] py-2.5 text-xs font-semibold text-white"
        >
          + Add product
        </button>
      </div>
      <div className="rounded bg-white p-5 shadow-sm">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-blush-soft text-[11px] uppercase text-ink/60">
              <th className="py-2"></th><th className="text-left">Product</th><th className="text-left">Category</th><th className="text-left">Price</th><th className="text-left">Stock</th><th className="text-left">Status</th>
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
                  <td>{p.name}</td>
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
