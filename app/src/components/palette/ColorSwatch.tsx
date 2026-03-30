import { getContrastColor } from "../../lib/colors";
import { CopyFeedback } from "./CopyFeedback";
import type { ColorEntry } from "../../types/palette";

interface ColorSwatchProps {
  entry: ColorEntry;
  isCopied: boolean;
  onCopy: (text: string, label: string) => void;
  showLabels?: boolean;
  tall?: boolean;
}

export function ColorSwatch({ entry, isCopied, onCopy, showLabels = true, tall = false }: ColorSwatchProps) {
  const textColor = getContrastColor(entry.hex);

  return (
    <button
      type="button"
      className={`relative flex flex-col justify-start gap-0.5 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-base group px-2 py-1.5 ${tall ? "min-h-[240px]" : "min-h-[120px]"}`}
      style={{ backgroundColor: entry.hex, color: textColor }}
      onClick={() => onCopy(`hsl(${entry.hslString})`, entry.label)}
      title={`${entry.label} — hsl(${entry.hslString})`}
    >
      {showLabels && (
        <>
          <span className="text-xs font-semibold transition-transform group-hover:scale-105 origin-left">{entry.label}</span>
          <span className="text-2xs font-mono opacity-75 transition-transform group-hover:scale-105 origin-left">
            hsl({entry.hslString})
          </span>
        </>
      )}
      <CopyFeedback visible={isCopied} />
    </button>
  );
}
