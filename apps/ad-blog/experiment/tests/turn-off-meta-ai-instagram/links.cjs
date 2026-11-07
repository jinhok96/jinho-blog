const { chromium } = require('playwright');
(async () => {
  const [url, filter] = process.argv.slice(2);
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ locale: 'en-US', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36' });
  const page = await ctx.newPage();
  try { await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); } catch (e) { console.error('goto:', e.message); }
  await page.waitForTimeout(2500);
  const links = await page.evaluate(() => [...document.querySelectorAll('a')].map(a => [a.innerText.trim().replace(/\s+/g,' '), a.href]));
  const re = new RegExp(filter || '.', 'i');
  for (const [t, h] of links) if (re.test(t)) console.log(t, '|', h);
  await browser.close();
})();
