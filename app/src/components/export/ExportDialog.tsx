import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { FormatSelector } from "./FormatSelector";
import { ExportPreview } from "./ExportPreview";
import { formatPalette, downloadPalette } from "../../lib/export";
import { usePalette } from "../../hooks/usePalette";
import type { ExportFormat, ColorSpace } from "../../types/palette";

export function ExportDialog() {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormat>("css");
  const [space, setSpace] = useState<ColorSpace>("hsl");
  const entries = usePalette();
  const code = formatPalette(entries, format, space);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="px-4 py-1.5 text-sm font-medium rounded-lg bg-white/10 text-white/90 hover:bg-white/15 transition-colors cursor-pointer"
        >
          Export
        </button>
      </Dialog.Trigger>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 8 }}
                transition={{ duration: 0.2 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xl p-6 rounded-2xl bg-[hsl(0_0%_10%)] border border-white/[0.08] shadow-2xl"
              >
                <Dialog.Title className="text-lg font-semibold text-white/90 mb-4">
                  Export Palette
                </Dialog.Title>
                <Dialog.Description className="sr-only">
                  Export your palette in various code formats and color spaces
                </Dialog.Description>
                <div className="flex flex-col gap-4">
                  <FormatSelector
                    format={format}
                    onFormatChange={setFormat}
                    space={space}
                    onSpaceChange={setSpace}
                  />
                  <ExportPreview
                    code={code}
                    onDownload={() => downloadPalette(entries, format, space)}
                  />
                </div>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                    aria-label="Close"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                    >
                      <path
                        d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </Dialog.Close>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
