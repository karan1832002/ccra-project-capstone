"use client";

import React, { useEffect, useMemo, useState } from "react";
import { RodeoSummary } from "@/types/rodeo";
import { RodeoEventCard } from "@/components/rodeo/RodeoEventCard";
import { ResultsPreview } from "@/components/rodeo/ResultsPreview";
import { EventFilterBar } from "@/components/rodeo/EventFilterBar";
import Hero from "@/components/ui/Hero";
import { pageStructure } from "@/lib/styles";
import { getRodeos, getRodeo, getResults, Result } from "@/lib/gateway";

export default function RodeoResultsPage() {
  // Rodeo summaries displayed on the page and the associated result entries.
  const [rodeos, setRodeos] = useState<RodeoSummary[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  // Maps each event ID to its parent rodeo ID so results can be grouped by rodeo.
  const [eventToRodeo, setEventToRodeo] = useState<Map<string, string>>(
    new Map(),
  );

  // Filter controls.
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        // Load the list of rodeos, then retrieve full details for each.
        const rodeoList = await getRodeos();

        // Skip any rodeos that fail to load so the rest of the page can still render.
        const details = (
          await Promise.all(
            rodeoList.map(async (r) => {
              try {
                return await getRodeo(r.id);
              } catch (error) {
                console.error("Skipping failed rodeo:", r.rodeoTitle, error);
                return null;
              }
            }),
          )
        ).filter((r) => r !== null);

        // Build a lookup table linking each event to its parent rodeo.
        const eventMap = new Map<string, string>();

        details.forEach((rodeo) => {
          rodeo.events.forEach((event) => {
            eventMap.set(event.id, rodeo.id);
          });
        });

        // Load all recorded results.
        const results = await getResults();

        setEventToRodeo(eventMap);

        // Convert the backend rodeo data into the simplified format used by the UI.
        const summaries: RodeoSummary[] = details
          .filter((r) => r.dates.length > 0)
          .map((r) => {
            // Ensure dates are ordered so the first and last represent the rodeo span.
            const dates = r.dates.toSorted((a, b) =>
              a.date.localeCompare(b.date),
            );

            return {
              id: r.id,
              name: r.rodeoTitle,
              location: r.location,
              year: new Date(dates[0].date).getFullYear(),
              startDate: dates[0].date,
              endDate: dates[dates.length - 1].date,
            };
          });

        setRodeos(summaries);
        setResults(results);
      } catch (error) {
        console.error("Results page failed:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // Available years for the filter dropdown.
  const years = useMemo(
    () => Array.from(new Set(rodeos.map((e) => e.year))).sort((a, b) => b - a),
    [rodeos],
  );

  // Group all results by rodeo using the event-to-rodeo lookup table.
  const resultsByRodeo = useMemo(() => {
    const map = new Map<string, Result[]>();

    for (const result of results) {
      const rodeoId = eventToRodeo.get(result.eventId);

      // Ignore results that cannot be matched to a rodeo.
      if (!rodeoId) continue;

      const existing = map.get(rodeoId) ?? [];
      existing.push(result);
      map.set(rodeoId, existing);
    }

    return map;
  }, [results, eventToRodeo]);

  // Apply the search and year filters, then hide rodeos without posted results.
  const visibleRodeos = useMemo(() => {
    return rodeos
      .filter((e) => year === "all" || String(e.year) === year)
      .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
      .filter((e) => resultsByRodeo.has(e.id))
      .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
  }, [rodeos, year, search, resultsByRodeo]);

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
        <EventFilterBar
          search={search}
          onSearchChange={setSearch}
          year={year}
          onYearChange={setYear}
          years={years}
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
              <ResultsPreview
                rodeoId={rodeo.id}
                entries={resultsByRodeo.get(rodeo.id) ?? []}
              />
            </RodeoEventCard>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
