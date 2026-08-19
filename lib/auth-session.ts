import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// Returns the verified Better-Auth session, memoized per request via React's
// cache(). The admin layout, each page's requireAdmin() guard, and every
// callGateway() helper all need the session; without this each one re-runs a
// separate DB lookup. Memoizing collapses those into a single lookup per
// request, which removes the biggest source of admin-page latency.
export const getCachedSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});
