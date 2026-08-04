"use server";

import { revalidatePath } from "next/cache";
import {
  getAdminRodeos,
  getAdminRodeoDetail,
  createRodeo,
  updateRodeo,
  deleteRodeo,
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/lib/gateway-client";
import type { RodeoPayload, EventPayload } from "@/lib/gateway-client";

// --- Rodeo & Event Server Actions ---
// All mutation wrappers below delegate to the event-service gateway and
// then call revalidatePath("/admin/events") to purge the Next.js server-
// side cache for the events admin page. This ensures the UI reflects
// changes without a manual refresh. Read operations (fetch) do not
// revalidate — they return fresh gateway responses on every call.

export async function fetchRodeos() {
  return getAdminRodeos();
}

export async function fetchRodeoDetail(id: string) {
  return getAdminRodeoDetail(id);
}

// Creates a rodeo after validating required string fields.
// Throws before touching the gateway if either title or location is empty.
export async function addRodeo(data: RodeoPayload) {
  if (!data.rodeoTitle.trim()) {
    throw new Error("Rodeo title is required.");
  }
  if (!data.location.trim()) {
    throw new Error("Location is required.");
  }

  const result = await createRodeo(data);
  revalidatePath("/admin/events");
  return result;
}

// Partial-update to an existing rodeo. Only the fields provided by
// the calling form are forwarded to the gateway.
export async function editRodeo(id: string, data: Partial<RodeoPayload>) {
  const result = await updateRodeo(id, data);
  revalidatePath("/admin/events");
  return result;
}

// Hard-deletes a rodeo. The gateway cascade-removes associated dates,
// draws, and events.
export async function removeRodeo(id: string) {
  await deleteRodeo(id);
  revalidatePath("/admin/events");
}

// Creates a competition event nested under a parent rodeo.
// Validates that the category string is non-empty before the gateway call.
export async function addEvent(rodeoId: string, data: EventPayload) {
  if (!data.category.trim()) {
    throw new Error("Category is required.");
  }

  const result = await createEvent(rodeoId, data);
  revalidatePath("/admin/events");
  return result;
}

// Updates a competition event's mutable fields.
export async function editEvent(id: string, data: Partial<EventPayload>) {
  const result = await updateEvent(id, data);
  revalidatePath("/admin/events");
  return result;
}

// Removes a single competition event from its parent rodeo.
export async function removeEvent(id: string) {
  await deleteEvent(id);
  revalidatePath("/admin/events");
}