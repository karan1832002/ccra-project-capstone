import React from "react";

// Low-level, domain-agnostic search box - same reuse intent as FilterSelect.
// Takes a value and reports changes back up, so it can be reused by
// any filter bar (rodeo events, shop filter, etc).
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({ value, onChange, placeholder, className }: SearchInputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? "Search"}
      className={`w-full rounded-md border border-stone-200 px-3 h-12 text-sm text-stone-600 placeholder-stone-400 outline-none transition focus:border-orange-600 ${className ?? ""}`}
    />
  );
}

export default SearchInput;