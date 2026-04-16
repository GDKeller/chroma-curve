import { AppShell } from "./components/AppShell";
import { Header } from "./components/Header";
import { ControlBar } from "./components/controls/ControlBar";
import { PaletteStrip } from "./components/palette/PaletteStrip";
import { PaletteGrid } from "./components/palette/PaletteGrid";
import { ChartTabs } from "./components/curves/ChartTabs";
import { usePalette } from "./hooks/usePalette";
import { useDynamicFavicon } from "./hooks/useDynamicFavicon";

export default function App() {
  const entries = usePalette();
  useDynamicFavicon();

  return (
    <AppShell>
      <Header />
      <ControlBar />
      <div className="flex flex-col gap-4 py-4">
        <PaletteStrip entries={entries} />
        <div className="mx-0 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_340px] lg:items-stretch">
          <PaletteGrid entries={entries} />
          <div className="md:hidden lg:block">
            <ChartTabs entries={entries} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
