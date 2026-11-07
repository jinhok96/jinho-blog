// Apple 사용 설명서 화면에서 지정한 소제목부터 다음 소제목 전까지 캡처 (Chromium, 1100px 폭, 2배율)
// 실행: node shot.cjs <url> <out.png> "<시작 소제목>" "<끝 소제목>"
const { chromium } = require('playwright');
(async () => {
  const [url, out, start, end] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ locale: 'en-US', viewport: { width: 1100, height: 900 }, deviceScaleFactor: 2 })).newPage();
  try { await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); } catch (e) {}
  await page.waitForTimeout(2500);
  const box = await page.evaluate(([s, e]) => {
    const art = document.querySelector('#article-section .AppleTopic') || document.querySelector('#article-section');
    const hs = [...art.querySelectorAll('h1, h2, h3')];
    const a = hs.find(h => h.innerText.trim().startsWith(s));
    const b = e ? hs.find(h => h.innerText.trim().startsWith(e)) : null;
    const ra = a.getBoundingClientRect();
    const r = art.getBoundingClientRect();
    const bottom = b ? b.getBoundingClientRect().top + window.scrollY : r.bottom + window.scrollY;
    return { x: r.left, y: ra.top + window.scrollY, width: r.width, height: bottom - (ra.top + window.scrollY), tags: hs.map(h => h.tagName + ':' + h.innerText.trim().slice(0, 40)) };
  }, [start, end]);
  console.log(JSON.stringify(box));
  await page.screenshot({ path: out, fullPage: true, clip: { x: Math.max(0, box.x - 16), y: Math.max(0, box.y - 20), width: box.width + 32, height: box.height + 8 } });
  await browser.close();
})();
