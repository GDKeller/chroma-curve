import { usePaletteStore } from "../../store/paletteStore";
import { SliderBase } from "./SliderBase";

const hueTrackStyle: React.CSSProperties = {
  background:
    "linear-gradient(to right, hsl(0,80%,55%), hsl(60,80%,55%), hsl(120,80%,55%), hsl(180,80%,55%), hsl(240,80%,55%), hsl(300,80%,55%), hsl(360,80%,55%))",
};

export function HueSlider() {
  const hue = usePaletteStore((s) => s.hue);
  const setHue = usePaletteStore((s) => s.setHue);

  return (
    <SliderBase
      label="Hue"
      value={hue}
      min={0}
      max={360}
      step={1}
      onValueChange={setHue}
      trackStyle={hueTrackStyle}
      formatValue={(v) => `${v}°`}
    />
  );
}
