// iLovePDF OCR PDF: 기본값(Original, English)으로 파일을 올려 결과를 내려받음 (로그인 없음)
// 사용: node ilovepdf.cjs <입력 PDF> <출력 PDF> <화면 접두사>
const { chromium } = require('playwright');
(async () => {
  const [input, output, prefix] = process.argv.slice(2);
  const b = await chromium.launch({ headless: false });
  const ctx = await b.newContext({ locale: 'en-US', viewport: { width: 1280, height: 1000 }, acceptDownloads: true });
  const p = await ctx.newPage();
  await p.goto('https://www.ilovepdf.com/ocr-pdf', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await p.setInputFiles('input[type=file]', input);
  await p.waitForTimeout(6000);
  await p.screenshot({ path: `${prefix}-options.png` });
  const side = await p.evaluate(() => (document.querySelector('.option__panel, #sidebar, aside') || document.body).innerText);
  console.log('options panel:', side.replace(/\s+/g, ' ').slice(0, 600));
  const t0 = Date.now();
  await p.locator('#processTask, button:has-text("OCR PDF")').first().click();
  // 끝나면 다운로드 화면으로 바뀜 (스캔이 아니면 확인 창이 뜰 수 있음)
  for (let i = 0; i < 600; i++) {
    await p.waitForTimeout(1000);
    const txt = await p.evaluate(() => document.body.innerText);
    if (/Download/i.test(txt) && /download\//.test(p.url())) break;
    if (i % 30 === 0) {
      await p.screenshot({ path: `${prefix}-wait.png` });
      console.log('wait', i, p.url(), txt.replace(/\s+/g, ' ').slice(0, 200));
    }
  }
  console.log('done after', ((Date.now() - t0) / 1000).toFixed(1), 's', p.url());
  await p.waitForTimeout(2000);
  await p.screenshot({ path: `${prefix}-result.png` });
  console.log('result text:', (await p.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ').slice(0, 500));
  const dlBtn = p.locator('#pickfiles, a.downloader__btn, a:has-text("Download")').first();
  const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 120000 }), dlBtn.click()]);
  await dl.saveAs(output);
  console.log('saved', output, dl.suggestedFilename());
  await b.close();
})();
