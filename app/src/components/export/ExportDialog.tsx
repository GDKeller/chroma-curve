import { useMemo, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Export, X } from "@phosphor-icons/react";
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
  const code = useMemo(
    () => (open ? formatPalette(entries, format, space) : ""),
    [open, entries, format, space],
  );

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="px-4 py-1.5 text-sm font-medium rounded-none bg-surface-active text-text-primary hover:bg-surface-active-hover transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Export size={16} />
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
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xl p-6 rounded-none bg-surface-overlay border border-border-elevated shadow-2xl"
              >
                <Dialog.Title className="text-lg font-semibold text-text-primary mb-4">
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
                    className="absolute top-4 right-4 text-text-subtle hover:text-text-secondary transition-colors cursor-pointer"
                    aria-label="Close"
                  >
                    <X size={16} />
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
