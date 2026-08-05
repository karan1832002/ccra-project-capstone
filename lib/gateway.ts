// lib/gateway.ts
//
// Single place where the frontend talks to the CCRA API gateway.
// Every backend response is wrapped as:
//   { success: true,  data: T }
//   { success: false, error: { code, message } }
// This helper unwraps that so callers just get `data` or a thrown error.

const GATEWAY_URL = process.env.GATEWAY_URL ?? "http://localhost:4000";

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

export class GatewayError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "GatewayError";
  }
}

type Options = {
  method?: string;
  body?: unknown;
  /** Seconds to cache. 0 = always fresh. Default 60. */
  revalidate?: number;
};

/**
 * Calls a public gateway route. Use this for anything a signed-out visitor
 * can see (rodeos, events, standings, products...).
 *
 * For ADMIN actions use callGateway() in lib/gateway-client.ts instead —
 * that one attaches the verified session role/id.
 */
export async function fetchFromGateway<T>(
  path: string,
  opts: Options = {},
): Promise<T> {
  // On the server, call the gateway directly with GATEWAY_URL. In the browser,
  // GATEWAY_URL isn't available (and the gateway's CORS rejects browser origins),
  // so route through the same-origin /api/gateway proxy instead.
  const base = typeof window === "undefined" ? GATEWAY_URL : "/api/gateway";
  const res = await fetch(`${base}${path}`, {
    method: opts.method ?? "GET",
    headers: { "Content-Type": "application/json" },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    next: { revalidate: opts.revalidate ?? 60 },
  });

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
// TYPES — match the backend AFTER the rodeo/event schema redesign
// ==========================================================================

// A rodeo is the top-level container (multi-day, with an entry window).
// (old db table)
export type Rodeo = {
  id: string;
  rodeoTitle: string;
  entriesOpen: string | null; // ISO date "YYYY-MM-DD"
  phoneInEntries: string | null;
  entriesClose: string | null;
  entryFee: number | null;
  location: string;
  image: string | null;
  description: string | null;
  capacity: number | null;
  createdAt: string;
};
// (current db table)
// export type Rodeo = {
//   id: string;
//   rodeoTitle: string;
//   entriesOpen: string | null; // ISO date "YYYY-MM-DD"
//   entriesClose: string | null; // ISO date "YYYY-MM-DD"
//   entryFee: number | null;
//   location: string;
//   image: string | null;
//   description: string | null;
//   capacity: number | null;
//   createdAt: string;
// };

// An event is a single competition inside a rodeo, identified by its category
// (e.g. "Bull Riding"). Matches the backend `events` table.
export type Event = {
  id: string;
  rodeoId: string;
  category: string;
  eventDate: string;
  eventTime: string;
  eventFee: number;
};

// GET /api/events/rodeos/:id returns a rodeo with these nested.
export type RodeoDetail = Rodeo & {
  dates: {
    id: string;
    rodeoId: string;
    date: string;
    startTime: string | null;
  }[];
  events: Event[];
  draws: { id: string; rodeoId: string; drawFile: string | null }[];
};

// Competitor registration for rodeo event
// (old db table)
export type Registration = {
  id: string;
  eventId: string;
  userId: string;
  partner: string | null;
  category: string;
  status: string;
  registeredAt: string | null;
};
// (current db table)
// export type Registration = {
//   id: string;
//   eventId: string;
//   userId: string;
//   competitorName: string | null;
//   status: string;
//   registeredAt: string | null;
// };

export type RegisterEventRequest = {
  userId: string;
  competitorName?: string;
};

// Result for rodeo event
// (old db table)
// export type Result = {
//   id: string;
//   eventId: string;
//   userId: string;
//   entryId: string | null;
//   category: string;
//   score?: number | null;
//   timeSeconds: number | null;
//   placement: number | null;
//   points: number;
//   money: number;
//   ground: number;
//   recordedAt: string | null;
// };
// (current db table)
export type Result = {
  id: string;
  rodeoId: string;
  rodeoTitle: string;
  rodeoLocation: string;
  rodeoStart: string;
  rodeoEnd: string;
  eventId: string;
  category: string;
  eventDate: string;
  eventTime: string;
  entryId: string;
  competitorId: string;
  competitorName: string;
  score: number | null;
  points: number | null;
  placement: number | null;
  money: number | null;
  ground: number | null;
  recordedAt: string | null;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  imageUrl: string | null;
};

// ==========================================================================
// CONVENIENCE WRAPPERS
// ==========================================================================

// Rodeos
export function getRodeos() {
  return fetchFromGateway<Rodeo[]>("/api/events/rodeos");
}
export function getRodeo(id: string) {
  return fetchFromGateway<RodeoDetail>(`/api/events/rodeos/${id}`);
}

// Events (individual competitions)
export function getEvents() {
  return fetchFromGateway<Event[]>("/api/events");
}
export function getEvent(id: string) {
  return fetchFromGateway<Event>(`/api/events/${id}`);
}

// Event Registrations (registrations for selected event)
export function getEventRegistrations(id: string) {
  return fetchFromGateway<Registration[]>(`/api/events/${id}/registrations`);
}

export function registerForEvent(
  eventId: string,
  data: RegisterEventRequest,
) {
  return fetchFromGateway<Registration>(
    `/api/events/${eventId}/register`,
    {
      method: "POST",
      body: data,
    },
  );
}

// Results
export function getResults() {
  return fetchFromGateway<Result[]>("/api/results");
}
export function getEventResults(id: string) {
  return fetchFromGateway<Result[]>(`/api/results/event/${id}`);
}
export function getCategoryResults(id: string) {
  return fetchFromGateway<Result[]>(`/api/results/standings/${id}`);
}

// Store
export function getProducts() {
  return fetchFromGateway<Product[]>("/api/store/products");
}
