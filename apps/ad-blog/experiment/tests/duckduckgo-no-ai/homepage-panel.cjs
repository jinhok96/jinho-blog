// 홈 오른쪽 아래 AI Settings 버튼 → Homepage AI Settings 창에서 Search Only 선택 → Apply 전후 비교
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, locale: 'en-US' });
  const p = await ctx.newPage();
  const ep = async () => p.evaluate(() => {
    const vis = (e) => !!(e && e.offsetParent !== null && e.getBoundingClientRect().width > 0);
    const all = [...document.querySelectorAll('a,button,span,div,label')];
    const n = (t) => all.filter(e => vis(e) && e.children.length <= 2 && (e.innerText || '').trim() === t).length;
    const header = [...document.querySelectorAll('a')].filter(a => vis(a) && /duck\.ai/.test(a.href) && a.getBoundingClientRect().top < 120).map(a => a.innerText.trim());
    return { askAI: n('Ask AI'), aiSettingsButton: n('AI Settings'), headerDuckAiLinks: header, banner: /Toggle to private AI chat/.test(document.body.innerText) };
  });
  await p.goto('https://duckduckgo.com/', { waitUntil: 'networkidle' }); await p.waitForTimeout(2000);
  const out = { before: await ep() };
  await p.getByText('AI Settings', { exact: true }).first().click(); await p.waitForTimeout(1500);
  await p.getByText('Search Only', { exact: true }).first().click(); await p.waitForTimeout(800);
  await p.screenshot({ path: 'screens/raw-12-homepage-panel-search-only.png' });
  await p.getByText('Apply', { exact: true }).first().click(); await p.waitForTimeout(2500);
  out.afterApplySamePage = await ep();
  out.cookies = (await ctx.cookies()).map(c => `${c.domain} ${c.name}=${c.value}`);
  await p.goto('https://duckduckgo.com/', { waitUntil: 'networkidle' }); await p.waitForTimeout(2000);
  out.afterReload = await ep();
  await p.screenshot({ path: 'screens/raw-13-home-after-search-only.png' });
  await p.goto('https://duckduckgo.com/settings', { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
  await p.getByText('AI Features', { exact: true }).first().click(); await p.waitForTimeout(1000);
  out.settingsAfter = await p.evaluate(() => ({ kbg: document.getElementById('setting_kbg')?.checked, kbe: document.getElementById('setting_kbe')?.selectedOptions[0]?.text, kbl: document.getElementById('setting_kbl')?.selectedOptions[0]?.text }));
  fs.writeFileSync('homepage-panel-log.json', JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));
  await b.close();
})();
