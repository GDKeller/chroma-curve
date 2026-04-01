import { useMemo, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import chroma from "chroma-js";
import { Triangle } from "@phosphor-icons/react";
import { SaturationCurve } from "./SaturationCurve";
import { EffectiveSaturation } from "./EffectiveSaturation";
import { ToggleSwitch } from "../controls/ToggleSwitch";
import { usePaletteStore } from "../../store/paletteStore";
import type { ColorEntry } from "../../types/palette";

interface ChartTabsProps {
  entries: ColorEntry[];
}

export function ChartTabs({ entries }: ChartTabsProps) {
  const [showDots, setShowDots] = useState(true);
  const [showCompare, setShowCompare] = useState(false);
  const hue = usePaletteStore((s) => s.hue);
  const saturation = usePaletteStore((s) => s.saturation);

  const { unadjustedColors, adjustedColors } = useMemo(() => ({
    unadjustedColors: entries.map((e) =>
      chroma.hsl(hue, saturation, e.lightness / 100).hex(),
    ),
    adjustedColors: entries.map((e) => e.hex),
  }), [entries, hue, saturation]);

  return (
    <div className="mx-4 md:mx-0 rounded-xs border border-border-default bg-surface-raised overflow-hidden lg:mr-4">
      <div className="px-4 py-2.5 flex items-center justify-between md:hidden lg:flex">
        <h2 className="text-sm font-semibold text-center w-full uppercase text-text-tertiary tracking-wider">
          Saturation Curve
        </h2>
      </div>
      <Tabs.Root defaultValue="adjustment">
        <Tabs.List className="flex border-y border-border-default">
          <Tabs.Trigger
            value="adjustment"
            className="flex-1 px-4 py-2 md:px-2 md:py-2 lg:px-4 lg:py-2 text-xs font-medium uppercase tracking-wider md:tracking-normal lg:tracking-wider text-text-subtle cursor-pointer transition-colors data-[state=active]:text-text-primary border-r border-border-default"
          >
            Adjustment
          </Tabs.Trigger>
          <Tabs.Trigger
            value="computed"
            className="flex-1 px-4 py-2 text-xs font-medium uppercase tracking-wider md:tracking-normal lg:tracking-wider text-text-subtle cursor-pointer transition-colors data-[state=active]:text-text-primary"
          >
            Computed
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="adjustment" forceMount className="data-[state=inactive]:hidden">
          <h3 className="sr-only">Adjustment <span>multiplier</span></h3>
          <SaturationCurve entries={entries} showDots={showDots} />
        </Tabs.Content>
        <Tabs.Content value="computed" forceMount className="data-[state=inactive]:hidden">
          <h3 className="sr-only">Computed <span>values</span></h3>
          <EffectiveSaturation entries={entries} showDots={showDots} />
        </Tabs.Content>
      </Tabs.Root>
      <div className="px-4 py-2 flex items-center justify-between md:hidden lg:flex">
        <button
          type="button"
          onClick={() => setShowCompare(!showCompare)}
          className="text-sm text-text-subtle font-semibold cursor-pointer select-none hover:text-text-muted transition-colors md:hidden lg:inline-flex lg:items-center lg:gap-1"
        >
          <Triangle size={7} weight="fill" className={`transition-transform ${showCompare ? "rotate-180" : "rotate-90"}`} /> Compare
        </button>
        <ToggleSwitch label="steps" checked={showDots} onChange={setShowDots} />
      </div>
      {showCompare && (
        <div className="px-4 pb-3 space-y-2 md:hidden lg:block">
          <div>
            <span className="text-xs text-text-faint block mb-1">Unadjusted</span>
            <div className="h-6 rounded-sm overflow-hidden grid grid-flow-col auto-cols-fr">
              {unadjustedColors.map((c, i) => (
                <div key={i} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs text-text-faint block mb-1">Adjusted</span>
            <div className="h-6 rounded-sm overflow-hidden grid grid-flow-col auto-cols-fr">
              {adjustedColors.map((c, i) => (
                <div key={i} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
