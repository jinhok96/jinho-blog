// Pixelcut Image Upscaler (로그인 없음): 업로드 → Fast Upscale 2x 또는 4x → Download > Preview resolution
// 실행: node web/run_pixelcut.cjs <2|4> <입력 폴더> <출력 폴더> [이름...]
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
      await pg.goto('https://www.pixelcut.ai/image-upscaler', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await pg.waitForTimeout(4000);
      await (await pg.$('input[type=file]')).setInputFiles(path.join(inDir, `${name}.png`));
      await pg.getByText('Retry', { exact: true }).waitFor({ timeout: 120000 });
      if (scale === '4') {
        await pg.waitForTimeout(3000);
        await pg.getByText('4x', { exact: true }).click();
      }
      // 결과 표시(After 1600×1200)는 본문 글자로 읽히지 않아 처리 시간을 넉넉히 기다림 (스크린샷으로 확인)
      await pg.waitForTimeout(20000);
      await pg.waitForTimeout(5000);
      await pg.screenshot({ path: `screens/pixelcut${scale}-${name}-done.png` });
      await pg.getByText('Download', { exact: true }).first().click();
      await pg.waitForTimeout(1500);
      await pg.screenshot({ path: `screens/pixelcut${scale}-${name}-menu.png` });
      // 로그인 없이 받을 수 있는 것은 'Preview resolution'뿐 (Full resolution은 'Free with sign in')
      const [dl] = await Promise.all([pg.waitForEvent('download', { timeout: 60000 }), pg.getByText('Preview resolution', { exact: true }).click()]);
      const ext = path.extname(dl.suggestedFilename()) || '.png';
      await dl.saveAs(path.join(outDir, `${name}${ext}`));
      console.log(name, 'ok', ((Date.now() - t0) / 1000).toFixed(1), dl.suggestedFilename());
    } catch (e) {
      console.log(name, 'FAIL', e.message.slice(0, 200));
      await pg.screenshot({ path: `screens/pixelcut${scale}-${name}-fail.png` });
    }
    await ctx.close();
  }
  await b.close();
})();
