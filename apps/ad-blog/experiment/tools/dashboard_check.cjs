// 운영 대시보드 페이지 점검 (ToolProof 운영 실험용): 발행 전에 dashboard/index.html을 Chromium으로 열어 스크립트 오류·빈 화면을 찾는다.
// 스크립트 하나가 문법 오류로 멈추면 화면 전체가 "데이터 불러오는 중"에 머물러도 발행은 성공하므로, 페이지를 고치면 발행 전에 실행한다.
//
// 실행: node apps/ad-blog/experiment/tools/dashboard_check.cjs [--data /tmp/dashboard-prev/stats]
//   --data: dashboard_data.py가 만든 data.js, 또는 stats 문서 JSON 폴더(ArtifactData list의 out_dir 저장본).
//           없으면 데이터 없는 화면("데이터 연결 안 됨")만 확인
// 결과: 문제가 없으면 요약을 출력하고 0, 있으면 문제 목록을 출력하고 1로 끝남
// Playwright는 클라우드 세션에 미리 설치된 것을 씀 (require('playwright'))

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright');

const PAGE = path.resolve(__dirname, '../dashboard/index.html');
const VIEWPORTS = [{ name: '데스크톱', width: 1280, height: 900 }, { name: '모바일', width: 375, height: 812 }];

function snapshotJs(data) {
  if (fs.statSync(data).isFile()) return fs.readFileSync(data, 'utf8');
  const docs = {};
  for (const f of fs.readdirSync(data).filter((n) => n.endsWith('.json'))) docs[path.basename(f, '.json')] = JSON.parse(fs.readFileSync(path.join(data, f), 'utf8'));
  return `window.DASHBOARD_SNAPSHOT = ${JSON.stringify({ docs }).replace(/<\//g, '<\\/')};\n`;
}

async function main() {
  const i = process.argv.indexOf('--data');
  const data = i > 0 ? process.argv[i + 1] : null;
  // 발행 때처럼 문서 뼈대로 감싸 임시 폴더에 둠 (data.js는 페이지가 상대 경로로 읽음)
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dashboard-check-'));
  fs.writeFileSync(path.join(dir, 'index.html'), `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body>\n${fs.readFileSync(PAGE, 'utf8')}\n</body></html>`);
  if (data) fs.writeFileSync(path.join(dir, 'data.js'), snapshotJs(data));

  const problems = [];
  const browser = await chromium.launch();
  try {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, timezoneId: 'Asia/Seoul' });
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      // 폰트·data.js 파일 없음은 로컬에서만 생기는 일이라 제외
      page.on('console', (m) => { if (m.type() === 'error' && !m.text().startsWith('Failed to load resource')) errors.push(m.text()); });
      await page.goto('file://' + path.join(dir, 'index.html'));
      await page.waitForTimeout(500);
      // 정렬 버튼을 모두 눌러 정렬·다시 그리기 경로도 실행
      for (const b of await page.$$('#posts-panel th:not([hidden]) .sort')) await b.click();
      const s = await page.evaluate(() => ({
        updated: document.getElementById('updated').textContent,
        notice: document.getElementById('notice').hidden ? '' : document.getElementById('notice').textContent,
        rows: document.querySelectorAll('#posts tr[data-slug]').length,
        posts: window.DASHBOARD_SNAPSHOT?.docs?.posts?.rows?.length ?? 0,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }));
      const tag = `[${vp.name} ${vp.width}px]`;
      errors.forEach((e) => problems.push(`${tag} 스크립트 오류: ${e}`));
      if (s.updated === '데이터 불러오는 중') problems.push(`${tag} 화면이 그려지지 않음 (갱신 시각이 "데이터 불러오는 중" 그대로)`);
      if (data && s.rows !== s.posts) problems.push(`${tag} 글별 표 ${s.rows}줄 / 데이터 ${s.posts}편`);
      if (s.overflow > 0) problems.push(`${tag} 페이지가 가로로 ${s.overflow}px 넘침`);
      if (vp === VIEWPORTS[0]) console.log(`${tag} ${s.updated} · 글별 표 ${s.rows}줄${s.notice ? ` · 안내: ${s.notice}` : ''}`);
      await page.close();
    }
  } finally {
    await browser.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
  if (problems.length) {
    console.error(problems.join('\n'));
    process.exit(1);
  }
  console.log('문제 없음');
}

main().catch((e) => { console.error(e); process.exit(1); });
