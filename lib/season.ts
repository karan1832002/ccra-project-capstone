// Membership term helper.
//
// A CCRA membership runs for one year from the day it is purchased — buy on
// 2026-08-11 and it is valid through 2027-08-11.
//
// Single source of truth: the membership application form and the checkout
// summary both use this, so the date a member is quoted is always the date
// that gets stored.
 
/** The ISO date ("YYYY-MM-DD") a membership starting on `from` expires. */
export function membershipExpiryDate(from: Date = new Date()): string {
  const expiry = new Date(from);
  expiry.setFullYear(expiry.getFullYear() + 1);
 
  // Format from local date parts. toISOString() converts to UTC first, which
  // can shift the date by a day for anyone west of Greenwich.
  const year = expiry.getFullYear();
  const month = String(expiry.getMonth() + 1).padStart(2, "0");
  const day = String(expiry.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
 