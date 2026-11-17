/* English is the default; explicit URLs and deliberate saved choices still win. */
async page => {
  const base = new URL(".", page.url());
  const checks = [];
  const assert = (value, label) => { if (!value) throw new Error(`FAIL: ${label}`); checks.push(label); };
  const visit = async (tab, path) => {
    await tab.goto(new URL(path, base).href);
    await tab.waitForFunction(() => Boolean(window.Zimo?.navigation));
  };
  const browser = page.context().browser();
  const context = await browser.newContext({ locale: "zh-CN", reducedMotion: "reduce" });
  const tab = await context.newPage();
  try {
    await visit(tab, "index.html");
    assert(await tab.locator("html").getAttribute("lang") === "en", "a fresh visit defaults to English even with a Chinese browser locale");
    assert((await tab.locator("h1").textContent()).includes("Zimo’s blog"), "the no-query homepage renders English copy");
    await tab.setViewportSize({ width: 1440, height: 1000 });
    await tab.locator('[data-language="zh"]').click();
    assert(await tab.locator("html").getAttribute("lang") === "zh-CN", "the Chinese language button remains available");
    await visit(tab, "index.html");
    assert(await tab.locator("html").getAttribute("lang") === "zh-CN", "a deliberate saved Chinese preference is respected");
    await visit(tab, "index.html?lang=en");
    assert(await tab.locator("html").getAttribute("lang") === "en", "an explicit English URL overrides a saved Chinese preference");
    await tab.evaluate(() => localStorage.removeItem("zimo.language"));
    await visit(tab, "index.html?lang=invalid");
    assert(await tab.locator("html").getAttribute("lang") === "en", "an invalid language falls back to English");
    await visit(tab, "note.html?id=windows-to-linux-terminal-workflow");
    assert(await tab.locator("html").getAttribute("lang") === "en", "a direct article link also defaults to the English interface");
    assert((await tab.locator(".document-meta").textContent()).includes("Original text"), "Chinese-only posts are honestly labelled, not silently translated");
  } finally { await context.close(); }
  const noStorage = await browser.newContext({ reducedMotion: "reduce" });
  await noStorage.addInitScript(() => {
    Storage.prototype.getItem = function () { throw new Error("Storage blocked"); };
    Storage.prototype.setItem = function () { throw new Error("Storage blocked"); };
  });
  const blockedTab = await noStorage.newPage();
  try {
    await visit(blockedTab, "index.html");
    assert(await blockedTab.locator("html").getAttribute("lang") === "en", "blocked storage does not break the English default");
    return { passed: checks.length, checks };
  } finally { await noStorage.close(); }
}
