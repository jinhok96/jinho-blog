// Render an image in headless Chromium via a local file:// page and take a screenshot of it.
// Usage: node screenshot.js <playwright-core dir> <chromium path> <image path> <out png>
const fs = require('fs');
const path = require('path');

const [pwDir, chromePath, imgPath, outPng] = process.argv.slice(2);
const { chromium } = require(pwDir);

(async () => {
  const html = path.join(path.dirname(outPng), '_page_' + path.basename(outPng, '.png') + '.html');
  fs.writeFileSync(
    html,
    `<!doctype html><html><body style="margin:0;background:#fff"><img id="i" src="file://${path.resolve(imgPath)}"></body></html>`,
  );
  const browser = await chromium.launch({ executablePath: chromePath, args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 2200, height: 1500 }, deviceScaleFactor: 1 });
  await page.goto('file://' + html);
  await page.waitForFunction(() => document.getElementById('i').complete);
  await page.locator('#i').screenshot({ path: outPng, type: 'png' });
  console.log('browser', browser.version(), '->', outPng);
  await browser.close();
  fs.unlinkSync(html);
})();
