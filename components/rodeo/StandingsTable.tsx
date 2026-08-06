/**
 * StandingsTable
 * --------------
 * Displays season standings calculated from individual Result records.
 *
 * The component:
 * - Groups results by competition category
 * - Aggregates points earned by each competitor
 * - Tracks the number of unique events where a competitor earned points
 * - Ranks competitors within each category by total points
 *
 * Each competition category receives its own standings table.
 */

import Table from "@/components/ui/Table";
import { TABLE_LAYOUTS } from "@/lib/tableLayouts";
import { Result } from "@/lib/gateway";

interface StandingsTableProps {
  // All results used to calculate season standings.
  entries: Result[];
}

// Running season total for one competitor within one category.
interface CompetitorTotals {
  competitorId: string;
  competitorName: string;
  eventIds: Set<string>;
  points: number;
}

export function StandingsTable({ entries }: StandingsTableProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-foreground">No standings posted yet.</p>;
  }

  // Group results by competition category so each category receives
  // its own standings table.
  const entriesByCategory = new Map<string, Result[]>();

  for (const entry of entries) {
    const category = entry.category;

    const existing = entriesByCategory.get(category) ?? [];
    existing.push(entry);
    entriesByCategory.set(category, existing);
  }

  const columns = ["Rank", "Competitor", "Event Count", "Points"];

  return (
    <div className="space-y-8 w-full">
      {Array.from(entriesByCategory.entries()).map(
        ([category, categoryEntries]) => {
          /*
           * Combine all results for each competitor into one season total.
           *
           * competitorId is used as the grouping key because it uniquely
           * identifies the competitor. The displayed name comes from the
           * result's competitorName field.
           *
           * A competitor may have multiple results in the same category.
           * Points are added together, while eventIds are stored in a Set
           * so each event is only counted once toward Event Count.
           */
          const totalsByCompetitor = new Map<string, CompetitorTotals>();

          for (const entry of categoryEntries) {
            const existing = totalsByCompetitor.get(entry.competitorId) ?? {
              competitorId: entry.competitorId,
              competitorName: entry.competitorName ?? entry.competitorId,
              eventIds: new Set<string>(),
              points: 0,
            };

            // Track unique events where this competitor earned points.
            existing.eventIds.add(entry.eventId);

            // Add this result's points to their season total.
            existing.points += entry.points ?? 0;

            totalsByCompetitor.set(entry.competitorId, existing);
          }

          // Rank competitors by total points, highest first.
          const ranked = Array.from(totalsByCompetitor.values()).sort(
            (a, b) => b.points - a.points,
          );

          /*
           * Convert the aggregated competitor totals into the format expected
           * by the reusable Table component.
           *
           * Property order must match the columns array because Table renders
           * row values using Object.values().
           */
          const data = ranked.map((competitor, index) => ({
            rank: index + 1,
            competitor: competitor.competitorName,
            eventCount: competitor.eventIds.size,
            points: competitor.points,
          }));

          return (
            <div key={category} className="w-full max-w-6xl">
              <h2 className="text-xl font-bold text-heading mb-4">
                {category}
              </h2>

              <Table
                columns={columns}
                data={data}
                columnWidths={TABLE_LAYOUTS.standings.columnWidths}
                wrapColumns={TABLE_LAYOUTS.standings.wrapColumns}
                alignColumns={TABLE_LAYOUTS.standings.alignColumns}
              />
            </div>
          );
        },
      )}
    </div>
  );
}

export default StandingsTable;
