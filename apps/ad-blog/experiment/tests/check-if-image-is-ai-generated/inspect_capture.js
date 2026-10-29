// Upload test files to Adobe Inspect (beta) and CAI Verify in headless Chromium, save the result pages
// and the position of the key line on each page (for the boxes drawn by charts.py).
// Usage: node inspect_capture.js <out dir> <file> [<file> ...]
// Run 2026-10-29: playwright from /opt/node-tools, Chromium 153.0.8010.12, viewport 1280x900, DPR 1.
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node-tools/node_modules/playwright');

const KEY_LINES = ['Created with AI', "We couldn't verify how this was made", 'There are unrecorded changes'];

(async () => {
  const [outDir, ...files] = process.argv.slice(2);
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch();
  const notes = { browser: browser.version(), date: new Date().toISOString(), inspect: {}, verify: {} };

  for (const file of files) {
    const name = path.basename(file).replace(/\.[^.]+$/, '');
    // Inspect: the upload goes through the "Browse files" file chooser (setting the hidden input does nothing)
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
    await page.goto('https://contentauthenticity.adobe.com/inspect', { waitUntil: 'networkidle', timeout: 60000 });
    const [chooser] = await Promise.all([page.waitForEvent('filechooser'), page.getByText('Browse files').click()]);
    await chooser.setFiles(file);
    await page.waitForTimeout(15000);
    const boxes = {};
    for (const line of KEY_LINES) {
      const loc = page.getByText(line, { exact: false }).first();
      if (await loc.count()) boxes[line] = await loc.boundingBox();
    }
    await page.screenshot({ path: path.join(outDir, `inspect-${name}.png`) });
    notes.inspect[name] = { text: (await page.evaluate(() => document.body.innerText)).trim(), boxes };
    await page.close();

    // Verify: shows a result page for files with Content Credentials only
    const v = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
    const errors = [];
    v.on('console', (m) => m.type() === 'error' && errors.push(m.text().split('\n')[0]));
    await v.goto('https://verify.contentauthenticity.org/', { waitUntil: 'networkidle', timeout: 60000 });
    await v.setInputFiles('input[type=file]', file);
    await v.waitForTimeout(10000);
    await v.screenshot({ path: path.join(outDir, `verify-${name}.png`) });
    const text = await v.evaluate(() => document.body.innerText);
    // drop the language menu (between "Change language" and the footer) so the result panel text stays
    const [head, rest = ''] = text.split('Change language');
    notes.verify[name] = { text: (head + (rest.split('日本語')[1] || '')).trim(), consoleErrors: errors };
    await v.close();
    console.log('done', name);
  }
  fs.writeFileSync(path.join(outDir, 'capture-notes.json'), JSON.stringify(notes, null, 2));
  await browser.close();
})();
