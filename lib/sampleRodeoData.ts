import { RodeoEvent, SheetFile, ResultEntry, CompetitionEvent, RodeoEntry, CurrentEntry } from "@/types/rodeo";
import { toIsoDate } from "@/lib/rodeoDateUtils";

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
    dateLabel: "Aug 1-2",
    startDate: "2026-08-01",
    entriesOpenDate: "2026-07-18",
    entriesCloseDate: "2026-07-25", // currently open — spans "today" (2026-07-22) for testing
    performances: [
      { id: "pincher-creek-2026-p1", date: "2026-08-01", time: "11 am" },
      { id: "pincher-creek-2026-p2", date: "2026-08-02", time: "1 pm" },
    ],
  },
  {
    id: "standoff-2026",
    name: "Standoff",
    location: "Standoff, AB",
    year: 2026,
    dateLabel: "Aug 5",
    startDate: "2026-08-05",
    entriesOpenDate: "2026-07-21",
    entriesCloseDate: "2026-07-28", // currently open — for testing
    performances: [{ id: "standoff-2026-p1", date: "2026-08-05", time: "3 pm" }],
  },
  {
    id: "dunmore-2026",
    name: "Dunmore",
    location: "Dunmore, AB",
    year: 2026,
    dateLabel: "Aug 8-10",
    startDate: "2026-08-08",
    entriesOpenDate: "2026-07-27",
    entriesCloseDate: "2026-08-03", // not open yet — for testing the "not yet open" case
    performances: [
      { id: "dunmore-2026-p1", date: "2026-08-08", time: "10 am" },
      { id: "dunmore-2026-p2", date: "2026-08-09", time: "10 am" },
      { id: "dunmore-2026-p3", date: "2026-08-10", time: "1 pm" },
    ],
  },
  {
    id: "winfield-2026",
    name: "Winfield (Galloways)",
    location: "Winfield, AB",
    year: 2026,
    dateLabel: "Jul 4",
    startDate: "2026-07-04",
    entriesOpenDate: "2026-06-20",
    entriesCloseDate: "2026-06-27", // already closed — for testing the "closed" case
    performances: [{ id: "winfield-2026-p1", date: "2026-07-04", time: "9 am" }],
  },
  {
    id: "stettler-2025",
    name: "Stettler",
    location: "Stettler, AB",
    year: 2025,
    dateLabel: "Jul 21-22",
    startDate: "2025-07-21",
    entriesOpenDate: "2025-07-14",
    entriesCloseDate: "2025-07-21", // past rodeo — entries long closed
    performances: [
      { id: "stettler-2025-p1", date: "2025-07-21", time: "9 am" },
      { id: "stettler-2025-p2", date: "2025-07-22", time: "9 am" },
    ],
  },
  {
    id: "magrath-2025",
    name: "Magrath",
    location: "Magrath, AB",
    year: 2025,
    dateLabel: "Jul 12-13",
    startDate: "2025-07-12",
    entriesOpenDate: "2025-07-05",
    entriesCloseDate: "2025-07-12", // past rodeo — entries long closed
    performances: [
      { id: "magrath-2025-p1", date: "2025-07-12", time: "9 am" },
      { id: "magrath-2025-p2", date: "2025-07-13", time: "9 am" },
    ],
  },
  {
    // The season-ending finals rodeo. Its id always follows the
    // "ccra-finals-<year>" pattern so getLatestFinalsEvent() can find the
    // most recent one without any other lookup table.
    //
    // Its performances list holds the 4 go-rounds *plus* a 5th performance
    // (id ending in "-avg") representing the average/aggregate placing
    // across all 4 rounds. That 5th performance isn't a "round" a
    // competitor enters separately — it's how the association posts the
    // overall placing (and its points) once all 4 rounds are scored, so it
    // gets its own ResultEntry rows just like a normal performance would.
    id: "ccra-finals-2025",
    name: "CCRA Finals",
    location: "Ponoka, AB",
    year: 2025,
    dateLabel: "Sep 5-6",
    startDate: "2025-09-05",
    entriesOpenDate: "2025-08-15",
    entriesCloseDate: "2025-08-29",
    performances: [
      { id: "ccra-finals-2025-r1", date: "2025-09-05", time: "10 am" },
      { id: "ccra-finals-2025-r2", date: "2025-09-05", time: "2 pm" },
      { id: "ccra-finals-2025-r3", date: "2025-09-06", time: "10 am" },
      { id: "ccra-finals-2025-r4", date: "2025-09-06", time: "2 pm" },
      { id: "ccra-finals-2025-avg", date: "2025-09-06", time: "2 pm" },
    ],
  },
];

