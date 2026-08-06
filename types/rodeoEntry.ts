/**
 * rodeoEntry.ts
 * -------------
 * Types used by the Enter Rodeo feature.
 *
 * These models represent the data needed by the registration UI rather
 * than the raw API responses. RodeoEventData is built from the gateway's
 * rodeo endpoints for display in the Add Entry modal, while RodeoEntry
 * represents a single event the competitor has added to their
 * registration before it is submitted to the backend.
 */

// Represents one event the competitor has added to their registration.
// Entries exist only in client-side state until they are submitted.
export type RodeoEntry = {
  id: string;

  rodeoId: string;
  rodeoName: string;

  eventId: string;
  eventName: string;
  eventDate: string;

  entryFee: number;
  eventFee: number;
};

// Simplified rodeo data prepared for the AddEntryModal. This is derived
// from the gateway's rodeo responses and contains only the information
// needed to build the rodeo and event selection lists.
export type RodeoEventData = {
  rodeoId: string;
  rodeoTitle: string;
  rodeoDates: string[];
  entryFee: number | null;

  events: {
    eventId: string;
    eventTitle: string;
    eventDate: string;
    eventFee: number | null;
  }[];
};
