"use client";

import React, { useEffect, useMemo, useState } from "react";
import { RodeoEvent, ResultEntry } from "@/types/rodeo";
import { getRodeoEvents, getAllResults } from "@/lib/sampleRodeoData";
import { RodeoEventCard } from "@/components/rodeo/RodeoEventCard";
import { ResultsPreview } from "@/components/rodeo/ResultsPreview";
import { EventFilterBar } from "@/components/rodeo/EventFilterBar";

export default function RodeoResultsPage() {
  // Raw data fetched from the data layer, unfiltered.
  const [events, setEvents] = useState<RodeoEvent[]>([]);
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Current filter selections, controlled here and passed down to
  // EventFilterBar. No sheet-type filter here — that only applies to draws.
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");

  useEffect(() => {
    Promise.all([getRodeoEvents(), getAllResults()]).then(([evts, res]) => {
      setEvents(evts);
      setResults(res);
      setLoading(false);
    });
  }, []);

  // Distinct years present in the data, newest first — feeds the year dropdown.
  const years = useMemo(
    () => Array.from(new Set(events.map((e) => e.year))).sort((a, b) => b - a),
    [events],
  );

  // Group results by event id so each card's preview can look up its own
  // rodeo's entries without re-scanning the full results list on every render.
  const resultsByEvent = useMemo(() => {
    const map = new Map<string, ResultEntry[]>();
    for (const entry of results) {
      const existing = map.get(entry.eventId) ?? [];
      existing.push(entry);
      map.set(entry.eventId, existing);
    }
    return map;
  }, [results]);

  // Events to render: matches the year and search filters, has at least one
  // result posted, sorted most recent first.
  const visibleEvents = useMemo(() => {
    return events
      .filter((e) => year === "all" || String(e.year) === year)
      .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
      .filter((e) => (resultsByEvent.get(e.id) ?? []).length > 0)
      .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
  }, [events, year, search, resultsByEvent]);

  if (loading) {
    return <p className="text-sm text-stone-400">Loading rodeo results...</p>;
  }

  // Tracks the last year header printed, so we only show "2026" / "2025" once
  // per group rather than on every card.
  let lastYear: number | null = null;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-semibold text-stone-950 mb-4">
        Rodeo Results
      </h1>

      {/* Filter bar is fully controlled — it just displays these values and
          reports changes back up via the on*Change callbacks. */}
      <EventFilterBar
        search={search}
        onSearchChange={setSearch}
        year={year}
        onYearChange={setYear}
        years={years}
      />

      {visibleEvents.length === 0 && (
        <p className="text-sm text-stone-400 py-6">No matching rodeos.</p>
      )}

      {visibleEvents.map((event) => {
        // Insert a year header whenever we cross into a new year while
        // iterating the already-sorted list.
        const showYearHeader = event.year !== lastYear;
        lastYear = event.year;
        return (
          <React.Fragment key={event.id}>
            {showYearHeader && (
              <div className="text-xs font-semibold text-stone-400 mt-5 mb-2">
                {event.year}
              </div>
            )}
            {/* RodeoEventCard is the shared shell (name/date/location
                header); ResultsPreview is the results-specific body —
                summary stats + a link through to the full results page. */}
            <RodeoEventCard event={event}>
              <ResultsPreview
                eventId={event.id}
                entries={resultsByEvent.get(event.id) ?? []}
              />
            </RodeoEventCard>
          </React.Fragment>
        );
      })}
    </div>
  );
}