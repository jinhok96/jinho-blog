// iPhone 18 Pro(모델) 보증 외 화면 가격 확인: 기기 iPhone 18 Pro → 모델 iPhone 18 Pro
// 실행: node prices18b.cjs → source-apple-iphone-screen-repair-18pro-2026-11-19.txt 뒤에 덧붙임
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ locale: 'en-US', viewport: { width: 1280, height: 1100 } })).newPage();
  await page.goto('https://support.apple.com/iphone/repair/screen-replacement?services=service', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(2000);
  const visibleSelects = async () => {
    const found = [];
    for (const s of await page.$$('select')) if (await s.isVisible()) found.push(s);
    return found;
  };
  let selects = await visibleSelects();
  await selects[0].selectOption({ label: 'iPhone 18 Pro' });
  await page.waitForTimeout(2000);
  selects = await visibleSelects();
  await selects[1].selectOption({ label: 'iPhone 18 Pro' });
  await page.waitForTimeout(2500);
  const txt = await page.evaluate(() => {
    const t = document.body.innerText;
    const i = t.indexOf('Estimated service cost');
    return t.slice(i - 120, i + 330);
  });
  fs.appendFileSync('source-apple-iphone-screen-repair-18pro-2026-11-19.txt', `\n# 가져온 시각: ${new Date().toISOString()} (보증 외 탭, 기기 iPhone 18 Pro · 모델 iPhone 18 Pro)\n${txt}\n`);
  console.log(txt);
  await browser.close();
})();
