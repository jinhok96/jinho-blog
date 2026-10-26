// 도움말 문서 본문의 링크(텍스트 → 주소) 목록 출력
// 실행: node links.cjs <url>
const { chromium } = require('playwright');
(async () => {
  const [url] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ locale: 'en-US' })).newPage();
  try { await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); } catch (e) {}
  await page.waitForTimeout(1500);
  const links = await page.evaluate(() => [...(document.querySelector('article') || document.body).querySelectorAll('a[href]')].map(a => a.innerText.trim().replace(/\s+/g, ' ') + ' -> ' + a.href));
  console.log([...new Set(links)].join('\n'));
  await browser.close();
})();