// Each entry links back to an event via eventId — mirrors how a "sheet_files"
// table would have a foreign key column to "events" in a real database.
const sheetFiles: SheetFile[] = [
  { id: "sf1", eventId: "pincher-creek-2026", label: "Day sheet - Aug 1", type: "day", fileType: "pdf", url: "https://canadianclassicrodeo.ca/wp-content/uploads/sites/7/2026/07/Pincher-Creek-Day-Sheets-Pincher-July-12.pdf" },
  { id: "sf2", eventId: "pincher-creek-2026", label: "Day sheet - Aug 2", type: "day", fileType: "pdf", url: "https://canadianclassicrodeo.ca/wp-content/uploads/sites/7/2026/07/Pincher-Creek-Day-Sheets-Pincher-July-13.pdf" },
  { id: "sf3", eventId: "standoff-2026", label: "Day sheet", type: "day", fileType: "pdf", url: "https://canadianclassicrodeo.ca/wp-content/uploads/sites/7/2026/07/Standoff-day-sheets-Standoff.pdf" },
  { id: "sf4", eventId: "dunmore-2026", label: "Day sheet - Aug 8", type: "day", fileType: "pdf", url: "#" },
  { id: "sf5", eventId: "dunmore-2026", label: "Day sheet - Aug 9", type: "day", fileType: "pdf", url: "#" },
  { id: "sf6", eventId: "dunmore-2026", label: "Day sheet - Aug 10", type: "day", fileType: "pdf", url: "#" },
  { id: "sf7", eventId: "winfield-2026", label: "Draw sheet", type: "draw", fileType: "pdf", url: "https://canadianclassicrodeo.ca/wp-content/uploads/sites/7/2026/06/Galloways-Draw-Sheets-Winfield-July-4.pdf" },
  { id: "sf8", eventId: "stettler-2025", label: "Mon draw", type: "draw", fileType: "pdf", url: "#" },
  { id: "sf9", eventId: "stettler-2025", label: "Tue draw", type: "draw", fileType: "pdf", url: "#" },
  { id: "sf10", eventId: "stettler-2025", label: "Day sheets", type: "day", fileType: "xlsx", url: "https://canadianclassicrodeo.ca/wp-content/uploads/sites/7/2025/07/Stettler-Day-Sheets.xlsx" },
  { id: "sf11", eventId: "magrath-2025", label: "Sat draw", type: "draw", fileType: "pdf", url: "#" },
  { id: "sf12", eventId: "magrath-2025", label: "Sun draw", type: "draw", fileType: "pdf", url: "#" },
];

