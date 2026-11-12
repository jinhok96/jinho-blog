// PDF24 Tools OCR PDF: 기본값으로 파일을 올려 OCR 결과를 내려받음
// 사용: node pdf24.cjs <입력 PDF> <출력 PDF> <화면 접두사>
const { chromium } = require('playwright');

const findDownload = require('./finddl.cjs');

(async () => {
  const [input, output, prefix] = process.argv.slice(2);
  const b = await chromium.launch({ headless: false });
  const ctx = await b.newContext({ locale: 'en-US', viewport: { width: 1280, height: 1000 }, acceptDownloads: true });
  const p = await ctx.newPage();
  const T = Date.now();
  p.on('close', () => console.log('event page close', (Date.now() - T) / 1000));
  p.on('crash', () => console.log('event page crash', (Date.now() - T) / 1000));
  b.on('disconnected', () => console.log('event browser disconnected', (Date.now() - T) / 1000));
  ctx.on('page', (np) => console.log('event new page', np.url()));
  await p.goto('https://tools.pdf24.org/en/ocr-pdf', { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
  await p.setInputFiles('input[type=file]', input);
  await p.waitForTimeout(4000);
  await p.screenshot({ path: `${prefix}-options.png` });
  const opts = await p.evaluate(() => {
    const out = {};
    for (const s of document.querySelectorAll('select')) out[s.id || s.name] = [...s.selectedOptions].map((o) => o.textContent.trim()).join('|');
    for (const c of document.querySelectorAll('input[type=checkbox]')) {
      const lab = c.closest('label') || document.querySelector(`label[for="${c.id}"]`);
      const name = (lab && lab.innerText.trim()) || '';
      if (name && !/^ms-opt/.test(name)) out['cb:' + name] = c.checked;
    }
    return out;
  });
  console.log('options', JSON.stringify(opts));
  const t0 = Date.now();
  await p.click('button.ocrPdf');
  let dlBtn = null;
  for (let i = 0; i < 1800 && !dlBtn; i++) {
    await p.waitForTimeout(1000);
    dlBtn = await findDownload(p);
    if (!dlBtn && i % 60 === 0) await p.screenshot({ path: `${prefix}-wait.png` });
  }
  console.log('done after', ((Date.now() - t0) / 1000).toFixed(1), 's');
  const msg = await p.evaluate(() => {
    const m = document.body.innerText.match(/PDF24 has recognized[^\n]*/);
    return m ? m[0] : '';
  });
  console.log('message', msg);
  await p.waitForTimeout(1000);
  await p.screenshot({ path: `${prefix}-result.png` });
  const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 120000 }), dlBtn.click()]);
  await dl.saveAs(output);
  console.log('saved', output, dl.suggestedFilename());
  await b.close();
})();
