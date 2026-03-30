import { useMemo, useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import chroma from "chroma-js";
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
  const hue = usePaletteStore((s) => s.hue);
  const saturation = usePaletteStore((s) => s.saturation);

  const { unadjustedColors, adjustedColors } = useMemo(() => ({
    unadjustedColors: entries.map((e) =>
      chroma.hsl(hue, saturation, e.lightness / 100).hex(),
    ),
    adjustedColors: entries.map((e) => e.hex),
  }), [entries, hue, saturation]);

  return (
    <div className="mx-4 md:mx-0 rounded-xl border border-border-default bg-surface-raised overflow-hidden lg:mr-4">
      <div className="px-4 py-2.5 flex items-center justify-between">
        <h3 className="text-sm font-medium text-text-tertiary uppercase tracking-wider">
          Saturation Curve
        </h3>
        <ToggleSwitch label="steps" checked={showDots} onChange={setShowDots} />
      </div>
      <Tabs.Root defaultValue="adjustment">
        <Tabs.List className="flex border-y border-border-default">
          <Tabs.Trigger
            value="adjustment"
            className="flex-1 px-4 py-2 text-sm font-medium uppercase tracking-wider text-text-subtle cursor-pointer transition-colors data-[state=active]:text-text-primary border-r border-border-default"
          >
            Adjustment
          </Tabs.Trigger>
          <Tabs.Trigger
            value="computed"
            className="flex-1 px-4 py-2 text-sm font-medium uppercase tracking-wider text-text-subtle cursor-pointer transition-colors data-[state=active]:text-text-primary"
          >
            Computed
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="adjustment">
          <SaturationCurve entries={entries} showDots={showDots} />
        </Tabs.Content>
        <Tabs.Content value="computed">
          <EffectiveSaturation entries={entries} showDots={showDots} />
        </Tabs.Content>
      </Tabs.Root>
      <details className="px-4 pb-3">
        <summary className="text-sm font-mono text-text-subtle cursor-pointer select-none py-2 hover:text-text-muted transition-colors">
          Compare
        </summary>
        <div className="space-y-2 pt-1">
          <div>
            <span className="text-sm font-mono text-text-faint block mb-1">Unadjusted</span>
            <div className="h-6 rounded-sm overflow-hidden grid grid-flow-col auto-cols-fr">
              {unadjustedColors.map((c, i) => (
                <div key={i} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div>
            <span className="text-sm font-mono text-text-faint block mb-1">Adjusted</span>
            <div className="h-6 rounded-sm overflow-hidden grid grid-flow-col auto-cols-fr">
              {adjustedColors.map((c, i) => (
                <div key={i} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        </div>
      </details>
    </div>
  );
}
