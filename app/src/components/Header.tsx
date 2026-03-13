import { ExportDialog } from "./export/ExportDialog";
import { AboutButton } from "./About";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-2">
        <div>
          <h1 className="text-lg font-semibold text-white/90 tracking-tight">
            Chroma Neutrals
          </h1>
          <p className="text-[13px] text-white/40">
            Tinted neutral palettes with parabolic saturation correction
          </p>
        </div>
        <AboutButton />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[11px] text-white/30">
          Click swatch to copy
        </span>
        <ExportDialog />
      </div>
    </header>
  );
}
