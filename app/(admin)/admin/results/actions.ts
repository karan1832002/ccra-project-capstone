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

// Fetches registrations for a specific event. Returns the userIds of all
// competitors registered for the given event so the form can filter the
// Competitor dropdown to only show relevant contestants.
export async function fetchEventRegistrations(eventId: string) {
  const registrations = await callGateway<{ userId: string }[]>(
    `/api/events/${eventId}/registrations`,
  );
  return registrations.map((r) => r.userId);
}

export async function addRodeoResult(formData: FormData) {
  const userId = formData.get("userId") as string;
  const eventId = formData.get("eventId") as string;
  const timeOrScore = parseFloat(formData.get("timeOrScore") as string);
  const placing = parseInt(formData.get("placing") as string, 10);
  const payoutMoney = parseFloat(formData.get("payoutMoney") as string);
  const groundMoney = parseFloat(formData.get("groundMoney") as string);

  if (
    !userId ||
    !eventId ||
    isNaN(timeOrScore) ||
    isNaN(placing) ||
    isNaN(payoutMoney) ||
    isNaN(groundMoney)
  ) {
    return { error: "Missing or invalid required fields." };
  }

  try {
    await submitRodeoResult({
      userId,
      eventId,
      timeOrScore,
      placing,
      payoutMoney,
      groundMoney,
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