/* Test the actual published essay; no calls to a model or to onion sites from visitors' browsers. */
async page => {
  const base = new URL(".", page.url()).href;
  const checks = [], errors = [];
  const assert = (value, label) => { if (!value) throw new Error(`FAIL: ${label}`); checks.push(label); };
  const onError = error => errors.push(error.message);
  page.on("pageerror", onError);
  const goto = async path => {
    await page.goto(new URL(path, base).href);
    await page.waitForFunction(() => Boolean(window.Zimo?.navigation));
  };
  const ready = async () => {
    await page.waitForSelector('.visual-article[data-story-ready="true"]');
    await page.waitForFunction(() => [...document.styleSheets].some(sheet => sheet.href?.includes("visual-story.css")));
  };
  try {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
    await goto("index.html?lang=zh");
    await page.evaluate(() => { window.__essayPiano = window.Zimo.music?.audio; });
    const card = page.locator('.note-card[href*="tor-onion-field-notes"]');
    assert(await card.count() === 1 && await card.locator("img").count() === 1, "the first real article has its original cover on the homepage");
    await card.click();
    await ready();
    assert(await page.evaluate(() => window.__essayPiano === window.Zimo.music?.audio), "in-site navigation to the essay keeps the existing music instance");
    assert(await page.locator("h1").count() === 1, "one article-level h1, not one per frame");
    assert(await page.locator(".story-scene").count() === 9 && await page.locator(".story-frame").count() === 10, "nine frames retain all ten body visuals and the source credits");
    assert(await page.locator(".story-hero-art").count() === 1, "IMAGE2.6 cover remains separate from technical diagrams");
    assert(await page.locator(".story-frame-art").count() === 2, "both body concept artworks are explicitly identified");
    assert(!await page.evaluate(() => window.Zimo.story.playing), "auto advance never starts on its own");
    assert((await page.locator(".story-copy").allTextContents()).join(" ").includes("未完全验收"), "the unresolved Ahmia behavior remains visible, not silently removed");
    await page.screenshot({ path: ".playwright-cli/tor-essay-desktop.png" });
    for (const scene of await page.locator(".story-scene").all()) {
      await scene.scrollIntoViewIfNeeded();
      for (const image of await scene.locator("img").all()) {
        await image.evaluate(image => image.decode());
        assert(await image.evaluate(image => image.complete && image.naturalWidth > 0 && image.alt.length > 12), "each visual loads locally with meaningful alternative text");
      }
    }
    await page.locator(".story-picker").selectOption("1");
    await page.waitForFunction(() => window.Zimo.story.current === 1);
    assert((await page.locator(".story-counter").textContent()).includes("02 / 09"), "chapter selection updates the current-scene counter");
    const imageButton = page.locator(".story-scene").nth(1).locator(".story-zoom").first();
    await imageButton.click();
    assert(await page.locator(".story-lightbox").isVisible(), "diagram opens in an accessible local modal");
    await page.locator(".story-lightbox-detail").click();
    assert(await page.locator(".story-lightbox").evaluate(dialog => dialog.classList.contains("is-zoomed")), "details can be enlarged beyond phone-sized overview text");
    await page.keyboard.press("Escape");
    assert(!await page.locator(".story-lightbox").isVisible(), "Escape closes the image without navigating away");
    assert(await imageButton.evaluate(button => button === document.activeElement), "closing a large image restores keyboard focus");
    await page.locator(".story-picker").selectOption("0");
    await page.locator(".story-play").click();
    assert(await page.evaluate(() => window.Zimo.story.playing), "automatic reading requires an explicit click");
    const beforeAutoRead = await page.evaluate(() => scrollY);
    await page.waitForFunction(before => scrollY > before + 80, beforeAutoRead, { timeout: 24000 });
    assert(await page.evaluate(() => window.Zimo.story.playing), "explicit playback reveals the next screen after 20 seconds without skipping tall-scene captions");
    await page.mouse.wheel(0, 30);
    await page.waitForFunction(() => !window.Zimo.story.playing);
    assert(!await page.evaluate(() => window.Zimo.story.playing), "manual scrolling pauses playback instead of fighting the reader");
    await page.locator('[data-language="en"]').click();
    await ready();
    assert((await page.locator(".document-meta").textContent()).includes("Original text"), "English UI correctly identifies the Chinese original, not an invented translation");
    assert((await page.locator(".story-play").getAttribute("aria-label")) === "Auto read", "story controls follow the UI language");
    assert(await page.locator(".story-controls").count() === 1, "language changes do not duplicate controls or timers");
    await page.locator("#theme-toggle").click();
    await page.locator(".story-picker").selectOption("5");
    await page.screenshot({ path: ".playwright-cli/tor-essay-dark-evidence.png" });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "desktop dark layout has no horizontal overflow");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator(".story-picker").selectOption("0");
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "the 390px phone layout fits without cropping the article");
    await page.screenshot({ path: ".playwright-cli/tor-essay-mobile.png" });
    const phoneImage = page.locator(".story-scene").first().locator(".story-zoom");
    await phoneImage.click();
    await page.locator(".story-lightbox-detail").click();
    assert(await page.locator(".story-lightbox-viewport").evaluate(view => view.scrollWidth > view.clientWidth), "small screens can pan the readable full-resolution diagram");
    await page.keyboard.press("Escape");
    await page.locator("#nav-toggle").click();
    await page.locator('#profile-sidebar [data-nav-section="home"]').click();
    await page.waitForFunction(() => window.Zimo.page === "home" && !window.Zimo.navigation.busy);
    assert(await page.locator(".story-controls").count() === 0 && !await page.evaluate(() => Boolean(window.Zimo.story)), "leaving the article cleans up the player and its timers");
    await page.goBack();
    await ready();
    assert(await page.locator(".story-controls").count() === 1 && !await page.evaluate(() => window.Zimo.story.playing), "Back restores one paused storyboard");
    assert(errors.length === 0, `no browser errors: ${errors.join("; ")}`);
    return { passed: checks.length, checks, browserErrors: errors };
  } finally {
    await page.evaluate(() => window.Zimo?.story?.pause());
    page.off("pageerror", onError);
  }
}
