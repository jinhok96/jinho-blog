const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 1100 }, locale: 'en-US' });
  const p = await ctx.newPage();
  const host = process.argv[2] || 'duckduckgo.com';
  await p.goto(`https://${host}/settings`, { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(2000);
  await p.getByText('AI Features', { exact: true }).first().click();
  await p.waitForTimeout(2000);
  await p.screenshot({ path: `probe/${host}-settings-ai.png`, fullPage: true });
  const t = await p.evaluate(() => document.body.innerText);
  fs.writeFileSync(`probe/${host}-settings-ai.txt`, t);
  const ctrls = await p.evaluate(() => [...document.querySelectorAll('input,select,button,[role=switch],[role=checkbox]')].filter(e => e.offsetParent).map(e => ({tag:e.tagName, type:e.type, id:e.id, name:e.name, aria:e.getAttribute('aria-label'), checked:e.checked, value:e.value, text:(e.innerText||'').slice(0,60), opts: e.tagName==='SELECT' ? [...e.options].map(o=>o.value+':'+o.text+(o.selected?'*':'')) : undefined})));
  console.log(JSON.stringify(ctrls, null, 0));
  console.log('---TEXT---'); console.log(t.slice(t.indexOf('AI Features'), t.indexOf('AI Features') + 2500));
  await b.close();
})();
