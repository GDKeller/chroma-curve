import { useMemo } from "react";
import type { ColorEntry } from "../../types/palette";

interface PaletteStripProps {
  entries: ColorEntry[];
}

export function PaletteStrip({ entries }: PaletteStripProps) {
  const reversed = useMemo(() => [...entries].reverse(), [entries]);

  return (
    <div className="h-14 rounded-xl overflow-hidden grid grid-flow-col auto-cols-fr mx-4">
      {reversed.map((entry) => (
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
