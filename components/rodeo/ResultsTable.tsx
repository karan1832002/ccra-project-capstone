/**
 * ResultsTable
 * ------------
 * Displays a rodeo's results grouped by competition category. Each category
 * receives its own table so results from different events are kept separate.
 *
 * Results are provided from the backend and are matched with the rodeo's
 * events list to retrieve additional information such as event category,
 * date, and time.
 */

import React from "react";
import Table from "@/components/ui/Table";
import { Event, Result } from "@/lib/gateway";

interface ResultsTableProps {
  entries: Result[];

  // The events belonging to the current rodeo. Results only contain an
  // eventId, so this list is used to look up event details when displaying
  // category names and event date/time information.
  events: Event[];
}

// Formats monetary values using Canadian currency formatting.
// Returns "-" when no payout value exists.
export function formatCurrency(amount: number | null): string {
  if (amount == null) {
    return "-";
  }

  return amount.toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
  });
}

// Formats the event score when one exists.
// Some event types may not use a score, so empty values are handled safely.
function formatScore(entry: Result): string {
  return entry.score != null ? entry.score.toString() : "-";
}

// Converts an event date and time into a readable display format.
// Example: "Jul 21 @ 9 am".
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
    return <p className="text-sm text-foreground">No results posted yet.</p>;
  }

  // Create a lookup table so results can access their related event
  // information using eventId.
  const eventById = new Map(events.map((event) => [event.id, event]));

  // Group results by competition category so each category receives
  // its own results table.
  const entriesByCategory = new Map<string, Result[]>();

  for (const entry of entries) {
    const category = eventById.get(entry.eventId)?.category ?? "Unknown Event";

    const existing = entriesByCategory.get(category) ?? [];
    existing.push(entry);
    entriesByCategory.set(category, existing);
  }

  // Table columns must match the order of properties in each row object below.
  // The shared Table component renders row values positionally.
  const columns = [
    "Date & Time",
    "Placing",
    "Score",
    "Competitor",
    "Money $",
    "Ground $",
    "Points",
  ];

  return (
    <div className="space-y-8">
      {Array.from(entriesByCategory.entries()).map(
        ([eventName, categoryEntries]) => {
          // Display results in placing order, with unplaced entries moved
          // to the bottom of the table.
          const sortedEntries = [...categoryEntries].sort(
            (a, b) => (a.placement ?? 999) - (b.placement ?? 999),
          );

          // Convert backend results into the row format expected by the
          // shared Table component.
          const data = sortedEntries.map((entry) => {
            const event = eventById.get(entry.eventId);

            return {
              dateTime: event ? formatDateTimeLabel(event) : "-",
              placing: entry.placement ?? "-",
              score: formatScore(entry),
              competitor: entry.competitorName ?? entry.competitorId,
              money: formatCurrency(entry.money),
              groundMoney: formatCurrency(entry.ground),
              points: entry.points ?? "-",
            };
          });

          return (
            <div key={eventName}>
              <h2 className="text-lg font-semibold text-heading mb-2">
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