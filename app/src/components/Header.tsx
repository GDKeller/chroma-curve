import { Copy } from "@phosphor-icons/react";
import { ExportDialog } from "./export/ExportDialog";
import { AboutButton } from "./About";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-3">
      <div className="flex items-center gap-2">
        <h1 className="text-base sm:text-xl font-semibold sm:mr-4 text-text-primary tracking-tight">
          Chroma Curve
        </h1>
        <p className="text-sm text-text-subtle hidden sm:block max-w-48 leading-tight">
          Parabolic saturation correction for monochromatic color palettes
        </p>
        <AboutButton />
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-text-subtle flex items-center gap-1 hidden md:flex">
          <Copy size={12} />
          Click swatch to copy
        </span>
        <ExportDialog />
      </div>
    </header>
  );
}
