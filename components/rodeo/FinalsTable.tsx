/**
 * FinalsTable
 * -----------
 * Finals-specific body content for the CCRA Finals results page. Each
 * competition category gets its own table with one row per competitor,
 * showing their score and points from every go-round of the finals, plus
 * a Total (the sum of their round scores) and its own Points column, and a
 * Total Points column combining every round's points with the total's.
 *
 * The finals event's performances list is expected to contain the 4
 * go-round performances plus one additional performance (id ending in
 * "-avg") representing the overall average/aggregate placing across all 4
 * rounds. That performance's `points` is what populates the Points column
 * next to Total — those points come from the association's own scoring
 * once every round is in, not something this component derives itself.
 *
 * Used by:
 * - app/results/finals/page.tsx
 */

import React from "react";
import Table from "@/components/ui/Table";
import { ResultEntry, RodeoPerformance } from "@/types/rodeo";

interface FinalsTableProps {
  entries: ResultEntry[];
  // The finals event's own performances — used to figure out how many
  // go-rounds there are and to separate them from the average placing.
  performances: RodeoPerformance[];
}

function isAveragePerformance(performance: RodeoPerformance): boolean {
  return performance.id.endsWith("-avg");
}

// Rough stock events are scored (whole numbers), timed events have a time
// (fractional seconds) — only one of the two will be set on any given
// entry, and the same holds for a competitor's summed Total.
function formatTimeOrScore(value: number | undefined): string {
  if (value === undefined) return "-";
  return Number.isInteger(value) ? value.toString() : value.toFixed(3);
}

// One competitor's full finals record within a single category: their
// entry from each go-round (some may be missing if they scratched a
// round), plus their average/aggregate placing entry.
interface CompetitorRow {
  competitor: string;
  roundEntries: (ResultEntry | undefined)[]; // indexed to match `goRounds` order
  averageEntry: ResultEntry | undefined;
}

export function FinalsTable({ entries, performances }: FinalsTableProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-stone-400">No finals results posted yet.</p>;
  }

  // Split the finals performances into the ordered go-rounds and the
  // separate average/aggregate placing (see file comment above).
  const goRounds = performances
    .filter((p) => !isAveragePerformance(p))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
  const averagePerformance = performances.find(isAveragePerformance);
  const roundCount = goRounds.length;

  // Group entries by competition category, same as the other results pages.
  const entriesByCategory = new Map<string, ResultEntry[]>();
  for (const entry of entries) {
    const existing = entriesByCategory.get(entry.eventName) ?? [];
    existing.push(entry);
    entriesByCategory.set(entry.eventName, existing);
  }

  // Column order here must exactly match the row property insertion order
  // built below, since Table renders each row positionally via
  // Object.values(row).
  const columns = [
    "Competitor",
    ...goRounds.flatMap((_, i) => [`Round ${i + 1}`, "Points"]),
    "Total",
    "Points",
    "Total Points",
  ];

  return (
    <div className="space-y-8">
      {Array.from(entriesByCategory.entries()).map(([eventName, categoryEntries]) => {
        // Gather every competitor's entry for each round, plus their
        // average entry, into one row per competitor.
        const rowsByCompetitor = new Map<string, CompetitorRow>();
        for (const entry of categoryEntries) {
          const existing = rowsByCompetitor.get(entry.competitor) ?? {
            competitor: entry.competitor,
            roundEntries: new Array(roundCount).fill(undefined),
            averageEntry: undefined,
          };
          if (averagePerformance && entry.performanceId === averagePerformance.id) {
            existing.averageEntry = entry;
          } else {
            const roundIndex = goRounds.findIndex((p) => p.id === entry.performanceId);
            if (roundIndex !== -1) existing.roundEntries[roundIndex] = entry;
          }
          rowsByCompetitor.set(entry.competitor, existing);
        }

        // Rank by Total Points (every round's points plus the average
        // placing's points combined), highest first.
        const rows = Array.from(rowsByCompetitor.values()).sort((a, b) => {
          const totalPointsA =
            a.roundEntries.reduce((sum, e) => sum + (e?.points ?? 0), 0) + (a.averageEntry?.points ?? 0);
          const totalPointsB =
            b.roundEntries.reduce((sum, e) => sum + (e?.points ?? 0), 0) + (b.averageEntry?.points ?? 0);
          return totalPointsB - totalPointsA;
        });

        const data = rows.map((row) => {
          // Total is the sum of whichever round values are actually
          // present (a scratched round just doesn't contribute).
          const roundValues = row.roundEntries.map((e) => e?.time ?? e?.score);
          const hasAnyRoundValue = roundValues.some((v) => v !== undefined);
          const total = hasAnyRoundValue
            ? roundValues.reduce((sum: number, v) => sum + (v ?? 0), 0)
            : undefined;
          const roundPointsSum = row.roundEntries.reduce((sum, e) => sum + (e?.points ?? 0), 0);
          const averagePoints = row.averageEntry?.points ?? 0;
          const totalPoints = roundPointsSum + averagePoints;

          // Built as a plain object in the same key order as `columns`.
          const rowData: Record<string, React.ReactNode> = { competitor: row.competitor };
          row.roundEntries.forEach((entry, i) => {
            rowData[`round${i + 1}`] = formatTimeOrScore(entry?.time ?? entry?.score);
            rowData[`round${i + 1}Points`] = entry?.points ?? "-";
          });
          rowData.total = formatTimeOrScore(total);
          rowData.averagePoints = row.averageEntry ? row.averageEntry.points ?? "-" : "-";
          rowData.totalPoints = totalPoints;

          return rowData;
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

export default FinalsTable;