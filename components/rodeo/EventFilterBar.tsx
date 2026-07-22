/**
 * EventFilterBar
 * --------------
 * The search + year (+ optional sheet-type) filter row shown above a list of
 * rodeo events. Holds no state itself — the parent page owns all filter
 * values and change handlers, so this component is just a layout of
 * SearchInput + FilterSelect.
 *
 * The sheet-type filter ("Draw sheets" / "Day sheets") is opt-in via
 * `showTypeFilter`, since it only makes sense on the draws page — the
 * results page reuses this bar without it.
 */

import React from "react";
import SearchInput from "@/components/ui/SearchInput";
import FilterSelect from "@/components/ui/FilterSelect";

interface EventFilterBarProps {
  // Owned by the parent page — see file comment above.
  search: string;
  onSearchChange: (value: string) => void;
  year: string;
  onYearChange: (value: string) => void;
  years: number[];
  sheetType?: string;
  onSheetTypeChange?: (value: string) => void;
  // Opt-in — see file comment above.
  showTypeFilter?: boolean;
}

export function EventFilterBar({
  search,
  onSearchChange,
  year,
  onYearChange,
  years,
  sheetType,
  onSheetTypeChange,
  showTypeFilter = false,
}: EventFilterBarProps) {
  const yearOptions = [
    { label: "All years", value: "all" },
    ...years.map((y) => ({ label: String(y), value: String(y) })),
  ];

  const typeOptions = [
    { label: "All documents", value: "all" },
    { label: "Draw sheets", value: "draw" },
    { label: "Day sheets", value: "day" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <div className="flex-1 min-w-[200px]">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          placeholder="Search by rodeo name"
        />
      </div>
      <FilterSelect value={year} onChange={onYearChange} options={yearOptions} className="min-w-[110px]" />
      {showTypeFilter && onSheetTypeChange && (
        <FilterSelect
          value={sheetType ?? "all"}
          onChange={onSheetTypeChange}
          options={typeOptions}
          className="min-w-[140px]"
        />
      )}
    </div>
  );
}

export default EventFilterBar;