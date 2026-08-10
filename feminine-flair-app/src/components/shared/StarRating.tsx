// Renders a 5-star row for a given average rating (supports halves, e.g. 4.3 -> 4 full + 1 partial).
export function StarRating({ avg, count, size = "sm" }: { avg: number; count: number; size?: "sm" | "md" }) {
  if (!count) {
    return <p className="text-[11px] text-ink/50">No reviews yet</p>;
  }
  const textSize = size === "md" ? "text-sm" : "text-xs";
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = avg - i >= 0.75;
    const half = !filled && avg - i >= 0.25;
    return filled ? "★" : half ? "⯨" : "☆";
  }).join("");

  return (
    <p className={`${textSize} text-ink/70`} aria-label={`Rated ${avg} out of 5 from ${count} review${count === 1 ? "" : "s"}`}>
      <span className="text-burgundy" aria-hidden="true">{stars}</span> {avg} · {count} review{count === 1 ? "" : "s"}
    </p>
  );
}
