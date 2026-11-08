// ezgif Video cutter 설정 칸(시작·끝·자르기 방식·출력 형식) 화면 캡처 (Copy original 선택 상태)
const { chromium } = require('playwright');
(async () => {
  const [clip, out] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
  await p.goto('https://ezgif.com/cut-video', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.setInputFiles('#new-image', clip);
  await Promise.all([p.waitForNavigation({ timeout: 600000 }), p.click('input[name=upload]')]);
  await p.fill('#start', '12.5');
  await p.fill('#end', '30');
  await p.selectOption('#encoding', 'original');
  const form = p.locator('form').filter({ has: p.locator('#encoding') }).first();
  await form.scrollIntoViewIfNeeded();
  const opts = await p.locator('#encoding option').allInnerTexts();
  await form.screenshot({ path: out });
  console.log(JSON.stringify({ opts }));
  await b.close();
})();
