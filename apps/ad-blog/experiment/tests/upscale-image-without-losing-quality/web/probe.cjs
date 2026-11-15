// 업스케일 웹 도구 첫 화면 확인: 스크린샷 + 본문 일부
// 실행: node web/probe.cjs <이름> <url>
const { chromium } = require('playwright');
(async () => {
  const [name, url] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await b.newContext({ viewport: { width: 1366, height: 900 }, locale: 'en-US',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' });
  const pg = await ctx.newPage();
  try { await pg.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }); } catch (e) { console.log('goto', e.message.slice(0, 100)); }
  await pg.waitForTimeout(6000);
  await pg.screenshot({ path: `screens/${name}.png` });
  const t = await pg.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').slice(0, 1500));
  console.log(name, pg.url(), '\n', t, '\n');
  await b.close();
})();
