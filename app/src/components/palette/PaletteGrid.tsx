import { useMemo, useState } from "react";
import { ColorSwatch } from "./ColorSwatch";
import { ToggleSwitch } from "../controls/ToggleSwitch";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import type { ColorEntry } from "../../types/palette";

interface PaletteGridProps {
  entries: ColorEntry[];
}

const STEP_OPTIONS = [8, 10, 12, 16, 20, 24, 48, 98];

type Orientation = "picker" | "rotated";

function sampleEntries(entries: ColorEntry[], count: number): ColorEntry[] {
  if (count >= entries.length) return entries;
  const step = (entries.length - 1) / (count - 1);
  return Array.from({ length: count }, (_, i) =>
    entries[Math.round(i * step)],
  );
}

// Find the column count that produces no orphans and the most square-ish grid
function bestCols(total: number): number {
  const target = Math.round(Math.sqrt(total));
  // Search outward from the square root for a clean divisor
  for (let d = 0; d <= target; d++) {
    if ((target + d) > 0 && total % (target + d) === 0) return target + d;
    if ((target - d) > 0 && total % (target - d) === 0) return target - d;
  }
  return target;
}

// Reorder row-major entries into column-major order for CSS grid rendering
function toColumnMajor(entries: ColorEntry[], cols: number): ColorEntry[] {
  const rows = Math.ceil(entries.length / cols);
  const reordered: ColorEntry[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = c * rows + r;
      if (idx < entries.length) reordered.push(entries[idx]);
    }
  }
  return reordered;
}

export function PaletteGrid({ entries }: PaletteGridProps) {
  const { copiedLabel, copy } = useCopyToClipboard();
  const [showBorders, setShowBorders] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [swatchCount, setSwatchCount] = useState<number>(entries.length);
  const [orientation, setOrientation] = useState<Orientation>("picker");

  const { displayEntries, cols } = useMemo(() => {
    const sampled = sampleEntries(entries, swatchCount);
    const cols = bestCols(sampled.length);

    if (orientation === "picker") {
      // Light at top, dark at bottom — entries are light→dark,
      // row-major: flows left→right across rows, then next row
      return { displayEntries: sampled, cols };
    }
    // Rotated 90°: dark at top-left, light at bottom-right
    // entries reversed to dark→light, then column-major so lightness flows down
    const reversed = sampled.slice().reverse();
    return { displayEntries: toColumnMajor(reversed, cols), cols };
  }, [entries, swatchCount, orientation]);

  return (
    <div>
      <div className="flex justify-end items-center gap-3 px-4 lg:pr-0 mb-1">
        <label className="flex items-center gap-1 cursor-pointer">
          <span className="text-[9px] font-mono text-white/55">swatches</span>
          <select
            value={swatchCount}
            onChange={(e) => setSwatchCount(Number(e.target.value))}
            className="text-[9px] font-mono text-white/40 bg-transparent border-none outline-none cursor-pointer"
          >
            {STEP_OPTIONS.map((n) => (
              <option key={n} value={n} className="bg-[hsl(0_0%_10%)]">
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-1 cursor-pointer">
          <span className="text-[9px] font-mono text-white/55">orientation</span>
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as Orientation)}
            className="text-[9px] font-mono text-white/40 bg-transparent border-none outline-none cursor-pointer"
          >
            <option value="picker" className="bg-[hsl(0_0%_10%)]">picker</option>
            <option value="rotated" className="bg-[hsl(0_0%_10%)]">rotated</option>
          </select>
        </label>
        <ToggleSwitch label="labels" checked={showLabels} onChange={setShowLabels} />
        <ToggleSwitch label="borders" checked={showBorders} onChange={setShowBorders} />
      </div>
      <div
        className={`grid ml-4 mr-4 lg:mr-0 rounded-xl overflow-hidden ${showBorders ? "gap-px bg-white/[0.04]" : "gap-0"}`}
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {displayEntries.map((entry) => (
          <ColorSwatch
            key={entry.label}
            entry={entry}
            isCopied={copiedLabel === entry.label}
            onCopy={copy}
            showLabels={showLabels}
            compact={swatchCount > 24}
          />
        ))}
      </div>
    </div>
  );
}
