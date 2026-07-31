// lib/gateway-client.ts
//
// Authenticated counterpart to lib/gateway.ts's fetchFromGateway(). Use this
// for ADMIN actions — anything that needs a verified user id/role attached,
// like GET /api/users or PATCH /api/users/:id/role.
//
// SERVER-SIDE ONLY. This reads cookies via next/headers to verify the
// Better-Auth session, which only works in Server Components, Route
// Handlers, and Server Actions. Never import this from a "use client" file,
// and never expose FRONTEND_GATEWAY_KEY via NEXT_PUBLIC_*.
//
// ASSUMPTIONS TO CONFIRM (I can't see the Azure gateway's own code, so these
// are my best guess at a reasonable contract, not a verified one):
//   - The gateway's requireInternalToken middleware checks for the
//     `x-gateway-key` header — the same key used by lib/auth.ts for
//     notification dispatch.
//   - Import path `@/lib/auth` — point this at wherever betterAuth({...})
//     is actually exported from if it's not lib/auth.ts.

import "server-only";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { GatewayError } from "@/lib/gateway";
import type { Rodeo, Event, RodeoDetail } from "@/lib/gateway";

// The base URL of the API gateway. GATEWAY_URL is the internal
// cluster routing variable — never exposed to the client.
const GATEWAY_URL = process.env.GATEWAY_URL ?? "http://localhost:4000";
const FRONTEND_GATEWAY_KEY = process.env.FRONTEND_GATEWAY_KEY;

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

// ==========================================================================
// INTERFACES
// ==========================================================================

// Represents a user account returned by the gateway's /api/users endpoint.
export interface User {
  id: string;
  email: string;
  role: string;
}

// Payload sent to the gateway when submitting a rodeo result via
// POST /api/results. All monetary values are in dollars.
export interface RodeoResultData {
  userId: string;
  eventId: string;
  timeOrScore: number;
  placing: number;
  payoutMoney: number;
  groundMoney: number;
}

// Payload for creating or updating a rodeo via the event-service gateway.
export interface RodeoPayload {
  rodeoTitle: string;
  location: string;
  entryFee?: number | null;
  entriesOpen?: string | null;
  entriesClose?: string | null;
  phoneInEntries?: string | null;
  description?: string | null;
  image?: string | null;
  capacity?: number | null;
}

// Payload for adding or updating a competition event under a rodeo.
export interface EventPayload {
  category: string;
  eventDate: string;
  eventTime: string;
  eventFee: number;
}

// ==========================================================================
// SESSION VERIFICATION
// ==========================================================================

async function getVerifiedSession() {
  const incomingHeaders = await headers();
  const session = await auth.api.getSession({ headers: incomingHeaders });
  if (!session?.user) {
    throw new GatewayError("UNAUTHENTICATED", "No active session.");
  }
  return session;
}

// ==========================================================================
// CORE FETCH WRAPPER
// ==========================================================================

/**
 * Sends an authenticated request to the API gateway.
 *
 * The endpoint argument is a path like "/api/users". It is concatenated
 * to the base gateway URL so the full target becomes something like
 * "http://localhost:4000/api/users". This keeps callers from repeating
 * the base URL in every method.
 *
 * Before the request leaves the server, the current user's session is
 * verified and the user id and role are injected as custom headers
 * (`x-user-id` and `x-user-role`). An internal gateway key is also
 * attached so the gateway can confirm the request originated from this
 * frontend service.
 *
 * Error handling:
 * - Missing gateway key        -> GatewayError("GATEWAY_MISCONFIGURED")
 * - No active session          -> GatewayError("UNAUTHENTICATED")
 * - Gateway returns 5xx        -> GatewayError("GATEWAY_UNAVAILABLE")
 * - Gateway returns ApiResponse with success:false -> GatewayError with
 *   the code and message from the gateway's error payload.
 */
export async function callGateway<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  // Abort early if the shared secret that identifies this frontend to the
  // gateway has not been configured.
  if (!FRONTEND_GATEWAY_KEY) {
    throw new GatewayError(
      "GATEWAY_MISCONFIGURED",
      "FRONTEND_GATEWAY_KEY is not set — the gateway will reject this request.",
    );
  }

  const session = await getVerifiedSession();
  const role = (session.user as { role?: string }).role ?? "member";

  // Build the full URL by appending the caller-supplied endpoint path
  // to the gateway base URL. The endpoint should always start with "/".
  const url = `${GATEWAY_URL}${endpoint}`;

  // Merge the caller's headers with the authentication headers required
  // by the gateway. Caller-supplied headers take precedence so that
  // methods can override Content-Type or pass additional custom headers.
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-gateway-key": FRONTEND_GATEWAY_KEY,
      "x-user-id": session.user.id,
      "x-user-role": role,
      ...options.headers,
    },
    // Admin data must not be served from Next.js's fetch cache.
    cache: "no-store",
  });

  // Treat any 5xx response as a gateway outage rather than a
  // domain-level error. This lets callers implement retry logic
  // without inspecting status codes themselves.
  if (!res.ok && res.status >= 500) {
    throw new GatewayError(
      "GATEWAY_UNAVAILABLE",
      `Gateway returned ${res.status}`,
    );
  }

  const json = (await res.json()) as ApiResponse<T>;
  if (!json.success) {
    throw new GatewayError(json.error.code, json.error.message);
  }
  return json.data;
}

// ==========================================================================
// CONVENIENCE WRAPPERS
// ==========================================================================

// Shape of a registration record returned by
// GET /api/events/:eventId/registrations.
export type Registration = {
  id: string;
  eventId: string;
  userId: string;
  entryId?: string;
};

// Fetches all registrations for a given event from the gateway's
// /api/events/:eventId/registrations endpoint.
export function getEventRegistrations(eventId: string) {
  return callGateway<Registration[]>(
    `/api/events/${eventId}/registrations`,
  );
}

// ---- Rodeo & event management (admin) ------------------------------------

// Fetches all rodeos from the event-service via the gateway.
export function getAdminRodeos() {
  return callGateway<Rodeo[]>("/api/events/rodeos");
}

// Fetches a single rodeo with its nested events, dates, and draws.
export function getAdminRodeoDetail(id: string) {
  return callGateway<RodeoDetail>(`/api/events/rodeos/${id}`);
}

// Creates a new rodeo in the event-service.
export function createRodeo(data: RodeoPayload) {
  return callGateway<Rodeo>("/api/events/rodeos", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Updates an existing rodeo's fields.
export function updateRodeo(id: string, data: Partial<RodeoPayload>) {
  return callGateway<Rodeo>(`/api/events/rodeos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// Deletes a rodeo and cascades to its child events.
export function deleteRodeo(id: string) {
  return callGateway<void>(`/api/events/rodeos/${id}`, {
    method: "DELETE",
  });
}

// Adds a competition event under an existing rodeo.
export function createEvent(rodeoId: string, data: EventPayload) {
  return callGateway<Event>(`/api/events/rodeos/${rodeoId}/events`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Updates a competition event's details.
export function updateEvent(id: string, data: Partial<EventPayload>) {
  return callGateway<Event>(`/api/events/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// Removes a competition event.
export function deleteEvent(id: string) {
  return callGateway<void>(`/api/events/${id}`, {
    method: "DELETE",
  });
}

// ---- Rodeo results -------------------------------------------------------

// Submits a rodeo result record to the gateway's /api/results endpoint.
// The payload includes the rider, event, score/time, placing, and
// any associated payouts.
export function submitRodeoResult(data: RodeoResultData) {
  return callGateway<void>("/api/results", {
    method: "POST",
    body: JSON.stringify(data),
  });
}