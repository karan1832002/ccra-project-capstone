/**
 * ResultsTable
 * ------------
 * Displays rodeo results grouped by competition category. Each category
 * receives its own table so results from different events are kept separate.
 *
 * Results are provided directly from the backend and already contain the
 * information needed for display, including event details, competitor
 * information, payouts, and points.
 */

import Table from "@/components/ui/Table";
import { TABLE_LAYOUTS } from "@/lib/tableLayouts";
import { Result } from "@/lib/gateway";

interface ResultsTableProps {
  // All result records belonging to the selected rodeo.
  entries: Result[];
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

// Formats an event time for display.
// Converts backend time values from "HH:mm:ss" format to "HH:mm".
function formatTime(time?: string | null): string {
  if (!time) return "-";
  return time.slice(0, 5);
}

// Converts a result's event date and time into a readable display format.
// Example: "Jul 21 @ 9 am".
function formatDateTimeLabel(entry: Result): string {
  const date = new Date(`${entry.eventDate}T00:00:00`);

  const dateLabel = date.toLocaleDateString("en-CA", {
    month: "short",
    day: "numeric",
  });

  return `${dateLabel} @ ${formatTime(entry.eventTime)}`;
}

export function ResultsTable({ entries }: ResultsTableProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-foreground">No results posted yet.</p>;
  }

  // Group results by competition category so each category receives
  // its own results table.
  const entriesByCategory = new Map<string, Result[]>();

  for (const entry of entries) {
    const category = entry.category ?? "Unknown Event";

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
    "Money",
    "Ground",
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
          const data = sortedEntries.map((entry) => ({
            dateTime: formatDateTimeLabel(entry),
            placing: entry.placement ?? "-",
            score: formatScore(entry),
            competitor: entry.competitorName ?? entry.competitorId,
            money: formatCurrency(entry.money),
            groundMoney: formatCurrency(entry.ground),
            points: entry.points ?? "-",
          }));

          return (
            <div key={eventName}>
              <h2 className="text-lg font-semibold text-heading mb-2">
                {eventName}
              </h2>

              <Table
                columns={columns}
                data={data}
                columnWidths={TABLE_LAYOUTS.results.columnWidths}
                wrapColumns={TABLE_LAYOUTS.results.wrapColumns}
                alignColumns={TABLE_LAYOUTS.results.alignColumns}
              />
            </div>
          );
        },
      )}
    </div>
  );
}

export default ResultsTable;
