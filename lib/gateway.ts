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
  opts: Options = {}
): Promise<T> {
  const res = await fetch(`${GATEWAY_URL}${path}`, {
    method: opts.method ?? "GET",
    headers: { "Content-Type": "application/json" },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    next: { revalidate: opts.revalidate ?? 60 },
  });

  if (!res.ok && res.status >= 500) {
    throw new GatewayError("GATEWAY_UNAVAILABLE", `Gateway returned ${res.status}`);
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
export type Rodeo = {
  id: string;
  rodeoTitle: string;
  entriesOpen: string | null;   // ISO date "YYYY-MM-DD"
  phoneInEntries: string | null;
  entriesClose: string | null;
  entryFee: number | null;
  location: string;
  image: string | null;
  description: string | null;
  capacity: number | null;
  createdAt: string;
};

// An event is a single competition inside a rodeo.
export type Event = {
  id: string;
  rodeoId: string;
  eventTitle: string;
  eventDate: string | null;
  eventTime: string | null;
  eventFee: number | null;
};

// GET /api/events/rodeos/:id returns a rodeo with these nested.
export type RodeoDetail = Rodeo & {
  dates: { id: string; rodeoId: string; date: string; startTime: string | null }[];
  events: Event[];
  draws: { id: string; rodeoId: string; drawFile: string | null }[];
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  imageUrl: string | null;
};

// Standings are COMPUTED from results (no standings table anymore).
export type Standing = {
  rank: number;
  userId: string;
  totalPoints: number | string; // Postgres SUM returns a string
  totalMoney: number;
  entries: number | string;
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

// Store
export function getProducts() {
  return fetchFromGateway<Product[]>("/api/store/products");
}

// Standings
export function getStandings(category: string) {
  return fetchFromGateway<Standing[]>(`/api/results/standings/${category}`);
}