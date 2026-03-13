import { usePaletteStore } from "../../store/paletteStore";
import { SliderBase } from "./SliderBase";

export function SaturationSlider() {
  const saturation = usePaletteStore((s) => s.saturation);
  const setSaturation = usePaletteStore((s) => s.setSaturation);

  return (
    <SliderBase
      label="Saturation"
      value={saturation}
      min={0}
      max={1}
      step={0.01}
      onValueChange={setSaturation}
      formatValue={(v) => `${Math.round(v * 100)}%`}
    />
  );
}
