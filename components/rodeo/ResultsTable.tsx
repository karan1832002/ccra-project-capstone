import React from "react";
import Table from "@/components/Table";
import { ResultEntry } from "@/types/rodeo";

interface ResultsTableProps {
  entries: ResultEntry[];
}

// Column headers, in the exact order the row objects below must match —
// Table renders Object.values(row) positionally, not by key name.
const columns = [
  "Event",
  "Placing",
  "Time / Score",
  "Competitor",
  "Partner",
  "Money",
  "Ground $",
  "Points",
];

function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-CA", { style: "currency", currency: "CAD" });
}

// Rough stock events are scored (score), timed events have a time — only one
// of the two will be set on any given entry.
function formatTimeOrScore(entry: ResultEntry): string {
  if (entry.time !== undefined) return entry.time.toFixed(3);
  if (entry.score !== undefined) return entry.score.toString();
  return "-";
}

// Results-specific body content for a RodeoEventCard: reshapes ResultEntry
// records into the plain row objects the existing Table component expects.
export function ResultsTable({ entries }: ResultsTableProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-gray-400">No results posted yet.</p>;
  }

  // Property insertion order here must mirror `columns` above.
  const data = entries.map((entry) => ({
    event: entry.eventName,
    placing: entry.placing,
    timeOrScore: formatTimeOrScore(entry),
    competitor: entry.competitor,
    partner: entry.partner ?? "-",
    money: formatCurrency(entry.money),
    groundMoney: formatCurrency(entry.groundMoney),
    points: entry.points ?? "-",
  }));

  return <Table columns={columns} data={data} />;
}

export default ResultsTable;