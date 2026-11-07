// apple.com/iphone-duo 질문·답(아코디언)을 모두 펼치고 각주까지 본문 전체 텍스트 저장
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [url, out] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ locale: 'en-US', viewport: { width: 1280, height: 1000 } })).newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(1500);
  const exp = page.locator('text=Expand all').first();
  if (await exp.count()) { await exp.click().catch(() => {}); await page.waitForTimeout(1500); }
  const text = await page.evaluate(() => {
    for (const el of document.querySelectorAll('*')) { const s = getComputedStyle(el); if (s.display === 'none' && !['SCRIPT','STYLE','NOSCRIPT','TEMPLATE'].includes(el.tagName)) el.style.display = 'block'; }
    return document.title + '\n' + location.href + '\n\n' + document.body.innerText;
  });
  fs.writeFileSync(out, `# 가져온 시각: ${new Date().toISOString()}\n# 원본: ${url} (질문·답 펼침)\n` + text);
  console.log(out, text.length);
  await browser.close();
})();
