import { useId } from "react";

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleSwitch({ label, checked, onChange }: ToggleSwitchProps) {
  const id = useId();
  return (
    <label className="flex items-center gap-1 cursor-pointer">
      <span id={id} className="text-[9px] font-mono text-white/55">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={id}
        onClick={() => onChange(!checked)}
        className="relative w-5 h-2.5 rounded-full transition-colors"
        style={{
          backgroundColor: checked
            ? "rgba(255,255,255,0.25)"
            : "rgba(255,255,255,0.06)",
        }}
      >
        <span
          className="absolute top-px left-px w-2 h-2 rounded-full bg-white/70 transition-transform"
          style={{
            transform: checked ? "translateX(10px)" : "translateX(0)",
          }}
        />
      </button>
    </label>
  );
}
