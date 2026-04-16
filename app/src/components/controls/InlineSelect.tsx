import * as Select from "@radix-ui/react-select";

interface InlineSelectProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}

export function InlineSelect<T extends string>({
  label,
  value,
  onChange,
  options,
}: InlineSelectProps<T>) {
  const selectedLabel = options.find((o) => o.value === value)?.label ?? value;
  const longestLabel = options.reduce((a, b) =>
    a.label.length > b.label.length ? a : b,
  ).label;

  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger asChild>
        <button
          type="button"
          aria-label={label}
          className="group bg-surface-raised border-border-default inline-flex min-h-6 cursor-pointer items-baseline gap-1 border px-3 py-1.5 text-sm whitespace-nowrap transition-colors outline-none"
        >
          <span className="text-text-muted transition-colors group-hover:text-white group-active:text-white group-data-[state=open]:text-white">
            {label}
          </span>
          <span className="text-text-faint relative text-right transition-colors group-hover:text-white group-active:text-white group-data-[state=open]:text-white">
            {/* Invisible sizer for stable width */}
            <span className="invisible" aria-hidden="true">
              {longestLabel}
            </span>
            <span className="absolute inset-0 text-right">{selectedLabel}</span>
          </span>
        </button>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={-1}
          align="end"
          className="bg-surface-raised border-border-default border border-t-0 shadow-lg"
        >
          <Select.Viewport>
            {options.map((opt) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                className="text-text-faint data-[highlighted]:bg-surface-hover flex min-h-6 cursor-pointer items-center justify-end px-3 text-sm outline-none data-[highlighted]:text-white"
              >
                <Select.ItemText>{opt.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
