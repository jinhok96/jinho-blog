const { chromium } = require('playwright');
(async () => {
  const [url, out, device] = process.argv.slice(2);
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ locale: 'en-US', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36', viewport: {width: 1280, height: 900} });
  const page = await ctx.newPage();
  try { await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); } catch (e) { console.error('goto:', e.message); }
  await page.waitForTimeout(2000);
  let clicked = false;
  if (device) {
    const loc = page.getByText(device, { exact: true }).first();
    try { await loc.click({ timeout: 5000 }); clicked = true; await page.waitForTimeout(2500); } catch (e) { console.error('click fail', e.message); }
  }
  for (let round = 0; round < 3; round++) {
    const n = await page.evaluate(() => { const els = [...document.querySelectorAll('[aria-expanded="false"]')].filter(e => !e.closest('header,nav') && e.innerText && e.innerText.length < 200 && !/English|Help Center|Log in/.test(e.innerText)); els.forEach(e => e.click()); return els.length; });
    if (!n) break; await page.waitForTimeout(1500);
  }
  const text = await page.evaluate(() => document.body ? document.body.innerText : '');
  require('fs').writeFileSync(out, `URL: ${page.url()}\nTITLE: ${await page.title()}\nDEVICE: ${device||'-'} clicked=${clicked}\nFETCHED: ${new Date().toISOString()}\n\n` + text);
  console.log(page.url(), await page.title(), clicked, text.length);
  await browser.close();
})();
