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
import { buttons } from "@/lib/styles";
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
    return <p className="text-sm text-body-text">No results posted yet.</p>;
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
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-body-text">
        <span>
          <span className="font-semibold text-heading-text">
            {formatCurrency(totalPayout)}
          </span>{" "}
          paid out
        </span>
        <span>
          <span className="font-semibold text-heading-text">{eventCount}</span>{" "}
          {eventCount === 1 ? "event" : "events"}
        </span>
        <span>
          <span className="font-semibold text-heading-text">{entries.length}</span>{" "}
          {entries.length === 1 ? "result" : "results"}
        </span>
      </div>

      <Link
        href={`/results/rodeo-results/${rodeoId}`}
        className={buttons.primaryButton}
      >
        View Full Results
      </Link>
    </div>
  );
}

export default ResultsPreview;