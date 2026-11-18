// Apple 수리 가격 위젯에서 기기를 iPhone 18 Pro로 바꿔 보증 외·AppleCare 가격 텍스트 저장 (비교 그림용)
// 실행: node prices18.cjs → source-apple-iphone-screen-repair-18pro-2026-11-19.txt
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ locale: 'en-US', viewport: { width: 1280, height: 1100 } })).newPage();
  let out = `# 가져온 시각: ${new Date().toISOString()}\n# 원본: https://support.apple.com/iphone/repair/screen-replacement (기기 선택 iPhone 18 Pro, 보증 외·AppleCare 탭)\n`;
  for (const svc of ['service', 'applecare']) {
    await page.goto(`https://support.apple.com/iphone/repair/screen-replacement?services=${svc}`, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(2000);
    const sel = await page.$('select');
    if (sel) {
      const opts = await page.$$eval('select option', os => os.map(o => o.textContent.trim()));
      out += `\n[${svc}] select options: ${opts.join(' | ')}\n`;
      await page.selectOption('select', { label: 'iPhone 18 Pro' }).catch(e => out += 'select fail ' + e.message + '\n');
    } else {
      await page.getByText('iPhone 18 Pro', { exact: true }).first().click().catch(e => out += 'click fail ' + e.message + '\n');
    }
    await page.waitForTimeout(2500);
    // 모델 선택이 있으면 목록 출력
    const sels = await page.$$eval('select', ss => ss.map(s => [...s.options].map(o => o.textContent.trim()).join(' | ')));
    out += `[${svc}] selects: ${JSON.stringify(sels)}\n`;
    const txt = await page.evaluate(() => { const t = document.body.innerText; const i = t.indexOf('Estimated service cost'); return t.slice(Math.max(0, i - 200), i + 900); });
    out += `\n[${svc}]\n${txt}\n`;
  }
  fs.writeFileSync('source-apple-iphone-screen-repair-18pro-2026-11-19.txt', out);
  console.log(out);
  await browser.close();
})();
