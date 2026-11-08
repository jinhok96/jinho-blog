// online-video-cutter.com (123apps Video Trimmer): 업로드 → 시작·끝 입력 → 설정(형식, No re-encoding) → Save → 내려받기
// node web_123apps.cjs CLIP START_S START_TENTH END_S END_TENTH NOREENC(0|1) OUT [SHOT]
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [clip, ss, st, es, et, noreenc, out, shot] = process.argv.slice(2);
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1366, height: 900 }, acceptDownloads: true });
  const p = await ctx.newPage();
  const t0 = Date.now();
  await p.goto('https://online-video-cutter.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForTimeout(3000);
  await p.locator('input[type=file]').first().setInputFiles(clip);
  await p.getByRole('button', { name: 'Save' }).waitFor({ timeout: 600000 });
  await p.waitForTimeout(3000);
  const tUp = Date.now();
  const steppers = p.locator('.time-stepper:visible');
  async function setField(stp, cls, val) {
    await stp.locator(`.input-${cls} .input`).click();
    await p.keyboard.press('Control+A');
    await p.keyboard.type(val);
    await p.keyboard.press('Enter');
    await p.waitForTimeout(400);
  }
  const s0 = steppers.nth(0), s1 = steppers.nth(1);
  await setField(s1, 'minutes', '00'); await setField(s1, 'seconds', es); await setField(s1, 'milliseconds', et);
  await setField(s0, 'seconds', ss); await setField(s0, 'milliseconds', st);
  const times = (await s0.innerText()).replace(/\s/g, '') + ' ~ ' + (await s1.innerText()).replace(/\s/g, '');
  await p.locator('button.btn-settings:visible').first().click();
  await p.waitForTimeout(1200);
  const pop = p.locator('.el-popover:visible').last();
  if (noreenc === '1') {
    await pop.getByText('No re-encoding').click();
    await p.waitForTimeout(800);
  }
  const popText = await pop.innerText();
  const sw = await pop.locator('.el-switch, [role=switch], input[type=checkbox]').first().evaluate(e => e.className + '|' + (e.getAttribute('aria-checked') || '') + '|' + (e.checked ?? ''))
    .catch(() => 'n/a');
  if (shot) await p.screenshot({ path: shot });
  await p.keyboard.press('Escape');
  await p.mouse.click(600, 820);
  await p.waitForTimeout(500);
  await p.getByRole('button', { name: 'Save' }).click();
  // 처리 뒤 결과 화면: 버튼 목록을 기록하며 내려받기 버튼이 나올 때까지 기다림
  const t1 = Date.now();
  let download;
  for (let i = 0; i < 90 && !download; i++) {
    await p.waitForTimeout(5000);
    const btns = await p.evaluate(() => [...document.querySelectorAll('button, a')].filter(e => e.offsetParent).map(e => (e.innerText || '').trim()).filter(t => /save|download/i.test(t)));
    if (process.env.DEBUG) { console.error(i, JSON.stringify(btns)); await p.screenshot({ path: `/tmp/tv/web/ovc-after-${i}.png` }); }
    const cand = p.locator('button:visible, a:visible').filter({ hasText: /^\s*(Save|Download)\s*$/i });
    const n = await cand.count();
    if (i > 0 && n > 0) {
      try {
        [download] = await Promise.all([p.waitForEvent('download', { timeout: 20000 }), cand.last().click()]);
      } catch (e) { if (process.env.DEBUG) console.error('no download yet', e.message.split('\n')[0]); }
    }
  }
  const tDone = Date.now();
  await download.saveAs(out);
  await p.screenshot({ path: out + '.png' });
  console.log(JSON.stringify({ tool: '123apps', noreenc, clip, times, sw, popText: popText.replace(/\n/g, ' / '), upload_s: (tUp - t0) / 1000, process_s: (tDone - t1) / 1000, bytes: fs.statSync(out).size, name: download.suggestedFilename() }));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
