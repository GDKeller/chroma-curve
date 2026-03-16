import { useState, useCallback, useRef } from "react";

export function useCopyToClipboard(timeout = 1500) {
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copy = useCallback(
    (text: string, label: string) => {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopiedLabel(label);
          setError(null);
          clearTimeout(timerRef.current);
          timerRef.current = setTimeout(() => setCopiedLabel(null), timeout);
        })
        .catch((err: unknown) => {
          setCopiedLabel(null);
          setError(err instanceof Error ? err.message : "Copy failed");
          console.warn("Clipboard write failed:", err);
        });
    },
    [timeout],
  );

  return { copiedLabel, error, copy };
}
