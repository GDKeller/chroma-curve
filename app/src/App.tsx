import { AppShell } from "./components/AppShell";
import { Header } from "./components/Header";
import { ControlBar } from "./components/controls/ControlBar";
import { PaletteStrip } from "./components/palette/PaletteStrip";
import { PaletteGrid } from "./components/palette/PaletteGrid";
import { SaturationCurve } from "./components/curves/SaturationCurve";
import { EffectiveSaturation } from "./components/curves/EffectiveSaturation";
import { usePalette } from "./hooks/usePalette";

export default function App() {
  const entries = usePalette();

  return (
    <AppShell>
      <Header />
      <ControlBar />
      <div className="flex flex-col gap-4 py-4">
        <PaletteStrip entries={entries} />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 mx-0">
          <PaletteGrid entries={entries} />
          <div className="flex flex-col gap-4 lg:mr-4">
            <SaturationCurve entries={entries} />
            <EffectiveSaturation entries={entries} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
