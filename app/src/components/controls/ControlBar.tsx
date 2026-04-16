import { HueSlider } from "./HueSlider";
import { TargetSwatch } from "./TargetSwatch";
import { TargetFormats } from "./TargetFormats";
import { SaturationSlider } from "./SaturationSlider";
import { AdjustmentSlider } from "./AdjustmentSlider";
import { LightnessRange } from "./LightnessRange";
import { ChartTabs } from "../curves/ChartTabs";
import { usePalette } from "../../hooks/usePalette";

export function ControlBar() {
  const entries = usePalette();

  return (
    <section
      aria-labelledby="controls-heading"
      className="border-border-default bg-surface-raised/85 sticky top-0 z-50 border-b px-4 py-3 backdrop-blur-xl sm:px-6 sm:py-4 md:px-4 lg:px-6"
    >
      <h2 id="controls-heading" className="sr-only">
        Palette controls
      </h2>
      <div className="mx-auto max-w-5xl md:grid md:grid-cols-[1fr_10rem] md:items-start md:gap-x-4 lg:block">
        <div className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-4 lg:flex lg:flex-row lg:flex-wrap lg:gap-6">
          <h3 className="sr-only">Target color</h3>
          <div className="flex gap-4 sm:gap-6">
            <HueSlider />
            <TargetSwatch />
          </div>
          <SaturationSlider />
          <div className="bg-border-default mx-2 hidden w-px self-stretch lg:block" />
          <h3 className="sr-only">Curve adjustment</h3>
          <AdjustmentSlider />
          <LightnessRange />
        </div>
        <TargetFormats />
        <div className="hidden md:block lg:hidden">
          <ChartTabs entries={entries} />
        </div>
      </div>
    </section>
  );
}
