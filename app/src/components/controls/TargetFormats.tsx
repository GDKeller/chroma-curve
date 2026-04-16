import { usePaletteStore } from "../../store/paletteStore";
import { formatAllFormats } from "../../lib/colors";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";

const LABELS: Array<{ key: keyof ReturnType<typeof formatAllFormats>; label: string }> = [
  { key: "hex", label: "HEX" },
  { key: "rgb", label: "RGB" },
  { key: "hsl", label: "HSL" },
  { key: "oklch", label: "OKLCH" },
];

export function TargetFormats() {
  const hue = usePaletteStore((s) => s.hue);
  const saturation = usePaletteStore((s) => s.saturation);
  const targetInput = usePaletteStore((s) => s.targetInput);
  const targetHue = usePaletteStore((s) => s.targetHue);
  const targetSat = usePaletteStore((s) => s.targetSat);
  const { copiedLabel, copy } = useCopyToClipboard();

  if (targetInput === null) return null;

  const drifted = hue !== targetHue || saturation !== targetSat;
  const formats = formatAllFormats(hue, saturation);

  return (
    <div
      className={`mt-3 pt-3 border-t border-border-default flex flex-wrap items-center gap-x-4 gap-y-1 ${drifted ? "opacity-55" : ""}`}
      aria-label="Target color formats"
    >
      <span className="text-3xs uppercase tracking-wider text-text-faint">
        Target{drifted ? " (drifted)" : ""}
      </span>
      {LABELS.map(({ key, label }) => {
        const value = formats[key];
        const isCopied = copiedLabel === label;
        return (
          <button
            key={key}
            type="button"
            onClick={() => copy(value, label)}
            className="flex items-baseline gap-1.5 text-left px-1.5 py-0.5 hover:bg-surface-hover transition-colors cursor-pointer group/fmt"
            aria-label={`Copy ${label} ${value}`}
          >
            <span className="text-3xs text-text-faint uppercase tracking-wider">
              {label}
            </span>
            <span className="text-xs font-mono text-text-secondary group-hover/fmt:text-text-primary tabular-nums">
              {isCopied ? "Copied" : value}
            </span>
          </button>
        );
      })}
    </div>
  );
}
