/* Internal browser step for: python3 scripts/build_resumes.py */
async page => {
  if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(page.url()).hostname)) throw new Error('Open the local preview before exporting PDFs.');
  const base = new URL('.', page.url());
  const tab = await page.context().newPage();
  const files = [];
  try {
    for (const language of ['zh', 'en']) {
      await tab.goto(new URL(`resume.html?lang=${language}`, base).href);
      await tab.waitForFunction(() => Boolean(window.Zimo?.chat && document.querySelectorAll('.resume-project').length));
      await tab.evaluate(async () => { window.Zimo.music.audio.pause(); window.Zimo.effects.setEnabled(false, false); document.documentElement.dataset.theme = 'light'; await document.fonts.ready; });
      await tab.emulateMedia({ media: 'print', reducedMotion: 'reduce' });
      const filename = `Zimo-Zeng-Resume-${language}.pdf`;
      const pdf = await tab.pdf({ path: `assets/resume/${filename}`, format: 'A4', preferCSSPageSize: true, printBackground: false, displayHeaderFooter: false });
      files.push({ filename, bytes: pdf.length, language });
    }
    return { files };
  } finally { await tab.close(); }
}
