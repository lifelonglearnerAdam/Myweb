# Susu’s one-sentence chat proxy

The public homepage never receives an upstream API key. An optional, user-initiated chat calls this Cloudflare Worker, which uses the owner-configured model **`gpt-6.1-sol`** via the Responses API.

## Character and output

The persona is a **server-side system prompt**, not a browser skill: gentle, friendly, cute but not clingy, no stage directions, no invented knowledge about the owner, and one tiny sentence. `shortReply()` imposes an additional one-sentence / character limit. The upstream request is capped at 160 output tokens.

Preset companion lines never call the model. Only the explicit chat form sends a message. It sends at most six previous turns, kept only in browser memory; Start fresh or a refresh clears them. No file, page text, private research, model configuration, or API credential is included in the prompt.

## Cost and abuse limits

A single SQLite-backed Durable Object shares the budget across Worker locations:

- **60 model requests per UTC day for the entire public site**.
- **20 requests per source IP per UTC day**, with daily salted hashed identifiers, not stored raw addresses.
- At most 10 requests per minute per source and a 1.5-second server minimum interval; the client holds a 2-second interval. This permits natural short replies while the global daily budget remains unchanged.
- Reservations count even if the model request fails; failures do not create unlimited retries.
- Input is limited to 160 characters and a byte-limited JSON body.
- Only allowlisted site origins may call the proxy. Origin checking alone is not authentication; the shared hard budget is the backstop against a fabricated Origin or distributed abuse.
- No chat body or upstream response/error is logged. Only short-lived request counters are persisted; an alarm removes them at the next UTC day.

The Worker/Durable Object uses the Cloudflare free plan. **Model requests still consume the owner's upstream API balance.** No paid Cloudflare plan is enabled by this setup. The daily model cap can be lowered by changing `MAX_DAILY_REQUESTS`; code also imposes a maximum of 100.

## Secrets

The following values are **Cloudflare Worker Secrets only**, never committed or copied into frontend code:

- `UPSTREAM_API_KEY`
- `UPSTREAM_BASE_URL` — HTTPS URL ending with `/v1`.
- `BUDGET_SALT` — random secret used for the daily source identifier.

Deploy using an authenticated Wrangler session:

```bash
wrangler deploy --config server/susu-worker/wrangler.jsonc
wrangler secret put UPSTREAM_API_KEY --config server/susu-worker/wrangler.jsonc
wrangler secret put UPSTREAM_BASE_URL --config server/susu-worker/wrangler.jsonc
wrangler secret put BUDGET_SALT --config server/susu-worker/wrangler.jsonc
```

Wrangler itself is not a frontend dependency. The site remains plain static HTML/CSS/JavaScript; only chat uses this separate backend.

## Maintenance

- The free homepage calls its own **`/api/chat`**, handled by `server/static-site/worker.mjs` and forwarded over the **`SUSU_CHAT` service binding** inside Cloudflare. The browser no longer contacts the proxy's separate public subdomain. GitHub Pages calls the free homepage's `/api/chat` endpoint with CORS.
- The conversation visibly shows both sides, thinking, connection failure/retry, and daily limits. Failed messages and presets never enter model context. There are no automatic upstream retries.
- Public endpoint selection is configured in `assets/js/companion-chat.js`.
- Allowed site origins and the daily caps live in `wrangler.jsonc`.
- Changing a site domain requires adding its exact origin, redeploying, and testing CORS.
- Delete/disable the Worker or remove its upstream secret to disable AI replies. Preset lines and the rest of the website continue working.
- To change character style, edit `persona()` here; do not add private projects or research as model context.

Tests: `node --test tests/worker.test.mjs`.
