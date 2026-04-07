import { useId } from "react";

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  variant?: "default" | "pill";
}

export function ToggleSwitch({ label, checked, onChange, variant = "default" }: ToggleSwitchProps) {
  const id = useId();
  const isPill = variant === "pill";
  return (
    <label className={`group flex items-center gap-1 cursor-pointer select-none transition-colors ${isPill ? "bg-surface-raised border border-border-default px-3 py-1.5" : ""}`}>
      <span id={id} className={`text-sm md:text-xs lg:text-sm group-hover:text-white group-active:text-white transition-colors ${checked ? "text-white" : "text-text-muted"}`}>
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={id}
        onClick={() => onChange(!checked)}
        className="relative w-7 h-4 rounded-full transition-colors min-w-[28px]"
        style={{
          backgroundColor: checked
            ? "var(--color-surface-active-hover)"
            : "var(--color-surface-hover)",
        }}
      >
        <span
          className={`absolute top-1/2 left-0.5 translate-x-0 -translate-y-1/2 w-3 h-3 rounded-full transition-transform ${checked ? "translate-x-3 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.4)]" : "translate-x-0 bg-text-secondary"}`}
        />
      </button>
    </label>
  );
}
