import { Copy } from "@phosphor-icons/react";
import { ExportDialog } from "./export/ExportDialog";
import { AboutButton } from "./About";

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3 lg:px-6">
      <div className="flex items-center gap-2">
        <h1 className="font-display text-text-primary text-base font-bold tracking-normal sm:mr-4 sm:text-xl lg:text-2xl">
          Chroma Curve
        </h1>
        <p className="text-2xs text-text-faint hidden max-w-32 leading-tight sm:block md:max-w-44 md:text-xs lg:text-xs">
          Parabolic saturation correction for monochromatic color palettes
        </p>
        <AboutButton />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-text-faint flex hidden items-center gap-1 text-sm md:flex">
          <Copy size={12} />
          Click swatch to copy
        </span>
        <ExportDialog />
      </div>
    </header>
  );
}
