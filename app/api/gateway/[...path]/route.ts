// app/api/gateway/[...path]/route.ts
//
// Same-origin proxy to the CCRA API gateway. Browser (client-component) code
// calls /api/gateway/<path> and this forwards it to ${GATEWAY_URL}/<path>
// server-side. Needed because:
//   - GATEWAY_URL is a server-only env var (undefined in the browser, where it
//     would otherwise fall back to http://localhost:4000).
//   - The gateway's CORS only allows same-origin server requests, not browser
//     cross-origin calls.
// This keeps GATEWAY_URL off the client and avoids CORS entirely.

import { NextRequest, NextResponse } from "next/server";

const GATEWAY_URL = process.env.GATEWAY_URL ?? "http://localhost:4000";

async function proxy(req: NextRequest, path: string[]) {
  const target = `${GATEWAY_URL}/${path.join("/")}${req.nextUrl.search}`;

  const init: RequestInit = {
    method: req.method,
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  };
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.text();
  }

  try {
    const res = await fetch(target, init);
    const body = await res.text();
    return new NextResponse(body, {
      status: res.status,
      headers: { "Content-Type": res.headers.get("content-type") ?? "application/json" },
    });
  } catch (err) {
    console.error("[api/gateway] proxy error:", (err as Error)?.message);
    return NextResponse.json(
      { success: false, error: { code: "GATEWAY_UNREACHABLE", message: "Could not reach the API gateway." } },
      { status: 502 },
    );
  }
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path);
}

export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return proxy(req, path);
}
