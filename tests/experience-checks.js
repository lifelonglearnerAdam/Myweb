/* Additional browser checks for the searchable archive, deep links and licensed piano player. */
async page => {
  const base = new URL(".", page.url()).href;
  const checks = [];
  const assert = (value, label) => { if (!value) throw new Error(`FAIL: ${label}`); checks.push(label); };
  const goto = async route => {
    await page.goto(new URL(route, base).href);
    await page.waitForFunction(() => Boolean(window.Zimo?.music));
    await page.waitForFunction(() => !window.Zimo.effects.transitioning && getComputedStyle(document.querySelector(".scene-overlay")).visibility === "hidden");
  };
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "no-preference", media: "screen" });
  for (const lang of ["zh", "en"]) {
    await goto(`archive.html?lang=${lang}`);
    assert(await page.locator(".archive-entry").count() === 10, `archive indexes all seven projects and three notes in ${lang}`);
    await page.locator("#archive-query").fill("Flutter");
    assert(await page.locator(".archive-entry").count() === 1, `archive searches technical keywords in ${lang}`);
    assert(new URL(page.url()).searchParams.get("q") === "Flutter", `archive search URL can be shared in ${lang}`);
    await page.locator('[data-archive-kind="notes"]').click();
    assert(await page.locator(".archive-empty").count() === 1, `archive has a real empty state in ${lang}`);
    await page.locator("#clear-archive").click();
    assert(await page.locator(".archive-entry").count() === 10, `clear search resets both query and type in ${lang}`);
    assert(await page.locator("#archive-query").evaluate(element => element === document.activeElement), `clear search returns keyboard focus in ${lang}`);
    await page.locator('[data-archive-kind="notes"]').click();
    assert(await page.locator(".archive-entry").count() === 3, `archive notes filter in ${lang}`);
    await page.reload();
    await page.waitForFunction(() => Boolean(window.Zimo));
    assert(await page.locator(".archive-entry").count() === 3, `archive filter persists in URL in ${lang}`);
  }
  await goto("archive.html?kind=projects&q=SAT&lang=en");
  assert(await page.locator(".archive-entry").count() === 1 && (await page.locator(".archive-entry h2").textContent()).includes("SAT"), "direct archive URL searches local course-project evidence");
  await page.locator("#archive-query").fill('<img src=x onerror="window.archiveInjected=true">');
  assert(await page.evaluate(() => !window.archiveInjected), "archive search is not interpreted as HTML");
  await page.locator('[data-language="zh"]').click();
  assert(await page.evaluate(() => !window.archiveInjected), "archive search stays escaped after language re-render");
  await goto("note.html?id=local-first&lang=en");
  assert(await page.locator(".note-toc a").count() === 3, "article has a real table of contents");
  await page.locator('.note-toc a[href="#note-section-2"]').click();
  assert(new URL(page.url()).hash === "#note-section-2", "article table of contents targets a real section");
  assert(await page.evaluate(() => !window.Zimo.effects.transitioning), "article micro-navigation does not trigger a full scene transition");
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"], { origin: new URL(base).origin });
  await page.locator("[data-copy-link]").click();
  assert((await page.evaluate(() => navigator.clipboard.readText())).includes("#note-section-2"), "copy article link preserves its deep-linked section");
  await page.reload();
  await page.waitForFunction(() => Boolean(window.Zimo));
  await page.waitForFunction(() => document.getElementById("note-section-2").getBoundingClientRect().top < 250);
  assert(await page.evaluate(() => scrollY > 200), "direct article deep links scroll after local content renders");

  await page.evaluate(() => {
    localStorage.setItem("zimo.music", "off");
    localStorage.removeItem("zimo.musicVolume");
    sessionStorage.removeItem("zimo.music.position");
  });
  await goto("index.html?lang=zh");
  assert(await page.evaluate(() => !window.Zimo.music.playing && !window.Zimo.music.requested), "music respects a stored pause preference");
  await page.locator("#music-toggle").click();
  await page.waitForFunction(() => window.Zimo.music.audio.readyState >= 3 && window.Zimo.music.audio.currentTime > .2);
  assert(await page.evaluate(() => window.Zimo.music.playing && !window.Zimo.music.audio.error), "licensed piano recording really decodes and plays");
  assert(await page.evaluate(() => window.Zimo.music.audio.loop), "Canon is configured as a single-track loop");
  assert(await page.evaluate(() => window.Zimo.music.audio.volume === .18), "piano starts at a quiet default volume");
  await page.locator("#music-volume-toggle").click();
  assert(await page.locator("#music-volume-panel").isVisible(), "music volume popover opens");
  await page.locator("#music-volume-slider").evaluate(element => { element.value = "0.09"; element.dispatchEvent(new Event("input", { bubbles: true })); });
  assert(await page.evaluate(() => window.Zimo.music.audio.volume === .09 && localStorage.getItem("zimo.musicVolume") === "0.09"), "volume control changes and persists actual playback volume");
  await page.keyboard.press("Escape");
  assert(await page.locator("#music-volume-panel").isHidden(), "Escape closes the music popover");
  await page.evaluate(() => { window.Zimo.music.audio.currentTime = 42; });
  await page.locator("#music-toggle").click();
  assert(await page.evaluate(() => !window.Zimo.music.playing), "music can be paused immediately");
  await goto("project.html?id=docsift&lang=en");
  assert(await page.evaluate(() => !window.Zimo.music.playing && window.Zimo.music.audio.volume === .09), "pause and volume preferences survive a page change");
  await page.locator("#music-toggle").click();
  await page.waitForFunction(() => window.Zimo.music.audio.readyState >= 3 && window.Zimo.music.audio.currentTime >= 42);
  assert(await page.evaluate(() => window.Zimo.music.audio.currentTime < 55), "music resumes near its previous playback position");
  assert((await page.locator("#music-track-title").textContent()).includes("Canon"), "music player is translated into English");
  await page.locator("#music-toggle").click();
  await page.emulateMedia({ media: "print" });
  assert(await page.locator("#music-player").isHidden(), "music player is excluded from printed documents");
  await page.emulateMedia({ media: "screen" });
  await page.setViewportSize({ width: 320, height: 800 });
  await goto("index.html?lang=en");
  const geometry = await page.evaluate(() => {
    const music = document.getElementById("music-player").getBoundingClientRect();
    const mascot = document.getElementById("susu-launch").getBoundingClientRect();
    return { musicRight: music.right, mascotLeft: mascot.left, width: innerWidth, scroll: document.documentElement.scrollWidth };
  });
  assert(geometry.musicRight < geometry.mascotLeft, "piano player and collapsed guide do not overlap on a 320px phone");
  assert(geometry.scroll <= geometry.width, "music and archive additions do not create mobile overflow");
  await goto("archive.html?lang=en");
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "searchable archive fits a 320px phone");
  await goto("credits.html?lang=en#music-credit");
  assert((await page.locator("#music-credit").textContent()).includes("Lee Galloway") && (await page.locator("#music-credit").textContent()).includes("CC BY-SA 3.0"), "performer and recording license are publicly credited");
  return { passed: checks.length, checks };
}
