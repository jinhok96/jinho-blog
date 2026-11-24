// online-video-cutter.com/volume (123apps 편집기 'Change Video Volume'): 업로드 → Volume 0% (또는 타임라인 음소거 버튼)
// → Export(무료 기본값) → 내려받기. 화면 캡처는 SHOT_PREFIX-*.png
// node web_123apps.cjs CLIP OUT MODE(volume0|mute) [SHOT_PREFIX]
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [clip, out, mode, shot] = process.argv.slice(2);
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1366, height: 900 }, acceptDownloads: true });
  const p = await ctx.newPage();
  const t0 = Date.now();
  await p.goto('https://online-video-cutter.com/volume', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForTimeout(4000);
  await p.locator('input[type=file]').first().setInputFiles(clip);
  await p.locator('button.btn-detach-audio').waitFor({ timeout: 300000 });
  await p.waitForTimeout(15000);
  const tUp = Date.now();
  if (mode === 'mute') {
    await p.locator('button.toggle-mute').first().click();
  } else {
    const box = p.locator('.el-collapse-item input[type=text]').first();
    await box.click({ clickCount: 3 });
    await box.fill('0');
    await box.press('Enter');
  }
  await p.waitForTimeout(2000);
  if (shot) await p.screenshot({ path: shot + '-set.png' });
  const volText = await p.locator('.el-collapse-item input[type=text]').first().inputValue().catch(() => '');
  await p.getByRole('button', { name: 'Export' }).first().click();
  await p.waitForTimeout(2500);
  const popText = await p.locator('.el-popover:visible').last().innerText().catch(() => '');
  if (shot) await p.screenshot({ path: shot + '-export.png' });
  const t1 = Date.now();
  let got = false;
  const [download] = await Promise.all([
    p.waitForEvent('download', { timeout: 900000 }).then(d => { got = true; return d; }),
    (async () => {
      await p.locator('.el-popover:visible').last().getByRole('button', { name: /Export/ }).click();
      for (let i = 0; i < 120 && !got; i++) {
        await p.waitForTimeout(5000);
        const c = p.locator('button:visible, a:visible').filter({ hasText: /^\s*(Download|Save)\s*$/i });
        if (await c.count()) { await c.last().click().catch(() => {}); }
      }
    })().catch(() => {}),
  ]);
  const tDone = Date.now();
  await download.saveAs(out);
  if (shot) await p.screenshot({ path: shot + '-done.png' });
  console.log(JSON.stringify({ tool: '123apps-volume', mode, clip, volText, popText: popText.split('\n').join(' / '), upload_s: (tUp - t0) / 1000, process_s: (tDone - t1) / 1000, bytes: fs.statSync(out).size, name: download.suggestedFilename(), at: new Date().toISOString() }));
  await b.close();
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
