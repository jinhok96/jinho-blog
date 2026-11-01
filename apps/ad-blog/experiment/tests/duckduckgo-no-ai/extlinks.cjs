const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('https://duckduckgo.com/duckduckgo-help-pages/ai-features/about-noaiduckduckgocom', { waitUntil: 'networkidle' });
  console.log((await p.evaluate(() => [...document.querySelectorAll('a')].map(a => a.innerText.trim() + ' | ' + a.href))).filter(l => /extension|addons|chromewebstore/i.test(l)).join('\n'));
  await b.close();
})();
