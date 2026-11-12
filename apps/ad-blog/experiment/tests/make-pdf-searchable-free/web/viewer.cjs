// Chromium 내장 PDF 보기로 결과 PDF를 열어 화면 유지 (찾기는 xdotool로)
// 사용: node viewer.cjs <PDF 경로> <유지 초>
const { chromium } = require('playwright');
(async () => {
  const [pdf, secs] = process.argv.slice(2);
  const b = await chromium.launch({ headless: false, args: ['--window-position=0,0', '--window-size=1500,980'] });
  const ctx = await b.newContext({ viewport: null });
  const p = await ctx.newPage();
  await p.goto('file://' + pdf).catch((e) => console.log(e.message));
  console.log('opened', b.version());
  await p.waitForTimeout(Number(secs) * 1000);
  await b.close();
})();
