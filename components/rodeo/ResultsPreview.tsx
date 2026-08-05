/**
 * ResultsPreview
 * --------------
 * Results-specific preview content for a RodeoEventCard on the results
 * *listing* page. Deliberately does NOT render the full ResultsTable here.
 * Instead this shows a couple of summary stats and a button through to
 * that rodeo's dedicated results page (ResultsTable still gets used there, 
 * in full).
 *
 * Mirrors DrawFileList's empty-state convention: if there's nothing to show
 * yet, say so in a single line rather than rendering an empty table/button.
 */

import React from "react";
import Link from "next/link";
import { Result } from "@/lib/gateway";

interface ResultsPreviewProps {
  rodeoId: string;
  entries: Result[];
}

function formatCurrency(amount: number): string {
  return amount.toLocaleString("en-CA", { style: "currency", currency: "CAD" });
}

export function ResultsPreview({ rodeoId, entries }: ResultsPreviewProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-stone-400">No results posted yet.</p>;
  }

  // Total payout across every placing (money + ground money), and the
  // number of distinct competition events (Barrel Racing, Team Roping, etc.)
  // this rodeo's results cover — gives a sense of scale without listing
  // every row.
  const totalPayout = entries.reduce(
    (sum, entry) => sum + (entry.money ?? 0) + (entry.ground ?? 0),
    0,
  );
  const eventCount = new Set(entries.map((entry) => entry.category)).size;

  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-stone-600">
        <span>
          <span className="font-semibold text-stone-950">
            {formatCurrency(totalPayout)}
          </span>{" "}
          paid out
        </span>
        <span>
          <span className="font-semibold text-stone-950">{eventCount}</span>{" "}
          {eventCount === 1 ? "event" : "events"}
        </span>
        <span>
          <span className="font-semibold text-stone-950">{entries.length}</span>{" "}
          {entries.length === 1 ? "result" : "results"}
        </span>
      </div>

      <Link
        href={`/results/rodeo-results/${rodeoId}`}
        className="shrink-0 rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
      >
        View Full Results
      </Link>
    </div>
  );
}

export default ResultsPreview;