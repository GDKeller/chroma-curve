import { getContrastColor } from "../../lib/colors";
import { CopyFeedback } from "./CopyFeedback";
import type { ColorEntry } from "../../types/palette";

interface ColorSwatchProps {
  entry: ColorEntry;
  isCopied: boolean;
  onCopy: (text: string, label: string) => void;
}

export function ColorSwatch({ entry, isCopied, onCopy }: ColorSwatchProps) {
  const textColor = getContrastColor(entry.hex);

  return (
    <button
      type="button"
      className="relative flex flex-col justify-center gap-0.5 px-4 py-3 min-h-[72px] text-left transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-1 focus-visible:ring-offset-[hsl(0_0%_6%)]"
      style={{ backgroundColor: entry.hex, color: textColor }}
      onClick={() => onCopy(`hsl(${entry.hslString})`, entry.label)}
      title={`Copy ${entry.label}`}
    >
      <span className="text-[13px] font-semibold">{entry.label}</span>
      <span className="text-[11px] font-mono opacity-75">
        hsl({entry.hslString})
      </span>
      <CopyFeedback visible={isCopied} />
    </button>
  );
}
