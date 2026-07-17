import { AzureOpenAI } from "openai";
import { NextRequest } from "next/server";

const endpoint = process.env.AZURE_OPENAI_ENDPOINT!;
const apiKey = process.env.AZURE_OPENAI_API_KEY!;
const deployment = process.env.AZURE_OPENAI_DEPLOYMENT!;
const apiVersion = process.env.AZURE_OPENAI_API_VERSION!;

const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

const SYSTEM_PROMPT = `You are the CCRA Rodeo website assistant. You help visitors with
questions about upcoming events, the schedule, results/standings, the rulebook, membership,
and the online store. Be concise and friendly. If you don't know something specific to CCRA,
say so and suggest they check the relevant page or contact the association directly.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "messages must be an array" }), {
        status: 400,
      });
    }

    const stream = await client.chat.completions.create({
      model: deployment,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
}