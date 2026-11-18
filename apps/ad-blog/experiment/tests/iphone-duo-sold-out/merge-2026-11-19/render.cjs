// 콘텐츠 정리 6번 통합(2026-11-19 세션 101): Apple 1차 출처를 Chromium으로 열어 본문 텍스트 저장
// 숨은 질문·답(display:none)도 펼쳐서 읽고, 페이지가 스스로 부르는 가격 API 응답(JSON)을 함께 저장 (직접 호출하지 않음)
// 실행: node render.cjs <url> <out.txt> [label]
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [url, out, label] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ locale: 'en-US', viewport: { width: 1280, height: 1000 } })).newPage();
  const apis = [];
  page.on('response', async (r) => {
    const u = r.url();
    if (/ols\/api\/pricing|mcm\/product-price|shop\/.*\/(pricing|price)/.test(u) && (r.headers()['content-type'] || '').includes('json')) {
      try { apis.push({ url: u, body: await r.json() }); } catch (e) {}
    }
  });
  try { await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); } catch (e) {}
  await page.waitForTimeout(2500);
  const text = await page.evaluate(() => {
    const art = document.querySelector('#article-section, #sections, article, main, .main') || document.body;
    for (const el of art.querySelectorAll('*')) { if (getComputedStyle(el).display === 'none' && !['SCRIPT', 'STYLE', 'TEMPLATE'].includes(el.tagName)) el.style.display = 'block'; }
    return document.title + '\n' + location.href + '\n\n' + art.innerText;
  });
  fs.writeFileSync(out, `# 가져온 시각: ${new Date().toISOString()}\n# 원본: ${url}${label ? ' (' + label + ')' : ''}\n` + text);
  if (apis.length) fs.writeFileSync(out.replace(/\.txt$/, '.api.json'), JSON.stringify(apis, null, 1));
  console.log(out, text.length, 'api', apis.length);
  await browser.close();
})();
