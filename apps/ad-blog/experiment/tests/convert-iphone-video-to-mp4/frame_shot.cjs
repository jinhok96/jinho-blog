// Chromium <video>로 파일을 열어 지정한 시각의 화면을 PNG로 저장 (회전·좌우 반전이 재생 때 어떻게 보이는지 확인용)
// node frame_shot.cjs FILE SECONDS OUT.png
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
(async () => {
  const [file, sec, out] = process.argv.slice(2);
  const srv = http.createServer((req, res) => {
    if (req.url === '/') { res.setHeader('Content-Type', 'text/html'); res.end('<body style="margin:0;background:#fff"><video id=v src="/v.mp4" muted preload=auto style="height:600px"></video></body>'); return; }
    const st = fs.statSync(file);
    const range = req.headers.range;
    if (range) {
      const [s, e] = range.replace('bytes=', '').split('-').map(x => x && +x);
      const end = e || st.size - 1;
      res.writeHead(206, { 'Content-Range': `bytes ${s}-${end}/${st.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - s + 1, 'Content-Type': 'video/mp4' });
      fs.createReadStream(file, { start: s, end }).pipe(res);
    } else { res.writeHead(200, { 'Content-Length': st.size, 'Content-Type': 'video/mp4' }); fs.createReadStream(file).pipe(res); }
  }).listen(0);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 700, height: 620 } });
  await p.goto(`http://127.0.0.1:${srv.address().port}/`);
  await p.waitForFunction(() => document.getElementById('v').readyState >= 2, null, { timeout: 30000 });
  await p.evaluate((t) => new Promise(r => { const v = document.getElementById('v'); v.addEventListener('seeked', () => setTimeout(r, 500), { once: true }); v.currentTime = t; }), +sec);
  await p.locator('#v').screenshot({ path: out });
  await b.close(); srv.close();
})();
