// arc.net 첫 화면의 Timeline 구역을 2배율로 캡처 (2026-10-25, Chromium). 실행: node shot.cjs
const { chromium } = require('/opt/node-tools/node_modules/playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
  await p.goto('https://arc.net/', { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(3000);
  const box = await p.evaluate(() => {
    const el = [...document.querySelectorAll('*')].find(e => e.childElementCount === 0 && e.textContent.trim() === 'Timeline');
    const r = el.getBoundingClientRect();
    return { y: r.top + window.scrollY };
  });
  await p.screenshot({ path: 'arc-net-timeline.png', fullPage: true, clip: { x: 140, y: box.y - 30, width: 990, height: 620 } });
  await b.close();
})();
