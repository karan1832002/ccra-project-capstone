"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
// import { RodeoEvent, ResultEntry } from "@/types/rodeo";
// import { getRodeoEvent, getResultsForEvent } from "@/lib/sampleRodeoData";
import { ResultsTable, formatCurrency } from "@/components/rodeo/ResultsTable";
import { pageStructure } from "@/lib/styles";
import { getRodeo, getEventResults, RodeoDetail, Result } from "@/lib/gateway";
import { formatShortDate } from "@/lib/rodeoDateUtils";

interface RodeoResultsDetailPageProps {
  // Next.js provides dynamic route params as a Promise, so it's unwrapped
  // with React.use() below rather than read directly off props.
  params: Promise<{ rodeoId: string }>;
}

export default function RodeoResultsDetailPage({
  params,
}: RodeoResultsDetailPageProps) {
  const { rodeoId } = React.use(params);

  const [rodeo, setRodeo] = useState<RodeoDetail | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [rodeoMissing, setRodeoMissing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Rodeo-wide payout totals across every result, regardless of category —
  // mirrors the "Payout Report" summary row shown at the top of the
  // association's own results pages.
  const totalMoney = useMemo(
    () => results.reduce((sum, entry) => sum + entry.money, 0),
    [results],
  );
  const totalGroundMoney = useMemo(
    () => results.reduce((sum, entry) => sum + entry.ground, 0),
    [results],
  );
  const totalPayout = totalMoney + totalGroundMoney;

  // Load the selected rodeo, then retrieve results for each event it contains.
  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        const rodeo = await getRodeo(rodeoId);
        setRodeo(rodeo);

        // Load the results for every event in this rodeo.
        const results = (
          await Promise.all(
            rodeo.events.map((event) => getEventResults(event.id)),
          )
        ).flat();

        setResults(results);
      } catch (error) {
        console.error("Failed to load rodeo results:", error);
        setRodeoMissing(true);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [rodeoId]);

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

  if (rodeoMissing || !rodeo) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        {backLink}
        <p className="text-sm text-stone-400">
          We couldn&apos;t find results for that rodeo.
        </p>
      </div>
    );
  }

  const dates = rodeo.dates.map((d) => d.date).toSorted();

  const dateLabel =
    dates.length === 1
      ? formatShortDate(dates[0])
      : `${formatShortDate(dates[0])} – ${formatShortDate(dates[dates.length - 1])}`;

  return (
    <div className={pageStructure.pageWrapper}>
      <div className={pageStructure.contentContainer}>
        {backLink}

        {/* Header on the left, payout summary on the right, tops aligned. */}
        <div className="flex items-start justify-between gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-stone-950">
              {rodeo.rodeoTitle} Results
            </h1>
            <p className="text-sm text-stone-400">
              {dateLabel}
              {rodeo.location ? ` · ${rodeo.location}` : ""}
            </p>
          </div>

          {/* Rodeo-wide payout summary. A two-column grid (label / value)
            keeps every colon and every $ amount aligned in its own column,
            regardless of how long each label is*/}
          <div className="text-sm text-stone-600 shrink-0">
            <div className="grid grid-cols-[auto_auto] gap-x-2 gap-y-1">
              <span className="text-right">Money:</span>
              <span className="font-semibold text-stone-950">
                {formatCurrency(totalMoney)}
              </span>
              <span className="text-right">Ground:</span>
              <span className="font-semibold text-stone-950">
                {formatCurrency(totalGroundMoney)}
              </span>
              <span className="text-right">Total Payout:</span>
              <span className="font-semibold text-stone-950">
                {formatCurrency(totalPayout)}
              </span>
            </div>
          </div>
        </div>

        <ResultsTable entries={results} events={rodeo.events} />
      </div>
    </div>
  );
}
