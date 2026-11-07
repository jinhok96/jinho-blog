// 칼럼 후속 확인: Gemini 공식 도움말·요금·학생 페이지를 Chromium(en-US)으로 렌더링해 본문 텍스트 저장
// 실행: node capture_followup.cjs <출력 폴더> <날짜 접미사>
const { chromium } = require('playwright');
const fs = require('fs');

const PAGES = {
  'changes-help': 'https://support.google.com/gemini/answer/17004136?hl=en',
  'gemini-limits-help': 'https://support.google.com/gemini/answer/16275805?hl=en',
  'gemini-models-help': 'https://support.google.com/gemini/answer/18648722?hl=en',
  'gemini-subscriptions': 'https://gemini.google/subscriptions/?hl=en',
  students: 'https://gemini.google/students/?hl=en',
  'plan-help': 'https://support.google.com/gemini/answer/14517446?hl=en',
};
const [out, suffix] = process.argv.slice(2);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 }, locale: 'en-US' });
  for (const [name, url] of Object.entries(PAGES)) {
    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
      await page.waitForTimeout(3000);
      fs.writeFileSync(`${out}/source-${name}-${suffix}.txt`, await page.innerText('body'));
      console.log(name, 'ok');
    } catch (error) {
      console.log(name, 'fail', error.message.split('\n')[0]);
    }
  }
  await browser.close();
})();
