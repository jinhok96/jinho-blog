const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 1000 }, locale: 'en-US', timezoneId: 'America/New_York' });
  const p = await ctx.newPage();
  const q = process.argv[2] || 'why is the sky blue';
  const host = process.argv[3] || 'duckduckgo.com';
  await p.goto(`https://${host}/?q=${encodeURIComponent(q)}`, { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(4000);
  await p.screenshot({ path: `probe/${host}-${q.replace(/\W+/g,'_')}.png` });
  const t = await p.evaluate(() => document.body.innerText);
  fs.writeFileSync(`probe/${host}-${q.replace(/\W+/g,'_')}.txt`, t);
  console.log(p.url()); console.log(t.slice(0, 1500));
  console.log('COOKIES', JSON.stringify((await ctx.cookies()).map(c => c.domain + ' ' + c.name + '=' + c.value)));
  await b.close();
})();
