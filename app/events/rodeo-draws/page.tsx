"use client";

import React, { useEffect, useMemo, useState } from "react";
import { RodeoEvent, SheetFile } from "@/types/rodeo";
import { getRodeoEvents, getAllSheetFiles } from "@/lib/sampleRodeoData";
import { RodeoEventCard } from "@/components/rodeo/RodeoEventCard";
import { DrawFileList } from "@/components/rodeo/DrawFileList";
import { EventFilterBar } from "@/components/rodeo/EventFilterBar";

export default function RodeoDrawsPage() {
  // Raw data fetched from the data layer, unfiltered.
  const [events, setEvents] = useState<RodeoEvent[]>([]);
  const [files, setFiles] = useState<SheetFile[]>([]);
  const [loading, setLoading] = useState(true);

  // Current filter selections, controlled here and passed down to EventFilterBar.
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");
  const [sheetType, setSheetType] = useState("all");

  // Fetch events and files once on mount. Swapping sampleRodeoData for a real
  // database later means this effect keeps working unchanged, since both
  // functions already return Promises.
  useEffect(() => {
    Promise.all([getRodeoEvents(), getAllSheetFiles()]).then(([evts, sheetFiles]) => {
      setEvents(evts);
      setFiles(sheetFiles);
      setLoading(false);
    });
  }, []);

  // Distinct years present in the data, newest first — feeds the year dropdown.
  const years = useMemo(
    () => Array.from(new Set(events.map((e) => e.year))).sort((a, b) => b - a),
    [events]
  );

  // Group sheet files by event id, applying the document-type filter (draw/day)
  // along the way. Recomputes only when files or sheetType change.
  const filesByEvent = useMemo(() => {
    const map = new Map<string, SheetFile[]>();
    for (const file of files) {
      if (sheetType !== "all" && file.type !== sheetType) continue;
      const existing = map.get(file.eventId) ?? [];
      existing.push(file);
      map.set(file.eventId, existing);
    }
    return map;
  }, [files, sheetType]);

  // Events to actually render: matches the year and search filters, has at
  // least one file left after the type filter, sorted most recent first.
  const visibleEvents = useMemo(() => {
    return events
      .filter((e) => year === "all" || String(e.year) === year)
      .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
      .filter((e) => (filesByEvent.get(e.id) ?? []).length > 0)
      .sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
  }, [events, year, search, filesByEvent]);

  if (loading) {
    return <p className="text-sm text-gray-400">Loading draw sheets...</p>;
  }

  // Tracks the last year header printed, so we only show "2026" / "2025" once
  // per group rather than on every card.
  let lastYear: number | null = null;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">Rodeo Draws</h1>

      {/* Filter bar is fully controlled — it just displays these values and
          reports changes back up via the on*Change callbacks. */}
      <EventFilterBar
        search={search}
        onSearchChange={setSearch}
        year={year}
        onYearChange={setYear}
        years={years}
        sheetType={sheetType}
        onSheetTypeChange={setSheetType}
        showTypeFilter
      />

      {visibleEvents.length === 0 && (
        <p className="text-sm text-gray-400 py-6">No matching draw sheets.</p>
      )}

      {visibleEvents.map((event) => {
        // Insert a year header whenever we cross into a new year while
        // iterating the already-sorted list.
        const showYearHeader = event.year !== lastYear;
        lastYear = event.year;
        return (
          <React.Fragment key={event.id}>
            {showYearHeader && (
              <div className="text-sm font-medium text-gray-400 mt-5 mb-2">{event.year}</div>
            )}
            {/* RodeoEventCard is the shared shell (name/date header + card
                styling); DrawFileList is the draws-specific body content. */}
            <RodeoEventCard event={event}>
              <DrawFileList files={filesByEvent.get(event.id) ?? []} />
            </RodeoEventCard>
          </React.Fragment>
        );
      })}
    </div>
  );
}