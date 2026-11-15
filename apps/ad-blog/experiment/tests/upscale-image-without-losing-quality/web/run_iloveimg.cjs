// iLoveIMG Upscale image (로그인 없음, 무료는 2x만): 업로드 → 2x → Upscale → 다운로드
// 실행: node web/run_iloveimg.cjs <입력 폴더> <출력 폴더> [이름...]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
(async () => {
  const [inDir, outDir, ...only] = process.argv.slice(2);
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
      await pg.goto('https://www.iloveimg.com/upscale-image', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await pg.waitForTimeout(3000);
      await (await pg.$('input[type=file]')).setInputFiles(path.join(inDir, `${name}.png`));
      await pg.getByText('Upscale', { exact: true }).last().waitFor({ timeout: 60000 });
      await pg.waitForTimeout(2000);
      await pg.screenshot({ path: `screens/iloveimg-${name}-options.png` });
      await pg.getByText('Upscale', { exact: true }).last().click();
      const dlBtn = pg.getByText(/Download upscaled/i).first();
      await dlBtn.waitFor({ timeout: 180000 });
      await pg.screenshot({ path: `screens/iloveimg-${name}-done.png` });
      const [dl] = await Promise.all([pg.waitForEvent('download', { timeout: 120000 }), dlBtn.click()]);
      const ext = path.extname(dl.suggestedFilename()) || '.png';
      await dl.saveAs(path.join(outDir, `${name}${ext}`));
      console.log(name, 'ok', ((Date.now() - t0) / 1000).toFixed(1), dl.suggestedFilename(), pg.url());
    } catch (e) {
      console.log(name, 'FAIL', e.message.slice(0, 200));
      await pg.screenshot({ path: `screens/iloveimg-${name}-fail.png` });
    }
    await ctx.close();
  }
  await b.close();
})();
