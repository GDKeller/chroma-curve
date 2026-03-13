import * as Slider from "@radix-ui/react-slider";

interface SliderBaseProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number) => void;
  trackStyle?: React.CSSProperties;
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
    <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
      <div className="flex items-center justify-between px-1">
        <span className="text-[13px] font-medium text-white/60 uppercase tracking-wider">
          {label}
        </span>
        <span className="text-[13px] font-mono text-amber-400/90 tabular-nums">
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
          className="relative grow rounded-full h-[6px] overflow-hidden"
          style={{
            backgroundColor: "rgba(255 255 255 / 0.08)",
            ...trackStyle,
          }}
        >
          <Slider.Range className="absolute h-full rounded-full bg-white/20" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-4 h-4 rounded-full bg-white border-2 border-amber-400 shadow-[0_0_0_1px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50 transition-transform hover:scale-110"
          aria-label={label}
        />
      </Slider.Root>
    </div>
  );
}
