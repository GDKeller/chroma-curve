import { getContrastColor } from "../../lib/colors";
import { CopyFeedback } from "./CopyFeedback";
import type { ColorEntry } from "../../types/palette";

interface ColorSwatchProps {
  entry: ColorEntry;
  isCopied: boolean;
  onCopy: (text: string, label: string) => void;
  showLabels?: boolean;
  compact?: boolean;
}

export function ColorSwatch({ entry, isCopied, onCopy, showLabels = true, compact = false }: ColorSwatchProps) {
  const textColor = getContrastColor(entry.hex);

  return (
    <button
      type="button"
      className={`relative flex flex-col justify-center gap-0.5 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-1 focus-visible:ring-offset-[hsl(0_0%_6%)] group ${compact ? "px-1.5 py-1 min-h-[40px]" : "px-4 py-3 min-h-[72px]"}`}
      style={{ backgroundColor: entry.hex, color: textColor }}
      onClick={() => onCopy(`hsl(${entry.hslString})`, entry.label)}
      title={`Copy ${entry.label}`}
    >
      {showLabels && (
        <>
          <span className={`font-semibold transition-transform group-hover:scale-105 origin-left ${compact ? "text-[9px]" : "text-[13px]"}`}>{entry.label}</span>
          <span className={`font-mono opacity-75 transition-transform group-hover:scale-105 origin-left ${compact ? "text-[7px]" : "text-[11px]"}`}>
            hsl({entry.hslString})
          </span>
        </>
      )}
      <CopyFeedback visible={isCopied} />
    </button>
  );
}
