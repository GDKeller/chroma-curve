import { usePaletteStore } from "../../store/paletteStore";
import { formatAllFormats } from "../../lib/colors";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";

const LABELS: Array<{
  key: keyof ReturnType<typeof formatAllFormats>;
  label: string;
}> = [
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
      className={`border-border-default mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-3 ${drifted ? "opacity-55" : ""}`}
      aria-label="Target color formats"
    >
      <span className="text-3xs text-text-faint tracking-wider uppercase">
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
            className="hover:bg-surface-hover group/fmt flex cursor-pointer items-baseline gap-1.5 px-1.5 py-0.5 text-left transition-colors"
            aria-label={`Copy ${label} ${value}`}
          >
            <span className="text-3xs text-text-faint tracking-wider uppercase">
              {label}
            </span>
            <span className="text-text-secondary group-hover/fmt:text-text-primary font-mono text-xs tabular-nums">
              {isCopied ? "Copied" : value}
            </span>
          </button>
        );
      })}
    </div>
  );
}