// Sample scoring data. Covers every competition category the association
// currently runs (barrel racing, breakaway roping, team roping, ribbon
// roping, steer wrestling, tie down roping — each split into its own
// age/weight divisions), so ResultsTable has at least one entry per category
// to render a table for. Stettler's entries are spread across both of its
// performances (see `performanceId`) to also exercise the case where a
// single category ran on more than one day.
const results: ResultEntry[] = [
  // --- Stettler 2025 (2 performances: p1 = Jul 21, p2 = Jul 22) ---------
  { id: "r1", eventId: "stettler-2025", eventName: "Ladies Barrel Racing 40-59", performanceId: "stettler-2025-p1", placing: 1, time: 17.824, competitor: "Aimee Cripps", money: 250.8, groundMoney: 0, points: 71 },
  { id: "r2", eventId: "stettler-2025", eventName: "Ladies Barrel Racing 40-59", performanceId: "stettler-2025-p1", placing: 2, time: 18.324, competitor: "Jill Flynn", money: 188.1, groundMoney: 0, points: 61 },
  { id: "r5", eventId: "stettler-2025", eventName: "Ladies Barrel Racing 40-59", performanceId: "stettler-2025-p2", placing: 1, time: 17.981, competitor: "Jill Flynn", money: 235, groundMoney: 0, points: 69 },
  { id: "r6", eventId: "stettler-2025", eventName: "Ladies Barrel Racing 40-59", performanceId: "stettler-2025-p2", placing: 2, time: 18.502, competitor: "Aimee Cripps", money: 175, groundMoney: 0, points: 59 },
  { id: "r7", eventId: "stettler-2025", eventName: "Ladies Barrel Racing 60+", performanceId: "stettler-2025-p1", placing: 1, time: 15.159, competitor: "Connie LeMoine", money: 271.7, groundMoney: 0, points: 73 },
  { id: "r8", eventId: "stettler-2025", eventName: "Ladies Barrel Racing 60+", performanceId: "stettler-2025-p1", placing: 2, time: 15.237, competitor: "Bev Welsh", money: 203.78, groundMoney: 0, points: 63 },
  { id: "r9", eventId: "stettler-2025", eventName: "Ladies Breakaway Roping", performanceId: "stettler-2025-p1", placing: 1, time: 3.5, competitor: "Trina Marshall", money: 250.8, groundMoney: 0, points: 72 },
  { id: "r10", eventId: "stettler-2025", eventName: "Ladies Breakaway Roping", performanceId: "stettler-2025-p1", placing: 2, time: 4.5, competitor: "Gina Icenoggle", money: 188.1, groundMoney: 0, points: 62 },
  { id: "r11", eventId: "stettler-2025", eventName: "Men's Breakaway Roping 40-64", performanceId: "stettler-2025-p1", placing: 1, time: 2.7, competitor: "Kelly Creasy", money: 125.4, groundMoney: 0, points: 64 },
  { id: "r12", eventId: "stettler-2025", eventName: "Men's Breakaway Roping 40-64", performanceId: "stettler-2025-p1", placing: 2, time: 2.9, competitor: "Kirk Hall", money: 83.6, groundMoney: 0, points: 54 },
  { id: "r13", eventId: "stettler-2025", eventName: "Men's Breakaway Roping 65+", performanceId: "stettler-2025-p1", placing: 1, time: 1.8, competitor: "Kent Mosher", money: 271.7, groundMoney: 0, points: 73 },
  { id: "r14", eventId: "stettler-2025", eventName: "Men's Breakaway Roping 65+", performanceId: "stettler-2025-p1", placing: 2, time: 2.6, competitor: "Glen Adie", money: 203.78, groundMoney: 0, points: 63 },
  // Team roping categories post one row per partner (Header + Heeler) so
  // each competitor sees their own name under "Competitor" — both rows
  // describe the same run.
  { id: "r15", eventId: "stettler-2025", eventName: "Mixed Team Roping", performanceId: "stettler-2025-p1", placing: 1, time: 25.5, competitor: "Millie Archer", partner: "Doug Craik", money: 104.5, groundMoney: 0, points: 62 },
  { id: "r16", eventId: "stettler-2025", eventName: "Mixed Team Roping Heeler", performanceId: "stettler-2025-p1", placing: 1, time: 25.5, competitor: "Doug Craik", partner: "Millie Archer", money: 104.5, groundMoney: 0, points: 62 },
  { id: "r17", eventId: "stettler-2025", eventName: "Ribbon Roping 40-59", performanceId: "stettler-2025-p1", placing: 1, time: 9.9, competitor: "Greg Henry", partner: "Trina Marshall", money: 94.05, groundMoney: 0, points: 63 },
  { id: "r18", eventId: "stettler-2025", eventName: "Ribbon Roping 40-59 Runner", performanceId: "stettler-2025-p1", placing: 1, time: 9.9, competitor: "Trina Marshall", partner: "Greg Henry", money: 94.05, groundMoney: 0, points: 63 },
  { id: "r19", eventId: "stettler-2025", eventName: "Ribbon Roping 60+", performanceId: "stettler-2025-p1", placing: 1, time: 10.8, competitor: "Greg Dell", partner: "Connie LeMoine", money: 125.4, groundMoney: 0, points: 64 },
  { id: "r20", eventId: "stettler-2025", eventName: "Ribbon Roping 60+ Runner", performanceId: "stettler-2025-p1", placing: 1, time: 10.8, competitor: "Connie LeMoine", partner: "Greg Dell", money: 125.4, groundMoney: 0, points: 64 },
  { id: "r21", eventId: "stettler-2025", eventName: "Steer Wrestling", performanceId: "stettler-2025-p1", placing: 1, time: 13.8, competitor: "Jeff Heggie", money: 94.05, groundMoney: 62.7, points: 63 },
  { id: "r22", eventId: "stettler-2025", eventName: "Team Roping 40-59", performanceId: "stettler-2025-p1", placing: 1, time: 15.6, competitor: "Tim Bevans", partner: "Traci Aipperspach", money: 104.5, groundMoney: 0, points: 62 },
  { id: "r23", eventId: "stettler-2025", eventName: "Team Roping 40-59 Heeler", performanceId: "stettler-2025-p1", placing: 1, time: 15.6, competitor: "Traci Aipperspach", partner: "Tim Bevans", money: 104.5, groundMoney: 0, points: 62 },
  { id: "r24", eventId: "stettler-2025", eventName: "Team Roping 60+", performanceId: "stettler-2025-p1", placing: 1, time: 15.3, competitor: "Mike Tucker", partner: "Rick Martine", money: 188.1, groundMoney: 70.54, points: 69 },
  { id: "r25", eventId: "stettler-2025", eventName: "Team Roping 60+ Heeler", performanceId: "stettler-2025-p1", placing: 1, time: 15.3, competitor: "Rick Martine", partner: "Mike Tucker", money: 188.1, groundMoney: 70.54, points: 69 },
  { id: "r26", eventId: "stettler-2025", eventName: "Tie Down Roping 40-59", performanceId: "stettler-2025-p1", placing: 1, time: 16.1, competitor: "Kirk Hall", money: 94.05, groundMoney: 0, points: 63 },
  { id: "r27", eventId: "stettler-2025", eventName: "Tie Down Roping 60+", performanceId: "stettler-2025-p1", placing: 1, time: 12.3, competitor: "Lynn Turcato", money: 125.4, groundMoney: 0, points: 64 },
  { id: "r28", eventId: "stettler-2025", eventName: "Tie Down Roping 68+", performanceId: "stettler-2025-p1", placing: 1, time: 12.1, competitor: "Everett Morton", money: 156.75, groundMoney: 0, points: 65 },
  // --- Magrath 2025 (2 performances: p1 = Jul 12, p2 = Jul 13) ----------
  { id: "r3", eventId: "magrath-2025", eventName: "Ladies Barrel Racing 40-59", performanceId: "magrath-2025-p1", placing: 1, time: 15.218, competitor: "Jackie Hoover", money: 250.8, groundMoney: 0, points: 72 },
  { id: "r4", eventId: "magrath-2025", eventName: "Team Roping 40-59", performanceId: "magrath-2025-p1", placing: 1, time: 6.1, competitor: "Trina Marshall", partner: "Lorna Hodge", money: 209, groundMoney: 0, points: 65 },
  // --- CCRA Finals 2025 (4 go-rounds + 1 average/aggregate placing) -----
  // Ladies Barrel Racing 40-59 — timed event, lower total time wins.
  { id: "f1", eventId: "ccra-finals-2025", eventName: "Ladies Barrel Racing 40-59", performanceId: "ccra-finals-2025-r1", placing: 1, time: 17.502, competitor: "Aimee Cripps", money: 300, groundMoney: 0, points: 20 },
  { id: "f2", eventId: "ccra-finals-2025", eventName: "Ladies Barrel Racing 40-59", performanceId: "ccra-finals-2025-r1", placing: 2, time: 17.89, competitor: "Jill Flynn", money: 225, groundMoney: 0, points: 18 },
  { id: "f3", eventId: "ccra-finals-2025", eventName: "Ladies Barrel Racing 40-59", performanceId: "ccra-finals-2025-r2", placing: 1, time: 17.398, competitor: "Aimee Cripps", money: 300, groundMoney: 0, points: 20 },
  { id: "f4", eventId: "ccra-finals-2025", eventName: "Ladies Barrel Racing 40-59", performanceId: "ccra-finals-2025-r2", placing: 2, time: 17.755, competitor: "Jill Flynn", money: 225, groundMoney: 0, points: 18 },
  { id: "f5", eventId: "ccra-finals-2025", eventName: "Ladies Barrel Racing 40-59", performanceId: "ccra-finals-2025-r3", placing: 2, time: 17.611, competitor: "Aimee Cripps", money: 225, groundMoney: 0, points: 18 },
  { id: "f6", eventId: "ccra-finals-2025", eventName: "Ladies Barrel Racing 40-59", performanceId: "ccra-finals-2025-r3", placing: 1, time: 17.502, competitor: "Jill Flynn", money: 300, groundMoney: 0, points: 20 },
  { id: "f7", eventId: "ccra-finals-2025", eventName: "Ladies Barrel Racing 40-59", performanceId: "ccra-finals-2025-r4", placing: 1, time: 17.45, competitor: "Aimee Cripps", money: 300, groundMoney: 0, points: 20 },
  { id: "f8", eventId: "ccra-finals-2025", eventName: "Ladies Barrel Racing 40-59", performanceId: "ccra-finals-2025-r4", placing: 2, time: 17.8, competitor: "Jill Flynn", money: 225, groundMoney: 0, points: 18 },
  { id: "f9", eventId: "ccra-finals-2025", eventName: "Ladies Barrel Racing 40-59", performanceId: "ccra-finals-2025-avg", placing: 1, time: 69.961, competitor: "Aimee Cripps", money: 500, groundMoney: 0, points: 40 },
  { id: "f10", eventId: "ccra-finals-2025", eventName: "Ladies Barrel Racing 40-59", performanceId: "ccra-finals-2025-avg", placing: 2, time: 71.947, competitor: "Jill Flynn", money: 375, groundMoney: 0, points: 30 },
  // Saddle Bronc — judged event, higher total score wins.
  { id: "f11", eventId: "ccra-finals-2025", eventName: "Saddle Bronc", performanceId: "ccra-finals-2025-r1", placing: 1, score: 78, competitor: "Jace Dunn", money: 300, groundMoney: 0, points: 20 },
  { id: "f12", eventId: "ccra-finals-2025", eventName: "Saddle Bronc", performanceId: "ccra-finals-2025-r1", placing: 2, score: 75, competitor: "Trey Wilkins", money: 225, groundMoney: 0, points: 18 },
  { id: "f13", eventId: "ccra-finals-2025", eventName: "Saddle Bronc", performanceId: "ccra-finals-2025-r2", placing: 1, score: 82, competitor: "Jace Dunn", money: 300, groundMoney: 0, points: 20 },
  { id: "f14", eventId: "ccra-finals-2025", eventName: "Saddle Bronc", performanceId: "ccra-finals-2025-r2", placing: 2, score: 77, competitor: "Trey Wilkins", money: 225, groundMoney: 0, points: 18 },
  { id: "f15", eventId: "ccra-finals-2025", eventName: "Saddle Bronc", performanceId: "ccra-finals-2025-r3", placing: 2, score: 79, competitor: "Jace Dunn", money: 225, groundMoney: 0, points: 18 },
  { id: "f16", eventId: "ccra-finals-2025", eventName: "Saddle Bronc", performanceId: "ccra-finals-2025-r3", placing: 1, score: 80, competitor: "Trey Wilkins", money: 300, groundMoney: 0, points: 20 },
  { id: "f17", eventId: "ccra-finals-2025", eventName: "Saddle Bronc", performanceId: "ccra-finals-2025-r4", placing: 1, score: 81, competitor: "Jace Dunn", money: 300, groundMoney: 0, points: 20 },
  { id: "f18", eventId: "ccra-finals-2025", eventName: "Saddle Bronc", performanceId: "ccra-finals-2025-r4", placing: 2, score: 76, competitor: "Trey Wilkins", money: 225, groundMoney: 0, points: 18 },
  { id: "f19", eventId: "ccra-finals-2025", eventName: "Saddle Bronc", performanceId: "ccra-finals-2025-avg", placing: 1, score: 320, competitor: "Jace Dunn", money: 500, groundMoney: 0, points: 40 },
  { id: "f20", eventId: "ccra-finals-2025", eventName: "Saddle Bronc", performanceId: "ccra-finals-2025-avg", placing: 2, score: 308, competitor: "Trey Wilkins", money: 375, groundMoney: 0, points: 30 },
];

