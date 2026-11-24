// ezgif.com Mute video (서버 처리): 업로드 → "Mute video!" → 결과 내려받기 + 화면 캡처
// node web_ezgif.cjs CLIP OUT [SHOT_PREFIX]
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [clip, out, shot] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
  const t0 = Date.now();
  await p.goto('https://ezgif.com/mute-video', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.setInputFiles('#new-image', clip);
  await Promise.all([p.waitForNavigation({ timeout: 600000 }), p.click('input[name=upload]')]);
  const tUp = Date.now();
  if (shot) await p.screenshot({ path: shot + '-form.png' });
  await p.click('input[name=effects]');
  await p.waitForSelector('#output video, #output a[href*=".mp4"], #output a[href*=".mov"]', { timeout: 600000 });
  const tDone = Date.now();
  const href = await p.evaluate(() => {
    const v = document.querySelector('#output video source, #output video');
    const a = [...document.querySelectorAll('#output a')].find(x => /save/i.test(x.innerText) || /\.(mp4|mov|webm)$/.test(x.href));
    return (v && (v.src || v.getAttribute('src'))) || (a && a.href);
  });
  const text = await p.evaluate(() => document.querySelector('#output')?.innerText.slice(0, 600));
  const resp = await p.request.get(new URL(href, p.url()).toString());
  fs.writeFileSync(out, await resp.body());
  if (shot) await p.screenshot({ path: shot + '-result.png', fullPage: true });
  console.log(JSON.stringify({ tool: 'ezgif-server', clip, href, upload_s: (tUp - t0) / 1000, process_s: (tDone - tUp) / 1000, bytes: fs.statSync(out).size, text, at: new Date().toISOString() }));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
