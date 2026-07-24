"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { RodeoEvent, ResultEntry } from "@/types/rodeo";
import { getLatestFinalsEvent, getResultsForEvent } from "@/lib/sampleRodeoData";
import { FinalsTable } from "@/components/rodeo/FinalsTable";

export default function RodeoFinalsPage() {
  const [event, setEvent] = useState<RodeoEvent | null>(null);
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventMissing, setEventMissing] = useState(false);

  // This page always shows the most recent CCRA Finals rodeo — there's no
  // eventId in the route, unlike the results detail page.
  useEffect(() => {
    setLoading(true);
    getLatestFinalsEvent().then((evt) => {
      if (!evt) {
        setEventMissing(true);
        setLoading(false);
        return;
      }
      setEvent(evt);
      getResultsForEvent(evt.id).then((res) => {
        setResults(res);
        setLoading(false);
      });
    });
  }, []);

  const backLink = (
    <Link
      href="/results/rodeo-results"
      className="inline-block text-sm text-stone-500 hover:text-orange-600 mb-4"
    >
      ← Back to all results
    </Link>
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        {backLink}
        <p className="text-sm text-stone-400">Loading finals results...</p>
      </div>
    );
  }

  if (eventMissing || !event) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        {backLink}
        <p className="text-sm text-stone-400">
          Finals results haven&apos;t been posted yet.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {backLink}

      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-stone-950">{event.name} Results</h1>
        <p className="text-sm text-stone-400">
          {event.dateLabel}
          {event.location ? ` · ${event.location}` : ""}
        </p>
      </div>

      <FinalsTable entries={results} performances={event.performances} />
    </div>
  );
}