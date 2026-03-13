import { usePaletteStore } from "../../store/paletteStore";
import { SliderBase } from "./SliderBase";

// Display: 0% = no curve (sMod=0), -1% to -100% = increasing curve strength.
// Slider is linear in this percentage; we convert to/from sMod internally.
function pctToSMod(pct: number): number {
  if (pct === 0) return 0;
  return 2500 / -pct;
}

function sModToPct(sMod: number): number {
  if (sMod === 0) return 0;
  return Math.round(-2500 / sMod);
}

export function AdjustmentSlider() {
  const sMod = usePaletteStore((s) => s.sMod);
  const setSMod = usePaletteStore((s) => s.setSMod);

  return (
    <SliderBase
      label="Adjustment"
      value={sModToPct(sMod)}
      min={-100}
      max={0}
      step={1}
      onValueChange={(v) => setSMod(pctToSMod(v))}
      formatValue={(v) => `${v}%`}
    />
  );
}
