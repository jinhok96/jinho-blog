// online-video-cutter.com/rotate-video (123apps 편집기): 업로드 → Rotate 버튼 N번(시계 방향 90도씩) → Export(기본 720p, 1080p 시도) → 내려받기
// node web_123apps.cjs CLIP CLICKS OUT [RES]
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [clip, clicks, out, res] = process.argv.slice(2);
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1366, height: 900 }, acceptDownloads: true });
  const p = await ctx.newPage();
  const t0 = Date.now();
  await p.goto('https://online-video-cutter.com/rotate-video', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForTimeout(4000);
  await p.locator('input[type=file]').first().setInputFiles(clip);
  await p.locator('button.ve-btn.rotate').waitFor({ timeout: 300000 });
  await p.waitForTimeout(15000);
  const tUp = Date.now();
  for (let i = 0; i < Number(clicks); i++) { await p.locator('button.ve-btn.rotate').click(); await p.waitForTimeout(1500); }
  await p.screenshot({ path: out + '-rotated.png' });
  await p.getByRole('button', { name: 'Export' }).first().click(); await p.waitForTimeout(2500);
  if (res) {
    await p.locator('.el-popover:visible, [role=dialog]:visible').last().getByText(res, { exact: true }).click();
    await p.waitForTimeout(2500);
    await p.screenshot({ path: out + `-${res}.png` });
    console.log('AFTER RES:', (await p.evaluate(() => [...document.querySelectorAll('.el-dialog, .el-popover, [role=dialog]')].filter(e => e.offsetParent).map(e => e.innerText).join(' | '))).replace(/\n/g, ' / '));
  }
  // 설정(톱니) 내용 기록
  const gear = p.locator('.el-popover:visible').last().locator('button').filter({ hasNot: p.locator('text=Export') });
  const popText = await p.locator('.el-popover:visible').last().innerText().catch(() => '');
  await p.screenshot({ path: out + '-export.png' });
  const t1 = Date.now();
  let got = false;
  const [download] = await Promise.all([
    p.waitForEvent('download', { timeout: 900000 }).then(d => { got = true; return d; }),
    (async () => {
      await p.locator('.el-popover:visible').last().getByRole('button', { name: /Export/ }).click();
      // 처리 뒤 내려받기 버튼이 따로 나오면 누름
      for (let i = 0; i < 120 && !got; i++) {
        await p.waitForTimeout(5000);
        const c = p.locator('button:visible, a:visible').filter({ hasText: /^\s*(Download|Save)\s*$/i });
        if (await c.count()) { await c.last().click().catch(() => {}); }
      }
    })().catch(() => {}),
  ]);
  const tDone = Date.now();
  await download.saveAs(out);
  await p.screenshot({ path: out + '-done.png' });
  console.log(JSON.stringify({ tool: '123apps', clicks, res: res || 'default', popText: popText.replace(/\n/g, ' / '), upload_s: (tUp - t0) / 1000, process_s: (tDone - t1) / 1000, bytes: fs.statSync(out).size, name: download.suggestedFilename() }));
  await b.close();
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
