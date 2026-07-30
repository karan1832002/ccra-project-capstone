"use client";

import React, { useEffect, useState, useMemo } from "react";
import { ResultEntry } from "@/types/rodeo";
import { getCompletedRodeoEvents, getAllResults } from "@/lib/sampleRodeoData";
import StandingsTable from "@/components/rodeo/StandingsTable";

export default function RodeoStandingsPage() {
  const [entries, setEntries] = useState<ResultEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  useEffect(() => {
    Promise.all([getCompletedRodeoEvents(), getAllResults()]).then(
      ([completedEvents, allResults]) => {
        const completedEventIds = new Set(completedEvents.map((e) => e.id));
        setEntries(allResults.filter((r) => completedEventIds.has(r.eventId)));
        setLoading(false);
      }
    );
  }, []);

  // Extract distinct categories from eventName
  const categories = useMemo(() => {
    const set = new Set(entries.map((e) => e.eventName));
    return ["all", ...Array.from(set)];
  }, [entries]);

  // Filtered standings
  const filteredEntries = useMemo(() => {
    return entries
      .filter((e) => category === "all" || e.eventName === category)
      .filter((e) =>
        e.competitor.toLowerCase().includes(search.toLowerCase())
      );
  }, [entries, category, search]);

  if (loading) {
    return (
      <div className="w-full py-8 px-4">
        <p className="text-sm text-stone-400">Loading standings...</p>
      </div>
    );
  }

  return (
    <div className="w-full py-8 px-4 max-w-4xl mx-auto">

      {/* RULEBOOK STYLE HEADING */}
      <h1 className="text-4xl font-bold text-orange-700 mb-4 text-center">
        Standings
      </h1>

      <p className="text-gray-600 text-center mb-8">
        View rankings and points earned across completed rodeo events.
      </p>

      {/* SEARCH + FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search competitor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 rounded-md border border-stone-300 px-4 py-2"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-1/2 rounded-md border border-stone-300 px-4 py-2"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "all" ? "All Categories" : cat}
            </option>
          ))}
        </select>
      </div>

      {/* CATEGORY TITLE */}
      {category !== "all" && filteredEntries.length > 0 && (
        <h2 className="text-xl font-semibold text-stone-900 mb-4 text-center">
          {category}
        </h2>
      )}

      {/* NO RESULTS */}
      {filteredEntries.length === 0 && (
        <p className="text-sm text-stone-400 py-6 text-center">
          No standings found.
        </p>
      )}

      {/* STANDINGS TABLE */}
      {filteredEntries.length > 0 && (
        <StandingsTable entries={filteredEntries} />
      )}
    </div>
  );
}
