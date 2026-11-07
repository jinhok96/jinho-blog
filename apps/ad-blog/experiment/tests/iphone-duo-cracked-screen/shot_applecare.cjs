// AppleCare 탭의 iPhone Duo 서비스 요금 목록 부분 캡처 → price-widget-applecare.png
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ locale: 'en-US', viewport: { width: 1280, height: 1100 }, deviceScaleFactor: 1 })).newPage();
  await page.goto('https://support.apple.com/iphone/repair/screen-replacement?services=applecare', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2500);
  const r = await page.evaluate(() => {
    const leaf = [...document.querySelectorAll('*')].filter(e => e.childElementCount === 0);
    const vis = e => { const b = e.getBoundingClientRect(); return b.height > 0 && b.width > 0; };
    const est = leaf.find(e => /^Estimated service cost$/.test(e.textContent.trim()) && vis(e));
    const dev = leaf.find(e => /^Choose your device$/.test(e.textContent.trim()) && vis(e));
    const btn = leaf.filter(e => /^Get service$/.test(e.textContent.trim()) && vis(e)).map(e => e.getBoundingClientRect()).sort((a, b) => a.top - b.top).find(b => b.top > est.getBoundingClientRect().top);
    return { top: (dev || est).getBoundingClientRect().top + scrollY, bottom: btn.bottom + scrollY };
  });
  await page.screenshot({ path: 'price-widget-applecare.png', clip: { x: 140, y: r.top - 30, width: 1000, height: r.bottom - r.top + 60 }, fullPage: true });
  console.log(r);
  await browser.close();
})();
