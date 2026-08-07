/**
 * Table Layouts
 * -------------
 * Shared configurations for reusable table components.
 *
 * Defines column widths and wrapping rules so tables on the same page
 * maintain consistent sizing and appearance.
 *
 * - widths: Percentage width of each column (should total 100%).
 * - wrapColumns: Column indexes that allow text wrapping.
 * - alignColumns: Text alignment of each column ("left", "center", or "right").
 *
 * Used by:
 * - CurrentEntriesTable
 * - PastChampionsTable
 * - ResultsTable
 * - StandingsTable
 */

export const TABLE_LAYOUTS = {
  // Current Entries: Competitor, Event, Date
  currentEntries: {
    columnWidths: ["40%", "40%", "20%"],
    wrapColumns: [0, 1],
    alignColumns: ["left", "left", "center"],
  },

  // Past Champions: Year, Champion, Event Count, Points
  pastChampions: {
    columnWidths: ["25%", "35%", "20%", "20%"],
    wrapColumns: [1, 2],
    alignColumns: ["center", "left", "center", "center"],
  },

  // Results: Date & Time, Placing, Score, Competitor, Money, Ground, Points
  results: {
    columnWidths: ["16%", "12%", "12%", "20%", "15%", "15%", "10%"],
    wrapColumns: [0, 3],
    alignColumns: [
      "center",
      "center",
      "center",
      "left",
      "center",
      "center",
      "center",
    ],
  },

  // Standings: Rank, Competitor, Event Count, Points
  standings: {
    columnWidths: ["25%", "35%", "20%", "20%"],
    wrapColumns: [1, 2],
    alignColumns: ["center", "left", "center", "center"],
  },
} as const;
