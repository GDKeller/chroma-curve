import { HueSlider } from "./HueSlider";
import { SaturationSlider } from "./SaturationSlider";
import { AdjustmentSlider } from "./AdjustmentSlider";
import { LightnessRange } from "./LightnessRange";

export function ControlBar() {
  return (
    <nav aria-label="Palette controls" className="sticky top-0 z-50 px-6 py-4 border-b border-border-default bg-surface-raised/85 backdrop-blur-xl">
      <div className="flex flex-wrap gap-6 max-w-5xl mx-auto">
        <HueSlider />
        <SaturationSlider />
        <div className="hidden lg:block w-px self-stretch bg-border-default mx-2" />
        <AdjustmentSlider />
        <LightnessRange />
      </div>
    </nav>
  );
}
