/**
 * lib/rodeoDateUtils.ts
 * ----------------------
 * Date formatting helpers for rodeo performances, built on top of
 * date-fns. Split out from sampleRodeoData.ts because these aren't data
 * access — they're just formatting — so they'll still be needed unchanged
 * once sampleRodeoData.ts's functions are swapped for real database queries.
 */

import { format, parseISO } from "date-fns";
import { RodeoEvent, RodeoPerformance } from "@/types/rodeo";

// Formats an ISO date ("2026-08-03") as a short display date ("Aug 03").
// `parseISO` reads the date as local midnight (not UTC), so this can't
// shift by a day depending on the browser's timezone.
export function formatShortDate(isoDate: string): string {
  return format(parseISO(isoDate), "MMM dd");
}

// Builds the label shown for one performance in the Enter Rodeo page's
// "Rodeo" dropdown, e.g. "Pincher Creek - Aug 03 @ 11 am" — this is what
// lets a contestant see and pick the rodeo *and* the exact date/time in one
// selection, since a rodeo can span several days. This part is app-specific
// (combining a rodeo name with a performance date/time), so it stays as a
// small hand-written function even though the date formatting itself comes
// from date-fns.
export function formatRodeoPerformanceLabel(
  rodeo: RodeoEvent,
  performance: RodeoPerformance
): string {
  return `${rodeo.name} - ${formatShortDate(performance.date)} @ ${performance.time}`;
}

// Converts a JS Date to an ISO "YYYY-MM-DD" string using its local date
// parts (not `toISOString()`, which is UTC-based and can roll over to the
// previous/next day depending on the user's timezone).
export function toIsoDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}