// Microsoft KB5127936 페이지의 "Context menu in File Explorer" 단락과 release health 표를 캡처 (Playwright + Chromium, 1280px)
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
  const notes = {};
  // 1) KB 페이지
  await p.goto('https://support.microsoft.com/en-us/help/5127936', { waitUntil: 'networkidle', timeout: 90000 });
  await p.waitForTimeout(3000);
  // 쿠키 배너 닫기 (있으면)
  for (const t of ['Accept', 'Reject']) { const btn = p.getByRole('button', { name: t }); if (await btn.count()) { await btn.first().click().catch(() => {}); break; } }
  // "Gradual rollout" 접힌 단락을 펼침
  const acc = p.locator('summary', { hasText: 'Gradual rollout' }).first();
  await acc.click();
  await p.waitForTimeout(1500);
  const heading = p.locator('text=[Context menu in File Explorer]').first();
  await heading.waitFor({ state: 'visible', timeout: 15000 });
  await heading.scrollIntoViewIfNeeded();
  // 페이지 좌표(스크롤 포함)로 "Highlights" 제목부터 다음 항목 "[Modernized AutoPlay experience]" 앞까지
  const rect = await p.evaluate(() => {
    const abs = el => { const r = el.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height }; };
    const h2 = [...document.querySelectorAll('h2,h3')].find(e => e.innerText.trim() === 'Highlights');
    const next = [...document.querySelectorAll('strong')].find(e => e.textContent.includes('[Modernized AutoPlay experience]'));
    const a = abs(h2), b = abs(next);
    return { x: a.x, y: a.y, bottom: b.y };
  });
  notes.kbTitle = (await p.locator('h1').first().innerText()).trim();
  notes.kbUrl = p.url();
  const clip = { x: Math.max(0, rect.x - 20), y: rect.y - 12, width: 860, height: rect.bottom - rect.y + 4 };
  await p.screenshot({ path: 'screens/kb5127936-context-menu.png', clip, fullPage: true });
  notes.kbClip = clip;
  // 2) release information 표 (26H2/25H2 최신 업데이트 행)
  await p.goto('https://learn.microsoft.com/en-us/windows/release-health/windows11-release-information', { waitUntil: 'networkidle', timeout: 90000 });
  await p.waitForTimeout(2000);
  const table = p.locator('table').first();
  await table.scrollIntoViewIfNeeded();
  await table.screenshot({ path: 'screens/windows11-release-information-table.png' });
  notes.relTable = (await table.innerText()).trim();
  notes.capturedAt = new Date().toISOString();
  notes.chromium = b.version();
  fs.writeFileSync('capture-notes.json', JSON.stringify(notes, null, 2));
  console.log(JSON.stringify(notes, null, 2));
  await b.close();
})();
