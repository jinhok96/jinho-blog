// 1차 출처 페이지를 Chromium으로 렌더링해 본문 글자를 source-{name}.txt로 저장
const { chromium } = require('playwright');
const fs = require('fs');
const pages = JSON.parse(process.argv[2]);
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, locale: 'en-US' });
  for (const [name, url] of pages) {
    const p = await ctx.newPage();
    try {
      await p.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
      await p.waitForTimeout(1500);
      const t = await p.evaluate(() => document.body.innerText);
      fs.writeFileSync(`source-${name}.txt`, `URL: ${url}\nFetched: ${new Date().toISOString()}\nFinal URL: ${p.url()}\n\n${t}`);
      console.log(name, p.url(), t.length);
    } catch (e) { console.log(name, 'ERR', e.message.split('\n')[0]); }
    await p.close();
  }
  await b.close();
})();
