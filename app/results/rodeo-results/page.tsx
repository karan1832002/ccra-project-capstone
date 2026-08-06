"use client";

import React, { useEffect, useMemo, useState } from "react";
import { RodeoEventCard } from "@/components/rodeo/RodeoEventCard";
import { ResultsPreview } from "@/components/rodeo/ResultsPreview";
import SearchAndFilterBar from "@/components/ui/SearchAndFilterBar";
import Hero from "@/components/ui/Hero";
import { pageStructure } from "@/lib/styles";
import { getResults, Result } from "@/lib/gateway";

export default function RodeoResultsPage() {
  // All results loaded from the backend. Rodeo summaries are derived from
  // this data rather than loaded separately.
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter controls.
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        // Load all posted results. Each result already contains its associated
        // rodeo information, allowing the page to build its own rodeo summaries.
        const results = await getResults();
        setResults(results);
      } catch (error) {
        console.error("Results page failed:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // Group results by rodeo while building the summary information needed
  // to render each rodeo card. Each map entry contains the rodeo details
  // along with every result belonging to that rodeo.
  const rodeoMap = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        name: string;
        location: string;
        year: number;
        startDate: string;
        endDate: string;
        results: Result[];
      }
    >();

    for (const result of results) {
      const existing = map.get(result.rodeoId);

      if (existing) {
        // Update the existing rodeo summary with this additional result.
        existing.results.push(result);

        if (result.eventDate < existing.startDate) {
          existing.startDate = result.eventDate;
        }

        if (result.eventDate > existing.endDate) {
          existing.endDate = result.eventDate;
        }

        continue;
      }

      // First result encountered for this rodeo. Initialize the summary.
      map.set(result.rodeoId, {
        id: result.rodeoId,
        name: result.rodeoTitle,
        location: result.rodeoLocation,
        year: new Date(result.eventDate).getFullYear(),
        startDate: result.eventDate,
        endDate: result.eventDate,
        results: [result],
      });
    }

    return map;
  }, [results]);

  // Build the year filter options from the loaded rodeo summaries.
  const yearOptions = useMemo(
    () => [
      { label: "All Years", value: "all" },
      ...Array.from(new Set(Array.from(rodeoMap.values()).map((r) => r.year)))
        .sort((a, b) => b - a)
        .map((year) => ({
          label: String(year),
          value: String(year),
        })),
    ],
    [rodeoMap],
  );

  // Apply the selected year and search filters, then sort rodeos from
  // newest to oldest.
  const visibleRodeos = useMemo(() => {
    return Array.from(rodeoMap.values())
      .filter((r) => year === "all" || String(r.year) === year)
      .filter((r) => r.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
  }, [rodeoMap, year, search]);

  // Insert a year heading before the first rodeo of each season.
  const rodeosWithYearHeaders = useMemo(
    () =>
      visibleRodeos.map((event, i) => ({
        event,
        showYearHeader: i === 0 || event.year !== visibleRodeos[i - 1].year,
      })),
    [visibleRodeos],
  );

  if (loading) {
    return <p className="text-sm text-stone-400">Loading rodeo results...</p>;
  }

  return (
    <div className={pageStructure.pageWrapper}>
      {/* HEADING */}
      <Hero
        badge="OFFICIAL RESULTS"
        title="Rodeo Results"
        description="Review results from completed rodeos, including event standings and competitor performances. Select a rodeo to view the full results breakdown."
      />

      <div className={pageStructure.contentContainer}>
        <SearchAndFilterBar
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search rodeos..."
          filterValue={year}
          onFilterChange={setYear}
          filterOptions={yearOptions}
        />

        {visibleRodeos.length === 0 && (
          <p className="text-sm text-stone-400 py-6">No matching rodeos.</p>
        )}

        {rodeosWithYearHeaders.map(({ event: rodeo, showYearHeader }) => (
          <React.Fragment key={rodeo.id}>
            {showYearHeader && (
              <div className="text-xs font-semibold text-stone-400 mt-5 mb-2">
                {rodeo.year}
              </div>
            )}
            <RodeoEventCard event={rodeo}>
              <ResultsPreview rodeoId={rodeo.id} entries={rodeo.results} />
            </RodeoEventCard>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
