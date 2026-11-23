// ezgif.com Rotate video: 업로드 → 회전 상자 하나(rotate_90/180/270) → 인코딩(original=Copy original / mp4) → 결과 내려받기
// node web_ezgif.cjs CLIP ROT ENCODING OUT [SHOT]
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [clip, rot, enc, out, shot] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
  const t0 = Date.now();
  await p.goto('https://ezgif.com/rotate-video', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.setInputFiles('#new-image', clip);
  await Promise.all([p.waitForNavigation({ timeout: 600000 }), p.click('input[name=upload]')]);
  const tUp = Date.now();
  await p.check(`input[name=rotate_${rot}]`);
  await p.selectOption('select[name=encoding]', enc);
  if (shot) await p.screenshot({ path: shot, fullPage: false });
  await p.click('input[name=rotate-video]');
  await p.waitForSelector('#output video, #output a[href*=".mp4"], #output a[href*=".mov"], #output a[href*=".webm"]', { timeout: 600000 });
  const tDone = Date.now();
  const href = await p.evaluate(() => {
    const v = document.querySelector('#output video source, #output video');
    const a = [...document.querySelectorAll('#output a')].find(x => /save/i.test(x.innerText) || /\.(mp4|mov|webm)$/.test(x.href));
    return (v && (v.src || v.getAttribute('src'))) || (a && a.href);
  });
  const text = await p.evaluate(() => document.querySelector('#output')?.innerText.slice(0, 600));
  const resp = await p.request.get(new URL(href, p.url()).toString());
  fs.writeFileSync(out, await resp.body());
  console.log(JSON.stringify({ tool: 'ezgif', rot, enc, clip, href, upload_s: (tUp - t0) / 1000, process_s: (tDone - tUp) / 1000, bytes: fs.statSync(out).size, text }));
  await p.screenshot({ path: out + '.png', fullPage: true });
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
