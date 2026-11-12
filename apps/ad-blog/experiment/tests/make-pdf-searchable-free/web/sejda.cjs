// Sejda OCR PDF: 기본값(English)으로 올려 'Recognize text on all pages' 결과를 내려받음 (로그인 없음)
// 사용: node sejda.cjs <입력 PDF> <출력 PDF> <화면 접두사>
const { chromium } = require('playwright');
const findDownload = require('./finddl.cjs');

(async () => {
  const [input, output, prefix] = process.argv.slice(2);
  const b = await chromium.launch({ headless: false });
  const ctx = await b.newContext({ locale: 'en-US', viewport: { width: 1280, height: 1000 }, acceptDownloads: true });
  const p = await ctx.newPage();
  await p.goto('https://www.sejda.com/ocr-pdf', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await p.setInputFiles('input[type=file].fileupload', input);
  await p.locator('#ocrAllPagesSubmitBtn').waitFor({ state: 'visible', timeout: 300000 });
  await p.waitForTimeout(2000);
  await p.screenshot({ path: `${prefix}-options.png` });
  const t0 = Date.now();
  await p.click('#ocrAllPagesSubmitBtn');
  let dlBtn = null;
  for (let i = 0; i < 1500; i++) {
    await p.waitForTimeout(1000);
    let ready = false;
    for (const f of p.frames()) {
      if (await f.evaluate(() => /Your document is ready/.test(document.body.innerText)).catch(() => false)) ready = true;
    }
    if (ready) {
      for (const f of p.frames()) {
        const a = await f.$('#download-dropdown a[download]').catch(() => null);
        if (a) {
          console.log('download link', await a.evaluate((e) => e.outerHTML.slice(0, 300)));
          dlBtn = a;
        }
      }
      if (dlBtn) break;
    }
    if (i % 60 === 0) await p.screenshot({ path: `${prefix}-wait.png` });
  }
  console.log('done after', ((Date.now() - t0) / 1000).toFixed(1), 's');
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${prefix}-result.png` });
  const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 120000 }), dlBtn.click()]);
  await dl.saveAs(output);
  console.log('saved', output, dl.suggestedFilename());
  await b.close();
})();
