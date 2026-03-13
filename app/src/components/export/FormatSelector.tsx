import * as Tabs from "@radix-ui/react-tabs";
import type { ExportFormat } from "../../types/palette";

interface FormatSelectorProps {
  value: ExportFormat;
  onChange: (format: ExportFormat) => void;
}

const formats: { value: ExportFormat; label: string }[] = [
  { value: "css", label: "CSS" },
  { value: "tailwind", label: "Tailwind" },
  { value: "json", label: "JSON" },
];

export function FormatSelector({ value, onChange }: FormatSelectorProps) {
  return (
    <Tabs.Root
      value={value}
      onValueChange={(v) => onChange(v as ExportFormat)}
    >
      <Tabs.List className="flex gap-1 p-1 rounded-lg bg-white/[0.04]">
        {formats.map((f) => (
          <Tabs.Trigger
            key={f.value}
            value={f.value}
            className="flex-1 px-3 py-1.5 text-sm font-medium rounded-md text-white/50 transition-colors data-[state=active]:bg-white/10 data-[state=active]:text-white hover:text-white/70 cursor-pointer"
          >
            {f.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  );
}
