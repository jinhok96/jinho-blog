const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1100, height: 1300 }, locale: 'en-US', deviceScaleFactor: 2 });
  await p.goto('https://support.google.com/gemini/answer/16938321?hl=en', { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(2000);
  const info = await p.evaluate(() => {
    const ids = [...document.querySelectorAll('article [id]')].map(e => e.id).filter(Boolean);
    const anchors = [...document.querySelectorAll('article a[href^="#"]')].map(a => a.getAttribute('href'));
    const h = [...document.querySelectorAll('article h2, article h3')].map(e => e.innerText.trim());
    const upd = document.body.innerText.match(/Last updated[^\n]*/i);
    return { ids, anchors, h, upd: upd && upd[0] };
  });
  console.log(JSON.stringify(info, null, 1));
  const art = await p.$('article');
  await art.screenshot({ path: 'help-16938321-full.png' });
  await b.close();
})();
