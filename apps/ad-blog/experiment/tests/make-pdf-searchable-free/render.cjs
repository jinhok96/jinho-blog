// 1차 출처 페이지를 Chromium으로 열어 본문 텍스트를 저장 (source_diff.cjs가 다시 비교하는 머리말 형식)
// 실행: node render.cjs <url> <out.txt> [선택자]   선택자 기본값: main → article → body
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [url, out, sel] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ locale: 'en-US', viewport: { width: 1280, height: 900 } })).newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  } catch (e) {}
  await page.waitForTimeout(2500);
  for (const el of await page.$$('details:not([open]) > summary')) {
    try {
      await el.click({ timeout: 500 });
    } catch (e) {}
  }
  const text = await page.evaluate((s) => {
    const root =
      (s && document.querySelector(s)) ||
      document.querySelector('main') ||
      document.querySelector('article') ||
      document.body;
    return document.title + '\n' + location.href + '\n\n' + root.innerText;
  }, sel);
  fs.writeFileSync(out, `# 가져온 시각: ${new Date().toISOString()}\n# 원본: ${url}\n` + text);
  console.log(out, text.length);
  await browser.close();
})();
