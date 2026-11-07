// Google 도움말 화면에서 두 소제목 사이 구간을 캡처 (Chromium, 1100px 폭, 2배율)
// 실행: node shot.cjs <url> <out.png> "<시작 소제목>" "<끝 소제목>"
const { chromium } = require('playwright');
(async () => {
  const [url, out, start, end] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ locale: 'en-US', viewport: { width: 1100, height: 900 }, deviceScaleFactor: 2 })).newPage();
  try { await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); } catch (e) {}
  await page.waitForTimeout(2500);
  // 접힌 단락 펼치기
  for (const el of await page.$$('[aria-expanded="false"]')) { try { await el.click({ timeout: 1000 }); } catch (e) {} }
  await page.waitForTimeout(1000);
  const box = await page.evaluate(([s, e]) => {
    const hs = [...document.querySelectorAll('article h1, article h2, article h3')];
    const a = hs.find(h => h.innerText.trim().startsWith(s));
    const b = e ? hs.find(h => h.innerText.trim().startsWith(e)) : null;
    const ra = a.getBoundingClientRect();
    const art = document.querySelector('article').getBoundingClientRect();
    const bottom = b ? b.getBoundingClientRect().top + window.scrollY : art.bottom + window.scrollY;
    return { x: art.left, y: ra.top + window.scrollY, width: art.width, height: bottom - (ra.top + window.scrollY) };
  }, [start, end]);
  console.log(JSON.stringify(box));
  await page.screenshot({ path: out, fullPage: true, clip: { x: Math.max(0, box.x - 16), y: Math.max(0, box.y - 20), width: box.width + 32, height: box.height + 8 } });
  await browser.close();
})();
