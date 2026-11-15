// Bigjpg (로그인 없음): Select Images → Start → 설정 창(사진·배율·노이즈 제거) → 확인 → Download
// 실행: node web/run_bigjpg.cjs <2|4> <입력 폴더> <출력 폴더> [이름...]
//   설정 창 버튼은 화면 글자로 고름: 이미지 종류 'Photo', 배율 '2x'/'4x', 노이즈 제거는 기본값
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
      await pg.goto('https://bigjpg.com/en', { waitUntil: 'domcontentloaded', timeout: 60000 });
      await pg.waitForTimeout(4000);
      await (await pg.$('input[type=file]')).setInputFiles(path.join(inDir, `${name}.png`));
      await pg.getByText('Start', { exact: true }).first().click();
      await pg.waitForTimeout(2500);
      await pg.screenshot({ path: `screens/bigjpg${scale}-${name}-dialog.png` });
      const dlg = await pg.evaluate(() => document.body.innerText.replace(/\s+/g, ' ').slice(0, 1500));
      console.log('dialog:', dlg.slice(0, 600));
      await pg.getByText('Photo', { exact: true }).first().click().catch(() => console.log('no Photo button'));
      // 배율 라디오는 글자 찾기로 눌리지 않아(글자가 별도 노드) 라디오 옆 글자가 '{배율}x'인 input을 직접 누름
      const clicked = await pg.evaluate((sc) => {
        const r = [...document.querySelectorAll('input[type=radio]')].find((e) => (e.parentElement.innerText || '').trim() === `${sc}x` || (e.nextSibling && (e.nextSibling.textContent || '').trim() === `${sc}x`));
        if (r) { r.click(); return true; } return false;
      }, scale);
      console.log('scale radio clicked:', clicked);
      const checked = await pg.evaluate((sc) => [...document.querySelectorAll('input[type=radio]:checked')].map((e) => e.parentElement.innerText.trim()), scale);
      console.log('checked:', checked.join(','));
      await pg.waitForTimeout(800);
      await pg.screenshot({ path: `screens/bigjpg${scale}-${name}-dialog2.png` });
      await pg.locator('button:visible', { hasText: /^OK$/ }).first().click();
      const dlBtn = pg.getByText(/^Download \(/).first();  // 'Download (364.08 KB)'
      await dlBtn.waitFor({ timeout: 400000 });
      await pg.waitForTimeout(1500);
      await pg.screenshot({ path: `screens/bigjpg${scale}-${name}-done.png` });
      // 다운로드 이벤트가 없으면(새 탭으로 열림) 링크 주소를 직접 받음
      const href = await dlBtn.evaluate((e) => (e.closest('a') || e).getAttribute('href'));
      try {
        const [dl] = await Promise.all([pg.waitForEvent('download', { timeout: 30000 }), dlBtn.click()]);
        const ext = path.extname(dl.suggestedFilename()) || '.png';
        await dl.saveAs(path.join(outDir, `${name}${ext}`));
        console.log(name, 'ok', ((Date.now() - t0) / 1000).toFixed(1), dl.suggestedFilename());
      } catch (e) {
        const res = await ctx.request.get(new URL(href, pg.url()).href);
        const ext = path.extname(new URL(href, pg.url()).pathname) || '.png';
        fs.writeFileSync(path.join(outDir, `${name}${ext}`), await res.body());
        console.log(name, 'ok(href)', ((Date.now() - t0) / 1000).toFixed(1), href);
      }
    } catch (e) {
      console.log(name, 'FAIL', e.message.slice(0, 200));
      await pg.screenshot({ path: `screens/bigjpg${scale}-${name}-fail.png` });
    }
    await ctx.close();
  }
  await b.close();
})();
