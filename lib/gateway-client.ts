// lib/gateway-client.ts
//
// Authenticated counterpart to lib/gateway.ts's fetchFromGateway(). Use this
// for ADMIN actions — anything that needs a verified user id/role attached,
// like GET /api/events/:id/registrations.
//
// SERVER-SIDE ONLY. This reads cookies via next/headers to verify the
// Better-Auth session, which only works in Server Components, Route
// Handlers, and Server Actions. Never import this from a "use client" file,
// and never expose FRONTEND_GATEWAY_KEY via NEXT_PUBLIC_*.
//
// ASSUMPTIONS TO CONFIRM (I can't see the Azure gateway's own code, so these
// are my best guess at a reasonable contract, not a verified one):
//   - Header names below (`x-frontend-gateway-key`, `x-user-id`,
//     `x-user-role`) are placeholders. If the gateway's auth middleware
//     expects e.g. `Authorization: Bearer <key>` instead, change them to
//     match — otherwise every call here will also 403.
//   - Import path `@/lib/auth` — point this at wherever betterAuth({...})
//     is actually exported from if it's not lib/auth.ts.
//   - `Role` and `Registration` types are placeholders based on what little
//     we know (user.role defaults to "member" in auth.ts). Tighten these up
//     once you know the real role set and the registrations response shape.

import "server-only";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { GatewayError } from "@/lib/gateway";

const GATEWAY_URL = process.env.GATEWAY_URL ?? "http://localhost:4000";
const FRONTEND_GATEWAY_KEY = process.env.FRONTEND_GATEWAY_KEY;

type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: { code: string; message: string } };

type Options = {
  method?: string;
  body?: unknown;
};

// Matches the additionalFields.role shape in auth.ts. Extend this union as
// real roles beyond "member" get added (this file assumes "admin"/"staff"
// exist — adjust to whatever you actually use).
type Role = "member" | "staff" | "admin" | "superadmin";

async function getVerifiedSession() {
  const incomingHeaders = await headers();
  const session = await auth.api.getSession({ headers: incomingHeaders });
  if (!session?.user) {
    throw new GatewayError("UNAUTHENTICATED", "No active session.");
  }
  return session;
}

/**
 * Calls an authenticated gateway route with the caller's verified user id
 * and role attached.
 *
 * Throws GatewayError("UNAUTHENTICATED") if there's no session, or
 * GatewayError("FORBIDDEN") if `allowedRoles` is given and the session's
 * role isn't in it. That local check just fails fast — the gateway should
 * still enforce its own authorization independently; this isn't a
 * replacement for that.
 */
export async function callGateway<T>(
  path: string,
  opts: Options & { allowedRoles?: Role[] } = {},
): Promise<T> {
  if (!FRONTEND_GATEWAY_KEY) {
    throw new GatewayError(
      "GATEWAY_MISCONFIGURED",
      "FRONTEND_GATEWAY_KEY is not set — the gateway will reject this request.",
    );
  }

  const session = await getVerifiedSession();
  const role = ((session.user as { role?: string }).role ?? "member") as Role;

  if (opts.allowedRoles && !opts.allowedRoles.includes(role)) {
    // Deliberately a different code/message than the gateway's own FORBIDDEN
    // response — this lets callers (and diagnostics) tell "blocked locally,
    // before any network call" apart from "the gateway itself said no".
    throw new GatewayError(
      "FORBIDDEN_LOCAL",
      `Blocked before reaching the gateway: role "${role}" is not in the allowed list.`,
    );
  }

  const res = await fetch(`${GATEWAY_URL}${path}`, {
    method: opts.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      "x-frontend-gateway-key": FRONTEND_GATEWAY_KEY,
      "x-user-id": session.user.id,
      "x-user-role": role,
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    // Admin data shouldn't be served from Next's fetch cache.
    cache: "no-store",
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
// CONVENIENCE WRAPPERS
// ==========================================================================

// Placeholder shape — replace once you've seen a real (non-Forbidden)
// response body from this endpoint.
export type Registration = {
  id: string;
  eventId: string;
  userId: string;
  entryId?: string;
};

export function getEventRegistrations(eventId: string) {
  return callGateway<Registration[]>(`/api/events/${eventId}/registrations`, {
    allowedRoles: ["admin", "staff", "superadmin"],
  });
}