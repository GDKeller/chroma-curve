import { useMemo, useState } from "react";
import { ColorSwatch } from "./ColorSwatch";
import { ToggleSwitch } from "../controls/ToggleSwitch";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import type { ColorEntry } from "../../types/palette";

interface PaletteGridProps {
  entries: ColorEntry[];
}

const STEP_OPTIONS = [8, 9, 10, 12, 16, 20, 24, 48];

type Layout = "row" | "column" | "vertical" | "horizontal";

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
  const [showBorders, setShowBorders] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [reversed, setReversed] = useState(false);
  const [swatchCount, setSwatchCount] = useState<number>(STEP_OPTIONS[0]);
  const [layout, setLayout] = useState<Layout>("row");

  const { displayEntries, cols } = useMemo(() => {
    const sampled = sampleEntries(entries, swatchCount);

    // Default order for all layouts is dark→light (reverse the light→dark entries)
    const ordered = reversed ? sampled : sampled.slice().reverse();

    if (layout === "row") {
      return { displayEntries: ordered, cols: ordered.length };
    }

    if (layout === "column") {
      return { displayEntries: ordered, cols: 1 };
    }

    const cols = bestCols(ordered.length);

    if (layout === "vertical") {
      return { displayEntries: ordered, cols };
    }
    // horizontal: lightness flows left→right via column-major reorder
    return { displayEntries: toColumnMajor(ordered, cols), cols };
  }, [entries, swatchCount, layout, reversed]);

  return (
    <div>
      <div className="flex justify-end items-center gap-4 px-4 lg:pr-0 mb-3">
        <label className="flex items-center gap-1 cursor-pointer">
          <span className="text-[11px] font-mono text-white/55">swatches</span>
          <select
            value={swatchCount}
            onChange={(e) => setSwatchCount(Number(e.target.value))}
            className="text-[11px] font-mono text-white/40 bg-transparent border-none outline-none cursor-pointer"
          >
            {STEP_OPTIONS.map((n) => (
              <option key={n} value={n} className="bg-[hsl(0_0%_10%)]">
                {n}
              </option>
            ))}
            <option value={entries.length} className="bg-[hsl(0_0%_10%)]">
              all ({entries.length})
            </option>
          </select>
        </label>
        <label className="flex items-center gap-1 cursor-pointer">
          <span className="text-[11px] font-mono text-white/55">layout</span>
          <select
            value={layout}
            onChange={(e) => setLayout(e.target.value as Layout)}
            className="text-[11px] font-mono text-white/40 bg-transparent border-none outline-none cursor-pointer"
          >
            <option value="row" className="bg-[hsl(0_0%_10%)]">row</option>
            <option value="column" className="bg-[hsl(0_0%_10%)]">column</option>
            <option value="vertical" className="bg-[hsl(0_0%_10%)]">vertical</option>
            <option value="horizontal" className="bg-[hsl(0_0%_10%)]">horizontal</option>
          </select>
        </label>
        <ToggleSwitch label="reverse" checked={reversed} onChange={setReversed} />
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
            tall={layout === "row"}
          />
        ))}
      </div>
    </div>
  );
}
