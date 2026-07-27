"use client";

import React, { useEffect, useState } from "react";
import { ResultEntry } from "@/types/rodeo";
import { getCompletedRodeoEvents, getAllResults } from "@/lib/sampleRodeoData";
import StandingsTable from "@/components/rodeo/StandingsTable";

export default function RodeoStandingsPage() {
  const [entries, setEntries] = useState<ResultEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      <div className="w-full py-8 px-4">
        <p className="text-sm text-stone-400">Loading standings...</p>
      </div>
    );
  }

  return (
    <div className="w-full py-8 px-4">
      <h1 className="text-3xl font-semibold text-stone-950 mb-6">Standings</h1>
      <StandingsTable entries={entries} />
    </div>
  );
}
