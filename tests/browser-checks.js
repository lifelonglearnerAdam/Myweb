/* Run with playwright-cli run-code --filename=tests/browser-checks.js after opening the local site. */
async page => {
  const base = new URL(".", page.url()).href;
  const checks = [];
  const errors = [];
  const failures = [];
  const onError = error => errors.push(error.message);
  const onResponse = response => {
    if (response.url().startsWith(base) && response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
  };
  page.on("pageerror", onError);
  page.on("response", onResponse);
  const assert = (condition, label) => { if (!condition) throw new Error(`FAIL: ${label}`); checks.push(label); };
  const settle = async () => {
    await page.waitForFunction(() => Boolean(window.Zimo));
    await page.waitForFunction(() => !window.Zimo.effects?.transitioning && (!document.querySelector(".scene-overlay") || getComputedStyle(document.querySelector(".scene-overlay")).visibility === "hidden"));
  };
  const goto = async path => { await page.goto(new URL(path, base).href); await settle(); };
  try {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion: "no-preference", colorScheme: "light" });
    await goto("index.html?lang=zh");
    await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
    await page.reload();
    await settle();
    assert(await page.locator("h1").count() === 1, "one primary heading on the homepage");
    assert(await page.locator(".project-card").count() === 4, "four featured projects");
    assert(await page.locator(".compact-project").count() === 2, "two additional engineering projects");
    assert(await page.locator(".note-card").count() === 0 && await page.locator(".empty-notes").isVisible(), "an honest empty blog instead of generated posts");
    assert(await page.evaluate(() => window.Zimo.effects.enabled), "sakura effects enabled by default");
    await page.mouse.move(50, 200);
    await page.mouse.move(750, 450, { steps: 18 });
    assert(await page.evaluate(() => window.Zimo.effects.particleCount > 0 && window.Zimo.effects.particleCount <= 64), "cursor emits a bounded sakura trail");
    await page.locator('[data-filter="ai"]').click();
    assert(await page.locator(".project-card").count() === 3, "AI project filter");
    await page.locator('[data-filter="engineering"]').click();
    assert(await page.locator(".project-card").count() === 1, "engineering project filter");
    await page.locator('[data-language="en"]').click();
    assert(await page.locator("html").getAttribute("lang") === "en", "English language attribute");
    assert((await page.locator("h1").textContent()).includes("Zimo’s blog"), "English blog title");
    assert(await page.locator(".project-card").count() === 1, "filter survives language switch");
    await page.locator('[data-filter="all"]').click();
    assert((await page.locator('.project-body h3').first().textContent()).includes("DocSift"), "localized project rendering");
    await page.reload();
    await settle();
    assert(await page.locator("html").getAttribute("lang") === "en", "language persists on reload");
    await page.locator("#theme-toggle").click();
    assert(await page.locator("html").getAttribute("data-theme") === "dark", "dark theme toggle");
    await page.reload();
    await settle();
    assert(await page.locator("html").getAttribute("data-theme") === "dark", "theme persists on reload");
    await page.locator("#theme-toggle").click();
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"], { origin: new URL(base).origin });
    await page.locator("[data-copy-email]").first().click();
    await page.waitForFunction(() => document.getElementById("toast").classList.contains("is-visible"));
    assert(await page.evaluate(() => navigator.clipboard.readText()) === "zimozeng961@gmail.com", "copy email writes the correct address");

    for (const lang of ["zh", "en"]) {
      for (const width of [320, 390, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        await goto(`index.html?lang=${lang}`);
        const geometry = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
        assert(geometry.scroll <= geometry.width + 1, `no horizontal overflow at ${width}px / ${lang}`);
      }
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await goto("index.html?lang=zh");
    assert(await page.locator("#header-navigation").isHidden(), "mobile navigation starts closed");
    await page.locator("#nav-toggle").click();
    assert(await page.locator("#header-navigation").isVisible(), "mobile navigation opens");
    await page.keyboard.press("Escape");
    assert(await page.locator("#header-navigation").isHidden(), "Escape closes mobile navigation");
    assert(await page.locator("#nav-toggle").evaluate(element => element === document.activeElement), "mobile menu restores keyboard focus");
    await page.locator("#nav-toggle").click();
    await page.locator('#header-navigation [data-nav-section="projects"]').click();
    await settle();
    assert(new URL(page.url()).hash === "#projects", "animated anchor transition lands on projects");
    assert(await page.locator("#header-navigation").isHidden(), "mobile menu closes after navigation");
    assert(await page.locator("#susu-mascot").isHidden(), "mascot is collapsed by default on mobile");
    await page.locator("#susu-launch").click();
    await page.waitForFunction(() => !document.getElementById("susu-stage").classList.contains("is-loading"));
    assert(await page.locator("#susu-mascot").isVisible(), "mascot can be expanded on mobile");
    assert(await page.locator("#susu-bubble").isVisible(), "mascot offers real navigation choices");
    await page.locator("#susu-dismiss").click();
    await page.locator("#susu-stage").click();
    assert(await page.locator("#susu-bubble").isVisible(), "mascot responds to a click");
    await page.keyboard.press("Escape");
    assert(await page.locator("#susu-bubble").isHidden(), "Escape dismisses mascot speech");
    await page.locator("#susu-minimize").click();
    assert(await page.locator("#susu-launch").isVisible(), "mascot collapse is reversible");
    await page.reload();
    await settle();
    assert(await page.locator("#susu-mascot").isHidden(), "mascot preference persists");
    await page.locator("[data-toggle-effects]").click();
    assert(await page.evaluate(() => !window.Zimo.effects.enabled), "sakura effects can be disabled");
    await page.reload();
    await settle();
    assert(await page.evaluate(() => !window.Zimo.effects.enabled), "effects preference persists");

    await page.setViewportSize({ width: 1280, height: 900 });
    for (const id of ["docsift", "miniso", "quantpilot", "ledger", "sat", "decibel", "monkeyocr"]) {
      for (const lang of ["zh", "en"]) {
        await goto(`project.html?id=${id}&lang=${lang}`);
        assert(await page.locator("h1").count() === 1 && (await page.locator("h1").textContent()).length > 0, `${id} case study renders in ${lang}`);
        assert(await page.locator(".prose li").count() >= 2, `${id} has implementation detail in ${lang}`);
      }
    }
    for (const lang of ["zh", "en"]) {
      await goto(`winter.html?lang=${lang}`);
      assert(await page.locator("[data-winter-task]").count() === 19, `winter guide has real study tasks in ${lang}`);
      assert(await page.locator("#profile-sidebar").isVisible(), `persistent sidebar is present on the guide in ${lang}`);
    }
    await goto("project.html?id=%3Cscript%3Ealert(1)%3C/script%3E&lang=en");
    assert((await page.locator("h1").textContent()).includes("isn’t here"), "unknown project IDs have a safe fallback");
    for (const lang of ["zh", "en"]) {
      await goto(`resume.html?lang=${lang}`);
      assert(await page.locator(".resume-project").count() === 5, `resume includes research and four projects in ${lang}`);
      await page.emulateMedia({ media: "print" });
      assert(await page.locator(".site-header").isHidden(), `print stylesheet hides navigation in ${lang}`);
      assert(await page.locator(".resume-sheet").isVisible(), `print stylesheet preserves resume in ${lang}`);
      await page.emulateMedia({ media: "screen" });
    }
    await goto("credits.html?lang=en");
    assert((await page.locator(".prose").textContent()).includes("CC BY-NC 4.0"), "artwork license is visible");
    for (const lang of ["zh", "en"]) {
      await page.setViewportSize({ width: 320, height: 800 });
      for (const route of [`project.html?id=docsift&lang=${lang}`, `note.html?id=not-published&lang=${lang}`, `resume.html?lang=${lang}`, `credits.html?lang=${lang}`]) {
        await goto(route);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `detail-page mobile layout: ${route}`);
      }
    }
    for (const prefix of ["", "web/"]) {
      await goto(`${prefix}about.html?lang=en`);
      assert(new URL(page.url()).hash === "#about" && await page.locator("html").getAttribute("lang") === "en", `${prefix || "root/"}legacy URL keeps language and destination`);
    }
    await page.evaluate(() => { localStorage.clear(); });
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
    await goto("index.html?lang=en");
    assert(await page.evaluate(() => !window.Zimo.effects.enabled), "reduced-motion preference disables petals and tree transitions");
    assert(await page.locator(".scene-overlay").evaluate(element => getComputedStyle(element).visibility === "hidden"), "reduced-motion users see content immediately");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    assert(errors.length === 0, `no uncaught browser errors (${errors.join("; ")})`);
    assert(failures.length === 0, `no missing local resources (${failures.join("; ")})`);
    return { passed: checks.length, checks, browserErrors: errors, failedResponses: failures };
  } finally {
    page.off("pageerror", onError);
    page.off("response", onResponse);
  }
}
