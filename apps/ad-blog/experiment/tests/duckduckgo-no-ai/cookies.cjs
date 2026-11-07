// 설정 저장 뒤 쿠키 속성(만료·httpOnly) 기록
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ locale: 'en-US' });
  const p = await ctx.newPage();
  await p.goto('https://duckduckgo.com/settings', { waitUntil: 'networkidle' }); await p.waitForTimeout(1500);
  await p.getByText('AI Features', { exact: true }).first().click(); await p.waitForTimeout(1000);
  await p.locator('#setting_kbg').locator('xpath=..').click(); await p.waitForTimeout(500);
  const respCookies = [];
  p.on('response', r => { const h = r.headers()['set-cookie']; if (h && /duckduckgo/.test(r.url())) respCookies.push(r.url() + ' :: ' + h); });
  await p.getByText('Save and Exit', { exact: true }).first().click(); await p.waitForTimeout(3000);
  const now = Date.now() / 1000;
  console.log(JSON.stringify((await ctx.cookies()).map(c => ({ name: c.name, value: c.value, domain: c.domain, httpOnly: c.httpOnly, expiresInDays: c.expires > 0 ? Math.round((c.expires - now) / 86400) : 'session' })), null, 1));
  console.log('Set-Cookie headers:', respCookies.length, respCookies.slice(0, 3));
  const ls = await p.evaluate(() => Object.keys(localStorage));
  console.log('localStorage keys:', ls);
  await b.close();
})();