// Competition events an entrant can sign up for on the Enter Rodeo page.
// Each one lists which rodeos (by RodeoEvent id) currently offer it, so the
// "Event" dropdown can be filtered based on whichever "Rodeo" was picked
// first. `isTeamEvent` drives whether the pop-up shows the partner dropdown.
const competitionEvents: CompetitionEvent[] = [
  {
    id: "ce-barrel-racing",
    name: "Ladies Barrel Racing 40-59",
    entryFee: 150,
    eventFee: 25,
    isTeamEvent: false,
    rodeoIds: ["pincher-creek-2026", "standoff-2026", "dunmore-2026", "winfield-2026"],
  },
  {
    id: "ce-team-roping",
    name: "Team Roping 40-59",
    entryFee: 200,
    eventFee: 30,
    isTeamEvent: true,
    rodeoIds: ["pincher-creek-2026", "standoff-2026", "dunmore-2026"],
  },
  {
    id: "ce-ribbon-roping",
    name: "Ribbon Roping",
    entryFee: 175,
    eventFee: 30,
    isTeamEvent: true,
    rodeoIds: ["pincher-creek-2026", "dunmore-2026", "winfield-2026"],
  },
  {
    id: "ce-breakaway-roping",
    name: "Breakaway Roping",
    entryFee: 150,
    eventFee: 25,
    isTeamEvent: false,
    rodeoIds: ["standoff-2026", "dunmore-2026", "winfield-2026"],
  },
  {
    id: "ce-pole-bending",
    name: "Pole Bending",
    entryFee: 140,
    eventFee: 25,
    isTeamEvent: false,
    rodeoIds: ["pincher-creek-2026", "winfield-2026"],
  },
];

