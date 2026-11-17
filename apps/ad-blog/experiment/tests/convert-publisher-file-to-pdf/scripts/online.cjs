// 온라인 변환기에 Publisher 파일을 올려 PDF로 바꾸고 내려받음 (로그인 없음, 무료 등급)
// 실행: node scripts/online.cjs <site> <file.pub> [...]
//   site: zamzar | cloudconvert | convertio | aspose
// 결과: out/<site>/<이름>.pdf, 단계별 화면 shots/<site>-<이름>-N.png, 버튼 목록·소요 시간은 표준 출력
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SITES = {
  zamzar: 'https://www.zamzar.com/convert/pub-to-pdf/',
  cloudconvert: 'https://cloudconvert.com/pub-to-pdf',
  convertio: 'https://convertio.co/pub-pdf/',
  aspose: 'https://products.aspose.app/pub/conversion/pub-to-pdf',
  freeconvert: 'https://www.freeconvert.com/pub-to-pdf',
};

const CONSENT = [
  '#onetrust-accept-btn-handler',
  'button:has-text("Accept all")',
  'button:has-text("Accept All")',
  'button:has-text("Accept")',
  'button:has-text("I agree")',
  'button:has-text("Agree")',
  'button:has-text("Got it")',
];

async function consent(page) {
  for (const sel of CONSENT) {
    try {
      await page.click(sel, { timeout: 800 });
    } catch (e) {}
  }
}

async function listButtons(page) {
  return page.$$eval('button, a, input[type=submit]', (els) =>
    els
      .filter((e) => e.offsetParent !== null)
      .map((e) => (e.innerText || e.value || '').trim())
      .filter((t) => t && t.length < 40),
  );
}

async function clickFirst(page, sels, timeout = 5000) {
  for (const sel of sels) {
    try {
      await page.click(sel, { timeout });
      return sel;
    } catch (e) {}
  }
  return null;
}

async function waitDownload(page, sels, maxMs) {
  const end = Date.now() + maxMs;
  while (Date.now() < end) {
    for (const sel of sels) {
      const el = await page.$(sel);
      if (el && (await el.isVisible())) {
        try {
          const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 30000 }), el.click()]);
          return dl;
        } catch (e) {}
      }
    }
    await page.waitForTimeout(2000);
  }
  return null;
}

(async () => {
  const [site, ...files] = process.argv.slice(2);
  const url = SITES[site];
  if (!url) throw new Error('unknown site ' + site);
  fs.mkdirSync(`out/${site}`, { recursive: true });
  fs.mkdirSync('shots', { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    locale: 'en-US',
    viewport: { width: 1280, height: 900 },
    acceptDownloads: true,
  });
  for (const f of files) {
    const base = path.basename(f, '.pub');
    const shot = (n) => page.screenshot({ path: `shots/${site}-${base}-${n}.png` });
    const page = await ctx.newPage();
    const t0 = Date.now();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(4000);
    await consent(page);
    // 사람이 하듯 파일 선택 버튼을 눌러 파일 창으로 올림 (버튼을 못 찾으면 첫 file input)
    const chooserBtn = {
      zamzar: 'button:has-text("Choose Files")',
      cloudconvert: 'button:has-text("Select File"), label:has-text("Select File")',
      convertio: 'label:has-text("Choose Files"), div:has-text("Choose Files") >> nth=-1',
      aspose: 'text=Drop or upload your file',
      freeconvert: 'button:has-text("Choose Files")',
    }[site];
    try {
      const [chooser] = await Promise.all([
        page.waitForEvent('filechooser', { timeout: 8000 }),
        page.click(chooserBtn, { timeout: 6000 }),
      ]);
      await chooser.setFiles(f);
      console.log(site, base, 'upload via file chooser');
    } catch (e) {
      const input = (await page.$$('input[type=file]'))[0];
      await input.setInputFiles(f);
      console.log(site, base, 'upload via input (chooser failed:', e.message.slice(0, 60), ')');
    }
    await page.waitForTimeout(5000);
    await consent(page);
    await shot(1);
    console.log(site, base, 'buttons after upload:', (await listButtons(page)).slice(0, 50).join(' | '));
    if (site === 'convertio') {
      // 대상 형식이 '...'로 비어 있으면 PDF를 고름
      try {
        await page.click('.convert-to-btn, button:has-text("...")', { timeout: 4000 });
        await page.waitForTimeout(800);
        await page.keyboard.type('pdf');
        await page.waitForTimeout(1500);
        await shot('1b');
        await page.click('[data-format="pdf"], li:has-text("PDF") >> nth=0', { timeout: 4000 });
      } catch (e) {
        console.log('convertio format select failed', e.message.slice(0, 80));
      }
    }
    const siteConvert = {
      cloudconvert: ['button.btn-primary:has-text("Convert")', 'button:text-is("Convert") >> nth=-1'],
      convertio: ['button:has-text("Convert") >> nth=-1', 'div.convert-button'],
      aspose: ['button:text-is("Convert")', '#uploadButton'],
      zamzar: ['button:has-text("Convert Now")'],
      freeconvert: ['button:has-text("Convert") >> nth=-1'],
    }[site];
    const clicked = await clickFirst(page, [
      ...siteConvert,
      'button:has-text("Convert Now")',
      'button:has-text("Convert")',
      'a:has-text("Convert")',
      'input[type=submit][value*="Convert"]',
      '#convert-button',
    ]);
    console.log(site, base, 'convert click:', clicked);
    await page.waitForTimeout(3000);
    await shot(2);
    const dl = await waitDownload(
      page,
      [
        'a:has-text("Download")',
        'a:has-text("Save result to your computer")',
        'button:has-text("Save result to your computer")',
        'button:has-text("Download")',
        'a.download-button',
        '#downloadButton',
      ],
      240000,
    );
    await shot(3);
    if (dl) {
      const out = `out/${site}/${base}.pdf`;
      await dl.saveAs(out);
      console.log(site, base, 'saved', out, fs.statSync(out).size, 'bytes', Math.round((Date.now() - t0) / 1000), 's', 'suggested:', dl.suggestedFilename());
    } else {
      console.log(site, base, 'NO DOWNLOAD; buttons:', (await listButtons(page)).slice(0, 60).join(' | '));
    }
    await page.close();
  }
  await browser.close();
})();
