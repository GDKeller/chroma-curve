import type { ColorEntry } from "../../types/palette";

interface PaletteStripProps {
  entries: ColorEntry[];
}

export function PaletteStrip({ entries }: PaletteStripProps) {
  return (
    <div className="h-14 rounded-xl overflow-hidden grid grid-flow-col auto-cols-fr mx-4">
      {[...entries].reverse().map((entry) => (
        <div
          key={entry.label}
          className="min-w-0"
          style={{ backgroundColor: entry.hex }}
          title={entry.label}
        />
      ))}
    </div>
  );
}
