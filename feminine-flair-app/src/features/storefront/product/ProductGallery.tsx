export function ProductGallery({ gradient }: { gradient: string }) {
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
