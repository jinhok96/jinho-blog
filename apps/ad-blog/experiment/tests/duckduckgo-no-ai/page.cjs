const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 1000 }, locale: 'en-US' });
  const p = await ctx.newPage();
  const url = process.argv[2], name = process.argv[3];
  await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(3000);
  await p.screenshot({ path: `probe/${name}.png` });
  const t = await p.evaluate(() => document.body.innerText);
  fs.writeFileSync(`probe/${name}.txt`, t);
  console.log(p.url()); console.log(t.slice(0, 800));
  await b.close();
})();
