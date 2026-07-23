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
 * can see (events list, standings, products...).
 *
 * For ADMIN actions use callGateway() in lib/gateway-client.ts instead —
 * that one attaches the verified session role.
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
    throw new GatewayError(
      "GATEWAY_UNAVAILABLE",
      `Gateway returned ${res.status}`
    );
  }

  const json = (await res.json()) as ApiResponse<T>;

  if (!json.success) {
    throw new GatewayError(json.error.code, json.error.message);
  }

  return json.data;
}

// --- Types matching what the backend services return --------------------

export type Event = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string | null;
  category: string | null;
  capacity: number | null;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  stock: number;
  imageUrl: string | null;
};

// --- Convenience wrappers -----------------------------------------------

export function getEvents() {
  return fetchFromGateway<Event[]>("/api/events");
}

export function getEvent(id: string) {
  return fetchFromGateway<Event>(`/api/events/${id}`);
}

export function getProducts() {
  return fetchFromGateway<Product[]>("/api/store/products");
}