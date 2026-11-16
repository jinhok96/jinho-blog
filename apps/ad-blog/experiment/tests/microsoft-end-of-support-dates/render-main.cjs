// Microsoft Learn·지원 문서를 Chromium으로 열어 main 본문 텍스트를 저장 (render.cjs의 article 대신 main)
// 실행: node render.cjs <url> <out.txt>
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [url, out] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ locale: 'en-US', viewport: { width: 1100, height: 900 } })).newPage();
  try { await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); } catch (e) {}
  await page.waitForTimeout(2000);
  // 접힌 단락(a.zippy) 펼치기
  for (const el of await page.$$('a.zippy, [aria-expanded="false"]')) { try { await el.click({ timeout: 800 }); } catch (e) {} }
  await page.waitForTimeout(800);
  const text = await page.evaluate(() => {
    document.querySelectorAll('details').forEach(d => { d.open = true; });
    const art = document.querySelector('main#main') || document.querySelector('main') || document.body;
    // 펼치지 못한 단락은 숨김 스타일을 풀어 본문에 포함
    for (const el of art.querySelectorAll('*')) { if (getComputedStyle(el).display === 'none') el.style.display = 'block'; }
    return document.title + '\n' + location.href + '\n\n' + art.innerText;
  });
  fs.writeFileSync(out, `# 가져온 시각: ${new Date().toISOString()}\n# 원본: ${url}\n` + text);
  console.log(out, text.length);
  await browser.close();
})();
