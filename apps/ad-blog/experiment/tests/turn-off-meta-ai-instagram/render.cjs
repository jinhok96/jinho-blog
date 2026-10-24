const { chromium } = require('playwright');
(async () => {
  const [url, out] = process.argv.slice(2);
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ locale: 'en-US', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36', viewport: {width: 1280, height: 900} });
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  } catch (e) { console.error('goto:', e.message); }
  await page.waitForTimeout(3000);
  const text = await page.evaluate(() => document.body ? document.body.innerText : '');
  require('fs').writeFileSync(out, `URL: ${page.url()}\nTITLE: ${await page.title()}\nFETCHED: ${new Date().toISOString()}\n\n` + text);
  console.log(page.url(), (await page.title()), text.length);
  await browser.close();
})();
