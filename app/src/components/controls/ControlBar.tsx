import { HueSlider } from "./HueSlider";
import { TargetSwatch } from "./TargetSwatch";
import { SaturationSlider } from "./SaturationSlider";
import { AdjustmentSlider } from "./AdjustmentSlider";
import { LightnessRange } from "./LightnessRange";
import { ChartTabs } from "../curves/ChartTabs";
import { usePalette } from "../../hooks/usePalette";

export function ControlBar() {
  const entries = usePalette();

  return (
    <nav
      aria-label="Palette controls"
      className="sticky top-0 z-50 px-4 py-3 sm:px-6 sm:py-4 md:px-4 lg:px-6 border-b border-border-default bg-surface-raised/85 backdrop-blur-xl"
    >
      <div className="max-w-5xl mx-auto md:grid md:grid-cols-[1fr_12rem] md:gap-x-4 md:items-start lg:block">
        <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-4 lg:flex lg:flex-row lg:flex-wrap lg:gap-6">
          <div className="flex gap-4 sm:gap-6">
            <HueSlider />
            <TargetSwatch />
          </div>
          <SaturationSlider />
          <div className="hidden lg:block w-px self-stretch bg-border-default mx-2" />
          <AdjustmentSlider />
          <LightnessRange />
        </div>
        <div className="hidden md:block lg:hidden">
          <ChartTabs entries={entries} />
        </div>
      </div>
    </nav>
  );
}
