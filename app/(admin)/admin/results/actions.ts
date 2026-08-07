"use server";

import { revalidatePath } from "next/cache";
import { submitRodeoResult, callGateway } from "@/lib/gateway-client";
import { listUsers } from "@/lib/queries/users";
import type { Rodeo, Event } from "@/lib/gateway";

// ==========================================================================
// READ ACTIONS — fetch reference data for the submission form dropdowns
// ==========================================================================

// Fetches all users from the local auth database. Returns only the subset
// of fields the dropdown needs (id + name) so no PII leaks to the client.
export async function fetchUsers() {
  const users = await listUsers();
  return users.map((u) => ({ id: u.id, name: u.name }));
}

// Fetches all rodeos and competition events from the event-service gateway
// so the form can offer a rodeo → event chained dropdown. Events are
// fetched separately so the client can filter them by the selected rodeo
// without additional round-trips.
export async function fetchRodeosAndEvents(): Promise<{
  rodeos: Rodeo[];
  events: Event[];
}> {
  const [rodeos, events] = await Promise.all([
    callGateway<Rodeo[]>("/api/events/rodeos"),
    callGateway<Event[]>("/api/events"),
  ]);
  return { rodeos, events };
}

// Fetches registrations for a specific event. Returns full registration
// records so the form can resolve userId, entryId, and competitorName.
export async function fetchEventRegistrations(eventId: string) {
  const registrations = await callGateway<
    { id: string; userId: string; competitorName: string | null }[]
  >(`/api/events/${eventId}/registrations`);
  return registrations.map((r) => ({
    entryId: r.id,
    userId: r.userId,
    competitorName: r.competitorName ?? "Unknown",
  }));
}

export async function addRodeoResult(formData: FormData) {
  // Form fields sent by the client.
  const userId = formData.get("userId") as string;
  const eventId = formData.get("eventId") as string;
  const entryId = formData.get("entryId") as string;
  const competitorName = formData.get("competitorName") as string;
  const score = parseFloat(formData.get("score") as string);
  const placing = parseInt(formData.get("placing") as string, 10);
  const payoutMoney = parseFloat(formData.get("payoutMoney") as string);
  const groundMoney = parseFloat(formData.get("groundMoney") as string);

  if (!userId || !eventId || !entryId || !competitorName) {
    return { error: "Missing required fields (user, event, entry, or competitor)." };
  }
  if (isNaN(score) || isNaN(placing) || isNaN(payoutMoney) || isNaN(groundMoney)) {
    return { error: "Missing or invalid numeric fields." };
  }

  try {
    // Fetch the event and its parent rodeo from the gateway so we can
    // populate the denormalized rodeo/event snapshot fields that the
    // results-service requires.
    // Fetch event details and the parent rodeo (with nested dates) in
    // parallel so we have everything needed for the denormalized snapshot.
    const event = await callGateway<{
      rodeoId: string;
      category: string;
      eventDate: string;
      eventTime: string;
    }>(`/api/events/${eventId}`);

    const rodeoDetail = await callGateway<{
      rodeoTitle: string;
      location: string;
      dates: { date: string }[];
    }>(`/api/events/rodeos/${event.rodeoId}`);

    // Derive rodeo date range from the nested performance dates.
    // Falls back to the event date if no dates are attached.
    const sortedDates = [...rodeoDetail.dates].sort(
      (a, b) => a.date.localeCompare(b.date),
    );
    const rodeoStart = sortedDates[0]?.date ?? event.eventDate;
    const rodeoEnd = sortedDates[sortedDates.length - 1]?.date ?? event.eventDate;

    await submitRodeoResult({
      eventId,
      competitorId: userId,
      entryId,
      category: event.category,
      score,
      placement: placing,
      points: 0,
      money: payoutMoney,
      ground: groundMoney,
      competitorName,
      rodeoId: event.rodeoId,
      rodeoTitle: rodeoDetail.rodeoTitle,
      rodeoLocation: rodeoDetail.location,
      rodeoStart,
      rodeoEnd,
      eventDate: event.eventDate,
      eventTime: event.eventTime,
    });

    revalidatePath("/admin/results");
    revalidatePath("/results/rodeo-results");
    revalidatePath("/results/standings");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to submit result to gateway." };
  }
}
