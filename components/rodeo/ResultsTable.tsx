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
import { ResultEntry, RodeoPerformance } from "@/types/rodeo";

interface ResultsTableProps {
  entries: ResultEntry[];
  // The rodeo's own list of performances, used to look up a date/time label
  // for entry.performanceId and to sort each category's rows by date.
  performances: RodeoPerformance[];
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-CA", { style: "currency", currency: "CAD" });
}

// Rough stock events are scored (score), timed events have a time — only one
// of the two will be set on any given entry.
function formatTimeOrScore(entry: ResultEntry): string {
  if (entry.time !== undefined) return entry.time.toFixed(3);
  if (entry.score !== undefined) return entry.score.toString();
  return "-";
}

// Turns a performance's ISO date and display time into a short label,
// e.g. "Jul 21 @ 9 am".
function formatDateTimeLabel(performance: RodeoPerformance): string {
  const date = new Date(`${performance.date}T00:00:00`);
  const dateLabel = date.toLocaleDateString("en-CA", { month: "short", day: "numeric" });
  return `${dateLabel} @ ${performance.time}`;
}

export function ResultsTable({ entries, performances }: ResultsTableProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-stone-400">No results posted yet.</p>;
  }

  // Quick lookup from a performance id to its full record — used both to
  // sort each category's rows by date and to render the date/time label.
  const performanceById = new Map(performances.map((performance) => [performance.id, performance]));

  // Group entries by competition category so each one gets its own table.
  const entriesByCategory = new Map<string, ResultEntry[]>();
  for (const entry of entries) {
    const existing = entriesByCategory.get(entry.eventName) ?? [];
    existing.push(entry);
    entriesByCategory.set(entry.eventName, existing);
  }

  const columns = ["Date & Time", "Placing", "Time / Score", "Competitor", "Partner", "Money $", "Ground $", "Points"];

  return (
    <div className="space-y-8">
      {Array.from(entriesByCategory.entries()).map(([eventName, categoryEntries]) => {
        // Sort by performance date first, then by placing within that date —
        // matches the order results are posted in on the association's site.
        const sortedEntries = [...categoryEntries].sort((a, b) => {
          const dateA = performanceById.get(a.performanceId)?.date ?? "";
          const dateB = performanceById.get(b.performanceId)?.date ?? "";
          if (dateA !== dateB) return dateA < dateB ? -1 : 1;
          return a.placing - b.placing;
        });

        // Property insertion order here must mirror `columns` above, since
        // Table renders each row positionally via Object.values(row).
        const data = sortedEntries.map((entry) => {
          const performance = performanceById.get(entry.performanceId);
          return {
            dateTime: performance ? formatDateTimeLabel(performance) : "-",
            placing: entry.placing,
            timeOrScore: formatTimeOrScore(entry),
            competitor: entry.competitor,
            partner: entry.partner ?? "-",
            money: formatCurrency(entry.money),
            groundMoney: formatCurrency(entry.groundMoney),
            points: entry.points ?? "-",
          };
        });

        return (
          <div key={eventName}>
            <h2 className="text-lg font-semibold text-stone-900 mb-2">{eventName}</h2>
            <Table columns={columns} data={data} />
          </div>
        );
      })}
    </div>
  );
}

export default ResultsTable;