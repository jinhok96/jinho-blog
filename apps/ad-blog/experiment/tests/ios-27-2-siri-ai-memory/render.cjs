// Apple 사용 설명서·지원 문서를 Chromium으로 열어 본문 텍스트를 저장 (목차 제외)
// 실행: node render.cjs <url> <out.txt> [--links links.tsv]
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [url, out, flag, linksOut] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ locale: 'en-US', viewport: { width: 1100, height: 900 } })).newPage();
  try { await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); } catch (e) {}
  await page.waitForTimeout(1500);
  const res = await page.evaluate(() => {
    const art = document.querySelector('#article-section, #sections, article, main, .main') || document.body;
    for (const el of art.querySelectorAll('*')) { if (getComputedStyle(el).display === 'none') el.style.display = 'block'; }
    const links = [...document.querySelectorAll('a[href*="/guide/"]')].map(a => a.href.split('#')[0] + '\t' + a.innerText.trim().replace(/\s+/g, ' '));
    return { text: document.title + '\n' + location.href + '\n\n' + art.innerText, links };
  });
  fs.writeFileSync(out, `# 가져온 시각: ${new Date().toISOString()}\n# 원본: ${url}\n` + res.text);
  if (flag === '--links') fs.writeFileSync(linksOut, [...new Set(res.links)].join('\n'));
  console.log(out, res.text.length);
  await browser.close();
})();
