import * as Select from "@radix-ui/react-select";

interface InlineSelectProps<T extends string> {
  label: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}

export function InlineSelect<T extends string>({ label, value, onChange, options }: InlineSelectProps<T>) {
  const selectedLabel = options.find((o) => o.value === value)?.label ?? value;
  const longestLabel = options.reduce((a, b) => (a.label.length > b.label.length ? a : b)).label;

  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger asChild>
        <button type="button" className="inline-flex items-baseline gap-1 min-h-6 cursor-pointer text-sm font-mono whitespace-nowrap outline-none bg-surface-raised border border-border-default px-3 py-1.5">
          <span className="text-text-tertiary">{label}</span>
          <span className="relative text-text-subtle text-right">
            {/* Invisible sizer for stable width */}
            <span className="invisible" aria-hidden="true">{longestLabel}</span>
            <span className="absolute inset-0 text-right">{selectedLabel}</span>
          </span>
        </button>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={-1}
          align="end"
          className="bg-surface-raised border border-t-0 border-border-default shadow-lg"
        >
          <Select.Viewport>
            {options.map((opt) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                className="flex items-center justify-end px-3 min-h-6 text-sm font-mono text-text-subtle cursor-pointer outline-none data-[highlighted]:bg-surface-hover"
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
