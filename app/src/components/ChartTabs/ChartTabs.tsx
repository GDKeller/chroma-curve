import { useMemo, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import chroma from "chroma-js";
import { Triangle } from "@phosphor-icons/react";
import { SaturationCurve } from "../SaturationCurve";
import { EffectiveSaturation } from "../EffectiveSaturation";
import { ToggleSwitch } from "../ToggleSwitch";
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

  const { unadjustedColors, adjustedColors } = useMemo(
    () => ({
      unadjustedColors: entries.map((e) =>
        chroma.hsl(hue, saturation, e.lightness / 100).hex(),
      ),
      adjustedColors: entries.map((e) => e.hex),
    }),
    [entries, hue, saturation],
  );

  return (
    <div className="border-border-default bg-surface-raised mx-4 overflow-hidden rounded-none border md:mx-0 lg:mr-4">
      <div className="flex items-center justify-between px-4 py-2 md:hidden lg:flex">
        <h2 className="text-text-muted w-full text-center text-sm font-semibold tracking-wider uppercase">
          Saturation Curve
        </h2>
      </div>
      <Tabs.Root defaultValue="adjustment">
        <Tabs.List className="border-border-default flex border-y">
          <Tabs.Trigger
            value="adjustment"
            className="text-text-faint data-[state=active]:text-text-primary border-border-default flex-1 cursor-pointer border-r px-4 py-2 text-xs font-medium tracking-wider uppercase transition-colors md:px-2 md:py-2 md:tracking-normal lg:px-4 lg:py-2 lg:tracking-wider"
          >
            Adjustment
          </Tabs.Trigger>
          <Tabs.Trigger
            value="computed"
            className="text-text-faint data-[state=active]:text-text-primary flex-1 cursor-pointer px-4 py-2 text-xs font-medium tracking-wider uppercase transition-colors md:tracking-normal lg:tracking-wider"
          >
            Computed
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content
          value="adjustment"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          <h3 className="sr-only">
            Adjustment <span>multiplier</span>
          </h3>
          <SaturationCurve entries={entries} showDots={showDots} />
        </Tabs.Content>
        <Tabs.Content
          value="computed"
          forceMount
          className="data-[state=inactive]:hidden"
        >
          <h3 className="sr-only">
            Computed <span>values</span>
          </h3>
          <EffectiveSaturation entries={entries} showDots={showDots} />
        </Tabs.Content>
      </Tabs.Root>
      <div className="flex items-center justify-between px-4 py-2 md:hidden lg:flex">
        <button
          type="button"
          onClick={() => setShowCompare(!showCompare)}
          className="text-text-faint hover:text-text-muted cursor-pointer text-sm font-semibold transition-colors select-none md:hidden lg:inline-flex lg:items-center lg:gap-1"
        >
          <Triangle
            size={7}
            weight="fill"
            className={`transition-transform ${showCompare ? "rotate-180" : "rotate-90"}`}
          />{" "}
          Compare
        </button>
        <ToggleSwitch label="steps" checked={showDots} onChange={setShowDots} />
      </div>
      {showCompare && (
        <div className="space-y-2 px-4 pb-3 md:hidden lg:block">
          <div>
            <span className="text-text-faint mb-1 block text-xs">
              Unadjusted
            </span>
            <div className="grid h-6 auto-cols-fr grid-flow-col overflow-hidden rounded-none">
              {unadjustedColors.map((c, i) => (
                <div key={i} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div>
            <span className="text-text-faint mb-1 block text-xs">Adjusted</span>
            <div className="grid h-6 auto-cols-fr grid-flow-col overflow-hidden rounded-none">
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
