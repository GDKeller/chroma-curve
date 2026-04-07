import { getContrastColor, toOklchString } from "../../lib/colors";
import { CopyFeedback } from "./CopyFeedback";
import type { ColorEntry, CopyFormat } from "../../types/palette";

interface ColorSwatchProps {
  entry: ColorEntry;
  copyFormat: CopyFormat;
  isCopied: boolean;
  onCopy: (text: string, label: string) => void;
  showLabels?: boolean;
  tall?: boolean;
}

function getCopyValue(entry: ColorEntry, format: CopyFormat): string {
  switch (format) {
    case "hex":
      return entry.hex;
    case "hsl":
      return `hsl(${entry.hslString})`;
    case "oklch":
      return toOklchString(entry.hex);
  }
}

export function ColorSwatch({ entry, copyFormat, isCopied, onCopy, showLabels = true, tall = false }: ColorSwatchProps) {
  const textColor = getContrastColor(entry.hex);
  const oklch = toOklchString(entry.hex);

  return (
    <button
      type="button"
      className={`relative flex flex-col justify-start gap-1 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-base group px-2 py-1.5 ${tall ? "min-h-[240px]" : "min-h-[120px]"}`}
      style={{ backgroundColor: entry.hex, color: textColor }}
      onClick={() => onCopy(getCopyValue(entry, copyFormat), entry.label)}
      title={`${entry.label} - click to copy ${copyFormat.toUpperCase()}`}
    >
      {showLabels && (
        <>
          <span className="text-sm font-semibold mb-4 transition-transform group-hover:scale-105 origin-left">{entry.label}</span>
          <span className="text-sm">{entry.hex}</span>
          <span className="text-2xs">hsl({entry.hslString})</span>
          <span className="text-2xs">{oklch}</span>
        </>
      )}
      <CopyFeedback visible={isCopied} />
    </button>
  );
}
