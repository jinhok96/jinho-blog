// storrito.com/tools/video-trim (브라우저 안에서 자르는 도구, 업로드 없음): 손잡이를 끌어 시작·끝을 맞추고 Trim and download
// 손잡이만 있어 숫자 입력이 없음 → 픽셀 단위로 끌고 화면의 "in · out" 표시를 읽어 목표에 가장 가까운 위치를 씀
// node web_storrito.cjs CLIP START END OUT [SHOT]
const { chromium } = require('playwright');
const fs = require('fs');
const toSec = s => { const [m, r] = s.split(':'); return +m * 60 + +r; };
(async () => {
  const [clip, start, end, out, shot] = process.argv.slice(2);
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1366, height: 1000 }, acceptDownloads: true });
  const p = await ctx.newPage();
  await p.goto('https://storrito.com/tools/video-trim/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.waitForTimeout(3000);
  const [fc] = await Promise.all([p.waitForEvent('filechooser'), p.getByRole('button', { name: 'Choose a video' }).click()]);
  await fc.setFiles(clip);
  await p.locator('.tool__status--ready').waitFor({ timeout: 120000 });
  const dur = toSec((await p.locator('.tool__time-display').innerText()).split('/')[1].trim());
  const track = await p.locator('.tool__timeline-track').boundingBox();
  const readRange = async () => {
    const t = await p.locator('.tool__range-display').innerText();
    const m = t.match(/in ([\d:.]+).*out ([\d:.]+)/);
    return [toSec(m[1]), toSec(m[2])];
  };
  async function setHandle(i, target) {
    const h = p.locator('.tool__timeline-handle').nth(i);
    let best = null;
    const base = track.x + track.width * target / dur;
    for (const dx of [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2]) {
      const hb = await h.boundingBox();
      await p.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2);
      await p.mouse.down();
      await p.mouse.move(base + dx, hb.y + hb.height / 2, { steps: 8 });
      await p.mouse.up();
      const v = (await readRange())[i];
      if (best === null || Math.abs(v - target) < Math.abs(best.v - target)) best = { dx, v };
    }
    const hb = await h.boundingBox();
    await p.mouse.move(hb.x + hb.width / 2, hb.y + hb.height / 2);
    await p.mouse.down();
    await p.mouse.move(base + best.dx, hb.y + hb.height / 2, { steps: 8 });
    await p.mouse.up();
  }
  await setHandle(1, +end);
  await setHandle(0, +start);
  const [inS, outS] = await readRange();
  if (shot) await p.screenshot({ path: shot });
  const t1 = Date.now();
  const [download] = await Promise.all([
    p.waitForEvent('download', { timeout: 600000 }),
    p.getByRole('button', { name: 'Trim and download' }).click(),
  ]);
  await download.saveAs(out);
  const status = await p.locator('.tool__status').innerText().catch(() => '');
  console.log(JSON.stringify({ tool: 'storrito', clip, in: inS, out: outS, process_s: (Date.now() - t1) / 1000, bytes: fs.statSync(out).size, name: download.suggestedFilename(), status }));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
