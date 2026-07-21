// Shared vocabulary for the rodeo event features. Every data function,
// component, and page in this feature imports its shapes from here — if the
// database schema changes, this is the one file to update first.

export interface RodeoEvent {
  id: string;
  name: string;
  location?: string;
  year: number;
  dateLabel: string; // display string, e.g. "Jul 12-13" — not used for sorting
  startDate: string; // ISO date (e.g. "2026-07-12") — used for sorting/filtering
}

// "draw" = pre-event pairing of contestant to livestock/order.
// "day" = the working sheet used during a specific performance day, which may
// get updated with scratches/doctor releases as the day goes on.
export type SheetType = "draw" | "day";
export type SheetFileType = "pdf" | "xlsx";

// One uploaded document (draw sheet or day sheet) attached to a RodeoEvent.
export interface SheetFile {
  id: string;
  eventId: string; // foreign key back to RodeoEvent.id
  label: string;
  type: SheetType;
  fileType: SheetFileType;
  url: string;
}

// One scored entry within an event (e.g. one contestant's placing in one
// competition category at one rodeo). Several ResultEntry rows can share the
// same eventId.
export interface ResultEntry {
  id: string;
  eventId: string; // foreign key back to RodeoEvent.id
  eventName: string; // the competition category, e.g. "Ladies Barrel Racing 40-59"
  placing: number;
  time?: number; // for timed events
  score?: number; // for judged/rough stock events
  competitor: string;
  partner?: string; // set for team events (e.g. team roping)
  money: number;
  groundMoney: number;
  points?: number;
}