/* Check the actual Windows-to-Linux post without sending prompts to the site's AI backend. */
async page => {
  const base = new URL(".", page.url()).href;
  const id = "windows-to-linux-terminal-workflow";
  const checks = [], errors = [], failures = [];
  const assert = (value, label) => { if (!value) throw new Error(`FAIL: ${label}`); checks.push(label); };
  const onError = error => errors.push(error.message);
  const onResponse = response => {
    if (response.url().startsWith(base) && response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
  };
  const goto = async path => {
    await page.goto(new URL(path, base).href);
    await page.waitForFunction(() => Boolean(window.Zimo?.navigation && window.PORTFOLIO?.notes));
    await page.waitForFunction(() => !window.Zimo.effects?.transitioning);
  };
  page.on("pageerror", onError);
  page.on("response", onResponse);
  try {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
    await goto("index.html?lang=zh");
    const card = page.locator(`.note-card[href*="${id}"]`);
    assert(await card.count() === 1, "the homepage publishes the migration article once");
    assert((await page.locator(".note-card").first().getAttribute("href")).includes(id), "the new dated article appears before the older Tor essay");
    assert(await page.locator('.note-card[href*="tor-onion-field-notes"]').count() === 1, "publishing a second article preserves the first");
    await card.click();
    await page.waitForURL(`**/note.html?id=${id}*`);
    await page.waitForFunction(() => window.Zimo.page === "note" && !window.Zimo.navigation.busy);
    assert(await page.locator("h1").count() === 1 && (await page.locator("h1").textContent()).includes("从 Windows 到 Linux"), "the real post renders with the correct direction and one primary heading");
    assert(await page.locator(".document-meta time").getAttribute("datetime") === "2026-11-17", "the article displays its actual writing date");
    assert(await page.locator("#profile-sidebar").isVisible(), "the article retains desktop navigation");
    assert(await page.locator(".markdown-body pre code.language-bash").count() >= 4, "the article renders its terminal examples as code blocks");
    const contents = await page.locator(".markdown-body").textContent();
    for (const term of ["LibreOffice", "Neovim", "tmux", "pi", "Ptyxis", "26 页", "AI 辅助"]) assert(contents.includes(term), `the published body contains ${term}`);
    const targets = await page.locator(".note-toc a").evaluateAll(links => links.map(link => link.hash.slice(1)));
    assert(targets.length >= 8, "the real headings generate an article directory");
    assert(await page.evaluate(ids => ids.every(id => document.getElementById(id)), targets), "every directory link points to a real heading");
    await page.locator(".note-toc a").nth(1).click();
    assert(new URL(page.url()).hash.slice(1) === targets[1], "the article directory navigates to its section");
    const references = await page.locator(".markdown-body a").evaluateAll(links => links.map(link => ({ href: link.href, target: link.target, rel: link.rel })));
    for (const host of ["jvns.ca", "drewdevault.com", "karthinks.com"]) {
      const link = references.find(link => new URL(link.href).hostname === host);
      assert(Boolean(link && link.target === "_blank" && link.rel.includes("noopener")), `the ${host} reference is linked safely`);
    }
    await goto(`note.html?id=${id}&lang=en`);
    assert((await page.locator(".document-meta").textContent()).includes("Original text"), "the English UI identifies the Chinese original instead of fabricating a translation");
    assert((await page.locator("h1").textContent()).includes("从 Windows 到 Linux"), "the original article title survives a language change");
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      for (const lang of ["zh", "en"]) {
        await goto(`note.html?id=${id}&lang=${lang}`);
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `the real article fits ${width}px / ${lang}`);
        assert(await page.locator(".markdown-body pre").evaluateAll(blocks => blocks.every(block => block.getBoundingClientRect().right <= innerWidth + 1)), `code blocks stay within ${width}px / ${lang}`);
      }
    }
    await goto("archive.html?kind=notes&lang=zh");
    assert(await page.locator(`.archive-entry[href*="${id}"]`).count() === 1, "the notes archive includes the migration article");
    assert(await page.locator('.archive-entry[href*="tor-onion-field-notes"]').count() === 1, "the notes archive still includes the Tor essay");
    assert(errors.length === 0, `no uncaught browser errors: ${errors.join("; ")}`);
    assert(failures.length === 0, `no missing site resources: ${failures.join("; ")}`);
    return { passed: checks.length, checks, browserErrors: errors, failedResponses: failures };
  } finally {
    page.off("pageerror", onError);
    page.off("response", onResponse);
  }
}
