import { usePaletteStore } from "../../store/paletteStore";
import { formatAllFormats, type AllFormats } from "../../lib/colors";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";

const LABELS: Array<{ key: keyof AllFormats; label: string }> = [
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

  const drifted = hue !== targetHue || saturation !== targetSat;
  const formats = formatAllFormats(hue, saturation);

  return (
    <>
      {/* Always mounted so screen readers announce target set/change/drift */}
      <span role="status" className="sr-only">
        {targetInput === null
          ? ""
          : `Target ${targetInput}${drifted ? ", drifted" : ""}`}
      </span>
      {targetInput !== null && (
        <div
          className="border-border-default mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-3"
          role="group"
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
                className="hover:bg-surface-hover group/fmt flex cursor-pointer items-baseline gap-1.5 px-1.5 py-0.5 text-left transition-colors md:flex-col md:items-start md:gap-0 lg:flex-row lg:items-baseline lg:gap-1.5"
                aria-label={`Copy ${label} ${value}`}
              >
                <span className="text-3xs text-text-faint tracking-wider uppercase">
                  {label}
                </span>
                <span
                  className={`group-hover/fmt:text-text-primary font-mono text-xs whitespace-nowrap tabular-nums ${drifted ? "text-text-muted" : "text-text-secondary"}`}
                >
                  {isCopied ? "Copied" : value}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}
