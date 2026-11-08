// 1차 출처 페이지를 Chromium으로 열어 접힌 단락을 펼친 뒤 본문 텍스트를 머리말과 함께 저장 (tools/source_diff.cjs 비교 형식)
// 실행: node render.cjs <url> <out.txt>
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [url, out] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ locale: 'en-US', viewport: { width: 1100, height: 900 } })).newPage();
  try { await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); } catch (e) {}
  await page.waitForTimeout(2500);
  for (const el of await page.$$('a.zippy, [aria-expanded="false"], details:not([open]) > summary')) {
    try { await el.click({ timeout: 800 }); } catch (e) {}
  }
  await page.waitForTimeout(800);
  const text = await page.evaluate(() => {
    const pick = ['article', 'main', '#main', '[role=main]'];
    let art = null;
    for (const s of pick) {
      art = document.querySelector(s);
      if (art && art.innerText.trim().length > 200) break;
      art = null;
    }
    art = art || document.body;
    for (const el of art.querySelectorAll('*')) {
      if (getComputedStyle(el).display === 'none') el.style.display = 'block';
    }
    return document.title + '\n' + location.href + '\n\n' + art.innerText;
  });
  fs.writeFileSync(out, `# 가져온 시각: ${new Date().toISOString()}\n# 원본: ${url}\n` + text);
  console.log(out, text.length);
  await browser.close();
})();
