/* A separate touch-enabled context: no simulated autoplay permission or fake user activation. */
async page => {
  const base = new URL(".", page.url()).href;
  const context = await page.context().browser().newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: "reduce" });
  const checks = [];
  const assert = (condition, label) => { if (!condition) throw new Error(`FAIL: ${label}`); checks.push(label); };
  try {
    const mobile = await context.newPage();
    await mobile.goto(base + "?lang=zh");
    await mobile.waitForFunction(() => Boolean(window.Zimo?.music && window.Zimo?.navigation));
    if (!await mobile.evaluate(() => window.Zimo.music.playing)) {
      await mobile.touchscreen.tap(140, 205);
      await mobile.waitForFunction(() => window.Zimo.music.playing && window.Zimo.music.audio.readyState >= 3);
    }
    assert(await mobile.evaluate(() => window.Zimo.music.playing && window.Zimo.music.audio.loop), "normal touch interaction starts the requested looping music");
    await mobile.locator("#susu-launch").tap();
    await mobile.waitForFunction(() => !document.getElementById("susu-stage").classList.contains("is-loading"));
    const before = await mobile.locator("#susu-mascot").boundingBox();
    const stage = await mobile.locator("#susu-stage").boundingBox();
    const client = await context.newCDPSession(mobile);
    const x = stage.x + stage.width / 2, y = stage.y + 65;
    await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
    for (let i = 1; i <= 10; i++) await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x - i * 13, y: y - i * 20 }] });
    await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    const after = await mobile.locator("#susu-mascot").boundingBox();
    assert(after.x < before.x - 100 && after.y < before.y - 100, "Susu can be dragged by a real touch sequence");
    assert(await mobile.evaluate(() => !window.Zimo.mascot.dragging), "touch release clears the drag state");
    assert(await mobile.evaluate(() => Boolean(localStorage.getItem("zimo.mascotPosition.mobile"))), "touch drag remembers the mobile position");
    assert((await mobile.locator("#susu-message").textContent()).includes("搬家成功"), "touch drag does not become a chat click");
    assert(await mobile.evaluate(() => document.documentElement.scrollWidth === innerWidth), "touch dragging does not create horizontal overflow");
    await mobile.locator("#susu-minimize").tap();
    await mobile.locator("#nav-toggle").tap();
    await mobile.locator('#header-navigation [data-nav-section="archive"]').tap();
    await mobile.waitForFunction(() => window.Zimo.page === "archive" && !window.Zimo.navigation.busy);
    assert(await mobile.evaluate(() => window.Zimo.music.playing), "music continues through touch navigation to the archive");
    assert(await mobile.locator(".archive-entry").count() === 7, "public archive is usable in a touch-enabled browser");
    await mobile.locator("#music-toggle").tap();
    assert(await mobile.evaluate(() => !window.Zimo.music.playing), "touch users can pause the background music");
    return { passed: checks.length, checks };
  } finally { await context.close(); }
}
