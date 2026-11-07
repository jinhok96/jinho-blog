// 글을 쓸 때 저장한 1차 출처 사본(tests/{slug}/source-*.txt)과 지금 페이지를 문장 단위로 비교한다.
//
// 2026-11-08 세션 90 (`seo-audit` Content Quality: Accurate information / Updated and current).
// 도움말 문서는 공지 없이 고쳐짐 (예: Gemini 도움말이 10-26 ~ 11-07 사이 메뉴 이름 'Settings & help' → 'Settings',
// Connected Apps 끊기 '스위치' → 'More options > Disconnect'). 링크가 살아 있는지는 extlink_check.py,
// 문장이 바뀌었는지는 이 도구가 봄.
//
// 대상: 둘째 줄 안에 `# 원본: {URL}` 머리말이 있는 사본 (render.cjs로 저장한 형식). 같은 URL 사본이 여럿이면
//       파일 이름 순으로 마지막 것(날짜 붙은 최신 사본)과 비교. 머리말 없는 사본(curl로 받은 HTML 등)은 건너뜀.
// 실행: node apps/ad-blog/experiment/tools/source_diff.cjs [--slug a,b] [--save] [--max 8] [--json 저장경로]
//   --save  바뀐 문장이 있는 출처만 `{원래 이름에서 날짜 뺀 것}-{한국 날짜}.txt`로 새 사본 저장 (사실 확인표에서 인용)
// 비교: 머리말·제목·주소 줄을 빼고 모든 줄을 이어 붙인 뒤 문장(. ! ? 뒤 공백)으로 나눠 공백을 정리하고
//       30자 이상 문장의 집합을 비교 → 줄바꿈·인라인 요소 위치가 다른 추출 차이는 잡지 않음.
//       Apple 설명서는 목차를 빼고 본문(#article-section 등)만 읽음 (tests/siri-history-on-iphone/render.cjs와 같은 선택자)
// 판단은 사람이: 바뀐 문장이 글의 단계·수치·이름과 관계있을 때만 글을 고침 (README 개선 세션 7 '문제 찾기')
// Playwright는 클라우드 세션에 미리 설치된 것을 씀 (require('playwright'))
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const TESTS = path.resolve(__dirname, '..', 'tests');
const CONCURRENCY = 4;
const SELECTOR = '#article-section, #sections, article, main, .main';

function args() {
  const a = process.argv.slice(2);
  const get = (k) => (a.includes(k) ? a[a.indexOf(k) + 1] : undefined);
  return {
    slugs: get('--slug') ? get('--slug').split(',') : null,
    save: a.includes('--save'),
    max: Number(get('--max') || 8),
    json: get('--json'),
  };
}

function kstDate() {
  return new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
}

