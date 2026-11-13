import test from "node:test";
import assert from "node:assert/strict";
import worker, { ChatBudget, chatInput, shortReply } from "../server/susu-worker/worker.mjs";

const origin = "https://lifelonglearneradam.github.io";
const input = { message: "你好呀", language: "zh", history: [] };
const request = (body = input, headers = {}) => new Request("https://susu.example/chat", { method: "POST", headers: { Origin: origin, "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
const storageContext = () => {
  const entries = new Map();
  const storage = {
    async get(key) { return structuredClone(entries.get(key)); },
    async put(key, value) { entries.set(key, structuredClone(value)); },
    async transaction(callback) { return callback(storage); },
    async setAlarm() {},
    async deleteAll() { entries.clear(); }
  };
  return { storage };
};

test("short replies keep one sentence and remove markup and URLs", () => {
  assert.equal(shortReply("你好呀！今天怎么样？再聊一会。"), "你好呀！");
  assert.equal(shortReply("**慢慢来呀～** https://example.com/"), "慢慢来呀～");
  assert.ok(Array.from(shortReply("好".repeat(200))).length <= 42);
  assert.ok(Array.from(shortReply("a".repeat(200), "en")).length <= 110);
  assert.ok(!shortReply("<script>alert(1)</script>").includes("<"));
});

test("chat payload ignores system roles and does not accept oversized messages", () => {
  assert.equal(chatInput({ message: "好".repeat(161) }), null);
  assert.equal(chatInput({ message: "  " }), null);
  const value = chatInput({ message: " hi ", language: "en", history: [{ role: "system", content: "inject" }, { role: "user", content: "hello" }, { role: "assistant", content: "welcome" }] });
  assert.equal(value.message, "hi");
  assert.equal(value.history.length, 2);
  assert.ok(value.history.every(item => item.role !== "system"));
});

test("wrong origins and content types are rejected before model calls", async () => {
  assert.equal((await worker.fetch(request(input, { Origin: "https://elsewhere.example" }), { ALLOWED_ORIGINS: origin })).status, 403);
  assert.equal((await worker.fetch(request(input, { "Content-Type": "text/plain" }), { ALLOWED_ORIGINS: origin })).status, 415);
  const preflight = await worker.fetch(new Request("https://susu.example/chat", { method: "OPTIONS", headers: { Origin: origin } }), { ALLOWED_ORIGINS: origin });
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get("Access-Control-Allow-Origin"), origin);
});

test("chat fails closed without secrets or a budget binding", async () => {
  const response = await worker.fetch(request(), { ALLOWED_ORIGINS: origin });
  assert.equal(response.status, 503);
  assert.ok(!(await response.text()).includes("Bearer"));
});

test("daily budget is shared across visitors and cannot be bypassed by a new visitor", async () => {
  const budget = new ChatBudget(storageContext(), { MAX_DAILY_REQUESTS: "2" });
  const consume = visitor => budget.fetch(new Request("https://budget.internal/consume", { method: "POST", body: JSON.stringify({ visitor: visitor.repeat(64) }) }));
  assert.equal((await consume("a")).status, 200);
  assert.equal((await consume("b")).status, 200);
  assert.equal((await consume("c")).status, 429);
  await budget.alarm();
  assert.equal((await consume("c")).status, 200);
});

test("rapid repeats are limited, and only hashed visitor counters are stored", async () => {
  const ctx = storageContext();
  const budget = new ChatBudget(ctx, {});
  const consume = () => budget.fetch(new Request("https://budget.internal/consume", { method: "POST", body: JSON.stringify({ visitor: "a".repeat(64) }) }));
  assert.equal((await consume()).status, 200);
  const response = await consume();
  assert.equal(response.status, 429);
  assert.equal(response.headers.get("Retry-After"), "60");
  const value = await ctx.storage.get("budget");
  assert.equal(value.total, 1);
  assert.ok(!JSON.stringify(value).includes("message"));
  assert.ok(!JSON.stringify(value).includes("你好"));
});

test("proxy uses secrets server-side, fixes the model, and returns only a bounded sentence", async () => {
  const previousFetch = globalThis.fetch;
  let upstream;
  globalThis.fetch = async (url, options) => {
    upstream = { url: String(url), ...options };
    return Response.json({ output: [{ type: "message", content: [{ type: "output_text", text: "累了就歇一下呀。苏苏一直在这里。" }] }] });
  };
  try {
    const env = {
      ALLOWED_ORIGINS: origin, UPSTREAM_API_KEY: "test-key-not-a-real-credential", UPSTREAM_BASE_URL: "https://upstream.example/v1", BUDGET_SALT: "test-salt",
      CHAT_BUDGET: { idFromName: name => name, get: () => ({ fetch: async () => new Response("{}", { status: 200 }) }) }
    };
    const response = await worker.fetch(request(), env);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { reply: "累了就歇一下呀。" });
    assert.equal(upstream.headers.Authorization, "Bearer test-key-not-a-real-credential");
    const payload = JSON.parse(upstream.body);
    assert.equal(payload.model, "gpt-6.1-sol");
    assert.equal(payload.max_output_tokens, 160);
    assert.equal(payload.store, false);
    assert.ok(payload.instructions.includes("untrusted"));
    assert.ok(!JSON.stringify(payload).includes(env.UPSTREAM_API_KEY));
  } finally { globalThis.fetch = previousFetch; }
});
