"use client";

import { useEffect, useState, useMemo } from "react";
import StandingsTable from "@/components/rodeo/StandingsTable";
import Hero from "@/components/ui/Hero";
import SearchAndFilterBar from "@/components/ui/SearchAndFilterBar";
import { pageStructure } from "@/lib/styles";
import { getResults, Result } from "@/lib/gateway";

export default function RodeoStandingsPage() {
  // All results used to calculate season standings.
  const [entries, setEntries] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // Currently selected event category filter.
  const [category, setCategory] = useState("all");

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        // Load every result for the current season.
        const results = await getResults();

        setEntries(results);
      } catch (error) {
        console.error("Failed to load standings:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // Build the category dropdown options from the loaded results.
  // The "all" option displays standings from every category.
  const categoryOptions = useMemo(() => {
    const categories = Array.from(
      new Set(entries.map((e) => e.category)),
    ).sort();

    return [
      { label: "All Categories", value: "all" },
      ...categories.map((category) => ({
        label: category,
        value: category,
      })),
    ];
  }, [entries]);

  // Apply the selected category filter.
  const filteredEntries = useMemo(() => {
    return entries
      .filter((e) => category === "all" || e.category === category)
      .filter((e) =>
        e.competitorName?.toLowerCase().includes(search.toLowerCase()),
      );
  }, [entries, category, search]);

  if (loading) {
    return (
      <div className="w-full py-8 px-4">
        <p className="text-sm text-caption-text">Loading standings...</p>
      </div>
    );
  }

  return (
    <div className={pageStructure.pageWrapper}>
      {/* HEADING */}
      <Hero
        badge="SEASON STANDINGS"
        title="Standings"
        description="View current CCRA standings and track competitor rankings throughout the season. Follow points earned across all rodeo events as athletes compete for the top spots."
      />

      <div className={pageStructure.contentContainer}>
        <div className="mx-auto max-w-3xl">
          {/* SEARCH + FILTER BAR */}
          <SearchAndFilterBar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search competitors..."
            filterValue={category}
            onFilterChange={setCategory}
            filterOptions={categoryOptions}
          />

          {/* NO RESULTS */}
          {filteredEntries.length === 0 && (
            <p className="text-sm text-body-text py-6 text-center">
              No standings found.
            </p>
          )}

          {/* STANDINGS TABLE */}
          {filteredEntries.length > 0 && (
            <StandingsTable entries={filteredEntries} />
          )}
        </div>
      </div>
    </div>
  );
}
