import type { Product } from "@/types/product";
import { placeholderGradient } from "@/lib/placeholder";

export function ProductGallery({ product }: { product: Pick<Product, "id" | "name" | "images"> }) {
  const images = product.images ?? [];

  if (images.length === 0) {
    const gradient = placeholderGradient(product.id);
    return (
      <div>
        <div className="mb-3 aspect-[3/4] rounded" style={{ background: gradient }} />
        <div className="flex gap-2">
          {[1, 0.85, 0.7, 0.55].map((opacity, i) => (
            <div key={i} className="h-20 w-16 rounded" style={{ background: gradient, opacity }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <img src={images[0]} alt={product.name} className="mb-3 aspect-[3/4] w-full rounded object-cover" />
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((src, i) => (
            <img key={src} src={src} alt={`${product.name} ${i + 1}`} className="h-20 w-16 rounded object-cover" />
          ))}
        </div>
      )}
    </div>
  );
}
