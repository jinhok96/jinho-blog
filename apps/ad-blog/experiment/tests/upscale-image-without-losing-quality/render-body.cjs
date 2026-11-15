// 제품 페이지처럼 main이 없거나 동적 로딩인 페이지를 body 전체로 저장
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [url, out] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await (await b.newContext({ locale: 'en-US', viewport: { width: 1280, height: 1000 } })).newPage();
  try { await p.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); } catch (e) {}
  await p.waitForTimeout(4000);
  const text = await p.evaluate(() => document.title + '\n' + location.href + '\n\n' + document.body.innerText);
  fs.writeFileSync(out, `# 가져온 시각: ${new Date().toISOString()}\n# 원본: ${url}\n` + text);
  console.log(out, text.length); await b.close();
})();
