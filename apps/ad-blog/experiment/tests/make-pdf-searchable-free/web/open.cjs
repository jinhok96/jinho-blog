// 사용: node open.cjs URL shot.png  — 페이지를 열고 화면과 입력 요소 목록 출력
const { chromium } = require('playwright');
(async () => {
  const [url, shot] = process.argv.slice(2);
  const b = await chromium.launch({ headless: false });
  const ctx = await b.newContext({ locale: 'en-US', viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  try {
    await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  } catch (e) {
    console.log('goto', e.message);
  }
  await p.waitForTimeout(3000);
  await p.screenshot({ path: shot });
  console.log(await p.title(), p.url());
  for (const el of await p.$$('input[type=file], button, select')) {
    const t = (await el.innerText().catch(() => '')).trim().slice(0, 60);
    const id = await el.getAttribute('id');
    const cls = ((await el.getAttribute('class')) || '').slice(0, 40);
    if (t || id) console.log(await el.evaluate((e) => e.tagName), id, cls, JSON.stringify(t));
  }
  await b.close();
})();
