"use client";

import Link from "next/link";
import {
  Calendar,
  ArrowRight,
  ClipboardList,
  ChevronLeft,
} from "lucide-react";
import EventRankings, { EventStanding } from "@/components/my-standings/EventRankings";
import RecentResults, { RecentResult } from "@/components/my-standings/RecentResults";

const user = {
  name: "Tammy Clemmer",
  ageGroup: "50-59",
  season: "2026",
};

const eventStandings: EventStanding[] = [
  {
    event: "Ladies Barrel Racing 40-59",
    points: 98,
    rank: 4,
    entries: 2,
    bestScore: "15.23",
    lastResult: "3rd – Strathmore",
  },
  {
    event: "Ribbon Roping 40-59 Runner",
    points: 44,
    rank: 9,
    entries: 1,
    bestScore: "N/A",
    lastResult: "5th – Taber",
  },
];

const recentResults: RecentResult[] = [
  {
    date: "Jun 14, 2026",
    rodeo: "Strathmore Classic",
    event: "Ladies Barrel Racing 50-59",
    place: "3rd",
    points: 42,
  },
  {
    date: "May 31, 2026",
    rodeo: "Taber Round-Up",
    event: "Ribbon Roping 50-59",
    place: "5th",
    points: 28,
  },
  {
    date: "May 17, 2026",
    rodeo: "Brooks Spring Rodeo",
    event: "Ladies Barrel Racing 50-59",
    place: "2nd",
    points: 56,
  },
];

export default function StandingsPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 transition-colors dark:bg-stone-950 dark:text-stone-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Back link to Profile Page*/}
        <Link
          href="/profile"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 transition hover:text-orange-600 dark:text-stone-400 dark:hover:text-orange-400 mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Profile
        </Link>

        {/* Header */}
        <div className="mb-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-orange-50 px-4 py-1 text-sm font-semibold text-orange-600 mb-6 dark:bg-orange-950/40 dark:text-orange-400">
              {user.season} SEASON
            </div>
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-stone-950 dark:text-stone-100">
              My Standings
            </h1>
            <p className="mt-3 text-lg text-stone-600 dark:text-stone-300 max-w-xl">
              Track your points, rankings, and results for the current CCRA season.
            </p>
          </div>

          {/* Primary actions */}
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/events/enter-rodeo"
              className="inline-flex items-center gap-2 rounded-md bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700"
            >
              <ClipboardList className="w-4 h-4" />
              Enter a Rodeo
            </Link>
            <Link
              href="/schedule"
              className="inline-flex items-center gap-2 rounded-md border border-stone-200 bg-white px-5 py-2.5 text-sm font-semibold text-stone-950 transition hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:hover:bg-stone-800"
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
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Rankings update after each sanctioned CCRA event.{" "}
            <Link
              href="/results/standings"
              className="inline-flex items-center gap-1 font-semibold text-orange-600 hover:text-orange-700 dark:text-orange-400"
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