import { useState, useCallback, useRef } from "react";

export function useCopyToClipboard(timeout = 1500) {
  const [copiedLabel, setCopiedLabel] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copy = useCallback(
    (text: string, label: string) => {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedLabel(label);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopiedLabel(null), timeout);
      });
    },
    [timeout],
  );

  return { copiedLabel, copy };
}
