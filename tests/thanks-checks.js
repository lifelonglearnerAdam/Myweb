/* The real bilingual thanks page, its navigation, and preserved resource licenses. */
async page => {
  const base = new URL(".", page.url());
  const checks = [], errors = [];
  const assert = (value, label) => { if (!value) throw new Error(`FAIL: ${label}`); checks.push(label); };
  const onError = error => errors.push(error.message);
  const goto = async path => {
    await page.goto(new URL(path, base).href);
    await page.waitForFunction(() => Boolean(window.Zimo?.navigation) && !window.Zimo.effects.transitioning);
  };
  page.on("pageerror", onError);
  try {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await goto("index.html?lang=en");
    const nav = page.locator('#profile-sidebar [data-nav-section="thanks"]');
    assert(await nav.count() === 1 && await nav.isVisible(), "the main sidebar has a visible Thanks entry");
    assert((await nav.getAttribute("href")).includes("credits.html"), "the new entry reuses the existing credits URL");
    await page.evaluate(() => { window.__thanksMusic = window.Zimo.music.audio; });
    await nav.click();
    await page.waitForFunction(() => window.Zimo.page === "credits" && !window.Zimo.navigation.busy);
    assert(await page.evaluate(() => window.__thanksMusic === window.Zimo.music.audio), "opening Thanks preserves the music instance");
    for (const lang of ["en", "zh"]) {
      await goto(`credits.html?lang=${lang}`);
      assert(await page.locator("h1").count() === 1, `one primary heading in ${lang}`);
      assert(await page.locator('[data-nav-section="thanks"]').getAttribute("aria-current") === "location", `Thanks is the active navigation item in ${lang}`);
      assert(await page.locator("[data-thanks-person]").count() === 3, `the three requested people are credited in ${lang}`);
      const sukuna = page.locator('[data-thanks-person="sukuna"]');
      const link = sukuna.locator('a[href="https://sukuna.moe/"]');
      assert(await link.count() === 1 && await link.getAttribute("target") === "_blank" && (await link.getAttribute("rel")).includes("noopener"), `Sukuna has the exact supplied safe link in ${lang}`);
      assert(/HUST/.test(await sukuna.textContent()) && /下载|downloaded/.test(await sukuna.textContent()), `Sukuna receives both design and download-source thanks in ${lang}`);
      assert((await page.locator('[data-thanks-person="nkns"]').textContent()).includes("Neovim"), `nkns is thanked for the Neovim introduction in ${lang}`);
      const xinhan = await page.locator('[data-thanks-person="xinhan-wang"]').textContent();
      assert(["王心瀚", "Xinhan Wang", "pi", "ChatGPT"].every(term => xinhan.includes(term)), `Xinhan Wang's name and guidance are credited in ${lang}`);
      assert(await page.locator('[data-thanks-person="nkns"] a, [data-thanks-person="xinhan-wang"] a').count() === 0, `no personal URLs are invented in ${lang}`);
      for (const section of ["people-credit", "design-credit", "community-credit", "mascot-credit", "poetry-credit", "music-credit"]) assert(await page.locator(`#${section}`).count() === 1, `${section} remains addressable in ${lang}`);
      const body = await page.locator(".thanks-page").textContent();
      for (const term of ["Neovim contributors", "folke", "Mario Zechner", "legeling", "Lee Galloway", "CC BY-NC 4.0", "CC BY-SA 3.0"]) assert(body.includes(term), `${term} credit survives in ${lang}`);
      assert(await page.locator('#site-footer a[href*="credits.html"]').count() === 1, `the footer still links to credits in ${lang}`);
      for (const width of [320, 390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Thanks fits ${width}px / ${lang}`);
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await goto("index.html?lang=en");
    await page.locator("#nav-toggle").click();
    const phoneNav = page.locator('[data-nav-section="thanks"]');
    await phoneNav.scrollIntoViewIfNeeded();
    assert(await phoneNav.isVisible(), "Thanks is reachable in the mobile menu");
    await phoneNav.click();
    await page.waitForFunction(() => window.Zimo.page === "credits" && !window.Zimo.navigation.busy);
    assert(await page.locator("#profile-sidebar").isHidden(), "the mobile menu closes after opening Thanks");
    assert(errors.length === 0, `no browser errors: ${errors.join("; ")}`);
    return { passed: checks.length, checks, browserErrors: errors };
  } finally { page.off("pageerror", onError); }
}
