// 업로드 후 화면을 단계별로 찍어 버튼·문구 확인 (조작 스크립트 작성용)
// 실행: node web/explore.cjs <이름> <url> <이미지> [업로드 버튼 문구]
const { chromium } = require('playwright');
(async () => {
  const [name, url, img, btn] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await b.newContext({
    viewport: { width: 1366, height: 900 }, locale: 'en-US', acceptDownloads: true,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
  });
  const pg = await ctx.newPage();
  await pg.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await pg.waitForTimeout(5000);
  const inputs = await pg.$$('input[type=file]');
  console.log('file inputs', inputs.length);
  if (inputs.length) await inputs[0].setInputFiles(img);
  else {
    const [fc] = await Promise.all([pg.waitForEvent('filechooser'), pg.getByText(btn, { exact: false }).first().click()]);
    await fc.setFiles(img);
  }
  for (let i = 1; i <= 4; i++) {
    await pg.waitForTimeout(7000);
    await pg.screenshot({ path: `screens/${name}-step${i}.png` });
    const t = await pg.evaluate(() =>
      [...document.querySelectorAll('button, a, [role=button], label')]
        .filter((e) => e.offsetParent && e.innerText.trim())
        .map((e) => e.innerText.trim().replace(/\s+/g, ' ').slice(0, 40))
        .join(' | '),
    );
    console.log(`step${i}`, pg.url(), '\n', t.slice(0, 1200));
  }
  await b.close();
})();
