"use client";

import SearchInput from "@/components/ui/SearchInput";
import FilterSelect from "@/components/ui/FilterSelect";

type ShopFilterBarProps = {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  categories: string[];
};

export default function ShopFilterBar({
  search,
  setSearch,
  category,
  setCategory,
  categories,
}: ShopFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center w-full">
      {/* Search Bar */}
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
        className="w-full"
      />

      {/* Category Filter */}
      <FilterSelect
        value={category}
        onChange={setCategory}
        options={[
          { label: "All Categories", value: "" },
          ...categories.map((c) => ({
            label: c,
            value: c,
          })),
        ]}
        className="w-full md:w-48"
      />
    </div>
  );
}
