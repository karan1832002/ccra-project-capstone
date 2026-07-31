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

// Fetches the full list of rodeos from the event-service gateway.
export async function fetchRodeos() {
  return getAdminRodeos();
}

// Fetches a single rodeo with its nested events, dates, and draws.
export async function fetchRodeoDetail(id: string) {
  return getAdminRodeoDetail(id);
}

// Validates and creates a new rodeo record through the gateway.
// Revalidates the events admin page so the list stays current.
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

// Updates an existing rodeo's metadata. Only sends the fields
// that were actually provided by the form.
export async function editRodeo(id: string, data: Partial<RodeoPayload>) {
  const result = await updateRodeo(id, data);
  revalidatePath("/admin/events");
  return result;
}

// Deletes a rodeo. The gateway cascades to child events and draws.
export async function removeRodeo(id: string) {
  await deleteRodeo(id);
  revalidatePath("/admin/events");
}

// Adds a competition event under a parent rodeo.
export async function addEvent(rodeoId: string, data: EventPayload) {
  if (!data.category.trim()) {
    throw new Error("Category is required.");
  }

  const result = await createEvent(rodeoId, data);
  revalidatePath("/admin/events");
  return result;
}

// Updates a competition event's details.
export async function editEvent(id: string, data: Partial<EventPayload>) {
  const result = await updateEvent(id, data);
  revalidatePath("/admin/events");
  return result;
}

// Removes a competition event from its parent rodeo.
export async function removeEvent(id: string) {
  await deleteEvent(id);
  revalidatePath("/admin/events");
}