import { SYSTEM_PROMPT } from "@/lib/chat/knowledge";
import { profile } from "@/data/portfolio";

// Both providers speak the OpenAI chat-completions format. Groq wins when its key is set.
// `models` is a fallback chain: Groq rate-limits each model separately, so when one is
// busy (HTTP 429) the same question goes to the next.
type Provider = { name: string; url: string; key: string; models: string[] };

function provider(): Provider | null {
  const override = process.env.CHAT_MODEL ? [process.env.CHAT_MODEL] : null;
  if (process.env.GROQ_API_KEY)
    return {
      name: "groq",
      url: "https://api.groq.com/openai/v1/chat/completions",
      key: process.env.GROQ_API_KEY,
      models: override ?? ["openai/gpt-oss-120b", "qwen/qwen3.8-27b", "openai/gpt-oss-20b"],
    };
  if (process.env.XAI_API_KEY)
    return {
      name: "xai",
      url: "https://api.x.ai/v1/chat/completions",
      key: process.env.XAI_API_KEY,
      models: override ?? ["grok-4.20-0309-non-reasoning"],
    };
  return null;
}

const MAX_MESSAGES = 12; // conversation turns sent upstream
const MAX_CHARS = 800; // per visitor message

// Best-effort per-IP limit. In-memory, so it resets on cold starts — the provider's
// own limits / spend cap are the hard ceiling.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return recent.length > MAX_PER_WINDOW;
}

type ChatMessage = { role: "user" | "assistant"; content: string };

function parseMessages(body: unknown): ChatMessage[] | null {
  if (!body || typeof body !== "object" || !Array.isArray((body as { messages?: unknown }).messages)) return null;
  const raw = (body as { messages: unknown[] }).messages;
  const messages: ChatMessage[] = [];
  for (const m of raw) {
    if (!m || typeof m !== "object") return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim();
    if (!text) continue;
    if (role === "user" && text.length > MAX_CHARS) return null;
    messages.push({ role, content: text.slice(0, 4000) });
  }
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") return null;
  return messages.slice(-MAX_MESSAGES);
}

const json = (status: number, error: string) => Response.json({ error }, { status });

/** Calls the provider, walking the model chain on rate limits. */
async function callModel(llm: Provider, messages: ChatMessage[], signal: AbortSignal) {
  let last: Response | null = null;
  for (const model of llm.models) {
    const res = await fetch(llm.url, {
      method: "POST",
      headers: { Authorization: `Bearer ${llm.key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: true,
        // Room for a reasoning model's brief hidden reasoning plus a short answer.
        max_tokens: 1000,
        temperature: 0.3,
        ...(model.startsWith("openai/gpt-oss") ? { reasoning_effort: "low" } : {}),
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      }),
      signal,
    });
    if (res.ok && res.body) return { res, model };
    console.error(`[chat] ${llm.name} ${model} error`, res.status, await res.text().catch(() => ""));
    last = res;
    if (res.status !== 429) break; // only rate limits are worth trying another model for
  }
  return { res: last, model: null };
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) return json(429, "You're sending messages quickly — please wait a few minutes and try again.");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json(400, "Invalid request.");
  }
  const messages = parseMessages(body);
  if (!messages) return json(400, `Please keep messages under ${MAX_CHARS} characters.`);

  const llm = provider();
  if (!llm) {
    console.error("[chat] no GROQ_API_KEY or XAI_API_KEY set");
    return json(503, `The assistant isn't available right now — you can email ${profile.email} instead.`);
  }

  const { res: upstream, model } = await callModel(llm, messages, request.signal).catch((err: unknown) => {
    console.error("[chat] network error", err);
    return { res: null, model: null };
  });

  if (!upstream || !model || !upstream.body) {
    if (upstream?.status === 429)
      return json(503, "The assistant is getting a lot of questions right now — please try again in a minute.");
    return json(502, `The assistant couldn't answer right now — try again, or email ${profile.email}.`);
  }

  // Convert the upstream SSE stream into a plain text stream of answer tokens.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";

  const stream = upstream.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const data = line.startsWith("data:") ? line.slice(5).trim() : "";
          if (!data || data === "[DONE]") continue;
          try {
            const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
            if (typeof delta === "string" && delta) controller.enqueue(encoder.encode(delta));
          } catch {
            // ignore keep-alives / partial lines
          }
        }
      },
    }),
  );

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Chat-Model": model },
  });
}
