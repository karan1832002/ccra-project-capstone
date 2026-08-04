"use client";

import React, { useEffect, useMemo, useState } from "react";
import { RodeoEvent, ResultEntry } from "@/types/rodeo";
import { getRodeoEvents, getAllResults } from "@/lib/sampleRodeoData";
import { RodeoEventCard } from "@/components/rodeo/RodeoEventCard";
import { ResultsPreview } from "@/components/rodeo/ResultsPreview";
import { EventFilterBar } from "@/components/rodeo/EventFilterBar";
import Hero from "@/components/ui/Hero";
import { pageStructure } from "@/lib/styles";

export default function RodeoResultsPage() {
  const [events, setEvents] = useState<RodeoEvent[]>([]);
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");

  useEffect(() => {
    Promise.all([getRodeoEvents(), getAllResults()]).then(([evts, res]) => {
      setEvents(evts);
      setResults(res);
      setLoading(false);
    });
  }, []);

  const years = useMemo(
    () => Array.from(new Set(events.map((e) => e.year))).sort((a, b) => b - a),
    [events],
  );

  const resultsByEvent = useMemo(() => {
    const map = new Map<string, ResultEntry[]>();
    for (const entry of results) {
      const existing = map.get(entry.eventId) ?? [];
      existing.push(entry);
      map.set(entry.eventId, existing);
    }
    return map;
  }, [results]);

  const visibleEvents = useMemo(() => {
    return events
      .filter((e) => year === "all" || String(e.year) === year)
      .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
      .filter((e) => (resultsByEvent.get(e.id) ?? []).length > 0)
      .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
  }, [events, year, search, resultsByEvent]);

  const eventsWithYearHeaders = useMemo(
    () =>
      visibleEvents.map((event, i) => ({
        event,
        showYearHeader: i === 0 || event.year !== visibleEvents[i - 1].year,
      })),
    [visibleEvents],
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

        {visibleEvents.length === 0 && (
          <p className="text-sm text-stone-400 py-6">No matching rodeos.</p>
        )}

        {eventsWithYearHeaders.map(({ event, showYearHeader }) => (
          <React.Fragment key={event.id}>
            {showYearHeader && (
              <div className="text-xs font-semibold text-stone-400 mt-5 mb-2">
                {event.year}
              </div>
            )}
            <RodeoEventCard event={event}>
              <ResultsPreview
                eventId={event.id}
                entries={resultsByEvent.get(event.id) ?? []}
              />
            </RodeoEventCard>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
