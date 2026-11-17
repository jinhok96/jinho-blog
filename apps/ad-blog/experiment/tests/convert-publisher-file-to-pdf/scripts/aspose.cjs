// Aspose PUB → PDF: 변환 뒤 'Download' 버튼(결과 링크)을 찾아 내려받음. 결과 화면 버튼·링크를 모두 기록
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async () => {
  const files = process.argv.slice(2);
  fs.mkdirSync('out/aspose', { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ locale: 'en-US', viewport: { width: 1280, height: 900 }, acceptDownloads: true });
  for (const f of files) {
    const base = path.basename(f, '.pub');
    const page = await ctx.newPage();
    const t0 = Date.now();
    await page.goto('https://products.aspose.app/pub/conversion/pub-to-pdf', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(4000);
    await (await page.$('input[type=file]')).setInputFiles(f);
    await page.waitForTimeout(4000);
    await page.click('button:text-is("Convert")');
    // 결과 영역이 나올 때까지 기다림
    for (let i = 0; i < 90; i++) {
      const vis = await page.$$eval('a, button', (els) =>
        els.filter((e) => e.offsetParent !== null).map((e) => [(e.innerText || '').trim(), e.getAttribute('href') || '']),
      );
      const hit = vis.find(([t]) => /^download$/i.test(t) || /download now/i.test(t));
      if (hit || i === 89) {
        await page.screenshot({ path: `shots/aspose-${base}-result.png` });
        console.log(base, 'visible:', JSON.stringify(vis.filter(([t]) => t && t.length < 50).slice(0, 40)));
        break;
      }
      await page.waitForTimeout(2000);
    }
    const dlBtn = await page.$('a:text-is("Download"), button:text-is("Download"), a:has-text("DOWNLOAD NOW"), button:has-text("DOWNLOAD NOW")');
    if (dlBtn) {
      try {
        const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 60000 }), dlBtn.click()]);
        const out = `out/aspose/${base}.pdf`;
        await dl.saveAs(out);
        console.log(base, 'saved', out, fs.statSync(out).size, Math.round((Date.now() - t0) / 1000), 's');
      } catch (e) {
        console.log(base, 'download failed', e.message.slice(0, 100));
      }
    } else {
      console.log(base, 'no Download button');
    }
    await page.close();
  }
  await browser.close();
})();
