"use client";

import { useEffect, useState, useMemo } from "react";
import StandingsTable from "@/components/rodeo/StandingsTable";
import Hero from "@/components/ui/Hero";
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
  const categories = useMemo(() => {
    const set = new Set(entries.map((e) => e.category));
    return ["all", ...Array.from(set)];
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
        <p className="text-sm text-muted-foreground">Loading standings...</p>
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
        {/* SEARCH + FILTER BAR */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search competitor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 rounded-md border border-border px-4 py-2"
          />

          {/* Category selector filters standings by competition type. */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full md:w-1/2 rounded-md border border-border px-4 py-2"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>

        {/* NO RESULTS */}
        {filteredEntries.length === 0 && (
          <p className="text-sm text-foreground py-6 text-center">
            No standings found.
          </p>
        )}

        {/* STANDINGS TABLE */}
        {filteredEntries.length > 0 && (
          <StandingsTable entries={filteredEntries} />
        )}
      </div>
    </div>
  );
}
