import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";

interface ExportPreviewProps {
  code: string;
  onDownload: () => void;
}

export function ExportPreview({ code, onDownload }: ExportPreviewProps) {
  const { copiedLabel, copy } = useCopyToClipboard();

  return (
    <div className="relative">
      <pre className="p-4 rounded-lg bg-black/60 border border-border-default overflow-auto max-h-[400px] text-[13px] font-mono leading-relaxed text-text-primary">
        {code}
      </pre>
      <div className="absolute top-3 right-3 flex gap-2">
        <button
          type="button"
          onClick={onDownload}
          aria-label="Download palette file"
          className="px-3 py-1 text-xs font-medium rounded-md bg-surface-active text-text-primary hover:bg-surface-active-hover transition-colors cursor-pointer"
        >
          Download
        </button>
        <button
          type="button"
          onClick={() => copy(code, "export")}
          aria-label="Copy palette code"
          className="px-3 py-1 text-xs font-medium rounded-md bg-surface-active text-text-primary hover:bg-surface-active-hover transition-colors cursor-pointer"
        >
          {copiedLabel === "export" ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
