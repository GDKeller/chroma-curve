import { ColorSwatch } from "./ColorSwatch";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";
import type { ColorEntry } from "../../types/palette";

interface PaletteGridProps {
  entries: ColorEntry[];
}

export function PaletteGrid({ entries }: PaletteGridProps) {
  const { copiedLabel, copy } = useCopyToClipboard();

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-px ml-4 mr-4 lg:mr-0 rounded-xl overflow-hidden bg-white/[0.04]">
      {entries.map((entry) => (
        <ColorSwatch
          key={entry.label}
          entry={entry}
          isCopied={copiedLabel === entry.label}
          onCopy={copy}
        />
      ))}
    </div>
  );
}
