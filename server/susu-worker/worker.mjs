/* Cloudflare-only proxy. No client credential, private project context, tools, or chat logs. */
import { persona } from "./persona.mjs";
const MAX_BODY_BYTES = 49152;
const MAX_INPUT_CHARACTERS = 400;
const CONTEXT_MESSAGES = 32;

export function shortReply(value, language = "zh") {
  let text = String(value || "").replace(/<[^>]*>/g, " ").replace(/https?:\/\/\S+/g, "").replace(/[*#`]/g, "").replace(/\s+/g, " ").trim();
  const sentences = Array.from(new Intl.Segmenter(language === "en" ? "en" : "zh", { granularity: "sentence" }).segment(text), part => part.segment);
  text = sentences.slice(0, 3).join("").trim();
  const limit = language === "en" ? 320 : 160;
  const characters = Array.from(text);
  if (characters.length > limit) text = characters.slice(0, limit - 1).join("").replace(/[，、,;；:：\s]+$/u, "") + (language === "en" ? "…" : "～");
  return text;
}

function replyJSON(body, status = 200, origin = "", extra = {}) {
  const headers = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", Vary: "Origin", ...extra };
  if (origin) Object.assign(headers, { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Expose-Headers": "Retry-After", "Access-Control-Max-Age": "600" });
  return new Response(JSON.stringify(body), { status, headers });
}

function allowedOrigin(request, env) {
  const origin = request.headers.get("Origin") || "";
  return (env.ALLOWED_ORIGINS || "").split(",").map(value => value.trim()).includes(origin) ? origin : "";
}

export function chatInput(body) {
  if (!body || typeof body !== "object" || typeof body.message !== "string") return null;
  const message = body.message.trim();
  if (!message || Array.from(message).length > MAX_INPUT_CHARACTERS) return null;
  const history = Array.isArray(body.history) ? body.history.slice(-CONTEXT_MESSAGES).filter(item => item && ["user", "assistant"].includes(item.role) && typeof item.content === "string").map(item => ({ role: item.role, content: Array.from(item.content).slice(0, item.role === "user" ? MAX_INPUT_CHARACTERS : 320).join("") })) : [];
  return { message, history, language: body.language === "en" ? "en" : "zh" };
}

async function visitorKey(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const day = new Date().toISOString().slice(0, 10);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${env.BUDGET_SALT}:${day}:${ip}`));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/") return replyJSON({ service: "Susu companion", status: "ready" });
    const origin = allowedOrigin(request, env);
    if (!origin) return replyJSON({ error: "origin_not_allowed" }, 403);
    if (url.pathname !== "/chat") return replyJSON({ error: "not_found" }, 404, origin);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Max-Age": "600", Vary: "Origin" } });
    if (request.method !== "POST") return replyJSON({ error: "method_not_allowed" }, 405, origin);
    if (!request.headers.get("Content-Type")?.toLowerCase().startsWith("application/json")) return replyJSON({ error: "invalid_content_type" }, 415, origin);
    if (Number(request.headers.get("Content-Length") || 0) > MAX_BODY_BYTES) return replyJSON({ error: "message_too_large" }, 413, origin);
    if (!env.UPSTREAM_API_KEY || !env.UPSTREAM_BASE_URL || !env.BUDGET_SALT || !env.CHAT_BUDGET) return replyJSON({ error: "not_configured" }, 503, origin);
    try {
      // A byte-limited stream avoids trusting a missing or dishonest Content-Length header.
      const reader = request.body?.getReader();
      if (!reader) return replyJSON({ error: "invalid_message" }, 400, origin);
      const chunks = []; let length = 0;
      while (true) {
        const part = await reader.read();
        if (part.done) break;
        length += part.value.byteLength;
        if (length > MAX_BODY_BYTES) { await reader.cancel(); return replyJSON({ error: "message_too_large" }, 413, origin); }
        chunks.push(part.value);
      }
      const bytes = new Uint8Array(length); let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
      let input;
      try { input = chatInput(JSON.parse(new TextDecoder().decode(bytes))); } catch (_) { return replyJSON({ error: "invalid_json" }, 400, origin); }
      if (!input) return replyJSON({ error: "invalid_message" }, 400, origin);
      const budget = env.CHAT_BUDGET.get(env.CHAT_BUDGET.idFromName("public-chat-budget"));
      const permit = await budget.fetch("https://budget.internal/consume", { method: "POST", body: JSON.stringify({ visitor: await visitorKey(request, env) }) });
      if (!permit.ok) {
        const seconds = Number(permit.headers.get("Retry-After")) || 60;
        return replyJSON({ error: seconds > 60 ? "daily_limit" : "rate_limited", retryAfter: seconds }, 429, origin, { "Retry-After": String(seconds) });
      }
      const upstream = new URL(env.UPSTREAM_BASE_URL.replace(/\/$/, "") + "/responses");
      if (upstream.protocol !== "https:" || upstream.username || upstream.password) return replyJSON({ error: "not_configured" }, 503, origin);
      const response = await fetch(upstream, {
        method: "POST", signal: AbortSignal.timeout(30000),
        headers: { Authorization: `Bearer ${env.UPSTREAM_API_KEY}`, "Content-Type": "application/json", "User-Agent": "Zimo-Susu-Companion/1.0" },
        body: JSON.stringify({ model: env.MODEL || "gpt-6.1-sol", instructions: persona(input.language), input: [...input.history, { role: "user", content: input.message }], max_output_tokens: 384, reasoning: { effort: "low" }, store: false })
      });
      if (!response.ok) return replyJSON({ error: "temporarily_unavailable" }, 503, origin);
      const data = await response.json();
      const text = (data.output || []).filter(item => item.type === "message").flatMap(item => item.content || []).filter(item => item.type === "output_text").map(item => item.text || "").join("") || (typeof data.output_text === "string" ? data.output_text : "");
      const reply = shortReply(text, input.language);
      if (!reply) return replyJSON({ error: "temporarily_unavailable" }, 503, origin);
      return replyJSON({ reply }, 200, origin);
    } catch (_) {
      // No upstream errors, prompts, response objects, API keys, or dialogue are logged.
      return replyJSON({ error: "temporarily_unavailable" }, 503, origin);
    }
  }
};

export class ChatBudget {
  constructor(ctx, env) { this.ctx = ctx; this.env = env; }
  async fetch(request) {
    const { visitor } = await request.json();
    if (typeof visitor !== "string" || !/^[a-f0-9]{64}$/.test(visitor)) return replyJSON({ error: "invalid_visitor" }, 400);
    const now = Date.now(), day = new Date(now).toISOString().slice(0, 10), minute = Math.floor(now / 60000);
    const dailyLimit = Math.max(1, Math.min(100, Number(this.env.MAX_DAILY_REQUESTS) || 60));
    const visitorLimit = Math.max(1, Math.min(20, Number(this.env.MAX_VISITOR_REQUESTS) || 20));
    const result = await this.ctx.storage.transaction(async transaction => {
      let state = await transaction.get("budget");
      if (!state || state.day !== day) state = { day, total: 0, visitors: {} };
      const current = state.visitors[visitor] || { total: 0, minute, burst: 0, last: 0 };
      if (current.minute !== minute) { current.minute = minute; current.burst = 0; }
      if (state.total >= dailyLimit || current.total >= visitorLimit) return { allowed: false, retry: String(Math.ceil((Date.parse(day + "T00:00:00Z") + 86400000 - now) / 1000)) };
      if (current.burst >= 10) return { allowed: false, retry: String(Math.max(1, 60 - Math.floor(now / 1000) % 60)) };
      if (now - current.last < 1500) return { allowed: false, retry: String(Math.max(1, Math.ceil((1500 - (now - current.last)) / 1000))) };
      current.total++; current.burst++; current.last = now; state.total++; state.visitors[visitor] = current;
      await transaction.put("budget", state);
      return { allowed: true };
    });
    await this.ctx.storage.setAlarm(Date.parse(day + "T00:00:00Z") + 86400000);
    return replyJSON({ allowed: result.allowed }, result.allowed ? 200 : 429, "", result.retry ? { "Retry-After": result.retry } : {});
  }
  async alarm() { await this.ctx.storage.deleteAll(); }
}
