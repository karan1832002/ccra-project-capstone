"use client";

import React from "react";
import MinuteEntry, { MinuteEntryData } from "@/components/ui/MinuteEntry";

const minutesData: MinuteEntryData[] = [
  {
    id: "2024-12-07",
    title: "2024 AGM / 1st Meeting of 2025 Season",
    date: "December 7, 2024",
    location: "Strathmore, AB",
    summary: "Regular board meeting covering 2024 Annual General Meeting review, financial updates, and planning for the 2025 season.",
    googleDocUrl: "https://docs.google.com/document/d/1BPM4Zb8TRoIYXmxjovLb2nicn8ydmHzi5RNwrdWPRB4/edit?tab=t.0",
  },

  // ─── add more entries below ───
  {
    id: "2025-04-15",
    title: "April 2025 Minutes",
    date: "April 15, 2025",
    location: "Zoom / Hybrid",
    summary: "Spring planning meeting – reviewed admin updates, sponsorship, rodeo dates, finances, and event plans.",
    googleDocUrl: "https://docs.google.com/document/d/1rVFfxNaPrvQ3F2KVYd4sp3TxV2LGfyVuhxmbp_nKrkI/edit?tab=t.0",
  },

  {
    id: "2025-05-17",
    title: "May 2025 Minutes",
    date: "May 17, 2025",
    location: "Taber, AB",
    summary: "Approved rodeos, updated sponsorship, set finals plans, and cut hold-back to 5%.",
    googleDocUrl: "https://docs.google.com/document/d/1iukOacevXZSbtc7C-OtailEBaRtYKlBMm2bihX1kjgM/edit?tab=t.0",
  },

  {
    id: "2025-07-10",
    title: "July 10 2025 Minutes",
    date: "July 10, 2025",
    location: "Zoom / Hybrid",
    summary: "Fixed entries, clarified rules, set signing authority, and discussed jackets.",
    googleDocUrl: "https://docs.google.com/document/d/1E6wDO8c5oOc4bDKyCBN-waOWMD8Nz4aBQrEPCuGjq6c/edit?tab=t.0",
  },

  {
    id: "2025-07-13",
    title: "July 13 2025 Minutes",
    date: "July 13, 2025",
    location: "Pincher Creek, AB",
    summary: "Booked finals stock, staff, banquet, and awards at Claresholm.",
    googleDocUrl: "https://docs.google.com/document/d/1tXO3enMiWARH_BsBrmgcLCnRauGoHDS7VFNVDXa_TmA/edit?tab=t.0",
  },

  {
    id: "2025-08-24",
    title: "August 2025 Minutes",
    date: "August 24, 2025",
    location: "Zoom / Hybrid",
    summary: "Picked finals judges/timers/announcer and handled complaints.",
    googleDocUrl: "https://docs.google.com/document/d/1dcom5Dns6Jke5U2wBhDkiFJ4XnquUycqMhL1UwXabhU/edit?tab=t.0",
  },

  {
    id: "2025-09-16",
    title: "September 2025 Minutes",
    date: "September 16, 2025",
    location: "Zoom / Hybrid",
    summary: "Finalized finals logistics and reviewed rule changes.",
    googleDocUrl: "https://docs.google.com/document/d/1s8v5m4PUQN4KlkpKA2EUT5xHQooUESM7uKCZpjuTkM8/edit?tab=t.0",
  },

  {
    id: "2025-10-6",
    title: "October 2025 Minutes",
    date: "October 6, 2025",
    location: "Zoom / Hybrid",
    summary: "Advanced finals prep and noted open board seats.",
    googleDocUrl: "https://docs.google.com/document/d/1lbGW2YU6WdtvwA2UJxspFp6xxq_pX4Lv/edit",
  },

  {
    id: "2025-10-18",
    title: "2025 AGM Minutes",
    date: "October 18, 2025",
    location: "Claresholm, AB",
    summary: "Elected new officers/directors and accepted financials.",
    googleDocUrl: "https://docs.google.com/document/d/1vd85IS70a4cfmFhOz1jkHDTsFKkaZ84vWK6sgoYiOLg/edit?tab=t.0",
  },

  {
    id: "2025-11-2",
    title: "November 2025 Minutes",
    date: "November 2, 2025",
    location: "Zoom / Hybrid",
    summary: "Made mixed team roping permanent and planned 2026 fundraising.",
    googleDocUrl: "https://docs.google.com/document/d/1QaIRFXU9r9LSFRPpgnxKcIkwuBfmaH4mYbhW33HeZyU/edit?tab=t.0",
  },

  {
    id: "2026-01-12",
    title: "January 2026 Minutes",
    date: "January 12, 2026",
    location: "Zoom / Hybrid",
    summary: "Confirmed early rodeos and required raffle sales for membership.",
    googleDocUrl: "https://docs.google.com/document/d/1BQ0i_e0nmqV2OzdBdq_yNiwabnldnSqXSW-xx6luWz0/edit?tab=t.0",
  },  

  {
    id: "2026-02-09",
    title: "February 2026 Minutes",
    date: "February 9, 2026",
    location: "Zoom / Hybrid",
    summary: "Planned prizes/raffles and listed potential rodeos.",
    googleDocUrl: "https://docs.google.com/document/d/1LfmpIq3cFXWIKh2jd_dZ560T1XaD4VTwuzn1HvCv2_c/edit?tab=t.0",
  },

  {
    id: "2026-03-16",
    title: "March 2026 Minutes",
    date: "March 16, 2026",
    location: "Zoom / Hybrid",
    summary: "Approved buckles, updated rodeos, and renewed Aimee’s contract.",
    googleDocUrl: "https://docs.google.com/document/d/1_csvIxM8CJhKNgU9hAe4cHSFw2YvgY6moxSmuBcecDc/edit?tab=t.0",
  },
];

export default function MinutesPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 transition-colors dark:bg-stone-950 dark:text-stone-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center py-16">
          <div className="inline-flex items-center gap-2 rounded-md bg-orange-50 px-4 py-1 text-sm font-semibold text-orange-600 mb-6 dark:bg-orange-950/40 dark:text-orange-400">
            GOVERNANCE
          </div>
          <h1 className="text-5xl font-semibold text-stone-950 tracking-tight mb-6 dark:text-stone-100">
            Meeting Minutes
          </h1>
          <p className="text-xl text-stone-600 dark:text-stone-300">
            Official records of Board of Directors meetings for the Canadian Classic Rodeo Association.
          </p>
        </div>

        {/* Minutes List */}
        <div className="max-w-3xl mx-auto space-y-6">
          {minutesData.map((entry) => (
            <MinuteEntry key={entry.id} entry={entry} />
          ))}
        </div>

        {/* Footer note */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Minutes are published after approval by the Board.  
            For older records or official copies, please{" "}
            <a
              href="/about-us/contact"
              className="text-orange-600 hover:underline dark:text-orange-400"
            >
              contact the office
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}