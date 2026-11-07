const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 1100 }, locale: 'en-US' });
  for (const host of ['noai.duckduckgo.com', 'duckduckgo.com']) {
    const p = await ctx.newPage();
    await p.goto(`https://${host}/settings`, { waitUntil: 'networkidle', timeout: 60000 });
    await p.waitForTimeout(2000);
    const r = await p.evaluate(() => [...document.querySelectorAll('input[type=checkbox],select')].map(e => ({id:e.id, vis: !!e.offsetParent, checked:e.checked, value:e.value})).filter(x => /kbg|kbe|kbl|kbj/.test(x.id)));
    console.log(host, JSON.stringify(r));
    const el = await p.$('#setting_kbj');
    if (el) { await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(500); }
    await p.screenshot({ path: `probe/${host}-settings-general-kbj.png` });
    await p.close();
  }
  await b.close();
})();
