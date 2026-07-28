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
    Promise.all([getRodeoEvents(), getAllSheetFiles()]).then(
      ([evts, sheetFiles]) => {
        setEvents(evts);
        setFiles(sheetFiles);
        setLoading(false);
      },
    );
  }, []);

  // Distinct years present in the data, newest first — feeds the year dropdown.
  const years = useMemo(
    () => Array.from(new Set(events.map((e) => e.year))).sort((a, b) => b - a),
    [events],
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

  // Tag each event with whether it starts a new year group. Compare each
  // event to the previous one in the sorted list — no variable tracking.
  const eventsWithYearHeaders = useMemo(
    () =>
      visibleEvents.map((event, i) => ({
        event,
        showYearHeader: i === 0 || event.year !== visibleEvents[i - 1].year,
      })),
    [visibleEvents],
  );

  if (loading) {
    return <p className="text-sm text-stone-400">Loading draw sheets...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-semibold text-stone-950 mb-4">
        Rodeo Draws
      </h1>

      {/* Callback Notice */}
    <div className="rounded-md border border-stone-200 bg-orange-50 p-6 shadow-sm mb-6">
      <h2 className="text-xl font-semibold text-stone-950 mb-2">
        Important Call Back Instructions
      </h2>
      <p className="text-sm text-stone-600">
        If you notice an issue with the draw (wrong event, missing entry, etc.), contact the office on Friday with your
        confirmation number. After Friday, the draw is final and cannot be changed.
      </p>
    </div>

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
        <p className="text-sm text-stone-400 py-6">No matching draw sheets.</p>
      )}

      {eventsWithYearHeaders.map(({ event, showYearHeader }) => (
        <React.Fragment key={event.id}>
          {showYearHeader && (
            <div className="text-xs font-semibold text-stone-400 mt-5 mb-2">
              {event.year}
            </div>
          )}
          <RodeoEventCard event={event}>
            <DrawFileList files={filesByEvent.get(event.id) ?? []} />
          </RodeoEventCard>
        </React.Fragment>
      ))}
    </div>
  );
}
