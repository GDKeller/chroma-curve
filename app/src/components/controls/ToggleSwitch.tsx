import { useId } from "react";

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleSwitch({ label, checked, onChange }: ToggleSwitchProps) {
  const id = useId();
  return (
    <label className="group flex items-center gap-1 cursor-pointer select-none bg-surface-raised border border-border-default px-3 py-1.5 transition-colors">
      <span id={id} className={`text-sm md:text-xs lg:text-sm font-mono group-hover:text-white group-active:text-white transition-colors ${checked ? "text-white" : "text-text-tertiary"}`}>
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
          className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full transition-transform ${checked ? "bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.4)]" : "bg-text-secondary"}`}
          style={{
            transform: checked ? "translateX(12px)" : "translateX(0)",
          }}
        />
      </button>
    </label>
  );
}
