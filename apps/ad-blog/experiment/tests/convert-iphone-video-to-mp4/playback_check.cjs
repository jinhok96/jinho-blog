// Chromium <video>로 변환 결과를 3초 재생해 영상 크기·재생 시간·디코딩된 영상 프레임·소리 바이트를 기록
// (Chromium이 그 MP4의 영상·소리를 실제로 재생할 수 있는지 확인용. Playwright Chromium은 HEVC 디코딩 불가)
// node playback_check.cjs FILE [FILE...]
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
(async () => {
  const files = process.argv.slice(2);
  let current = files[0];
  const srv = http.createServer((req, res) => {
    if (req.url === '/') { res.setHeader('Content-Type', 'text/html'); res.end('<video id=v src="/v.mp4" muted autoplay playsinline></video>'); return; }
    const st = fs.statSync(current);
    const range = req.headers.range;
    if (range) {
      const [s, e] = range.replace('bytes=', '').split('-').map(x => x && +x);
      const end = e || st.size - 1;
      res.writeHead(206, { 'Content-Range': `bytes ${s}-${end}/${st.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - s + 1, 'Content-Type': 'video/mp4' });
      fs.createReadStream(current, { start: s, end }).pipe(res);
    } else { res.writeHead(200, { 'Content-Length': st.size, 'Content-Type': 'video/mp4' }); fs.createReadStream(current).pipe(res); }
  }).listen(0);
  const port = srv.address().port;
  const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  for (const f of files) {
    current = f;
    const p = await b.newPage();
    await p.goto(`http://127.0.0.1:${port}/`);
    await p.waitForTimeout(3500);
    const info = await p.evaluate(() => {
      const v = document.getElementById('v');
      return { w: v.videoWidth, h: v.videoHeight, duration: v.duration, t: +v.currentTime.toFixed(2), err: v.error && v.error.code,
        videoBytes: v.webkitVideoDecodedByteCount, audioBytes: v.webkitAudioDecodedByteCount,
        canMp2: document.createElement('video').canPlayType('video/mp4; codecs="avc1.640028, mp4a.6B"') };
    });
    console.log(JSON.stringify({ file: path.basename(path.dirname(f)) + '/' + path.basename(f), ...info }));
    await p.close();
  }
  await b.close(); srv.close();
})();
