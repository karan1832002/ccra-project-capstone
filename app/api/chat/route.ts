// app/api/chat/route.ts
//
// Thin server-side proxy to the CCRA gateway -> ai-chat-service.
//
// Why keep this route instead of calling the gateway from the browser?
//   - GATEWAY_URL stays server-side (never shipped to the client)
//   - no CORS involved, since the browser only ever talks to our own origin
//   - the ChatWidget component needs no changes
//
// The Azure OpenAI call now lives in ai-chat-service, which also does
// rulebook retrieval (RAG) and logs conversations. This file no longer
// talks to any AI provider directly.

import { NextRequest } from "next/server";

const GATEWAY_URL = process.env.GATEWAY_URL!;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages must be a non-empty array" }), {
        status: 400,
      });
    }

    // ai-chat-service takes a single question. Send the latest user message.
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (!lastUser?.content) {
      return new Response(JSON.stringify({ error: "no user message found" }), { status: 400 });
    }

    const res = await fetch(`${GATEWAY_URL}/api/chat/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: lastUser.content }),
      cache: "no-store",
    });

    const json = await res.json();

    if (!json.success) {
      console.error("Gateway chat error:", json.error);
      return new Response(
        "Sorry, the assistant is unavailable right now. Please try again shortly.",
        { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } }
      );
    }

    // The widget reads the body as a stream. A plain-text response works
    // fine - it simply arrives in a single chunk instead of token by token.
    let answer: string = json.data.answer;

    // If the answer was grounded in the rulebook, cite the sections used.
    const sources: string[] = json.data.sources ?? [];
    if (sources.length > 0) {
      answer += `\n\nSources: ${sources.join(", ")}`;
    }

    return new Response(answer, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("Chat proxy error:", err);
    return new Response("Sorry, something went wrong. Please try again.", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}