import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";

interface ExportPreviewProps {
  code: string;
  onDownload: () => void;
}

export function ExportPreview({ code, onDownload }: ExportPreviewProps) {
  const { copiedLabel, copy } = useCopyToClipboard();

  return (
    <div className="relative">
      <pre className="border-border-default text-text-primary max-h-[400px] overflow-auto rounded-none border bg-black/60 p-4 text-base leading-relaxed">
        {code}
      </pre>
      <div className="absolute top-3 right-3 flex gap-2">
        <button
          type="button"
          onClick={onDownload}
          aria-label="Download palette file"
          className="bg-surface-active text-text-primary hover:bg-surface-active-hover cursor-pointer rounded-none px-3 py-1 text-sm font-medium transition-colors"
        >
          Download
        </button>
        <button
          type="button"
          onClick={() => copy(code, "export")}
          aria-label="Copy palette code"
          className="bg-surface-active text-text-primary hover:bg-surface-active-hover cursor-pointer rounded-none px-3 py-1 text-sm font-medium transition-colors"
        >
          {copiedLabel === "export" ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
