/**
 * RodeoEventCard
 * --------------
 * The shared card shell for a single rodeo event: event name, date, and
 * location in a header row, with arbitrary body content below.
 *
 * This component only renders the shell — it has no idea what `children`
 * contains. That's what lets the same card wrap DrawFileList on the draws
 * page and ResultsTable on the results page.
 */

import React from "react";
import { RodeoSummary } from "@/types/rodeo";
import { formatShortDate } from "@/lib/rodeoDateUtils";

interface RodeoEventCardProps {
  event: RodeoSummary;
  children: React.ReactNode;
}

export function RodeoEventCard({ event, children }: RodeoEventCardProps) {
  return (
    <div className="rounded-md border border-stone-200 shadow-sm bg-white p-6 mb-3">
      <div className="flex justify-between items-baseline mb-3 flex-wrap gap-1">
        <span className="font-semibold text-xl text-stone-950">
          {event.name}
        </span>
        <span className="text-sm text-stone-400">
          {formatShortDate(event.startDate)}
          {event.endDate !== event.startDate &&
            ` - ${formatShortDate(event.endDate)}`}
          {event.location ? ` · ${event.location}` : ""}
        </span>
      </div>
      {children}
    </div>
  );
}

export default RodeoEventCard;
