const { chromium } = require('playwright');
(async () => {
  const [url, out, marker, full] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ locale: 'en-US', viewport: { width: 1100, height: 900 }, deviceScaleFactor: 2 })).newPage();
  try { await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); } catch (e) {}
  await page.waitForTimeout(3000);
  if (full) { await page.screenshot({ path: out, fullPage: false }); }
  else {
    const h = await page.evaluateHandle((m) => {
      const all = [...document.querySelectorAll('div')].filter(d => d.innerText && d.innerText.startsWith(m));
      all.sort((a, b) => a.innerText.length - b.innerText.length);
      return all[0];
    }, marker);
    const el = h.asElement();
    const box = await el.boundingBox();
    console.log(JSON.stringify(box), (await el.innerText()).slice(0, 400));
    await page.screenshot({ path: out, clip: { x: Math.max(0, box.x - 24), y: Math.max(0, box.y - 24), width: box.width + 48, height: box.height + 48 } });
  }
  await browser.close();
})();
