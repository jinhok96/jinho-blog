// 네 설정을 모두 바꾼 뒤 쿠키 4개의 만료 기간 기록
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ locale: 'en-US' });
  const p = await ctx.newPage();
  await p.goto('https://duckduckgo.com/settings', { waitUntil: 'networkidle', timeout: 90000 }); await p.waitForTimeout(4000);
  await p.getByText('AI Features', { exact: true }).first().click(); await p.waitForTimeout(1000);
  await p.locator('#setting_kbg').locator('xpath=..').click(); await p.waitForTimeout(500);
  await p.selectOption('#setting_kbe', '0'); await p.waitForTimeout(1200);
  await p.keyboard.press('Escape'); await p.waitForTimeout(800);
  await p.selectOption('#setting_kbl', '0'); await p.waitForTimeout(800);
  await p.locator('#setting_kbj').locator('xpath=..').click(); await p.waitForTimeout(500);
  await p.getByText('Save and Exit', { exact: true }).first().click(); await p.waitForTimeout(3000);
  const now = Date.now() / 1000;
  console.log(JSON.stringify((await ctx.cookies()).map(c => ({ name: c.name, value: c.value, domain: c.domain, httpOnly: c.httpOnly, expiresInDays: c.expires > 0 ? Math.round((c.expires - now) / 86400) : 'session' }))));
  await b.close();
})();
