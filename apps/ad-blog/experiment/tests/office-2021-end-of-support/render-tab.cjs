// 지원 문서의 탭(예: Mac)을 눌러 그 탭 본문까지 main 텍스트로 저장
// 실행: node render-tab.cjs <url> <탭 이름> <out.txt>
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [url, tab, out] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await (await b.newContext({ locale: 'en-US', viewport: { width: 1100, height: 900 } })).newPage();
  try { await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); } catch (e) {}
  await p.getByRole('tab', { name: tab, exact: true }).first().click({ timeout: 5000 }).catch(() => {});
  await p.waitForTimeout(1500);
  const text = await p.evaluate(() => {
    const m = document.querySelector('main') || document.body;
    return document.title + '\n' + location.href + '\n\n' + m.innerText;
  });
  fs.writeFileSync(out, `# 가져온 시각: ${new Date().toISOString()}\n# 원본: ${url}\n` + text);
  console.log(out, text.length); await b.close();
})();
