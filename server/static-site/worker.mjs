/* Serve public assets normally; chat stays on the website's own origin.
 * A service binding reaches the private proxy inside Cloudflare, not via another public hostname.
 * No upstream credential exists in this Worker or in the browser. */
// Audio seeking and PDF viewers need byte ranges, which the asset binding may ignore.
async function staticAsset(request, assets) {
  const url = new URL(request.url);
  if (!/^\/assets\/(?:audio|resume)\//.test(url.pathname) || !["GET", "HEAD"].includes(request.method)) return assets.fetch(request);
  const upstreamHeaders = new Headers(request.headers);
  upstreamHeaders.delete("Range"); upstreamHeaders.delete("If-Range"); upstreamHeaders.set("Accept-Encoding", "identity");
  const response = await assets.fetch(new Request(request, { headers: upstreamHeaders }));
  if (response.status !== 200 || !/^(?:audio\/|application\/pdf)/i.test(response.headers.get("Content-Type") || "")) return response;
  const headers = new Headers(response.headers); headers.set("Accept-Ranges", "bytes");
  const full = () => new Response(response.body, { status: 200, headers });
  const range = request.headers.get("Range");
  if (!range || request.method === "HEAD") return full();
  const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if (!match || (!match[1] && !match[2])) return full(); // Ignore unsupported multi-range requests.
  const validator = request.headers.get("If-Range");
  if (validator && (validator.startsWith("W/") || (validator !== headers.get("ETag") && validator !== headers.get("Last-Modified")))) return full();
  if (Number(headers.get("Content-Length")) > 8 * 1024 * 1024) return full();
  const body = await response.arrayBuffer(), size = body.byteLength;
  const suffix = match[1] === "";
  let start = suffix ? Math.max(0, size - Number(match[2])) : Number(match[1]);
  let end = suffix || !match[2] ? size - 1 : Math.min(size - 1, Number(match[2]));
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start < 0 || start >= size || start > end || (suffix && !(Number(match[2]) > 0))) {
    headers.set("Content-Range", `bytes */${size}`); headers.set("Content-Length", "0");
    return new Response(null, { status: 416, headers });
  }
  headers.delete("Content-Encoding"); headers.set("Content-Range", `bytes ${start}-${end}/${size}`); headers.set("Content-Length", String(end - start + 1));
  return new Response(body.slice(start, end + 1), { status: 206, headers });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/chat") return staticAsset(request, env.ASSETS);
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
