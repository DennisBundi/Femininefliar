import { useState } from "react";

export function VariantPicker({ colors, sizes }: { colors: string[]; sizes: string[] }) {
  const [color, setColor] = useState(colors[0]);
  const [size, setSize] = useState(sizes[0]);

  return (
    <div className="space-y-5">
      {colors.length > 0 && (
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide">Colour</h4>
          <div className="flex gap-2">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                aria-label={`Select colour ${c}`}
                aria-pressed={color === c}
                style={{ background: c, boxShadow: color === c ? "0 0 0 2px #630625" : "0 0 0 1px #f0dde0" }}
                className="h-6 w-6 rounded-full"
              />
            ))}
          </div>
        </div>
      )}
      {sizes.length > 0 && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wide">Size</h4>
            <a href="#" className="text-[11.5px] text-burgundy underline">Size guide</a>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                aria-pressed={s === size}
                className={`rounded border px-3 py-1.5 text-xs ${s === size ? "border-burgundy bg-burgundy text-white" : "border-blush-soft"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
