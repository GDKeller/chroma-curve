import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";

interface ExportPreviewProps {
  code: string;
}

export function ExportPreview({ code }: ExportPreviewProps) {
  const { copiedLabel, copy } = useCopyToClipboard();

  return (
    <div className="relative">
      <pre className="p-4 rounded-lg bg-black/60 border border-white/[0.06] overflow-auto max-h-[400px] text-[13px] font-mono leading-relaxed text-white/80">
        {code}
      </pre>
      <button
        type="button"
        onClick={() => copy(code, "export")}
        className="absolute top-3 right-3 px-3 py-1 text-xs font-medium rounded-md bg-white/10 text-white/90 hover:bg-white/15 transition-colors cursor-pointer"
      >
        {copiedLabel === "export" ? "Copied!" : "Copy All"}
      </button>
    </div>
  );
}
