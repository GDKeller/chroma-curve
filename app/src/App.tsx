import { AppShell } from "./components/AppShell";
import { Header } from "./components/Header";
import { ControlBar } from "./components/controls/ControlBar";
import { PaletteStrip } from "./components/palette/PaletteStrip";
import { PaletteGrid } from "./components/palette/PaletteGrid";
import { ChartTabs } from "./components/curves/ChartTabs";
import { usePalette } from "./hooks/usePalette";

export default function App() {
  const entries = usePalette();

  return (
    <AppShell>
      <Header />
      <ControlBar />
      <div className="flex flex-col gap-4 py-4">
        <PaletteStrip entries={entries} />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4 mx-0 lg:items-stretch">
          <PaletteGrid entries={entries} />
          <ChartTabs entries={entries} />
        </div>
      </div>
    </AppShell>
  );
}
