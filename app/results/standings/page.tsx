"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ResultEntry } from "@/types/rodeo";
import { getCompletedRodeoEvents, getAllResults } from "@/lib/sampleRodeoData";
import { StandingsTable } from "@/components/rodeo/StandingsTable";

export default function RodeoStandingsPage() {
  const [entries, setEntries] = useState<ResultEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Standings only count results from rodeos that have already happened —
  // pull the list of completed events first, then keep only the results
  // that belong to one of them.
  useEffect(() => {
    setLoading(true);
    Promise.all([getCompletedRodeoEvents(), getAllResults()]).then(
      ([completedEvents, allResults]) => {
        const completedEventIds = new Set(completedEvents.map((e) => e.id));
        setEntries(allResults.filter((r) => completedEventIds.has(r.eventId)));
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <p className="text-sm text-stone-400">Loading standings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">

      <h1 className="text-3xl font-semibold text-stone-950 mb-6">Standings</h1>

      <StandingsTable entries={entries} />
    </div>
  );
}