import { AppShell } from "./components/AppShell";
import { Header } from "./components/Header";
import { ControlBar } from "./components/ControlBar";
import { PaletteStrip } from "./components/PaletteStrip";
import { PaletteGrid } from "./components/PaletteGrid";
import { ChartTabs } from "./components/ChartTabs";
import { usePalette } from "./hooks/usePalette";
import { useDynamicFavicon } from "./hooks/useDynamicFavicon";

export function App() {
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
