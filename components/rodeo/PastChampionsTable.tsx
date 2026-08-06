/**
 * PastChampionsTable
 * ------------------
 * Displays the season champion for every competition category.
 *
 * Champions are determined by:
 *  - grouping results by category
 *  - grouping those results by season (calendar year)
 *  - totaling points earned by each competitor
 *  - selecting the competitor with the highest point total
 *
 * Each category receives its own table containing one champion per season.
 */

import Table from "@/components/ui/Table";
import { TABLE_LAYOUTS } from "@/lib/tableLayouts";
import { Result } from "@/lib/gateway";

interface PastChampionsTableProps {
  entries: Result[];
}

interface CompetitorTotals {
  competitorId: string;
  competitorName: string;
  eventIds: Set<string>;
  points: number;
}

export default function PastChampionsTable({
  entries,
}: PastChampionsTableProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-foreground">No champions available.</p>;
  }

  // Group all results by category.
  const entriesByCategory = new Map<string, Result[]>();

  for (const entry of entries) {
    const existing = entriesByCategory.get(entry.category) ?? [];
    existing.push(entry);
    entriesByCategory.set(entry.category, existing);
  }

  const columns = ["Year", "Champion", "Event Count", "Points"];

  return (
    <div className="space-y-8 w-full">
      {Array.from(entriesByCategory.entries()).map(
        ([category, categoryEntries]) => {
          // Group category results into seasons.
          const entriesByYear = new Map<number, Result[]>();

          for (const entry of categoryEntries) {
            const year = new Date(entry.eventDate).getFullYear();

            const existing = entriesByYear.get(year) ?? [];
            existing.push(entry);
            entriesByYear.set(year, existing);
          }

          // Determine the champion for each season.
          const champions = Array.from(entriesByYear.entries())
            .map(([year, seasonEntries]) => {
              const totalsByCompetitor = new Map<string, CompetitorTotals>();

              for (const entry of seasonEntries) {
                const existing = totalsByCompetitor.get(entry.competitorId) ?? {
                  competitorId: entry.competitorId,
                  competitorName: entry.competitorName ?? entry.competitorId,
                  eventIds: new Set<string>(),
                  points: 0,
                };

                existing.eventIds.add(entry.eventId);
                existing.points += entry.points ?? 0;

                totalsByCompetitor.set(entry.competitorId, existing);
              }

              const ranked = Array.from(totalsByCompetitor.values()).sort(
                (a, b) => b.points - a.points,
              );

              return {
                year,
                champion: ranked[0],
              };
            })
            .sort((a, b) => b.year - a.year);

          const data = champions.map(({ year, champion }) => ({
            year,
            champion: champion.competitorName,
            eventCount: champion.eventIds.size,
            points: champion.points,
          }));

          return (
            <div key={category} className="w-full max-w-6xl">
              <h2 className="text-xl font-bold text-heading mb-4">
                {category}
              </h2>

              <Table
                columns={columns}
                data={data}
                columnWidths={TABLE_LAYOUTS.pastChampions.columnWidths}
                wrapColumns={TABLE_LAYOUTS.pastChampions.wrapColumns}
                alignColumns={TABLE_LAYOUTS.pastChampions.alignColumns}
              />
            </div>
          );
        },
      )}
    </div>
  );
}
