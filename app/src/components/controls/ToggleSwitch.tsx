import { useId } from "react";

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  variant?: "default" | "pill";
}

export function ToggleSwitch({
  label,
  checked,
  onChange,
  variant = "default",
}: ToggleSwitchProps) {
  const id = useId();
  const isPill = variant === "pill";
  return (
    <label
      className={`group flex cursor-pointer items-center gap-1 transition-colors select-none ${isPill ? "bg-surface-raised border-border-default border px-3 py-1.5" : ""}`}
    >
      <span
        id={id}
        className={`text-sm transition-colors group-hover:text-white group-active:text-white md:text-xs lg:text-sm ${checked ? "text-white" : "text-text-muted"}`}
      >
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={id}
        onClick={() => onChange(!checked)}
        className="relative h-4 w-7 min-w-[28px] rounded-full transition-colors"
        style={{
          backgroundColor: checked
            ? "var(--color-surface-active-hover)"
            : "var(--color-surface-hover)",
        }}
      >
        <span
          className={`absolute top-1/2 left-0.5 h-3 w-3 translate-x-0 -translate-y-1/2 rounded-full transition-transform ${checked ? "translate-x-3 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.4)]" : "bg-text-secondary translate-x-0"}`}
        />
      </button>
    </label>
  );
}
