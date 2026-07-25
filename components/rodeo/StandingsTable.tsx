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
    <div className="space-y-8">
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
          <div key={eventName}>
            <h2 className="text-lg font-semibold text-stone-900 mb-2">{eventName}</h2>
            <Table columns={columns} data={data} />
          </div>
        );
      })}
    </div>
  );
}

export default StandingsTable;