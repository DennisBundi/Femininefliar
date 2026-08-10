// Flat shape used by the storefront + admin UI. `colors`/`sizes` list every option the product
// comes in; per-combination stock is a v2 concern (see ProductVariant, kept for that later step).
export interface ProductVariant {
  id: string;
  size?: string;
  color?: string;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  priceKes: number;
  description?: string;
  images: string[]; // empty until real product photography is uploaded — components fall back to a brand-gradient placeholder (see lib/placeholder.ts)
  colors: string[]; // hex values, matches the swatches in the filter bar and product page
  sizes: string[]; // empty array = one-size (accessories, footwear)
  stock: number;
  unitsSold: number; // powers the "top products" report; increment on every completed sale
  createdAt: string; // ISO date — Hero/New Arrivals sort newest first by this field
  variants?: ProductVariant[];
}
