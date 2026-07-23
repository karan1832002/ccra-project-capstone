// Shared vocabulary for the rodeo event features. Every data function,
// component, and page in this feature imports its shapes from here — if the
// database schema changes, this is the one file to update first.

// One specific performance (a single day + start time) within a RodeoEvent.
// Rodeos often run across multiple days (e.g. a Fri/Sat/Sun weekend), and a
// contestant entering needs to pick exactly which performance they're
// entering, not just the rodeo as a whole.
export interface RodeoPerformance {
  id: string; // unique within the parent RodeoEvent, e.g. "pincher-creek-2026-p1"
  date: string; // ISO date, e.g. "2026-08-03"
  time: string; // display time, e.g. "11 am"
}

export interface RodeoEvent {
  id: string;
  name: string;
  location?: string;
  year: number;
  dateLabel: string; // display string, e.g. "Jul 12-13" — not used for sorting
  startDate: string; // ISO date (e.g. "2026-07-12") — used for sorting/filtering
  entriesOpenDate: string; // ISO date — entries can't be taken before this date
  entriesCloseDate: string; // ISO date — entries can't be taken after this date (inclusive)
  performances: RodeoPerformance[]; // individual day/time slots a contestant chooses between when entering
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

// A competition category a contestant can sign up for on the Enter Rodeo
// page (e.g. "Team Roping 40-59", "Ladies Barrel Racing 40-59"). This is
// distinct from RodeoEvent — a RodeoEvent is one rodeo weekend, and a single
// CompetitionEvent (with the same fees) is typically offered at several
// different RodeoEvents.
export interface CompetitionEvent {
  id: string;
  name: string;
  entryFee: number; // dollars
  eventFee: number; // dollars — separate office/admin fee charged alongside the entry fee
  isTeamEvent: boolean; // true => the entrant must also select a partner (team roping, ribbon roping, etc.)
  rodeoIds: string[]; // foreign keys back to RodeoEvent.id — which rodeos currently offer this event
}

// One row added via the Enter Rodeo page's "Add Entry" pop-up. This is
// client-side state only until the entry form is submitted to a real
// backend, so it deliberately denormalizes the rodeo/event names alongside
// their ids — that way the entries table can render immediately without
// re-looking-up names from an id.
export interface RodeoEntry {
  id: string; // client-generated id (e.g. crypto.randomUUID()) — not a database id yet
  rodeoId: string; // foreign key back to RodeoEvent.id
  rodeoName: string;
  performanceId: string; // foreign key back to RodeoEvent.performances[].id — which specific day/time was entered
  performanceDate: string; // ISO date, denormalized from the performance for easy display
  performanceTime: string; // display time, denormalized from the performance for easy display
  eventId: string; // foreign key back to CompetitionEvent.id
  eventName: string;
  partner?: string; // set when eventId refers to a team event
  entryFee: number;
  eventFee: number;
}

// A club/association member — used to populate the Enter Rodeo page's
// roping-partner dropdown. Only active members should ever reach that
// dropdown; lapsed memberships shouldn't be selectable as a partner.
export interface Member {
  id: string;
  name: string;
  active: boolean;
}