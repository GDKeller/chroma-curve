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
    <div className="flex min-w-[140px] flex-1 flex-col gap-1 sm:min-w-[200px]">
      <div className="flex items-center justify-between px-1">
        <span className="text-text-muted flex h-6 items-center text-sm font-semibold tracking-wider uppercase">
          {label}
        </span>
        <span className="text-text-primary flex items-center text-base tabular-nums">
          {displayValue}
        </span>
      </div>
      <Slider.Root
        className="relative flex h-5 cursor-pointer touch-none items-center select-none"
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={([v]) => onValueChange(v)}
      >
        <Slider.Track
          className="bg-border-elevated relative h-[6px] grow overflow-hidden rounded-full"
          style={trackStyle}
        >
          <Slider.Range
            className={`absolute h-full rounded-full ${trackStyle ? "" : "bg-surface-active-hover"}`}
          />
        </Slider.Track>
        <Slider.Thumb
          className="block h-4 w-4 rounded-full border-2 border-white bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.4)] transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:outline-none"
          aria-label={label}
        />
      </Slider.Root>
    </div>
  );
}
