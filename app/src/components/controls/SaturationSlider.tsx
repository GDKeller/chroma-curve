import * as Slider from "@radix-ui/react-slider";
import { Crosshair, ArrowsOutLineHorizontal } from "@phosphor-icons/react";
import { usePaletteStore } from "../../store/paletteStore";

export function SaturationSlider() {
  const saturation = usePaletteStore((s) => s.saturation);
  const setSaturation = usePaletteStore((s) => s.setSaturation);
  const satMode = usePaletteStore((s) => s.satMode);
  const setSatMode = usePaletteStore((s) => s.setSatMode);

  return (
    <div className="flex flex-col gap-1.5 flex-1 w-full sm:w-auto sm:min-w-[200px]">
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-semibold text-text-tertiary uppercase tracking-wider shrink-0">
          Saturation
        </span>
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={() => setSatMode(satMode === "endpoint" ? "target" : "endpoint")}
            className={`flex items-center text-sm cursor-pointer transition-colors shrink-0 ${satMode === "target" ? "text-text-primary" : "text-text-faint"}`}
            title={satMode === "endpoint" ? "Slider controls endpoint saturation" : "Slider controls target (L50) saturation"}
          >
            {satMode === "target" ? <Crosshair size={14} weight="fill" /> : <ArrowsOutLineHorizontal size={14} />}
            <span className="ml-0.5">{satMode}</span>
          </button>
          <span className="text-base text-text-primary tabular-nums">
            {Math.round(saturation * 100)}%
          </span>
        </div>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none h-5 cursor-pointer"
        value={[saturation]}
        min={0}
        max={1}
        step={0.01}
        onValueChange={([v]) => setSaturation(v)}
      >
        <Slider.Track
          className="relative grow rounded-full h-[6px] overflow-hidden bg-border-elevated"
        >
          <Slider.Range className="absolute h-full rounded-full bg-surface-active-hover" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-4 h-4 rounded-full bg-white border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 transition-transform hover:scale-110"
          aria-label="Saturation"
        />
      </Slider.Root>
    </div>
  );
}
