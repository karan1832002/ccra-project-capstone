/**
 * CurrentEntriesTable
 * -------------------
 * Renders one table per rodeo currently taking entries or waiting to
 * happen, with each rodeo's name/date/location shown as a heading above
 * its table. Rodeos whose end date has already passed are excluded.
 *
 * Rodeo sections are sorted by start date (soonest first). Within each
 * rodeo's table, rows are sorted by event name, then by competitor name.
 */

import React from "react";
import Table from "@/components/ui/Table";
import { CurrentEntry, RodeoEvent } from "@/types/rodeo";

interface CurrentEntriesTableProps {
  entries: CurrentEntry[];
  // The full list of rodeos, used to look up each rodeo's dateLabel/location
  // for its section heading, to sort sections by startDate, and to filter
  // out rodeos that have already ended.
  rodeos: RodeoEvent[];
}

export function CurrentEntriesTable({
  entries,
  rodeos,
}: CurrentEntriesTableProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-stone-400">No entries posted yet.</p>;
  }

  // Quick lookup from a rodeo id to its full record.
  const rodeoById = new Map(rodeos.map((rodeo) => [rodeo.id, rodeo]));

  // The individual event's date, distinct from the rodeo's own start date
  // and dateLabel shown in the section heading.
  const columns = ["Competitor", "Event", "Date"];

  const todayIso = new Date().toISOString().slice(0, 10);

  // Group entries by rodeoId so each rodeo gets its own table, skipping any
  // rodeo that has already ended.
  const entriesByRodeoId = new Map<string, CurrentEntry[]>();
  for (const entry of entries) {
    const rodeo = rodeoById.get(entry.rodeoId);
    if (rodeo?.startDate && rodeo.startDate < todayIso) continue; // Replace startDate with endDate when connected to db

    const group = entriesByRodeoId.get(entry.rodeoId);
    if (group) {
      group.push(entry);
    } else {
      entriesByRodeoId.set(entry.rodeoId, [entry]);
    }
  }

  // Sections ordered by the rodeo's start date, soonest first.
  const rodeoIds = [...entriesByRodeoId.keys()].sort((a, b) => {
    const startDateA = rodeoById.get(a)?.startDate ?? "";
    const startDateB = rodeoById.get(b)?.startDate ?? "";
    if (startDateA !== startDateB) return startDateA < startDateB ? -1 : 1;
    return 0;
  });

  if (rodeoIds.length === 0) {
    return <p className="text-sm text-stone-400">No entries posted yet.</p>;
  }

  return (
    <div className="w-full flex flex-col gap-8">
      {rodeoIds.map((rodeoId) => {
        const rodeo = rodeoById.get(rodeoId);
        const rodeoEntries = entriesByRodeoId.get(rodeoId)!;

        // Sort rows within this rodeo by event name, then competitor.
        const sortedEntries = [...rodeoEntries].sort((a, b) => {
          if (a.eventName !== b.eventName)
            return a.eventName.localeCompare(b.eventName);
          return a.competitor.localeCompare(b.competitor);
        });

        // Property insertion order here must mirror `columns` above, since
        // Table renders each row positionally via Object.values(row).
        // Event-level dates aren't tracked yet, so the rodeo's own
        // startDate is used as a stand-in for each row's Date.
        const data = sortedEntries.map((entry) => ({
          competitor: entry.competitor,
          event: entry.eventName,
          date: rodeo?.startDate ?? "-",
        }));

        return (
          <div key={rodeoId}>
            <div className="mb-2">
              <h2 className="text-xl font-semibold text-stone-950">
                {rodeoEntries[0].rodeoName}
              </h2>
              {(rodeo?.dateLabel || rodeo?.location) && (
                <p className="text-sm text-stone-400">
                  {rodeo?.dateLabel}
                  {rodeo?.dateLabel && rodeo?.location ? " · " : ""}
                  {rodeo?.location}
                </p>
              )}
            </div>
            <Table columns={columns} data={data} />
          </div>
        );
      })}
    </div>
  );
}

export default CurrentEntriesTable;
