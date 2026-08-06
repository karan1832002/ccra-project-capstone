"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ResultsTable, formatCurrency } from "@/components/rodeo/ResultsTable";
import { pageStructure } from "@/lib/styles";
import { getRodeo, getEventResults, Result } from "@/lib/gateway";
import { formatShortDate } from "@/lib/rodeoDateUtils";

interface RodeoResultsDetailPageProps {
  // Next.js provides dynamic route params as a Promise in this route setup.
  // React.use() unwraps the promise so the rodeo id can be used for data loading.
  params: Promise<{ rodeoId: string }>;
}

export default function RodeoResultsDetailPage({
  params,
}: RodeoResultsDetailPageProps) {
  const { rodeoId } = React.use(params);

  const [results, setResults] = useState<Result[]>([]);
  const [resultsMissing, setResultsMissing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Calculate payout totals across every result in the rodeo.
  // Null payout values are treated as zero for calculations.
  const totalMoney = useMemo(
    () => results.reduce((sum, entry) => sum + (entry.money ?? 0), 0),
    [results],
  );

  const totalGroundMoney = useMemo(
    () => results.reduce((sum, entry) => sum + (entry.ground ?? 0), 0),
    [results],
  );

  const totalPayout = totalMoney + totalGroundMoney;

  // Load the selected rodeo to identify its events.
  // Results are stored by event, so each event's results are loaded
  // and combined into a single results array.
  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
        // Get the rodeo details so we can find the event IDs that belong
        // to this rodeo. Results are stored by event, not by rodeo.
        const rodeo = await getRodeo(rodeoId);

        // Retrieve results for each event and combine them into one array.
        const results = (
          await Promise.all(
            rodeo.events.map((event) => getEventResults(event.id)),
          )
        ).flat();

        console.log("rodeoId:", rodeoId);
        console.log("Detail page results:", results);

        setResults(results);
      } catch (error) {
        console.error("Failed to load results:", error);
        setResultsMissing(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [rodeoId]);

  // Shared navigation back to the main results listing page.
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
        <p className="text-sm text-muted-foreground">Loading results...</p>
      </div>
    );
  }

  if (resultsMissing || results.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        {backLink}
        <p className="text-sm text-foreground">
          We couldn't find results for that rodeo.
        </p>
      </div>
    );
  }

  // Format the rodeo date range for display.
  // Single-day rodeos show one date; multi-day rodeos show the full range.
  const dates = [...new Set(results.map((r) => r.eventDate))].toSorted();

  const dateLabel =
    dates.length === 1
      ? formatShortDate(dates[0])
      : `${formatShortDate(dates[0])} – ${formatShortDate(dates[dates.length - 1])}`;

  return (
    <div className={pageStructure.pageWrapper}>
      <div className={pageStructure.contentContainer}>
        {backLink}

        {/* Page header contains the rodeo name/date information on the left and
            overall payout totals on the right. */}
        <div className="flex items-start justify-between gap-6 mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-heading">
              {results[0].rodeoTitle} Results
            </h1>

            <p className="text-sm text-muted-foreground">
              {dateLabel}
              {results[0].rodeoLocation ? ` · ${results[0].rodeoLocation}` : ""}
            </p>
          </div>

          {/* Summary of all prize money awarded across this rodeo.
              A grid keeps labels and values aligned regardless of label length. */}
          <div className="text-sm text-foreground shrink-0">
            <div className="grid grid-cols-[auto_auto] gap-x-2 gap-y-1">
              <span className="text-right">Money:</span>
              <span className="font-semibold text-heading">
                {formatCurrency(totalMoney)}
              </span>
              <span className="text-right">Ground:</span>
              <span className="font-semibold text-heading">
                {formatCurrency(totalGroundMoney)}
              </span>
              <span className="text-right">Total Payout:</span>
              <span className="font-semibold text-heading">
                {formatCurrency(totalPayout)}
              </span>
            </div>
          </div>
        </div>

        {/* ResultsTable groups the combined event results into separate
            competition category tables. */}
        <ResultsTable entries={results} />
      </div>
    </div>
  );
}
