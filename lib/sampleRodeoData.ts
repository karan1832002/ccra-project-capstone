import { RodeoEvent, SheetFile, ResultEntry } from "@/types/rodeo";

// Sample data below stands in for the database. Once the DB is ready, swap the
// bodies of the exported functions to real queries — callers won't need to
// change, since every function already returns a Promise, matching how an
// async database call or API fetch would behave.

// --- In-memory sample records -----------------------------------------

const events: RodeoEvent[] = [
  {
    id: "pincher-creek-2026",
    name: "Pincher Creek",
    location: "Pincher Creek, AB",
    year: 2026,
    dateLabel: "Jul 12-13",
    startDate: "2026-07-12",
  },
  {
    id: "standoff-2026",
    name: "Standoff",
    location: "Standoff, AB",
    year: 2026,
    dateLabel: "Jul 14",
    startDate: "2026-07-14",
  },
  {
    id: "dunmore-2026",
    name: "Dunmore",
    location: "Dunmore, AB",
    year: 2026,
    dateLabel: "Jul 17-19",
    startDate: "2026-07-17",
  },
  {
    id: "winfield-2026",
    name: "Winfield (Galloways)",
    location: "Winfield, AB",
    year: 2026,
    dateLabel: "Jul 4",
    startDate: "2026-07-04",
  },
  {
    id: "stettler-2025",
    name: "Stettler",
    location: "Stettler, AB",
    year: 2025,
    dateLabel: "Jul 21-22",
    startDate: "2025-07-21",
  },
  {
    id: "magrath-2025",
    name: "Magrath",
    location: "Magrath, AB",
    year: 2025,
    dateLabel: "Jul 12-13",
    startDate: "2025-07-12",
  },
];

// Each entry links back to an event via eventId — mirrors how a "sheet_files"
// table would have a foreign key column to "events" in a real database.
const sheetFiles: SheetFile[] = [
  { id: "sf1", eventId: "pincher-creek-2026", label: "Day sheet - Jul 12", type: "day", fileType: "pdf", url: "https://canadianclassicrodeo.ca/wp-content/uploads/sites/7/2026/07/Pincher-Creek-Day-Sheets-Pincher-July-12.pdf" },
  { id: "sf2", eventId: "pincher-creek-2026", label: "Day sheet - Jul 13", type: "day", fileType: "pdf", url: "https://canadianclassicrodeo.ca/wp-content/uploads/sites/7/2026/07/Pincher-Creek-Day-Sheets-Pincher-July-13.pdf" },
  { id: "sf3", eventId: "standoff-2026", label: "Day sheet", type: "day", fileType: "pdf", url: "https://canadianclassicrodeo.ca/wp-content/uploads/sites/7/2026/07/Standoff-day-sheets-Standoff.pdf" },
  { id: "sf4", eventId: "dunmore-2026", label: "Day sheet - Jul 17", type: "day", fileType: "pdf", url: "#" },
  { id: "sf5", eventId: "dunmore-2026", label: "Day sheet - Jul 18", type: "day", fileType: "pdf", url: "#" },
  { id: "sf6", eventId: "dunmore-2026", label: "Day sheet - Jul 19", type: "day", fileType: "pdf", url: "#" },
  { id: "sf7", eventId: "winfield-2026", label: "Draw sheet", type: "draw", fileType: "pdf", url: "https://canadianclassicrodeo.ca/wp-content/uploads/sites/7/2026/06/Galloways-Draw-Sheets-Winfield-July-4.pdf" },
  { id: "sf8", eventId: "stettler-2025", label: "Mon draw", type: "draw", fileType: "pdf", url: "#" },
  { id: "sf9", eventId: "stettler-2025", label: "Tue draw", type: "draw", fileType: "pdf", url: "#" },
  { id: "sf10", eventId: "stettler-2025", label: "Day sheets", type: "day", fileType: "xlsx", url: "https://canadianclassicrodeo.ca/wp-content/uploads/sites/7/2025/07/Stettler-Day-Sheets.xlsx" },
  { id: "sf11", eventId: "magrath-2025", label: "Sat draw", type: "draw", fileType: "pdf", url: "#" },
  { id: "sf12", eventId: "magrath-2025", label: "Sun draw", type: "draw", fileType: "pdf", url: "#" },
];

// Sample scoring data — only a couple of events have results filled in, since
// this is just enough to exercise ResultsTable once it's wired into a page.
const results: ResultEntry[] = [
  { id: "r1", eventId: "stettler-2025", eventName: "Ladies Barrel Racing 40-59", placing: 1, time: 17.824, competitor: "Aimee Cripps", money: 250.8, groundMoney: 0, points: 71 },
  { id: "r2", eventId: "stettler-2025", eventName: "Ladies Barrel Racing 40-59", placing: 2, time: 18.324, competitor: "Jill Flynn", money: 188.1, groundMoney: 0, points: 61 },
  { id: "r3", eventId: "magrath-2025", eventName: "Ladies Barrel Racing 40-59", placing: 1, time: 15.218, competitor: "Jackie Hoover", money: 250.8, groundMoney: 0, points: 72 },
  { id: "r4", eventId: "magrath-2025", eventName: "Team Roping 40-59", placing: 1, time: 6.1, competitor: "Trina Marshall", partner: "Lorna Hodge", money: 209, groundMoney: 0, points: 65 },
];

// Simulates network latency so components built against these functions behave
// the same way they will once they're calling a real API — e.g. loading
// states in the page won't just disappear instantly like they would with a
// synchronous in-memory return.
function delay<T>(value: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// --- Public data-access functions ---------------------------------------
// This is the "API" the rest of the app talks to. Replace each function body
// with a real database/query call later; callers won't need to change.

export async function getRodeoEvents(): Promise<RodeoEvent[]> {
  return delay(events);
}

export async function getSheetFilesForEvent(eventId: string): Promise<SheetFile[]> {
  return delay(sheetFiles.filter((f) => f.eventId === eventId));
}

export async function getAllSheetFiles(): Promise<SheetFile[]> {
  return delay(sheetFiles);
}

export async function getResultsForEvent(eventId: string): Promise<ResultEntry[]> {
  return delay(results.filter((r) => r.eventId === eventId));
}

export async function getAllResults(): Promise<ResultEntry[]> {
  return delay(results);
}