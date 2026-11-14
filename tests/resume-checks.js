/* Real bilingual PDF downloads and selected coursework, without publishing the transcript. */
async page => {
  const base = new URL('.',page.url()).href;
  const checks = [];
  const assert = (value,label) => {if(!value)throw new Error(`FAIL: ${label}`);checks.push(label);};
  await page.setViewportSize({width:1440,height:1000});
  await page.emulateMedia({reducedMotion:'reduce',media:'screen'});
  for(const lang of ['zh','en']) {
    await page.goto(new URL(`resume.html?lang=${lang}`,base).href);
    await page.waitForFunction(()=>Boolean(window.Zimo?.chat)&&!window.Zimo.effects.transitioning);
    assert(await page.locator('[data-nav-section="resume"]').getAttribute('aria-current')==='location',`résumé has its own persistent sidebar entry in ${lang}`);
    assert(await page.locator('.resume-downloads a[download]').count()===2,`two direct PDF buttons are present in ${lang}`);
    const selected=await page.evaluate(()=>window.PORTFOLIO.profile.resumeCourses);
    const coursework=await page.locator('.resume-coursework').textContent();
    assert(selected.every(c=>c.score>=85&&c.score<=100&&coursework.includes(c.name[lang])&&coursework.includes(`${c.score}/100`)),`all displayed course results are selected, numeric and at least 85 in ${lang}`);
    assert(!/学号|学生编号|U\d{8,}|累计绩点|平均分/.test(coursework),`coursework does not expose student identity or invented summary scores in ${lang}`);
    const start=page.url();
    const link=page.locator(`.resume-downloads a[href$="-${lang}.pdf"]`);
    const response=await page.request.get(new URL(await link.getAttribute('href'),page.url()).href);
    const bytes=await response.body();
    assert(response.ok()&&response.headers()['content-type'].includes('application/pdf')&&bytes.subarray(0,5).toString()==='%PDF-',`the ${lang} download is a real PDF, not a print-dialog substitute`);
    const download=page.waitForEvent('download');
    await link.click();
    const file=await download;
    assert(file.suggestedFilename()===`Zimo-Zeng-Resume-${lang}.pdf`&&await file.failure()===null,`the ${lang} PDF really downloads with the expected filename`);
    assert(page.url()===start,`downloading ${lang} does not navigate away from the résumé`);
    await page.emulateMedia({media:'print'});
    assert(await page.locator('#profile-sidebar').isHidden()&&await page.locator('.resume-toolbar').isHidden(),`printed ${lang} résumé excludes navigation and download controls`);
    assert(await page.locator('.resume-sheet').isVisible()&&await page.locator('.resume-coursework').isVisible(),`printed ${lang} résumé retains the verified course results`);
    await page.emulateMedia({media:'screen'});
  }
  await page.setViewportSize({width:320,height:800});
  await page.goto(new URL('resume.html?lang=zh',base).href);
  await page.waitForFunction(()=>Boolean(window.Zimo?.chat)&&!window.Zimo.effects.transitioning);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'résumé downloads fit the narrowest supported phone');
  assert(await page.locator('.resume-downloads a').first().isVisible()&&await page.locator('.resume-downloads a').last().isVisible(),'both PDF buttons remain reachable on a phone');
  await page.locator('#nav-toggle').click();
  assert(await page.locator('[data-nav-section="resume"]').isVisible(),'phone drawer also keeps the résumé entry');
  return {passed:checks.length,checks};
}
