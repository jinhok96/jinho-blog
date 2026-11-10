// CloudConvert MOV → MP4: 파일 선택 → (옵션 화면 캡처) → 기본값으로 Convert → Download
// node web_cloudconvert.cjs IN.mov OUT.mp4 SHOT_PREFIX [--options] [--copy]
//   --copy: Options의 Video Codec·Audio Codec에 "copy"를 넣어 다시 인코딩하지 않고 옮김
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [inp, out, shot] = process.argv.slice(2);
  const codec = process.argv.includes('--copy') ? 'copy' : null;
  const showOptions = process.argv.includes('--options') || !!codec;
  const b = await chromium.launch();
  const ctx = await b.newContext({ locale: 'en-US', viewport: { width: 1366, height: 1000 }, acceptDownloads: true });
  const p = await ctx.newPage();
  await p.goto('https://cloudconvert.com/mov-to-mp4', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForTimeout(3000);
  for (const t of ['Accept', 'Accept all', 'I agree', 'Got it']) {
    try { await p.getByRole('button', { name: t, exact: true }).click({ timeout: 1500 }); } catch (e) {}
  }
  const t0 = Date.now();
  await p.setInputFiles('input[type=file]', inp);
  await p.waitForTimeout(4000);
  await p.screenshot({ path: shot + '-1-added.png' });
  if (showOptions) {
    let clicked = false;
    for (const c of await p.$$('button, a')) {
      const h = await c.innerHTML();
      if (/wrench|cog|gear|settings|options/i.test(h)) {
        try { await c.click({ timeout: 2000 }); clicked = true; break; } catch (e) {}
      }
    }
    console.log('options clicked', clicked);
    await p.waitForTimeout(3000);
    await p.screenshot({ path: shot + '-2-options.png', fullPage: true });
    fs.writeFileSync(shot + '-2-options.txt', await p.evaluate(() => document.body.innerText));
    if (codec) {
      for (const label of ['Video Codec', 'Audio Codec']) {
        const id = await p.locator('label', { hasText: label }).first().getAttribute('for');
        await p.locator(`button[id="${id}"]`).click();
        await p.waitForTimeout(1000);
        const opts = await p.getByRole('option').allInnerTexts();
        console.log(label, 'options:', JSON.stringify(opts));
        await p.getByRole('option', { name: /^Copy/ }).first().click();
        await p.waitForTimeout(800);
      }
      await p.screenshot({ path: shot + '-2b-options-copy.png' });
    }
    await p.getByRole('button', { name: 'Apply' }).click({ timeout: 5000 });
    await p.waitForTimeout(1500);
  }
  await p.locator('button:visible').filter({ hasText: /^\s*Convert\s*$/ }).last().click({ timeout: 15000 });
  let link;
  for (let i = 0; i < 120; i++) {
    await p.waitForTimeout(5000);
    if (i % 6 === 0) await p.screenshot({ path: shot + '-wait.png' });
    const c = p.locator('a:visible, button:visible').filter({ hasText: /^\s*Download\s*$/ });
    if (await c.count()) { link = c.first(); break; }
  }
  const t1 = Date.now();
  await p.screenshot({ path: shot + '-3-done.png' });
  const [d] = await Promise.all([p.waitForEvent('download', { timeout: 120000 }), link.click()]);
  await d.saveAs(out);
  console.log(JSON.stringify({ out, secondsToDownloadButton: (t1 - t0) / 1000, suggested: d.suggestedFilename() }));
  await b.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
