/* Chat UI regression uses mocked replies, not paid model requests. */
async page => {
  const base = new URL(".", page.url()).href;
  const checks = [], posts = [];
  const assert = (value, label) => { if (!value) throw new Error(`FAIL: ${label}`); checks.push(label); };
  const pattern = "**/api/chat";
  let mode = "ok", release;
  await page.route(pattern, async route => {
    const body = route.request().postDataJSON(); posts.push(body);
    if (mode === "network") return route.abort("failed");
    if (mode === "slow") await new Promise(resolve => { release = resolve; });
    if (mode === "daily") return route.fulfill({ status: 429, contentType: "application/json", body: JSON.stringify({ error: "daily_limit", retryAfter: 3600 }) });
    if (mode === "rate") return route.fulfill({ status: 429, contentType: "application/json", body: JSON.stringify({ error: "rate_limited", retryAfter: 1 }) });
    return route.fulfill({ status: 200, contentType: "application/json", headers: { "access-control-allow-origin": new URL(base).origin }, body: JSON.stringify({ reply: posts.length === 1 ? "记住啦，小墨，苏苏陪你一起加油～" : "小墨呀，你的小名字我还记着呢～" }) });
  });
  const cooldown = async () => page.waitForFunction(() => !document.getElementById("susu-chat-retry").disabled);
  let submittedAt = 0;
  const send = async text => {
    if (submittedAt) await page.waitForFunction(time => Date.now() - time >= 2050, submittedAt);
    await page.locator("#susu-chat-input").fill(text);
    await page.locator("#susu-chat-input").press("Enter");
    submittedAt = Date.now();
    await page.waitForFunction(() => !window.Zimo.chat.busy);
  };
  try {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(base + "?lang=zh");
    await page.waitForFunction(() => Boolean(window.Zimo.chat));
    await page.evaluate(() => { localStorage.setItem("zimo.mascot", "open"); localStorage.setItem("zimo.music", "off"); sessionStorage.setItem("zimo.susu.greeted", "true"); });
    await page.reload(); await page.waitForFunction(() => Boolean(window.Zimo.chat) && !window.Zimo.effects.transitioning);
    assert(posts.length === 0, "loading the site and preset messages do not call the model");
    await page.locator("#susu-greet").click();
    assert(await page.locator("#susu-chat-form").isVisible(), "clicking Susu opens a usable conversation immediately");
    assert((await page.locator("#susu-chat-privacy").textContent()).includes("请勿输入隐私"), "privacy notice remains visible");
    await send("叫我小墨吧，今天有点累");
    assert(posts.length === 1, "one Enter submits exactly one message");
    assert(posts[0].history.length === 0 && Object.keys(posts[0]).sort().join(",") === "history,language,message", "no private page or project data is sent");
    assert((await page.locator(".susu-chat-line.is-user p").textContent()).includes("叫我小墨"), "the visitor can see their sent message");
    assert((await page.locator(".susu-chat-line.is-assistant p").textContent()).includes("记住啦"), "Susu reply is visible as a separate conversation bubble");
    assert((await page.locator("#susu-message").textContent()).includes("记住啦"), "latest reply also appears by Susu’s face");
    assert(await page.locator("#susu-chat-input").inputValue() === "", "sent input is cleared rather than left looking unsent");
    await page.locator('[data-language="en"]').click();
    assert((await page.locator("#susu-message").textContent()).includes("记住啦"), "language switch does not overwrite a model reply with a preset");
    await page.locator('[data-language="zh"]').click();
    for (let i = 0; i < 16; i++) await send(i === 15 ? "你还记得怎么叫我吗" : `我们再聊第${i + 1}句吧`);
    assert(posts.at(-1).history.length === 32, "sixteen complete conversation turns are sent as context");
    assert(posts.at(-1).history[0].content.includes("小墨"), "earlier nickname remains in the sixteenth-turn context");
    assert(await page.locator(".susu-chat-line.is-assistant:not(.is-error)").count() >= 6, "the conversation shows prior replies rather than only an input");
    await page.locator("#susu-dismiss").click(); await page.locator("#susu-greet").click();
    assert((await page.locator("#susu-message").textContent()).includes("小墨"), "closing and reopening preserves the last reply");
    await page.locator(".project-body h3 a").first().click();
    await page.waitForFunction(() => window.Zimo.page === "project" && !window.Zimo.navigation.busy);
    await page.locator("#susu-greet").click();
    assert(await page.locator(".susu-chat-line").count() > 2 && await page.locator("#susu-chat-form").count() === 1, "soft navigation preserves conversation without duplicate forms");
    await page.locator("#susu-chat-clear").click(); submittedAt = 0;
    assert(await page.locator(".susu-chat-line").count() === 0, "Start fresh clears visible and model context");
    mode = "rate"; await send("再说一句吧");
    assert((await page.locator(".susu-chat-line.is-error p").last().textContent()).includes("慢一点"), "rate limiting gives a visible response instead of silence");
    mode = "network"; await cooldown(); await page.locator("#susu-chat-retry").click();
    await page.waitForFunction(() => !window.Zimo.chat.busy);
    assert((await page.locator(".susu-chat-line.is-error p").last().textContent()).includes("没连上"), "network failure produces a visible retry bubble");
    assert(await page.locator("#susu-chat-retry").isVisible(), "network failure offers an explicit retry");
    await page.locator("#susu-chat-clear").click(); submittedAt = 0;
    mode = "daily"; await send("还有额度吗");
    assert((await page.locator("#susu-chat-status").textContent()).includes("额度用完"), "daily budget exhaustion is distinguished from a network error");
    assert(await page.locator("#susu-chat-retry").isHidden(), "daily exhaustion does not invite pointless paid retries");
    await page.locator("#susu-chat-clear").click(); submittedAt = 0; mode = "ok";
    const callsBeforeIME = posts.length;
    await page.locator("#susu-chat-input").evaluate(input => { input.value = "输入法选字"; input.dispatchEvent(new CompositionEvent("compositionstart", { bubbles: true })); input.form.requestSubmit(); });
    assert(posts.length === callsBeforeIME, "Chinese input-method composition cannot accidentally submit a message");
    await page.locator("#susu-chat-input").evaluate(input => input.dispatchEvent(new CompositionEvent("compositionend", { bubbles: true })));
    await page.setViewportSize({ width: 390, height: 600 });
    await page.waitForFunction(() => {
      const bounds = document.getElementById("susu-bubble").getBoundingClientRect();
      return bounds.x >= 0 && bounds.y >= 0 && bounds.right <= innerWidth + 1 && bounds.bottom <= innerHeight + 1;
    });
    const bounds = await page.locator("#susu-bubble").boundingBox();
    assert(bounds.x >= 0 && bounds.y >= 0 && bounds.x + bounds.width <= 391 && bounds.y + bounds.height <= 601, "conversation stays visible on a short phone viewport");
    await page.locator("#susu-chat-clear").click();
    return { passed: checks.length, checks };
  } finally { release?.(); await page.unroute(pattern); }
}
