/**
 * CurrentEntriesTable
 * -------------------
 * A single flat table of every competitor's already-submitted entry into an
 * upcoming rodeo, across every rodeo currently taking entries (or waiting
 * to happen) — not split per category like ResultsTable, since Rodeo and
 * Event are both columns here rather than a per-table heading. Rows are
 * sorted by the rodeo's start date first (soonest event first), then by
 * event name, then by competitor name.
 */

import React from "react";
import Table from "@/components/ui/Table";
import { CurrentEntry, RodeoEvent } from "@/types/rodeo";

interface CurrentEntriesTableProps {
  entries: CurrentEntry[];
  // The full list of rodeos, used to look up each entry's dateLabel and to
  // sort rows by the rodeo's startDate.
  rodeos: RodeoEvent[];
}

export function CurrentEntriesTable({ entries, rodeos }: CurrentEntriesTableProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-stone-400">No entries posted yet.</p>;
  }

  // Quick lookup from a rodeo id to its full record — used both to sort rows
  // by startDate and to render the "Dates" label.
  const rodeoById = new Map(rodeos.map((rodeo) => [rodeo.id, rodeo]));

  const columns = ["Competitor", "Rodeo", "Event", "Dates"];

  // Sort by rodeo start date first, then event name, then competitor —
  // soonest rodeo first, grouped by category, alphabetical within that.
  const sortedEntries = [...entries].sort((a, b) => {
    const startDateA = rodeoById.get(a.rodeoId)?.startDate ?? "";
    const startDateB = rodeoById.get(b.rodeoId)?.startDate ?? "";
    if (startDateA !== startDateB) return startDateA < startDateB ? -1 : 1;
    if (a.eventName !== b.eventName) return a.eventName.localeCompare(b.eventName);
    return a.competitor.localeCompare(b.competitor);
  });

  // Property insertion order here must mirror `columns` above, since Table
  // renders each row positionally via Object.values(row).
  const data = sortedEntries.map((entry) => {
    const rodeo = rodeoById.get(entry.rodeoId);
    return {
      competitor: entry.partner ? `${entry.competitor} / ${entry.partner}` : entry.competitor,
      rodeo: entry.rodeoName,
      event: entry.eventName,
      dates: rodeo?.dateLabel ?? "-",
    };
  });

  return (
    <div>
      <Table columns={columns} data={data} />
    </div>
  );
}

export default CurrentEntriesTable;