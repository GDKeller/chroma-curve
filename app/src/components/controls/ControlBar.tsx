import { HueSlider } from "./HueSlider";
import { TargetSwatch } from "./TargetSwatch";
import { SaturationSlider } from "./SaturationSlider";
import { AdjustmentSlider } from "./AdjustmentSlider";
import { LightnessRange } from "./LightnessRange";

export function ControlBar() {
  return (
    <nav aria-label="Palette controls" className="sticky top-0 z-50 px-4 py-3 sm:px-6 sm:py-4 border-b border-border-default bg-surface-raised/85 backdrop-blur-xl">
      <div className="flex flex-wrap gap-4 sm:gap-6 max-w-5xl mx-auto">
        <div className="flex gap-4 sm:gap-6 sm:contents w-full sm:w-auto">
          <HueSlider />
          <TargetSwatch />
        </div>
        <SaturationSlider />
        <div className="hidden lg:block w-px self-stretch bg-border-default mx-2" />
        <AdjustmentSlider />
        <LightnessRange />
      </div>
    </nav>
  );
}
