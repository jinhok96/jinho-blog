const { chromium } = require('playwright');
(async () => {
  const urls = process.argv.slice(2);
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ locale: 'en-US', viewport: { width: 1280, height: 900 } });
  for (const u of urls) {
    const page = await ctx.newPage();
    let st = '';
    try { const r = await page.goto(u, { waitUntil: 'domcontentloaded', timeout: 45000 }); st = r && r.status(); } catch (e) { st = 'ERR ' + e.message.slice(0, 80); }
    await page.waitForTimeout(4000);
    const name = u.replace(/https?:\/\//, '').replace(/[^a-z0-9]+/gi, '_').slice(0, 60);
    await page.screenshot({ path: `shots/probe-${name}.png` });
    const t = (await page.title()).slice(0, 80);
    const inputs = await page.$$eval('input[type=file]', els => els.map(e => e.accept || '(any)'));
    console.log(st, u, '|', t, '| file inputs:', inputs.length, inputs.join(' ; ').slice(0, 120));
    await page.close();
  }
  await browser.close();
})();
