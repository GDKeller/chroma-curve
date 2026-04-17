import { useMemo } from "react";
import type { ColorEntry } from "../../types/palette";

interface PaletteStripProps {
  entries: ColorEntry[];
}

export function PaletteStrip({ entries }: PaletteStripProps) {
  const reversed = useMemo(() => [...entries].reverse(), [entries]);

  return (
    <div
      aria-hidden="true"
      className="mx-4 grid h-14 auto-cols-fr grid-flow-col overflow-hidden rounded-none"
    >
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
