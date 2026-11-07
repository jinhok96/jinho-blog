// 페이지 본문 텍스트 저장 (script·style 제거, 접힌 단락 펼침). 실행: node render2.cjs <url> <out.txt>
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [url, out] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ locale: 'en-US', viewport: { width: 1280, height: 1000 } })).newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(1500);
  const text = await page.evaluate(() => {
    document.querySelectorAll('script,style,noscript,template,svg').forEach(e => e.remove());
    for (const el of document.querySelectorAll('*')) { if (getComputedStyle(el).display === 'none') el.style.display = 'block'; }
    return document.title + '\n' + location.href + '\n\n' + document.body.innerText;
  });
  fs.writeFileSync(out, `# 가져온 시각: ${new Date().toISOString()}\n# 원본: ${url}\n` + text);
  console.log(out, text.length);
  await browser.close();
})();
