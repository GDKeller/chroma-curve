import { HueSlider } from "./HueSlider";
import { SaturationSlider } from "./SaturationSlider";
import { AdjustmentSlider } from "./AdjustmentSlider";

export function ControlBar() {
  return (
    <div className="sticky top-0 z-50 px-6 py-4 border-b border-white/[0.06] bg-[hsl(0_0%_8%/0.85)] backdrop-blur-xl">
      <div className="flex flex-wrap gap-6 max-w-5xl mx-auto">
        <HueSlider />
        <SaturationSlider />
        <AdjustmentSlider />
      </div>
    </div>
  );
}
