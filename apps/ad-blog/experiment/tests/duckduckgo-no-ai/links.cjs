const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto(process.argv[2], { waitUntil: 'networkidle' });
  const links = await p.evaluate(() => [...document.querySelectorAll('a')].map(a => a.innerText.trim().replace(/\s+/g,' ') + ' | ' + a.href));
  console.log(links.filter(l => /help-pages/.test(l)).join('\n'));
  await b.close();
})();
