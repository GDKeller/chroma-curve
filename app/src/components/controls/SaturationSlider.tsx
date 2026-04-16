import * as Slider from "@radix-ui/react-slider";
import { Crosshair, ArrowsOutLineHorizontal } from "@phosphor-icons/react";
import { usePaletteStore } from "../../store/paletteStore";

export function SaturationSlider() {
  const saturation = usePaletteStore((s) => s.saturation);
  const setSaturation = usePaletteStore((s) => s.setSaturation);
  const satMode = usePaletteStore((s) => s.satMode);
  const setSatMode = usePaletteStore((s) => s.setSatMode);

  return (
    <div className="flex w-full flex-1 flex-col gap-1 sm:w-auto sm:min-w-[200px]">
      <div className="flex items-center justify-between px-1">
        <span className="text-text-muted flex h-6 shrink-0 items-center text-sm font-semibold tracking-wider uppercase">
          Saturation
        </span>
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={() =>
              setSatMode(satMode === "endpoint" ? "target" : "endpoint")
            }
            className={`flex h-6 shrink-0 cursor-pointer items-center px-1 text-sm transition-colors ${satMode === "target" ? "text-text-primary" : "text-text-faint"}`}
            title={
              satMode === "endpoint"
                ? "Slider controls endpoint saturation"
                : "Slider controls target (L50) saturation"
            }
          >
            {satMode === "target" ? (
              <Crosshair size={14} weight="fill" />
            ) : (
              <ArrowsOutLineHorizontal size={14} />
            )}
            <span className="ml-1">{satMode}</span>
          </button>
          <span className="text-text-primary text-base tabular-nums">
            {Math.round(saturation * 100)}%
          </span>
        </div>
      </div>
      <Slider.Root
        className="relative flex h-5 cursor-pointer touch-none items-center select-none"
        value={[saturation]}
        min={0}
        max={1}
        step={0.01}
        onValueChange={([v]) => setSaturation(v)}
      >
        <Slider.Track className="bg-border-elevated relative h-[6px] grow overflow-hidden rounded-full">
          <Slider.Range className="bg-surface-active-hover absolute h-full rounded-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block h-4 w-4 rounded-full border-2 border-white bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.4)] transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
          aria-label="Saturation"
        />
      </Slider.Root>
    </div>
  );
}
