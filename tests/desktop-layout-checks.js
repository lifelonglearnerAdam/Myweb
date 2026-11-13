/* Ensure desktop pictures are actually legible, without changing the phone composition. */
async page => {
  const base = new URL(".", page.url()).href;
  const checks = [];
  const assert = (value, label) => { if (!value) throw new Error(`FAIL: ${label}`); checks.push(label); };
  for (const language of ["zh", "en"]) {
    for (const width of [390, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(base + `?lang=${language}`);
      await page.waitForFunction(() => Boolean(window.Zimo.chat));
      const sizes = await page.evaluate(() => {
        const card = document.querySelector(".poetry-card").getBoundingClientRect();
        const photo = document.querySelector(".poetry-photo").getBoundingClientRect();
        const caption = document.querySelector(".poetry-card figcaption").getBoundingClientRect();
        return { card: card.width, photoWidth: photo.width, photoHeight: photo.height, photoY: photo.y, captionY: caption.y, scroll: document.documentElement.scrollWidth, viewport: innerWidth };
      });
      assert(sizes.scroll <= sizes.viewport + 1, `no horizontal overflow at ${width}px / ${language}`);
      if (width >= 861) {
        assert(sizes.photoWidth / sizes.card >= .43 && sizes.photoWidth / sizes.card <= .49, `desktop photograph occupies almost half the poem card at ${width}px / ${language}`);
        assert(sizes.photoHeight >= 250, `desktop photograph is not a narrow thumbnail at ${width}px / ${language}`);
      }
      if (width <= 580) assert(sizes.photoWidth > sizes.card * .95 && sizes.captionY > sizes.photoY, `phone poetry remains image-above-text at ${width}px / ${language}`);
      if (width >= 1000) assert(await page.locator(".project-card").first().evaluate(element => getComputedStyle(element).display === "grid"), `desktop projects use wide editorial rows at ${width}px / ${language}`);
    }
  }
  return { passed: checks.length, checks };
}
