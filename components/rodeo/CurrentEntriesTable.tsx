 /**
 * CurrentEntriesTable
 * -------------------
 * Displays current rodeo entries grouped into separate tables by rodeo.
 * Each section includes the rodeo name and location above its entries.
 *
 * Rodeo sections are ordered by event date (soonest first). Within each
 * rodeo table, entries are sorted by event category, then competitor name.
 */

import Table from "@/components/ui/Table";
import { TABLE_LAYOUTS } from "@/lib/tableLayouts";
import { Registration } from "@/lib/gateway";

interface CurrentEntriesTableProps {
  entries: Registration[];
}

export function CurrentEntriesTable({ entries }: CurrentEntriesTableProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-foreground">No entries posted yet.</p>;
  }

  // Column labels displayed by the shared Table component.
  const columns = ["Competitor", "Event", "Date"];

  // Group registrations by rodeo so each rodeo receives its own table.
  const entriesByRodeoId = new Map<string, Registration[]>();

  for (const entry of entries) {
    const group = entriesByRodeoId.get(entry.rodeoId);

    if (group) {
      group.push(entry);
    } else {
      entriesByRodeoId.set(entry.rodeoId, [entry]);
    }
  }

  // Sort rodeo sections by the earliest event date within each rodeo.
  const rodeoIds = [...entriesByRodeoId.keys()].sort((a, b) => {
    const dateA = entriesByRodeoId.get(a)?.[0]?.eventDate ?? "";

    const dateB = entriesByRodeoId.get(b)?.[0]?.eventDate ?? "";

    return dateA.localeCompare(dateB);
  });

  if (rodeoIds.length === 0) {
    return <p className="text-sm text-stone-400">No entries posted yet.</p>;
  }

  return (
    <div className="w-full flex flex-col gap-8">
      {rodeoIds.map((rodeoId) => {
        const rodeoEntries = entriesByRodeoId.get(rodeoId)!;

        // Sort entries within each rodeo by event category, then competitor.
        const sortedEntries = [...rodeoEntries].sort((a, b) => {
          if (a.category !== b.category) {
            return a.category.localeCompare(b.category);
          }

          return (a.competitorName ?? "").localeCompare(b.competitorName ?? "");
        });

        // Object property order must match the columns array above because
        // the shared Table component renders rows using Object.values().
        const data = sortedEntries.map((entry) => ({
          competitor: entry.competitorName ?? "-",
          event: entry.category,
          date: entry.eventDate,
        }));

        return (
          <div key={rodeoId}>
            <div className="mb-2">
              <h2 className="text-xl font-semibold text-heading">
                {rodeoEntries[0].rodeoTitle}
              </h2>

              <p className="text-sm text-muted-foreground">
                {rodeoEntries[0].location}
              </p>
            </div>
            <Table
              columns={columns}
              data={data}
              columnWidths={TABLE_LAYOUTS.currentEntries.columnWidths}
              wrapColumns={TABLE_LAYOUTS.currentEntries.wrapColumns}
              alignColumns={TABLE_LAYOUTS.currentEntries.alignColumns}
            />
          </div>
        );
      })}
    </div>
  );
}

export default CurrentEntriesTable;
