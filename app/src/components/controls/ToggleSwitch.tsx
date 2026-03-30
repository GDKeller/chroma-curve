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
      <span id={id} className="text-xs font-mono text-text-tertiary">
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
          className="absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-text-secondary transition-transform"
          style={{
            transform: checked ? "translateX(12px)" : "translateX(0)",
          }}
        />
      </button>
    </label>
  );
}
