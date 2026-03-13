import { AnimatePresence, motion } from "framer-motion";

interface CopyFeedbackProps {
  visible: boolean;
}

export function CopyFeedback({ visible }: CopyFeedbackProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-sm pointer-events-none"
        >
          <span className="text-xs font-mono font-semibold text-white tracking-wide">
            Copied!
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
