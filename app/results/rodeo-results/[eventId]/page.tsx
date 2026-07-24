"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { RodeoEvent, ResultEntry } from "@/types/rodeo";
import { getRodeoEvent, getResultsForEvent } from "@/lib/sampleRodeoData";
import { ResultsTable, formatCurrency } from "@/components/rodeo/ResultsTable";

interface RodeoResultsDetailPageProps {
  // Next.js provides dynamic route params as a Promise, so it's unwrapped
  // with React.use() below rather than read directly off props.
  params: Promise<{ eventId: string }>;
}

export default function RodeoResultsDetailPage({
  params,
}: RodeoResultsDetailPageProps) {
  const { eventId } = React.use(params);

  const [event, setEvent] = useState<RodeoEvent | null>(null);
  const [results, setResults] = useState<ResultEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventMissing, setEventMissing] = useState(false);

  // Rodeo-wide payout totals across every result, regardless of category —
  // mirrors the "Payout Report" summary row shown at the top of the
  // association's own results pages.
  const totalMoney = useMemo(
    () => results.reduce((sum, entry) => sum + entry.money, 0),
    [results],
  );
  const totalGroundMoney = useMemo(
    () => results.reduce((sum, entry) => sum + entry.groundMoney, 0),
    [results],
  );
  const totalPayout = totalMoney + totalGroundMoney;

  // Load the rodeo itself first, then its results — if the id doesn't match
  // any rodeo (bad link, typo'd URL), skip straight to the "not found" state
  // instead of trying to fetch results for nothing.
  useEffect(() => {
    setLoading(true);
    getRodeoEvent(eventId).then((evt) => {
      if (!evt) {
        setEventMissing(true);
        setLoading(false);
        return;
      }
      setEvent(evt);
      getResultsForEvent(eventId).then((res) => {
        setResults(res);
        setLoading(false);
      });
    });
  }, [eventId]);

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
        <p className="text-sm text-stone-400">Loading results...</p>
      </div>
    );
  }

  if (eventMissing || !event) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        {backLink}
        <p className="text-sm text-stone-400">
          We couldn&apos;t find results for that rodeo.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {backLink}

      {/* Header on the left, payout summary on the right, tops aligned. */}
      <div className="flex items-start justify-between gap-6 mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-stone-950">{event.name} Results</h1>
          <p className="text-sm text-stone-400">
            {event.dateLabel}
            {event.location ? ` · ${event.location}` : ""}
          </p>
        </div>

        {/* Rodeo-wide payout summary. A two-column grid (label / value)
            keeps every colon and every $ amount aligned in its own column,
            regardless of how long each label is*/}
        <div className="text-sm text-stone-600 shrink-0">
          <div className="grid grid-cols-[auto_auto] gap-x-2 gap-y-1">
            <span className="text-right">Money:</span>
            <span className="font-semibold text-stone-950">{formatCurrency(totalMoney)}</span>
            <span className="text-right">Ground:</span>
            <span className="font-semibold text-stone-950">{formatCurrency(totalGroundMoney)}</span>
            <span className="text-right">Total Payout:</span>
            <span className="font-semibold text-stone-950">{formatCurrency(totalPayout)}</span>
          </div>
        </div>
      </div>

      <ResultsTable entries={results} performances={event.performances} />
    </div>
  );
}