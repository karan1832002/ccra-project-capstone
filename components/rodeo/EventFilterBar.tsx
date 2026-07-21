import React from "react";
import SearchInput from "@/components/SearchInput";
import FilterSelect from "@/components/FilterSelect";

interface EventFilterBarProps {
  // All values and change handlers are passed in — this component holds no
  // state of its own. The parent page owns the filter state and decides what
  // "search"/"year"/"sheetType" mean for its own data.
  search: string;
  onSearchChange: (value: string) => void;
  year: string;
  onYearChange: (value: string) => void;
  years: number[];
  sheetType?: string;
  onSheetTypeChange?: (value: string) => void;
  // The results page can reuse this bar with showTypeFilter left off, since
  // "draw vs day" doesn't apply to results.
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