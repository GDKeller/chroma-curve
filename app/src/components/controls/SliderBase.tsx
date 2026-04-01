import type { CSSProperties } from "react";
import * as Slider from "@radix-ui/react-slider";

interface SliderBaseProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number) => void;
  trackStyle?: CSSProperties;
  formatValue?: (value: number) => string;
}

export function SliderBase({
  label,
  value,
  min,
  max,
  step,
  onValueChange,
  trackStyle,
  formatValue,
}: SliderBaseProps) {
  const displayValue = formatValue ? formatValue(value) : String(value);

  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-[140px] sm:min-w-[200px]">
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-semibold text-text-tertiary uppercase tracking-wider">
          {label}
        </span>
        <span className="text-base text-text-primary tabular-nums">
          {displayValue}
        </span>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none h-5 cursor-pointer"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onValueChange(v)}
      >
        <Slider.Track
          className="relative grow rounded-full h-[6px] overflow-hidden bg-border-elevated"
          style={trackStyle}
        >
          <Slider.Range className={`absolute h-full rounded-full ${trackStyle ? "" : "bg-surface-active-hover"}`} />
        </Slider.Track>
        <Slider.Thumb
          className="block w-4 h-4 rounded-full bg-white border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 transition-transform hover:scale-110"
          aria-label={label}
        />
      </Slider.Root>
    </div>
  );
}
