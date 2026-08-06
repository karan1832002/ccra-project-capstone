/**
 * SearchAndFilterBar
 * ------------------
 * Reusable search + filter controls for collection pages.
 *
 * Holds no state — the parent owns filter values and handlers.
 * Renders a SearchInput, primary FilterSelect, and an optional
 * secondary document-type filter.
 */

import React from "react";
import SearchInput from "@/components/ui/SearchInput";
import FilterSelect from "@/components/ui/FilterSelect";

interface SearchAndFilterBarProps {
  // Search
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;

  // Primary dropdown filter
  filterValue: string;
  onFilterChange: (value: string) => void;
  filterOptions: { label: string; value: string }[];

  // Optional secondary filter (used on Draws page)
  sheetType?: string;
  onSheetTypeChange?: (value: string) => void;
  showTypeFilter?: boolean;
}

export default function SearchAndFilterBar({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterValue,
  onFilterChange,
  filterOptions,
  sheetType,
  onSheetTypeChange,
  showTypeFilter = false,
}: SearchAndFilterBarProps) {
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
          placeholder={searchPlaceholder}
        />
      </div>
      <FilterSelect
        value={filterValue}
        onChange={onFilterChange}
        options={filterOptions}
      />
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
