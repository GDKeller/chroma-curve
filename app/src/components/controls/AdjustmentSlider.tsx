import { usePaletteStore } from "../../store/paletteStore";
import { SliderBase } from "./SliderBase";

/**
 * Maps sMod value to a percentage label matching the original:
 * tooltip shows  0 - (50^2 / sMod)  rounded to nearest int, with % suffix.
 */
function formatAdjustment(sMod: number): string {
  const v = 0 - Math.pow(50, 2) / sMod;
  return `${Math.round(v)}%`;
}

export function AdjustmentSlider() {
  const sMod = usePaletteStore((s) => s.sMod);
  const setSMod = usePaletteStore((s) => s.setSMod);

  return (
    <SliderBase
      label="Adjustment"
      value={sMod}
      min={25}
      max={2500}
      step={1}
      onValueChange={setSMod}
      formatValue={formatAdjustment}
    />
  );
}
