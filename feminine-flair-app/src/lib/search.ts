import type { Product } from "@/types/product";

// Cheap Levenshtein distance — good enough for single-character typos on short words
// ("dres" -> "dress"), not meant to be a full fuzzy-search engine.
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// True if `needle` appears in `haystack`, or is within edit-distance 1 of some word in it —
// covers substring search plus basic single-typo tolerance ("dres" / "amera").
function fuzzyIncludes(haystack: string, needle: string): boolean {
  const hay = haystack.toLowerCase();
  const query = needle.toLowerCase().trim();
  if (!query) return false;
  if (hay.includes(query)) return true;
  return hay.split(/\s+/).some((word) => query.length >= 3 && levenshtein(word, query) <= 1);
}

export function searchProducts(products: Product[], query: string): Product[] {
  const q = query.trim();
  if (!q) return [];
  return products.filter((p) => fuzzyIncludes(p.name, q) || fuzzyIncludes(p.category, q));
}
