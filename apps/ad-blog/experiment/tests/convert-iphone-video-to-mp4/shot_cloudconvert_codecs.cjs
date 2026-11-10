// CloudConvert Options의 Video Codec 목록을 펼친 화면만 캡처 (변환은 하지 않음 → 크레딧 쓰지 않음)
// node shot_cloudconvert_codecs.cjs IN.mov OUT.png
const { chromium } = require('playwright');
(async () => {
  const [inp, out] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await (await b.newContext({ locale: 'en-US', viewport: { width: 1366, height: 1000 } })).newPage();
  await p.goto('https://cloudconvert.com/mov-to-mp4', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForTimeout(3000);
  await p.setInputFiles('input[type=file]', inp);
  await p.waitForTimeout(4000);
  for (const c of await p.$$('button, a')) {
    const h = await c.innerHTML();
    if (/wrench|cog|gear|settings|options/i.test(h)) { try { await c.click({ timeout: 2000 }); break; } catch (e) {} }
  }
  await p.waitForTimeout(2500);
  const id = await p.locator('label', { hasText: 'Video Codec' }).first().getAttribute('for');
  await p.locator(`button[id="${id}"]`).click();
  await p.waitForTimeout(1200);
  await p.screenshot({ path: out });
  console.log(JSON.stringify(await p.getByRole('option').allInnerTexts()));
  await b.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
