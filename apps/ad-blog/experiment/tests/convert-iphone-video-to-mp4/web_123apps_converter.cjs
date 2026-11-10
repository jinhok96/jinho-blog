// video-converter.com (123apps Video Converter): 업로드 → mp4(기본) → Settings 화면 캡처 → Convert → Download
// node web_123apps_converter.cjs IN.mov OUT.mp4 SHOT_PREFIX [VCODEC_LABEL]
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [inp, out, shot, vcodec] = process.argv.slice(2);
  const b = await chromium.launch();
  const ctx = await b.newContext({ locale: 'en-US', viewport: { width: 1366, height: 1000 }, acceptDownloads: true });
  const p = await ctx.newPage();
  await p.goto('https://video-converter.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForTimeout(3000);
  const t0 = Date.now();
  await p.locator('input[type=file]').first().setInputFiles(inp);
  // 업로드가 끝나면 파일 이름이 보이고 Convert 버튼이 활성화됨
  for (let i = 0; i < 120; i++) {
    await p.waitForTimeout(2000);
    const ok = await p.evaluate(() => /iphone|\.mov/i.test(document.body.innerText) && !/Uploading|%/.test((document.querySelector('.upload-progress, .progress') || {}).innerText || ''));
    if (ok && i > 3) break;
  }
  const tUp = Date.now();
  await p.screenshot({ path: shot + '-1-uploaded.png' });
  try { await p.getByText('Settings', { exact: true }).first().click({ timeout: 5000 }); } catch (e) { console.log('settings click', e.message.split('\n')[0]); }
  await p.waitForTimeout(1500);
  if (vcodec) {
    await p.locator('select[name=vcodec]').selectOption({ label: vcodec });
    await p.waitForTimeout(800);
  }
  const settings = await p.evaluate(() => [...document.querySelectorAll('select')].filter(s => s.offsetParent).map(s => s.name + '=' + s.options[s.selectedIndex].text + ' [' + [...s.options].map(o => o.text).join(' / ') + ']'));
  const settingsText = await p.evaluate(() => {
    const el = [...document.querySelectorAll('div')].find(d => d.offsetParent && /Video codec|Audio codec/i.test(d.innerText) && d.innerText.length < 800);
    return el ? el.innerText : '';
  });
  await p.screenshot({ path: shot + '-2-settings.png' });
  await p.getByText('Convert', { exact: true }).last().click({ timeout: 10000 });
  const t1 = Date.now();
  let download;
  for (let i = 0; i < 120 && !download; i++) {
    await p.waitForTimeout(5000);
    const cand = p.locator('a:visible, button:visible').filter({ hasText: /^\s*Download\s*$/i });
    if (await cand.count()) {
      try { [download] = await Promise.all([p.waitForEvent('download', { timeout: 30000 }), cand.first().click()]); } catch (e) {}
    }
  }
  const tDone = Date.now();
  await p.screenshot({ path: shot + '-3-done.png' });
  await download.saveAs(out);
  console.log(JSON.stringify({ tool: '123apps converter', vcodec: vcodec || 'default', settings, settingsText: settingsText.replace(/\n/g, ' / '), upload_s: (tUp - t0) / 1000, process_s: (tDone - t1) / 1000, bytes: fs.statSync(out).size, name: download.suggestedFilename() }));
  await b.close();
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
