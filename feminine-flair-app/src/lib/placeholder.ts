// Deterministic brand-gradient placeholder for products without real photography yet.
// Swap any call site for a real <img src={product.images[0]}> once photos are uploaded.
const GRADIENTS = [
  "linear-gradient(150deg,#F5B7BD,#630625)",
  "linear-gradient(150deg,#f0929f,#4a041c)",
  "linear-gradient(150deg,#8a1230,#fce3e6)",
  "linear-gradient(150deg,#F5B7BD,#993a51)",
  "linear-gradient(150deg,#630625,#f0b8c2)",
];

export function placeholderGradient(productId: string) {
  const n = Number(productId) || productId.length;
  return GRADIENTS[n % GRADIENTS.length];
}
