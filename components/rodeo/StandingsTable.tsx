/**
 * StandingsTable
 * --------------
 * Standings-specific body content for the standings page. Aggregates a
 * season's worth of ResultEntry rows into one ranked Table per competition
 * category (the same per-category grouping ResultsTable uses), except each
 * row here represents a competitor's season totals rather than a single
 * placing.
 */

import React from "react";
import Table from "@/components/ui/Table";
import { ResultEntry } from "@/types/rodeo";

interface StandingsTableProps {
  // Every result from every *completed* rodeo this season — the page is
  // responsible for filtering out results from rodeos that haven't
  // happened yet before passing entries in.
  entries: ResultEntry[];
}

// Running total for one competitor within one category, before ranking.
interface CompetitorTotals {
  competitor: string;
  rodeoIds: Set<string>; // distinct rodeos they've placed at — size gives Rodeo Count
  points: number;
}

export function StandingsTable({ entries }: StandingsTableProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-stone-400">No standings posted yet.</p>;
  }

  // Group entries by competition category so each one (e.g. "Ladies Barrel
  // Racing 40-59") gets its own ranked table, same as the results page.
  const entriesByCategory = new Map<string, ResultEntry[]>();
  for (const entry of entries) {
    const existing = entriesByCategory.get(entry.eventName) ?? [];
    existing.push(entry);
    entriesByCategory.set(entry.eventName, existing);
  }

  const columns = ["Rank", "Competitor", "Rodeo Count", "Points"];

  return (
    <div className="space-y-8 w-full flex flex-col items-center">
      {Array.from(entriesByCategory.entries()).map(([eventName, categoryEntries]) => {
        // Roll every placing up into one running total per competitor:
        // total points across the season, and the number of distinct
        // rodeos (not placings) they've collected points at — a
        // competitor with two placings at the same rodeo still only
        // counts as 1 toward Rodeo Count.
        const totalsByCompetitor = new Map<string, CompetitorTotals>();
        for (const entry of categoryEntries) {
          const existing = totalsByCompetitor.get(entry.competitor) ?? {
            competitor: entry.competitor,
            rodeoIds: new Set<string>(),
            points: 0,
          };
          existing.rodeoIds.add(entry.eventId);
          existing.points += entry.points ?? 0;
          totalsByCompetitor.set(entry.competitor, existing);
        }

        // Rank by total points, highest first.
        const ranked = Array.from(totalsByCompetitor.values()).sort(
          (a, b) => b.points - a.points
        );

        // Property insertion order here must mirror `columns` above, since
        // Table renders each row positionally via Object.values(row).
        const data = ranked.map((totals, index) => ({
          rank: index + 1,
          competitor: totals.competitor,
          rodeoCount: totals.rodeoIds.size,
          points: totals.points,
        }));

        return (
          <div key={eventName} className="w-full max-w-6xl">
            <h2 className="text-lg font-semibold text-stone-900 mb-2">{eventName}</h2>

            <div className="w-full flex justify-center">
              <div className="w-full max-w-6xl">
                <div className="bg-white shadow-md rounded-lg p-6">
                  <h2 className="text-xl font-bold text-stone-900 mb-4">{eventName}</h2>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-orange-600 text-white">
                          <th className="px-4 py-2 text-left">Rank</th>
                          <th className="px-4 py-2 text-left">Competitor</th>
                          <th className="px-4 py-2 text-left">Rodeo Count</th>
                          <th className="px-4 py-2 text-left">Points</th>
                          </tr>
                        </thead>

                        <tbody>
                          {ranked.map((row, index) => (
                            <tr
                              key={row.competitor}
                              className={index % 2 === 0 ? "bg-stone-50" : "bg-white"}
                            >
                              <td className="px-4 py-2 border-b">{index + 1}</td>
                              <td className="px-4 py-2 border-b">{row.competitor}</td>
                              <td className="px-4 py-2 border-b">{row.rodeoIds.size}</td>
                              <td className="px-4 py-2 border-b font-semibold">
                              {row.points}
                              </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StandingsTable;