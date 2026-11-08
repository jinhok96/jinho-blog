// Chromium <video>로 잘린 파일을 열어 duration과 0초 화면을 캡처 → 원본의 어느 시점 화면인지 비교용 PNG 저장
// node playback_check.cjs FILE OUT_PNG
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
(async () => {
  const [file, outPng] = process.argv.slice(2);
  const srv = http.createServer((req, res) => {
    if (req.url === '/') { res.setHeader('Content-Type', 'text/html'); res.end(`<video id=v src="/v.mp4" muted preload=auto style="width:960px"></video>`); return; }
    const st = fs.statSync(file);
    const range = req.headers.range;
    if (range) {
      const [s, e] = range.replace('bytes=', '').split('-').map(x => x && +x);
      const end = e || st.size - 1;
      res.writeHead(206, { 'Content-Range': `bytes ${s}-${end}/${st.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - s + 1, 'Content-Type': 'video/mp4' });
      fs.createReadStream(file, { start: s, end }).pipe(res);
    } else { res.writeHead(200, { 'Content-Length': st.size, 'Content-Type': 'video/mp4' }); fs.createReadStream(file).pipe(res); }
  }).listen(0);
  const port = srv.address().port;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1000, height: 500 } });
  await p.goto(`http://127.0.0.1:${port}/`);
  const info = await p.evaluate(() => new Promise(r => {
    const v = document.getElementById('v');
    const done = () => r({ duration: v.duration, w: v.videoWidth, h: v.videoHeight, t: v.currentTime, err: v.error && v.error.code });
    v.addEventListener('loadeddata', () => setTimeout(done, 1000), { once: true });
    setTimeout(done, 20000);
    v.addEventListener('error', done, { once: true });
  }));
  await p.locator('#v').screenshot({ path: outPng });
  console.log(JSON.stringify({ file: path.basename(file), ...info }));
  await b.close(); srv.close();
})();
