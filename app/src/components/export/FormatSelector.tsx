import * as Tabs from "@radix-ui/react-tabs";
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
  { value: "json", label: "JSON" },
  { value: "text", label: "Text" },
];

const spaces: { value: ColorSpace; label: string }[] = [
  { value: "hsl", label: "HSL" },
  { value: "hex", label: "HEX" },
  { value: "rgb", label: "RGB" },
  { value: "hcl", label: "HCL" },
  { value: "oklch", label: "OKLCH" },
];

const tabTrigger =
  "flex-1 px-3 py-1.5 text-sm font-medium rounded-md text-white/50 transition-colors data-[state=active]:bg-white/10 data-[state=active]:text-white hover:text-white/70 cursor-pointer";

export function FormatSelector({
  format,
  onFormatChange,
  space,
  onSpaceChange,
}: FormatSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <span className="text-[11px] font-mono text-white/30 uppercase tracking-wider mb-1 block">
          Format
        </span>
        <Tabs.Root
          value={format}
          onValueChange={(v) => onFormatChange(v as ExportFormat)}
        >
          <Tabs.List className="flex gap-1 p-1 rounded-lg bg-white/[0.04]">
            {formats.map((f) => (
              <Tabs.Trigger key={f.value} value={f.value} className={tabTrigger}>
                {f.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>
      </div>
      <div>
        <span className="text-[11px] font-mono text-white/30 uppercase tracking-wider mb-1 block">
          Color Space
        </span>
        <Tabs.Root
          value={space}
          onValueChange={(v) => onSpaceChange(v as ColorSpace)}
        >
          <Tabs.List className="flex gap-1 p-1 rounded-lg bg-white/[0.04]">
            {spaces.map((s) => (
              <Tabs.Trigger key={s.value} value={s.value} className={tabTrigger}>
                {s.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>
      </div>
    </div>
  );
}
