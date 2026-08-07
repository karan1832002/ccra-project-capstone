/**
 * SearchInput
 * -----------
 * A plain, domain-agnostic search box. Knows nothing about what it's
 * searching — just takes a value and reports changes back up via onChange.
 * Same reuse intent as FilterSelect: any filter bar (rodeo events, shop, etc.)
 * can compose it without this component knowing about that context.
 *
 * Used by:
 * - components/rodeo/EventFilterBar.tsx
 */

import React from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder,
  className,
}: SearchInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? "Search"}
      className={`w-full rounded-md border border-border px-3 h-12 text-sm text-foreground bg-surface placeholder-muted-foreground outline-none transition focus:border-primary ${className ?? ""}`}
    />
  );
}

export default SearchInput;
