// Img.Upscaler (imgupscaler.com, 로그인 없음): 파일 선택 → 200% 또는 400% → Upload and start → Download
// 실행: node web/run_imgupscaler.cjs <2|4> <입력 폴더> <출력 폴더> [이름...]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async () => {
  const [scale, inDir, outDir, ...only] = process.argv.slice(2);
  fs.mkdirSync(outDir, { recursive: true });
  const names = only.length ? only : fs.readdirSync(inDir).filter((f) => f.endsWith('.png')).map((f) => f.slice(0, -4));
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  for (const name of names) {
    const ctx = await b.newContext({
      viewport: { width: 1366, height: 900 }, locale: 'en-US', acceptDownloads: true,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
    });
    const pg = await ctx.newPage();
    const t0 = Date.now();
    try {
      await pg.goto('https://imgupscaler.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await pg.waitForTimeout(4000);
      await (await pg.$('input[type=file]')).setInputFiles(path.join(inDir, `${name}.png`));
      await pg.waitForTimeout(2000);
      await pg.getByText(scale === '4' ? '400%' : '200%', { exact: true }).first().click();
      await pg.waitForTimeout(1000);
      await pg.screenshot({ path: `screens/imgupscaler${scale}-${name}-options.png` });
      await pg.getByText('Upload and start', { exact: true }).click();
      const dlBtn = pg.getByText('Download', { exact: true }).first();
      await dlBtn.waitFor({ timeout: 240000 });
      await pg.waitForTimeout(2000);
      await pg.screenshot({ path: `screens/imgupscaler${scale}-${name}-done.png` });
      const [dl] = await Promise.all([pg.waitForEvent('download', { timeout: 120000 }), dlBtn.click()]);
      const ext = path.extname(dl.suggestedFilename()) || '.png';
      await dl.saveAs(path.join(outDir, `${name}${ext}`));
      console.log(name, 'ok', ((Date.now() - t0) / 1000).toFixed(1), dl.suggestedFilename());
    } catch (e) {
      console.log(name, 'FAIL', e.message.slice(0, 200));
      await pg.screenshot({ path: `screens/imgupscaler${scale}-${name}-fail.png` });
    }
    await ctx.close();
  }
  await b.close();
})();
