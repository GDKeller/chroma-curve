import { useRef, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { Lock, LockOpen } from "@phosphor-icons/react";
import { usePaletteStore } from "../../store/paletteStore";

export function LightnessRange() {
  const lMin = usePaletteStore((s) => s.lMin);
  const lMax = usePaletteStore((s) => s.lMax);
  const setLRange = usePaletteStore((s) => s.setLRange);
  const [locked, setLocked] = useState(false);
  const prevRef = useRef({ lMin, lMax });

  function handleChange([newMin, newMax]: number[]) {
    if (!locked) {
      prevRef.current = { lMin: newMin, lMax: newMax };
      setLRange(newMin, newMax);
      return;
    }

    const minDelta = newMin - prevRef.current.lMin;
    const maxDelta = newMax - prevRef.current.lMax;

    let finalMin: number;
    let finalMax: number;

    if (minDelta !== 0) {
      // Min thumb moved right → max thumb moves left by same amount
      finalMin = newMin;
      finalMax = Math.max(prevRef.current.lMax - minDelta, finalMin + 1);
    } else {
      // Max thumb moved left → min thumb moves right by same amount
      finalMax = newMax;
      finalMin = Math.min(prevRef.current.lMin - maxDelta, finalMax - 1);
    }

    finalMin = Math.max(0, finalMin);
    finalMax = Math.min(100, finalMax);

    prevRef.current = { lMin: finalMin, lMax: finalMax };
    setLRange(finalMin, finalMax);
  }

  return (
    <div className="flex flex-col gap-1.5 flex-1 min-w-[140px] sm:min-w-[200px]">
      <div className="flex items-center justify-between px-1">
        <span className="text-[13px] font-medium text-text-tertiary uppercase tracking-wider">
          Range
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLocked(!locked)}
            className={`flex items-center text-[11px] font-mono cursor-pointer transition-colors ${locked ? "text-text-primary" : "text-text-faint"}`}
            title={locked ? "Unlock range" : "Lock range span"}
          >
            {locked ? <Lock size={14} weight="fill" /> : <LockOpen size={14} />}
            <span className="ml-0.5">{locked ? "locked" : "lock"}</span>
          </button>
          <span className="text-[13px] font-mono text-text-primary tabular-nums inline-flex">
            <span className="w-[2ch] text-right">{lMin}</span>
            <span>–</span>
            <span className="w-[3ch]">{lMax}</span>
          </span>
        </div>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none h-5 cursor-pointer"
        value={[lMin, lMax]}
        min={0}
        max={100}
        step={1}
        minStepsBetweenThumbs={1}
        onValueChange={handleChange}
      >
        <Slider.Track
          className="relative grow rounded-full h-[6px] overflow-hidden"
          style={{
            background: "linear-gradient(to right, hsl(0 0% 0%), hsl(0 0% 100%))",
          }}
        >
          <Slider.Range className="absolute h-full rounded-full bg-surface-active-hover" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-4 h-4 rounded-full bg-white border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 transition-transform hover:scale-110"
          aria-label="Minimum lightness"
        />
        <Slider.Thumb
          className="block w-4 h-4 rounded-full bg-white border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 transition-transform hover:scale-110"
          aria-label="Maximum lightness"
        />
      </Slider.Root>
    </div>
  );
}
