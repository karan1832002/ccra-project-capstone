// app/profile/my-standings/page.tsx
//
// Personalized standings dashboard for the logged-in member. Fetches
// ALL result rows from the results-service (GET /api/results, public)
// and filters them client-side by the current user's `competitorId`.
//
// The results-service does not expose a per-competitor endpoint, so we
// retrieve the full dataset and narrow it here. Two derived views are
// computed from the raw result rows:
//
//   1. Event Rankings (left column) — group results by competition
//      category, sum points, track best score and most recent result
//      date per category, then rank categories by total points
//      descending.  Maps to the `EventStanding` contract expected by
//      the `EventRankings` component.
//
//   2. Recent Results (right column) — last 10 result rows sorted
//      newest-first, with ordinal placement suffixes (1st, 2nd, …).
//      Maps to the `RecentResult` contract expected by the
//      `RecentResults` component.


"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Calendar,
  ArrowRight,
  ClipboardList,
  ChevronLeft,
} from "lucide-react";
import EventRankings, { type EventStanding } from "@/components/my-standings/EventRankings";
import RecentResults, { type RecentResult } from "@/components/my-standings/RecentResults";
import { useSession } from "@/lib/auth-client";
import { getResults, type Result } from "@/lib/gateway";
import { pageStructure, buttons } from "@/lib/styles";

/**
 * Returns the English ordinal suffix for a positive integer.
 *  1 → "st",  2 → "nd",  3 → "rd",  4 → "th", …
 * Handles edge cases: 11 → "th", 12 → "th", 13 → "th".
 */
function ordinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] ?? s[v] ?? s[0];
}

export default function StandingsPage() {
  const { data: session, isPending } = useSession();
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all results, then filter to the logged-in user client-side.
  // The results-service does not expose a per-user endpoint, so we
  // fetch the full list and narrow it here.
  useEffect(() => {
    if (isPending) return;

    getResults()
      .then((data) => {
        if (session?.user?.id) {
          setResults(data.filter((r) => r.competitorId === session.user.id));
        }
      })
      .catch((err) => {
        console.error("Failed to load results:", err);
        setError("Could not load standings. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, [session, isPending]);

  if (isPending || loading) {
    return (
      <div className={`${pageStructure.pageWrapper} flex items-center justify-center`}>
        <div className="animate-pulse text-body-text text-sm">Loading standings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${pageStructure.pageWrapper} flex items-center justify-center`}>
        <div className="text-danger text-sm">{error}</div>
      </div>
    );
  }

  // Group results by category to derive per-event standings.
  // Each category bucket produces one EventStanding row with aggregated
  // points, best score, and last result date.
  const byCategory = new Map<
    string,
    { totalPoints: number; bestScore: number; lastDate: string; count: number }
  >();

  for (const r of results) {
    const existing = byCategory.get(r.category);
    const pts = r.points ?? 0;
    const score = r.score ?? 0;

    if (existing) {
      existing.totalPoints += pts;
      existing.count += 1;
      if (score > existing.bestScore) existing.bestScore = score;
      if (r.eventDate > existing.lastDate) existing.lastDate = r.eventDate;
    } else {
      byCategory.set(r.category, {
        totalPoints: pts,
        bestScore: score,
        lastDate: r.eventDate,
        count: 1,
      });
    }
  }

  // Build ranked standings — sort categories by total points descending,
  // then assign a 1-based rank.
  const sortedCategories = [...byCategory.entries()].sort(
    (a, b) => b[1].totalPoints - a[1].totalPoints,
  );

  const eventStandings: EventStanding[] = sortedCategories.map(
    ([category, agg], i) => ({
      event: category,
      points: agg.totalPoints,
      rank: i + 1,
      entries: agg.count,
      bestScore: agg.bestScore,
      lastResult: agg.lastDate,
    }),
  );

  // Recent results: last 10 results, newest first.
  const recentResults: RecentResult[] = [...results]
    .sort((a, b) => b.eventDate.localeCompare(a.eventDate))
    .slice(0, 10)
    .map((r) => ({
      date: r.eventDate,
      rodeo: r.rodeoTitle,
      event: r.category,
      place: r.placement != null
        ? `${r.placement}${ordinalSuffix(r.placement)}`
        : "—",
      points: r.points ?? 0,
    }));

  const season = String(new Date().getFullYear());
  return (
    <div className={pageStructure.pageWrapper}>
      <div className={pageStructure.contentContainer}>

        {/* Back link to Profile Page*/}
        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-body-text transition hover:text-primary mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Profile
        </Link>

        {/* Header */}
        <div className="mb-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-accent/40 px-4 py-1 text-sm font-semibold text-accent-text mb-6">
              {season} SEASON
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-heading-text">
              My Standings
            </h1>
            <p className="mt-3 text-lg text-body-text max-w-xl">
              Track your points, rankings, and results for the current CCRA season.
            </p>
          </div>

          {/* Primary actions */}
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/events/enter-rodeo"
              className={buttons.primaryButton}
            >
              <ClipboardList className="w-4 h-4" />
              Enter a Rodeo
            </Link>
            <Link
              href="/schedule"
              className={buttons.secondaryButton}
            >
              <Calendar className="w-4 h-4" />
              Full Schedule
            </Link>
          </div>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-8">
          <EventRankings items={eventStandings} />
          <RecentResults items={recentResults} />
        </div>

        {/* Footer note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-caption-text">
            Rankings update after each sanctioned CCRA event.{" "}
            <Link
              href="/results/standings"
              className="inline-flex items-center gap-1 font-semibold text-accent-text hover:text-primary-dark"
            >
              View full association standings
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}