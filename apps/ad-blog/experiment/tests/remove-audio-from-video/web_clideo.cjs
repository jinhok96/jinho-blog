// Clideo Mute video: 업로드 → 자동 처리 → 결과 화면 캡처 → Download 버튼으로 받기 (로그인 없음)
// node web_clideo.cjs CLIP OUT [SHOT_PREFIX]
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [clip, out, shot] = process.argv.slice(2);
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 1000 }, acceptDownloads: true });
  const p = await ctx.newPage();
  const t0 = Date.now();
  await p.goto('https://clideo.com/mute-video', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForTimeout(2000);
  await (await p.$('input[type=file]')).setInputFiles(clip);
  await p.waitForURL(/export-result/, { timeout: 900000 });
  await p.waitForTimeout(3000);
  const t1 = Date.now();
  const text = await p.evaluate(() => document.body.innerText.split(/\s+/).join(' ').slice(0, 600));
  if (shot) await p.screenshot({ path: shot + '-result.png' });
  let result = { tool: 'clideo', clip, process_s: (t1 - t0) / 1000, text, at: new Date().toISOString() };
  try {
    const [dl] = await Promise.all([
      p.waitForEvent('download', { timeout: 120000 }),
      p.click('button:has-text("Download")'),
    ]);
    await dl.saveAs(out);
    result.bytes = fs.statSync(out).size;
    result.suggested = dl.suggestedFilename();
  } catch (e) {
    result.download_error = String(e).slice(0, 300);
    if (shot) await p.screenshot({ path: shot + '-download.png' });
    result.after = await p.evaluate(() => document.body.innerText.split(/\s+/).join(' ').slice(0, 400));
  }
  console.log(JSON.stringify(result));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
