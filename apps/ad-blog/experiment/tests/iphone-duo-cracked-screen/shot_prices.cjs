// Apple 수리 가격 위젯(iPhone Duo 선택 상태) 부분만 캡처: 보증 외(service)·AppleCare(applecare) 두 탭
// 실행: node shot_prices.cjs  → price-widget-service.png, price-widget-applecare.png (+ 내부 화면 줄 위치 JSON)
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ locale: 'en-US', viewport: { width: 1280, height: 1100 }, deviceScaleFactor: 1 })).newPage();
  const out = {};
  for (const svc of ['service', 'applecare']) {
    await page.goto(`https://support.apple.com/iphone/repair/screen-replacement?services=${svc}`, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(2500);
    const box = await page.evaluate(() => {
      const all = [...document.querySelectorAll('h2,h3,p,span,div,a,button')];
      const top = all.find(e => e.childElementCount === 0 && /How much will it cost\?/.test(e.textContent));
      const est = all.filter(e => e.childElementCount === 0 && /^Get service$/.test(e.textContent.trim())).map(e => e.getBoundingClientRect()).find(r => r.height > 0);
      const inner = all.find(e => e.childElementCount === 0 && /^Inner display damage$/.test(e.textContent.trim()));
      const t = top.getBoundingClientRect(); const ir = inner ? inner.parentElement.getBoundingClientRect() : null;
      return { x: 0, y: t.top + scrollY - 30, h: (est.bottom + scrollY + 30) - (t.top + scrollY - 30), inner: ir && { x: ir.left, y: ir.top + scrollY, w: ir.width, h: ir.height } };
    });
    await page.screenshot({ path: `price-widget-${svc}.png`, clip: { x: 140, y: box.y, width: 1000, height: box.h }, fullPage: true });
    out[svc] = { clip: { x: 140, y: box.y, width: 1000, height: box.h }, inner: box.inner };
  }
  fs.writeFileSync('price-widget-boxes.json', JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out));
  await browser.close();
})();