// Simulates network latency so components built against these functions behave
// the same way they will once they're calling a real API — e.g. loading
// states in the page won't just disappear instantly like they would with a
// synchronous in-memory return.
// Sample "already submitted" entries for the Current Entries table. Unlike
// `results`, these aren't tied to a specific performance — a competitor
// enters a rodeo weekend and picks their performance later/at check-in — so
// each row just links back to the rodeo and competition category.
const currentEntries: CurrentEntry[] = [
  { id: "ce1", rodeoId: "pincher-creek-2026", rodeoName: "Pincher Creek", eventName: "Ladies Barrel Racing 40-59", competitor: "Aimee Cripps" },
  { id: "ce2", rodeoId: "pincher-creek-2026", rodeoName: "Pincher Creek", eventName: "Ladies Barrel Racing 40-59", competitor: "Jill Flynn" },
  { id: "ce3", rodeoId: "pincher-creek-2026", rodeoName: "Pincher Creek", eventName: "Pole Bending", competitor: "Connie LeMoine" },
  { id: "ce4", rodeoId: "standoff-2026", rodeoName: "Standoff", eventName: "Team Roping 40-59", competitor: "Kelly Creasy", partner: "Kirk Hall" },
  { id: "ce5", rodeoId: "standoff-2026", rodeoName: "Standoff", eventName: "Ladies Breakaway Roping", competitor: "Trina Marshall" },
  { id: "ce6", rodeoId: "dunmore-2026", rodeoName: "Dunmore", eventName: "Men's Breakaway Roping 65+", competitor: "Kent Mosher" },
  { id: "ce7", rodeoId: "dunmore-2026", rodeoName: "Dunmore", eventName: "Men's Breakaway Roping 65+", competitor: "Glen Adie" },
  { id: "ce8", rodeoId: "dunmore-2026", rodeoName: "Dunmore", eventName: "Pole Bending", competitor: "Bev Welsh" },
];

