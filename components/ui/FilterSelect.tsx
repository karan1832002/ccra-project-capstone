/**
 * FilterSelect
 * ------------
 * A plain, domain-agnostic dropdown. Doesn't know what "years" or "sheet
 * types" mean — the caller supplies `options` and decides what the value
 * represents. Same reuse intent as SearchInput.
 *
 * Used by:
 * - components/rodeo/EventFilterBar.tsx
 */

import React from "react";

// A single dropdown option. `value` is what's stored in state;
// `label` is what's shown to the user.
export interface FilterOption {
  label: string;
  value: string;
}

// Controlled dropdown props. `value`/`onChange` follow the standard
// controlled-input pattern; `className` lets callers tweak sizing per use.
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
      className={`rounded-md border border-border px-3 h-12 text-sm text-foreground bg-surface outline-none transition focus:border-primary ${className ?? ""}`}
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