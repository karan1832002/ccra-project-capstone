/**
 * ResultsTable
 * ------------
 * Results-specific body content for the results detail page. Splits a
 * rodeo's results into one Table per competition category (e.g. "Ladies
 * Barrel Racing 40-59", "Team Roping 60+"), rather than one giant table
 * mixing every category's rows together. Within each category, rows are
 * sorted by performance date first, then by placing — matching how the
 * association's own results pages are ordered.
 */

import React from "react";
import Table from "@/components/ui/Table";
// import { ResultEntry, RodeoPerformance } from "@/types/rodeo";
import { Event, Result } from "@/lib/gateway";

interface ResultsTableProps {
  entries: Result[];
  // The rodeo's own list of performances, used to look up a date/time label
  // for entry.performanceId and to sort each category's rows by date.
  events: Event[];
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-CA", { style: "currency", currency: "CAD" });
}

// Rough stock events are scored (score), timed events have a time — only one
// of the two will be set on any given entry.
function formatTimeOrScore(entry: Result): string {
  if (entry.timeSeconds != null) {
    return entry.timeSeconds.toFixed(3);
  }

  if (entry.score != null) {
    return entry.score.toString();
  }

  return "-";
}

// Turns a performance's ISO date and display time into a short label,
// e.g. "Jul 21 @ 9 am".
function formatDateTimeLabel(event: Event): string {
  const date = new Date(`${event.eventDate}T00:00:00`);

  const dateLabel = date.toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
  });

  return `${dateLabel} @ ${event.eventTime}`;
}

export function ResultsTable({ entries, events }: ResultsTableProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-stone-400">No results posted yet.</p>;
  }

  // Quick lookup from a performance id to its full record — used both to
  // sort each category's rows by date and to render the date/time label.
  const eventById = new Map(events.map((event) => [event.id, event]));

  // Group entries by competition category so each one gets its own table.
  const entriesByCategory = new Map<string, Result[]>();

  for (const entry of entries) {
    const category = eventById.get(entry.eventId)?.category ?? "Unknown Event";

    const existing = entriesByCategory.get(category) ?? [];
    existing.push(entry);
    entriesByCategory.set(category, existing);
  }

  const columns = [
    "Date & Time",
    "Placing",
    "Time / Score",
    "Competitor",
    "Money $",
    "Ground $",
    "Points",
  ];

  return (
    <div className="space-y-8">
      {Array.from(entriesByCategory.entries()).map(
        ([eventName, categoryEntries]) => {
          // Sort by performance date first, then by placing within that date —
          // matches the order results are posted in on the association's site.
          const sortedEntries = [...categoryEntries].sort(
            (a, b) => (a.placement ?? 999) - (b.placement ?? 999),
          );

          // Property insertion order here must mirror `columns` above, since
          // Table renders each row positionally via Object.values(row).
          const data = sortedEntries.map((entry) => {
            const event = eventById.get(entry.eventId);

            return {
              dateTime: event ? formatDateTimeLabel(event) : "-",
              placing: entry.placement ?? "-",
              timeOrScore: formatTimeOrScore(entry),
              competitor: entry.userId,
              money: formatCurrency(entry.money),
              groundMoney: formatCurrency(entry.ground),
              points: entry.points ?? "-",
            };
          });

          return (
            <div key={eventName}>
              <h2 className="text-lg font-semibold text-stone-900 mb-2">
                {eventName}
              </h2>
              <Table columns={columns} data={data} />
            </div>
          );
        },
      )}
    </div>
  );
}

export default ResultsTable;
