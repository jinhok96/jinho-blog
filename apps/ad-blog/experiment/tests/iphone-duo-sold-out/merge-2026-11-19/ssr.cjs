// Apple Self Service Repair 스토어에서 iPhone Duo 부품·가격 목록 텍스트 저장 (페이지가 부르는 JSON도 저장)
// 실행: node ssr.cjs <url> <out.txt>
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [url, out] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ locale: 'en-US', viewport: { width: 1280, height: 1000 } })).newPage();
  const apis = [];
  page.on('response', async (r) => { if ((r.headers()['content-type'] || '').includes('json')) { try { const b = await r.text(); if (/Duo/i.test(b)) apis.push({ url: r.url(), body: b.slice(0, 200000) }); } catch (e) {} } });
  try { await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 }); } catch (e) {}
  for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 2500); await page.waitForTimeout(800); }
  await page.waitForTimeout(2000);
  const text = await page.evaluate(() => document.title + '\n' + location.href + '\n\n' + document.body.innerText);
  fs.writeFileSync(out, `# 가져온 시각: ${new Date().toISOString()}\n# 원본: ${url}\n` + text);
  if (apis.length) fs.writeFileSync(out.replace(/\.txt$/, '.api.json'), JSON.stringify(apis, null, 1));
  await page.screenshot({ path: out.replace(/\.txt$/, '.png'), fullPage: false });
  console.log(out, text.length, 'api', apis.length, page.url());
  await browser.close();
})();