function delay<T>(value: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// --- Public data-access functions ---------------------------------------
// This is the "API" the rest of the app talks to. Replace each function body
// with a real database/query call later; callers won't need to change.

export async function getRodeoEvents(): Promise<RodeoEvent[]> {
  return delay(events);
}

// Used by the results detail page (/results/rodeo-results/[eventId]) to look
// up the single rodeo it's displaying. Returns null rather than throwing so
// the caller can render a "not found" state instead of an error boundary.
export async function getRodeoEvent(eventId: string): Promise<RodeoEvent | null> {
  return delay(events.find((e) => e.id === eventId) ?? null);
}

// Used by the finals page (/results/finals) — finds the most recent CCRA
// Finals rodeo. Finals events always use the "ccra-finals-<year>" id
// pattern, so the most recent one is just whichever has the latest
// startDate. Returns null (rather than throwing) if a finals rodeo hasn't
// been added yet, same convention as getRodeoEvent.
export async function getLatestFinalsEvent(): Promise<RodeoEvent | null> {
  const finalsEvents = events.filter((e) => e.id.startsWith("ccra-finals-"));
  if (finalsEvents.length === 0) return delay(null);
  const latest = finalsEvents.reduce((latestSoFar, e) =>
    e.startDate > latestSoFar.startDate ? e : latestSoFar
  );
  return delay(latest);
}

// Used by the Enter Rodeo page's "Rodeo" dropdown — only rodeos currently
// within their entries-open window should be selectable. A rodeo whose
// entries haven't opened yet, or have already closed, shouldn't show up as
// an option to enter.
export async function getRodeosOpenForEntries(
  referenceDate: Date = new Date()
): Promise<RodeoEvent[]> {
  const todayIso = toIsoDate(referenceDate);
  return delay(
    events.filter(
      (e) => todayIso >= e.entriesOpenDate && todayIso <= e.entriesCloseDate
    )
  );
}

// Used by the standings page — only rodeos that have already happened
// (every performance date in the past) contribute to season standings. An
// upcoming or in-progress rodeo hasn't posted final results yet, so its
// entries (if any exist as placeholders) shouldn't count.
export async function getCompletedRodeoEvents(
  referenceDate: Date = new Date()
): Promise<RodeoEvent[]> {
  const todayIso = toIsoDate(referenceDate);
  return delay(
    events.filter((e) => {
      const lastPerformanceDate = e.performances.reduce(
        (latest, p) => (p.date > latest ? p.date : latest),
        e.startDate
      );
      return lastPerformanceDate < todayIso;
    })
  );
}

// Used by the Current Entries page — every submitted entry for a rodeo that
// hasn't happened yet (mirrors getCompletedRodeoEvents' "last performance
// date" check, just inverted, so a rodeo counts as upcoming until its final
// performance has passed).
export async function getCurrentEntriesForUpcomingRodeos(
  referenceDate: Date = new Date()
): Promise<CurrentEntry[]> {
  const todayIso = toIsoDate(referenceDate);
  const upcomingRodeoIds = new Set(
    events
      .filter((e) => {
        const lastPerformanceDate = e.performances.reduce(
          (latest, p) => (p.date > latest ? p.date : latest),
          e.startDate
        );
        return lastPerformanceDate >= todayIso;
      })
      .map((e) => e.id)
  );
  return delay(currentEntries.filter((entry) => upcomingRodeoIds.has(entry.rodeoId)));
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

export async function getAllCompetitionEvents(): Promise<CompetitionEvent[]> {
  return delay(competitionEvents);
}

// Used by the Enter Rodeo page's "Event" dropdown — only returns the
// competition events offered at the selected rodeo.
export async function getCompetitionEventsForRodeo(
  rodeoId: string
): Promise<CompetitionEvent[]> {
  return delay(competitionEvents.filter((ce) => ce.rodeoIds.includes(rodeoId)));
}

// --- Entry submission ----------------------------------------------------

// Everything the Enter Rodeo page needs to send when the competitor
// submits their entries.
export interface SubmitRodeoEntriesPayload {
  competitorName: string;
  email: string;
  entries: RodeoEntry[];
}

export interface SubmitRodeoEntriesResult {
  confirmationNumber: string;
}

// Stands in for the real "save this entry to the database" API call.
// Once the backend exists, replace the body with something like:
//
//   const res = await fetch("/api/rodeo-entries", {
//     method: "POST",
//     body: JSON.stringify(payload),
//   });
//   if (!res.ok) throw new Error("Failed to submit entries");
//   return res.json();
//
// Callers already `await` this and handle a thrown error, so no caller-side
// changes should be needed once that swap happens.
//
// `simulateFailure` isn't something a real API would take — it's here only
// so the Enter Rodeo page's "submission failed" UI can be exercised during
// testing without needing a real backend to say no. Remove it once this is
// wired up for real.
export async function submitRodeoEntries(
  payload: SubmitRodeoEntriesPayload,
  simulateFailure = false
): Promise<SubmitRodeoEntriesResult> {
  await delay(undefined, 400);
  if (simulateFailure) {
    throw new Error("Simulated submission failure");
  }
  return { confirmationNumber: generateConfirmationNumber() };
}

// Placeholder confirmation-number generator — a real backend would generate
// this (e.g. from a database sequence or UUID) and return it in the
// response instead.
function generateConfirmationNumber(): string {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `RE-${random}`;
}