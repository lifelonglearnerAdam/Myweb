/* Frontend chat uses mocked responses here; live proxy checks are explicit and separate. */
async page => {
  const base = new URL(".", page.url()).href;
  const checks = [];
  let calls = 0, posted;
  const assert = (value, label) => { if (!value) throw new Error(`FAIL: ${label}`); checks.push(label); };
  const endpoint = "https://zimo-susu-chat.zimo-personal-space.workers.dev/chat";
  await page.route(endpoint, async route => {
    calls++; posted = route.request().postDataJSON();
    await route.fulfill({ status: 200, contentType: "application/json", headers: { "access-control-allow-origin": new URL(base).origin }, body: JSON.stringify({ reply: "慢慢来呀，苏苏陪你一起加油～" }) });
  });
  try {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(base + "?lang=zh");
    await page.waitForFunction(() => Boolean(window.Zimo.chat));
    await page.evaluate(() => { localStorage.setItem("zimo.mascot", "open"); localStorage.setItem("zimo.music", "off"); sessionStorage.setItem("zimo.susu.greeted", "true"); });
    await page.reload();
    await page.waitForFunction(() => Boolean(window.Zimo.chat) && !window.Zimo.effects.transitioning);
    assert(calls === 0, "loading the site and preset lines do not call the model");
    await page.locator("#susu-greet").click();
    await page.locator("#susu-chat-toggle").click();
    assert(await page.locator("#susu-chat-form").isVisible(), "chat is explicitly opened by the visitor");
    assert((await page.locator("#susu-chat-privacy").textContent()).includes("请勿输入隐私"), "a visible privacy note precedes chat submission");
    await page.locator("#susu-chat-input").fill("今天学习有一点累");
    await page.locator("#susu-chat-send").click();
    await page.waitForFunction(() => !window.Zimo.chat.busy && document.getElementById("susu-message").textContent.includes("一起加油"));
    assert(calls === 1, "one explicit message causes one model request");
    assert(posted.message === "今天学习有一点累" && posted.history.length === 0, "first request sends only the message, language and empty history");
    assert(Object.keys(posted).sort().join(",") === "history,language,message", "no page, research, credentials or local settings enter the chat payload");
    assert(await page.locator("#susu-chat-input").inputValue() === "", "successful submission clears the input");
    await page.locator('[data-language="en"]').click();
    assert((await page.locator("#susu-chat-privacy").textContent()).includes("private details"), "chat interface switches to English");
    assert((await page.locator("#susu-message").textContent()).includes("一起加油"), "language change does not erase or reinterpret the AI reply");
    await page.waitForFunction(() => !document.getElementById("susu-chat-send").disabled);
    await page.locator("#susu-chat-input").fill("Thank you, Susu");
    await page.locator("#susu-chat-send").click();
    await page.waitForFunction(() => !window.Zimo.chat.busy);
    assert(posted.history.length === 2 && posted.language === "en", "follow-up includes only the last conversation turn");
    await page.unroute(endpoint);
    await page.route(endpoint, route => route.fulfill({ status: 429, contentType: "application/json", body: JSON.stringify({ error: "rate_limited" }) }));
    await page.waitForFunction(() => !document.getElementById("susu-chat-send").disabled);
    await page.locator("#susu-chat-input").fill("One more hello");
    await page.locator("#susu-chat-send").click();
    await page.waitForFunction(() => !window.Zimo.chat.busy);
    assert((await page.locator("#susu-message").textContent()).includes("breather"), "server rate limiting gets a short gentle fallback");
    await page.unroute(endpoint);
    await page.route(endpoint, route => route.abort("failed"));
    await page.waitForFunction(() => !document.getElementById("susu-chat-send").disabled);
    await page.locator("#susu-chat-input").fill("Are you still here?");
    await page.locator("#susu-chat-send").click();
    await page.waitForFunction(() => !window.Zimo.chat.busy);
    assert((await page.locator("#susu-message").textContent()).includes("can’t reach"), "network failure does not break the fixed companion");
    await page.locator(".project-body h3 a").first().click();
    await page.waitForFunction(() => !window.Zimo.navigation.busy && window.Zimo.page === "project");
    assert(await page.locator("#susu-chat-form").count() === 1, "soft navigation preserves one chat form rather than duplicating it");
    await page.locator("#susu-greet").click();
    await page.setViewportSize({ width: 390, height: 844 });
    const bounds = await page.locator("#susu-bubble").boundingBox();
    assert(bounds.x >= 0 && bounds.x + bounds.width <= 391 && bounds.y >= 0, "expanded chat remains within phone viewport bounds");
    return { passed: checks.length, checks };
  } finally { await page.unroute(endpoint); }
}
