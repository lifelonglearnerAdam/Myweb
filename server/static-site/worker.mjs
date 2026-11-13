/* Serve public assets normally; chat stays on the website's own origin.
 * A service binding reaches the private proxy inside Cloudflare, not via another public hostname.
 * No upstream credential exists in this Worker or in the browser. */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/chat") return env.ASSETS.fetch(request);
    if (!["POST", "OPTIONS"].includes(request.method)) {
      return Response.json({ error: "method_not_allowed" }, { status: 405, headers: { Allow: "POST, OPTIONS", "Cache-Control": "no-store" } });
    }
    if (!env.SUSU_CHAT) return Response.json({ error: "temporarily_unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
    try {
      // Preserve Origin and the trusted client-IP header for the proxy's validation and budget.
      const forwarded = new Request("https://susu.internal/chat", request);
      return await env.SUSU_CHAT.fetch(forwarded);
    } catch (_) {
      return Response.json({ error: "temporarily_unavailable" }, { status: 503, headers: { "Cache-Control": "no-store", "Access-Control-Allow-Origin": request.headers.get("Origin") === url.origin ? url.origin : "https://lifelonglearneradam.github.io", Vary: "Origin" } });
    }
  }
};
