// ezgif.com Mute video '로컬 처리'(Local processing 상자 켬 → 브라우저 안에서 처리, 업로드 없음)
// node web_ezgif_local.cjs CLIP OUT [SHOT_PREFIX]
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [clip, out, shot] = process.argv.slice(2);
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 1000 }, acceptDownloads: true });
  const p = await ctx.newPage();
  const reqs = [];
  p.on('request', r => { if (r.method() === 'POST') reqs.push(r.url()); });
  await p.goto('https://ezgif.com/mute-video', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.check('#local-processing');
  await p.setInputFiles('#new-image', clip);
  await p.click('input[name=upload]');  // 로컬 처리에서는 버튼 이름이 'Load file!'
  await p.waitForSelector('input[value="Mute video!"]', { state: 'visible', timeout: 600000 });
  if (shot) await p.screenshot({ path: shot + '-form.png' });
  const t0 = Date.now();
  await p.click('input[value="Mute video!"]');
  // 결과가 blob: 링크·video로 나타날 때까지
  await p.waitForFunction(() => {
    const o = document.querySelector('#output');
    return o && (o.querySelector('video') || [...o.querySelectorAll('a')].some(a => a.href.startsWith('blob:')));
  }, null, { timeout: 600000 });
  const t1 = Date.now();
  const text = await p.evaluate(() => document.querySelector('#output')?.innerText.slice(0, 600));
  const b64 = await p.evaluate(async () => {
    const o = document.querySelector('#output');
    const a = [...o.querySelectorAll('a')].find(a => a.href.startsWith('blob:'));
    const v = o.querySelector('video source, video');
    const src = (a && a.href) || (v && (v.src || v.getAttribute('src')));
    const buf = await (await fetch(src)).arrayBuffer();
    let s = ''; const u = new Uint8Array(buf);
    for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000));
    return btoa(s);
  });
  fs.writeFileSync(out, Buffer.from(b64, 'base64'));
  if (shot) await p.screenshot({ path: shot + '-result.png', fullPage: true });
  console.log(JSON.stringify({ tool: 'ezgif-local', clip, process_s: (t1 - t0) / 1000, bytes: fs.statSync(out).size, post_requests: reqs, text, at: new Date().toISOString() }));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
