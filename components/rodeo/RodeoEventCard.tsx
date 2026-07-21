import React from "react";
import { RodeoEvent } from "@/types/rodeo";

interface RodeoEventCardProps {
  event: RodeoEvent;
  // Whatever body content this card wraps — DrawFileList on the draws page,
  // ResultsTable on the results page. This component only renders the shared
  // header/card shell and has no idea what's inside `children`.
  children: React.ReactNode;
}

export function RodeoEventCard({ event, children }: RodeoEventCardProps) {
  return (
    <div className="rounded-md border border-stone-200 shadow-sm bg-white p-6 mb-3">
      <div className="flex justify-between items-baseline mb-3 flex-wrap gap-1">
        <span className="font-semibold text-xl text-stone-950">{event.name}</span>
        <span className="text-sm text-stone-400">
          {event.dateLabel}
          {event.location ? ` · ${event.location}` : ""}
        </span>
      </div>
      {children}
    </div>
  );
}

export default RodeoEventCard;