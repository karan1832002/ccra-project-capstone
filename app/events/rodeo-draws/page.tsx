"use client";

import React, { useEffect, useMemo, useState } from "react";
import { RodeoEvent, SheetFile } from "@/types/rodeo";
import { getRodeoEvents, getAllSheetFiles } from "@/lib/sampleRodeoData";
import { RodeoEventCard } from "@/components/rodeo/RodeoEventCard";
import { DrawFileList } from "@/components/rodeo/DrawFileList";
import SearchAndFilterBar from "@/components/ui/SearchAndFilterBar";
import Hero from "@/components/ui/Hero";
import { pageStructure } from "@/lib/styles";

export default function RodeoDrawsPage() {
  // Raw data fetched from the data layer, unfiltered.
  const [events, setEvents] = useState<RodeoEvent[]>([]);
  const [files, setFiles] = useState<SheetFile[]>([]);
  const [loading, setLoading] = useState(true);

  // Current filter selections, controlled here and passed down to SearchAndFilterBar.
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

  // Distinct years present in the data, newest first — feeds the filter dropdown.
  const yearOptions = useMemo(
    () => [
      { label: "All Years", value: "all" },
      ...Array.from(new Set(events.map((e) => e.year)))
        .sort((a, b) => b - a)
        .map((year) => ({
          label: String(year),
          value: String(year),
        })),
    ],
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
    return <p className="text-sm text-stone-600">Loading draw sheets...</p>;
  }
  return (
    <div className={pageStructure.pageWrapper}>
      {/* Page Header */}
      <Hero
        badge="COMPETITION SCHEDULES"
        title="Rodeo Draws"
        description="View the official competition draws for upcoming CCRA rodeos. Find your event, check your position in the order, and prepare for your time in the arena."
      />

      <div className={pageStructure.contentContainer}>
        {/* Notice */}
        <section className="mb-8 rounded-xl border border-orange-200 bg-orange-50 shadow-sm">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-stone-900 mb-3">
              Important Call Back Instructions
            </h2>

            <p className="text-stone-700 leading-7">
              If you notice an issue with the draw (wrong event, missing entry,
              etc.), contact the office on <strong>Friday</strong> with your
              confirmation number. After Friday, the draw is final and cannot be
              changed.
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-8">
          <SearchAndFilterBar
            search={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search rodeos..."
            filterValue={year}
            onFilterChange={setYear}
            filterOptions={yearOptions}
            sheetType={sheetType}
            onSheetTypeChange={setSheetType}
            showTypeFilter
          />
        </section>

        {visibleEvents.length === 0 && (
          <p className="text-sm text-stone-600 py-6">
            No matching draw sheets.
          </p>
        )}

        {eventsWithYearHeaders.map(({ event, showYearHeader }) => (
          <React.Fragment key={event.id}>
            {showYearHeader && (
              <div className="text-xs font-semibold text-stone-600 mt-5 mb-2">
                {event.year}
              </div>
            )}
            <RodeoEventCard
              event={{
                ...event,
                endDate: event.startDate,
                location: event.location ?? "",
              }}
            >
              <DrawFileList files={filesByEvent.get(event.id) ?? []} />
            </RodeoEventCard>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
