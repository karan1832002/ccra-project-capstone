/**
 * lib/sampleMemberData.ts
 * ------------------------
 * Sample data standing in for a "members" table. Once the database is
 * ready, swap the body of `getActiveMembers` for a real query — the
 * function already returns a Promise, so callers won't need to change.
 *
 * Used by:
 * - components/rodeo/AddEntryModal.tsx (Team Roping / Ribbon Roping
 *   partner dropdown — only active members can be picked as a partner)
 */

import { Member } from "@/types/rodeo";

const members: Member[] = [
  { id: "m1", name: "Aimee Cripps", active: true },
  { id: "m2", name: "Jill Flynn", active: true },
  { id: "m3", name: "Jackie Hoover", active: true },
  { id: "m4", name: "Trina Marshall", active: true },
  { id: "m5", name: "Lorna Hodge", active: true },
  { id: "m6", name: "Casey Windsor", active: true },
  { id: "m7", name: "Dallas Reimer", active: true },
  { id: "m8", name: "Shane Bouchard", active: true },
  { id: "m9", name: "Old Member (Inactive)", active: false }, // sample inactive member — should never show up in the dropdown
];

function delay<T>(value: T, ms = 150): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// Public data-access function — the only one the rest of the app needs.
// Filters out inactive members so lapsed memberships can't be picked as
// a roping partner.
export async function getActiveMembers(): Promise<Member[]> {
  return delay(members.filter((m) => m.active));
}