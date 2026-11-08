// clideo.com Video Cutter: 업로드 → Extract Selected, 시작·끝 입력 → Export → Download
// node web_clideo.cjs CLIP START(mm:ss.xx) END(mm:ss.xx) OUT [SHOT]
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [clip, start, end, out, shot] = process.argv.slice(2);
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1366, height: 1000 }, acceptDownloads: true });
  const p = await ctx.newPage();
  await p.goto('https://clideo.com/cut-video', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForTimeout(3000);
  await p.locator('#upload-file').setInputFiles(clip);
  await p.locator('#left-time-input').waitFor({ state: 'visible', timeout: 600000 });
  await p.waitForTimeout(3000);
  const ok = p.getByRole('button', { name: 'Ok' });
  if (await ok.isVisible().catch(() => false)) await ok.click();
  for (const [sel, v] of [['#right-time-input', end], ['#left-time-input', start]]) {
    await p.locator(sel).click({ clickCount: 3 });
    await p.keyboard.type(v);
    await p.keyboard.press('Enter');
    await p.waitForTimeout(800);
  }
  const vals = [await p.locator('#left-time-input').inputValue(), await p.locator('#right-time-input').inputValue()];
  const fmt = await p.locator('text=Format').locator('..').innerText().catch(() => '');
  if (shot) await p.screenshot({ path: shot });
  const t1 = Date.now();
  await p.getByRole('button', { name: 'Export' }).click();
  // 결과 페이지의 Download
  const dl = p.getByRole('button', { name: /^Download$/ }).or(p.getByRole('link', { name: /^Download$/ })).first();
  await dl.waitFor({ state: 'visible', timeout: 900000 });
  const tDone = Date.now();
  await p.waitForTimeout(2000);
  const pageText = (await p.evaluate(() => document.body.innerText)).slice(0, 1500);
  await p.screenshot({ path: out + '.png' });
  // Download는 새 탭이나 파일 주소로 열릴 수 있음 → 내려받기 이벤트·새 탭·mp4 응답 중 먼저 오는 것
  const mp4Urls = [];
  const bodies = [];
  ctx.on('response', r => {
    if (/\.mp4(\?|$)/.test(r.url()) || /video\/mp4/.test(r.headers()['content-type'] || '')) {
      mp4Urls.push(r.url());
      bodies.push(r.body().then(b => ({ url: r.url(), status: r.status(), b })).catch(e => ({ url: r.url(), err: e.message })));
    }
  });
  const dlPromise = ctx.waitForEvent('page', { timeout: 120000 }).then(async np => {
    const d = await np.waitForEvent('download', { timeout: 120000 }).catch(() => null);
    return d || { url: np.url() };
  });
  const directDl = p.waitForEvent('download', { timeout: 120000 }).catch(() => null);
  await dl.click();
  let got = await Promise.race([directDl, dlPromise.catch(() => null)]);
  if (!got) got = await directDl;
  let name;
  if (got && got.saveAs) { await got.saveAs(out); name = got.suggestedFilename(); }
  else {
    const url = (got && got.url) || mp4Urls[mp4Urls.length - 1];
    // 새 탭이 받은 mp4 응답 본문을 그대로 씀 (주소는 한 번만 쓸 수 있어 다시 받으면 403)
    await p.waitForTimeout(15000);
    const got2 = (await Promise.all(bodies)).filter(x => x.b && x.status === 200 && x.b.length > 100000);
    console.error(JSON.stringify((await Promise.all(bodies)).map(x => ({ url: x.url.slice(0, 80), status: x.status, len: x.b && x.b.length, err: x.err }))));
    if (got2.length) { fs.writeFileSync(out, got2[got2.length - 1].b); name = got2[got2.length - 1].url; }
    else {
    // 같은 페이지 안에서 fetch(쿠키·Referer 포함)로 받아 base64로 넘김
    const b64 = await p.evaluate(async u => {
      const r = await fetch(u, { credentials: 'include' });
      const buf = new Uint8Array(await r.arrayBuffer());
      let s = ''; for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
      return btoa(s);
    }, url);
    fs.writeFileSync(out, Buffer.from(b64, 'base64')); name = url;
    }
  }
  console.log(JSON.stringify({ tool: 'clideo', clip, vals, fmt, process_s: (tDone - t1) / 1000, bytes: fs.statSync(out).size, name, pageText: pageText.replace(/\n+/g, ' / ') }));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
