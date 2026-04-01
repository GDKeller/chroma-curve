import { useMemo, useState } from "react";
import { ColorSwatch } from "./ColorSwatch";
import { InlineSelect } from "../controls/InlineSelect";
import { ToggleSwitch } from "../controls/ToggleSwitch";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import { usePaletteStore } from "../../store/paletteStore";
import type { ColorEntry, CopyFormat } from "../../types/palette";

interface PaletteGridProps {
  entries: ColorEntry[];
}

const STEP_OPTIONS = [3, 4, 5, 8, 9, 10, 12, 16, 20, 24, 48];

type Layout = "row" | "column" | "vertical" | "horizontal";

const LAYOUT_OPTIONS: { value: Layout; label: string }[] = [
  { value: "row", label: "row" },
  { value: "column", label: "column" },
  { value: "vertical", label: "vertical" },
  { value: "horizontal", label: "horizontal" },
];

const COPY_FORMAT_OPTIONS: { value: CopyFormat; label: string }[] = [
  { value: "hex", label: "hex" },
  { value: "hsl", label: "hsl" },
  { value: "oklch", label: "oklch" },
];

function sampleEntries(entries: ColorEntry[], count: number): ColorEntry[] {
  if (count >= entries.length) return entries;
  const step = (entries.length - 1) / (count - 1);
  return Array.from({ length: count }, (_, i) =>
    entries[Math.round(i * step)],
  );
}

// Find the column count that produces no orphans and the most square-ish grid
function bestCols(total: number): number {
  if (total <= 1) return 1;
  const target = Math.round(Math.sqrt(total));
  // Search outward from the square root for a clean divisor (min 2 cols)
  for (let d = 0; d <= target; d++) {
    if ((target + d) >= 2 && total % (target + d) === 0) return target + d;
    if ((target - d) >= 2 && total % (target - d) === 0) return target - d;
  }
  return total;
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
  const copyFormat = usePaletteStore((s) => s.copyFormat);
  const setCopyFormat = usePaletteStore((s) => s.setCopyFormat);
  const [showBorders, setShowBorders] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [reversed, setReversed] = useState(false);
  const [swatchCount, setSwatchCount] = useState<number>(8);
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
    <section aria-labelledby="palette-heading" className="flex flex-col">
      <h2 id="palette-heading" className="sr-only">Color palette</h2>
      <div role="group" aria-label="Palette display options" className="flex flex-wrap justify-end items-center gap-1 px-4 lg:pr-0 mb-3">
        <InlineSelect
          label="swatches"
          value={String(swatchCount)}
          onChange={(v) => setSwatchCount(Number(v))}
          options={[
            ...STEP_OPTIONS.map((n) => ({ value: String(n), label: String(n) })),
            { value: String(entries.length), label: `all (${entries.length})` },
          ]}
        />
        <InlineSelect label="layout" value={layout} onChange={setLayout} options={LAYOUT_OPTIONS} />
        <InlineSelect label="copy" value={copyFormat} onChange={setCopyFormat} options={COPY_FORMAT_OPTIONS} />
        <ToggleSwitch label="reverse" checked={reversed} onChange={setReversed} variant="pill" />
        <ToggleSwitch label="labels" checked={showLabels} onChange={setShowLabels} variant="pill" />
        <ToggleSwitch label="borders" checked={showBorders} onChange={setShowBorders} variant="pill" />
      </div>
      <div
        className={`grid flex-1 ml-4 mr-4 lg:mr-0 rounded-xl overflow-hidden auto-rows-fr ${showBorders ? "gap-px bg-surface-overlay" : "gap-0"}`}
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {displayEntries.map((entry) => (
          <ColorSwatch
            key={entry.label}
            entry={entry}
            copyFormat={copyFormat}
            isCopied={copiedLabel === entry.label}
            onCopy={copy}
            showLabels={showLabels}
            tall={layout === "row"}
          />
        ))}
      </div>
    </section>
  );
}