/** tests/{slug}/source-*.txt 중 `# 원본:` 머리말이 있는 사본 → {url: 최신 파일} (slug별) */
function collect(slugs) {
  const out = [];
  for (const slug of fs.readdirSync(TESTS).sort()) {
    const dir = path.join(TESTS, slug);
    if (!fs.statSync(dir).isDirectory() || (slugs && !slugs.includes(slug))) continue;
    const byUrl = {};
    for (const name of fs.readdirSync(dir).filter((n) => /^source-.*\.txt$/.test(n))) {
      const head = fs.readFileSync(path.join(dir, name), 'utf8').split('\n', 3).join('\n');
      const m = head.match(/^# 원본: (\S+)/m);
      if (!m) continue;
      // 같은 URL이면 '가져온 시각'이 가장 늦은 사본 (없으면 파일 이름)
      const fetched = (head.match(/^# 가져온 시각: (\S+)/m) || [])[1] || '';
      const prev = byUrl[m[1]];
      if (!prev || fetched > prev.fetched || (fetched === prev.fetched && name > prev.name)) byUrl[m[1]] = { name, fetched };
    }
    for (const [url, { name }] of Object.entries(byUrl)) out.push({ slug, url, file: path.join(dir, name) });
  }
  return out;
}

/** 머리말(#)·제목·주소 줄을 빼고 문장 집합으로 */
function sentences(text, fromPage = false) {
  let lines = text.split('\n').filter((l) => !l.startsWith('# '));
  // 사본 형식: 제목 줄 + 주소 줄 + 본문 → 제목·주소를 뺌 (지금 페이지는 본문만 넘김)
  if (!fromPage && /^https?:\/\//.test((lines[1] || '').trim())) lines = lines.slice(2);
  const joined = lines.filter((l) => !/^https?:\/\//.test(l.trim())).join(' ').replace(/\s+/g, ' ').replace(/\s+([.,;:!?])/g, '$1');
  // 30자 이상 문장만, 본문에 섞인 스크립트·JSON 조각(중괄호)과 Apple 설명서 틀(판 선택·목차·이전/다음·'Helpful?' 의견 칸)은 뺌
  // (세션 56~58 사본은 바깥 main을 읽어 이 틀이 들어 있음)
  const clean = (s) => s
    .replace(/^.*?\bTable of Contents\s+/, '')
    .replace(/(^|\s+)Previous\s.*?\bHelpful\?$/, '')
    .replace(/\s*\bHelpful\?$/, '')
    .trim();
  return new Set(joined.split(/(?<=[.!?])\s+/).map(clean)
    .filter((s) => s.length >= 30 && !/[{}]/.test(s) && !/character limit|Thanks for your feedback|personal information in your comment/i.test(s)));
}

async function render(ctx, url) {
  const page = await ctx.newPage();
  try {
    try { await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 }); } catch (e) { /* 늦게 끝나는 페이지도 읽음 */ }
    await page.waitForTimeout(3000);
    // 접힌 단락 펼치기: 본문 안 요소만, 최대 40개 (사이트 메뉴의 aria-expanded까지 누르면 페이지마다 수십 초가 걸림)
    const toggles = await page.$$(`:is(${SELECTOR}) :is(a.zippy, [aria-expanded="false"])`);
    for (const el of toggles.slice(0, 40)) { try { await el.click({ timeout: 300 }); } catch (e) { /* 펼칠 수 없는 요소 */ } }
    await page.waitForTimeout(500);
    return await page.evaluate((sel) => {
      // 선택자 목록 순서대로 (querySelector에 목록을 통째로 주면 문서 순서상 먼저 나오는 바깥 main을 고름 → Apple 목차가 섞임)
      const art = sel.split(',').map((s) => document.querySelector(s.trim())).find(Boolean) || document.body;
      for (const el of art.querySelectorAll('*')) { if (getComputedStyle(el).display === 'none') el.style.display = 'block'; }
      return { title: document.title, href: location.href, text: art.innerText };
    }, SELECTOR);
  } catch (e) {
    return { error: e.message };
  } finally {
    await page.close();
  }
}

(async () => {
  const opt = args();
  const jobs = collect(opt.slugs);
  if (!jobs.length) {
    console.log('비교할 사본이 없습니다 (`# 원본:` 머리말이 있는 tests/{slug}/source-*.txt).');
    return;
  }
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ locale: 'en-US', viewport: { width: 1100, height: 900 } });
  const results = [];
  const queue = [...jobs];
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      const job = queue.shift();
      const now = await render(ctx, job.url);
      process.stderr.write(`${jobs.length - queue.length}/${jobs.length} ${job.slug} ${path.basename(job.file)}\n`);
      if (now.error || !now.text || now.text.trim().length < 200) {
        results.push({ ...job, status: 'error', note: now.error || '본문이 비어 있음 (로그인·봇 확인 화면일 수 있음)' });
        continue;
      }
      const old = sentences(fs.readFileSync(job.file, 'utf8'));
      const cur = sentences(now.text, true);
      const added = [...cur].filter((s) => !old.has(s));
      const removed = [...old].filter((s) => !cur.has(s));
      const status = added.length || removed.length ? 'changed' : 'same';
      let saved;
      if (status === 'changed' && opt.save) {
        const base = path.basename(job.file, '.txt').replace(/-\d{4}-\d{2}-\d{2}$/, '');
        saved = path.join(path.dirname(job.file), `${base}-${kstDate()}.txt`);
        if (saved !== job.file) fs.writeFileSync(saved, `# 가져온 시각: ${new Date().toISOString()}\n# 원본: ${job.url}\n${now.title}\n${now.href}\n\n${now.text}`);
        else saved = undefined;
      }
      results.push({ ...job, status, added, removed, saved });
    }
  }));
  await browser.close();
  results.sort((a, b) => (a.slug + a.file).localeCompare(b.slug + b.file));
  const rel = (f) => path.relative(TESTS, f);
  const changed = results.filter((r) => r.status === 'changed');
  const errors = results.filter((r) => r.status === 'error');
  console.log(`## 1차 출처 문장 비교 (${kstDate()} KST, 출처 ${results.length}개 · 바뀜 ${changed.length} · 확인 불가 ${errors.length})\n`);
  for (const r of changed) {
    console.log(`### ${rel(r.file)} (+${r.added.length} −${r.removed.length})\n${r.url}${r.saved ? `\n새 사본: ${rel(r.saved)}` : ''}`);
    for (const s of r.removed.slice(0, opt.max)) console.log(`- − ${s.slice(0, 300)}`);
    for (const s of r.added.slice(0, opt.max)) console.log(`- + ${s.slice(0, 300)}`);
    if (r.added.length > opt.max || r.removed.length > opt.max) console.log(`- … (--max로 더 보기)`);
    console.log('');
  }
  for (const r of errors) console.log(`- 확인 불가: ${rel(r.file)} — ${r.note}`);
  console.log(`\n바뀌지 않음 ${results.length - changed.length - errors.length}개`);
  if (opt.json) fs.writeFileSync(opt.json, JSON.stringify(results, null, 1));
})();
