// cloudinary.com/tools/remove-audio-from-video: 업로드 → Output Format MP4(기본) → Remove Audio → 결과 받기 (로그인 없음)
// node web_cloudinary.cjs CLIP OUT [SHOT_PREFIX]
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const [clip, out, shot] = process.argv.slice(2);
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 1000 }, acceptDownloads: true });
  const p = await ctx.newPage();
  const urls = [];
  p.on('response', r => { if (/video\/upload/.test(r.url())) urls.push(r.url()); });
  const t0 = Date.now();
  await p.goto('https://cloudinary.com/tools/remove-audio-from-video', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForTimeout(4000);
  const accept = p.locator('#onetrust-accept-btn-handler');
  if (await accept.count()) await accept.click().catch(() => {});
  await (await p.$('input[type=file]')).setInputFiles(clip);
  await p.getByText('Video uploaded!').waitFor({ timeout: 600000 });
  const tUp = Date.now();
  if (shot) await p.screenshot({ path: shot + '-form.png' });
  await p.getByRole('button', { name: /Remove Audio/ }).click();
  // 결과: Download 버튼(또는 링크)이 나타날 때까지
  const dlBtn = p.locator('a:visible, button:visible').filter({ hasText: /Download/i }).first();
  await dlBtn.waitFor({ timeout: 600000 });
  const tDone = Date.now();
  await p.waitForTimeout(1500);
  if (shot) await p.screenshot({ path: shot + '-result.png' });
  const text = await p.evaluate(() => document.body.innerText.split(/\s+/).join(' ').match(/Video uploaded.{0,400}|Done.{0,300}|ready.{0,300}/i)?.[0]);
  let href = await dlBtn.getAttribute('href').catch(() => null);
  let saved = false;
  try {
    const [dl] = await Promise.all([p.waitForEvent('download', { timeout: 60000 }), dlBtn.click()]);
    await dl.saveAs(out); saved = true;
  } catch (e) {
    if (!href) href = urls.filter(u => !/cloudinary-tools-uploads\/[^/]+\.mp4$/.test(u) || /\/(ac_none|fl_|e_)/.test(u)).pop();
    if (href) { const r = await p.request.get(href); fs.writeFileSync(out, await r.body()); saved = true; }
  }
  console.log(JSON.stringify({ tool: 'cloudinary', clip, upload_s: (tUp - t0) / 1000, process_s: (tDone - tUp) / 1000, saved, bytes: saved ? fs.statSync(out).size : null, href, video_urls: [...new Set(urls)].slice(-6), text, at: new Date().toISOString() }));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
