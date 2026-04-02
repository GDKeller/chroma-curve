import type { ExportFormat, ColorSpace } from "../../types/palette";

interface FormatSelectorProps {
  format: ExportFormat;
  onFormatChange: (format: ExportFormat) => void;
  space: ColorSpace;
  onSpaceChange: (space: ColorSpace) => void;
}

const formats: { value: ExportFormat; label: string }[] = [
  { value: "css", label: "CSS" },
  { value: "tw4", label: "TW v4" },
  { value: "tw3", label: "TW v3" },
  { value: "scss", label: "SCSS" },
  { value: "js", label: "JS/TS" },
  { value: "json", label: "JSON" },
  { value: "gpl", label: "GPL" },
  { value: "text", label: "Text" },
];

const spaces: { value: ColorSpace; label: string }[] = [
  { value: "hsl", label: "HSL" },
  { value: "hex", label: "HEX" },
  { value: "rgb", label: "RGB" },
  { value: "hcl", label: "HCL" },
  { value: "oklch", label: "OKLCH" },
];

const btnBase =
  "flex-1 px-3 py-1.5 text-base font-medium rounded-none text-text-muted transition-colors hover:text-text-secondary cursor-pointer";
const btnActive = "bg-surface-active text-white";

export function FormatSelector({
  format,
  onFormatChange,
  space,
  onSpaceChange,
}: FormatSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <span className="text-sm text-text-faint uppercase tracking-wider mb-1 block">
          Format
        </span>
        <div
          role="radiogroup"
          aria-label="Export format"
          className="flex gap-1 p-1 rounded-none bg-surface-overlay"
        >
          {formats.map((f) => (
            <button
              key={f.value}
              role="radio"
              aria-checked={format === f.value}
              className={`${btnBase} ${format === f.value ? btnActive : ""}`}
              onClick={() => onFormatChange(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <span className="text-sm text-text-faint uppercase tracking-wider mb-1 block">
          Color Space
        </span>
        <div
          role="radiogroup"
          aria-label="Color space"
          className="flex gap-1 p-1 rounded-none bg-surface-overlay"
        >
          {spaces.map((s) => (
            <button
              key={s.value}
              role="radio"
              aria-checked={space === s.value}
              className={`${btnBase} ${space === s.value ? btnActive : ""}`}
              onClick={() => onSpaceChange(s.value)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
