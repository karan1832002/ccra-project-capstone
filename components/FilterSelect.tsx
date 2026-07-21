import React from "react";

// A single dropdown option. `value` is what's stored in state;
// `label` is what's shown to the user.
export interface FilterOption {
  label: string;
  value: string;
}

// Low-level, domain-agnostic dropdown — same reuse intent as SearchInput.
// The component knows nothing about "years" or "sheet types"; the caller
// decides what options mean.
interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  className?: string;
}

export function FilterSelect({ value, onChange, options, className }: FilterSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`rounded-md border border-stone-200 px-3 h-12 text-sm text-stone-600 bg-white outline-none transition focus:border-orange-600 ${className ?? ""}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export default FilterSelect;