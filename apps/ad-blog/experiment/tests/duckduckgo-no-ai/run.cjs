// DuckDuckGo 홈·검색 설정의 AI 진입점을 설정 전후로 비교 (일반 headless Chromium, 로그인 없음)
// 검색 결과 페이지는 자동화 브라우저에 418 오류를 돌려줘 측정하지 않음
const { chromium } = require('playwright');
const fs = require('fs');
const log = { startedAt: new Date().toISOString(), browser: null, steps: [] };
const VIEW = { width: 1280, height: 900 };

async function homeEntryPoints(p, host = 'duckduckgo.com', shot) {
  await p.goto(`https://${host}/`, { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(2500);
  if (shot) await p.screenshot({ path: `screens/raw-${shot}.png` });
  return await p.evaluate(() => {
    const vis = (e) => !!(e && e.offsetParent !== null && e.getBoundingClientRect().width > 0);
    const all = [...document.querySelectorAll('a,button,[role=tab],[role=radio],label,span,div')];
    const findText = (t) => all.filter(e => vis(e) && e.children.length <= 2 && (e.innerText || '').trim() === t).length;
    const duckLinks = [...document.querySelectorAll('a')].filter(a => vis(a) && /duck\.ai/.test(a.href)).map(a => (a.innerText || '').trim().slice(0, 30) + ' -> ' + a.href);
    return {
      askAIToggle: findText('Ask AI'),
      searchToggle: findText('Search'),
      duckAiHeaderLink: findText('Duck.ai'),
      aiSettingsButton: findText('AI Settings'),
      optionalBanner: /Toggle to private AI chat/.test(document.body.innerText),
      visibleDuckAiLinks: duckLinks,
    };
  });
}

async function cookies(ctx) {
  return (await ctx.cookies()).filter(c => /duckduckgo\.com/.test(c.domain)).map(c => `${c.domain} ${c.name}=${c.value}`);
}

async function openAiTab(p, host = 'duckduckgo.com') {
  await p.goto(`https://${host}/settings`, { waitUntil: 'networkidle', timeout: 60000 });
  await p.waitForTimeout(1500);
  await p.getByText('AI Features', { exact: true }).first().click();
  await p.waitForTimeout(1500);
}

async function aiState(p) {
  return await p.evaluate(() => {
    const g = (id) => document.getElementById(id);
    return { duckAi_kbg: g('setting_kbg')?.checked, searchAssist_kbe: g('setting_kbe')?.selectedOptions[0]?.text, exploreMore_kbl: g('setting_kbl')?.selectedOptions[0]?.text, hideAiImages_kbj: g('setting_kbj')?.checked };
  });
}

async function save(p) {
  await p.getByText('Save and Exit', { exact: true }).first().click();
  await p.waitForTimeout(3000);
}

(async () => {
  const b = await chromium.launch();
  log.browser = 'Chromium ' + b.version() + ' (Playwright, headless)';
  // 1. 새 프로필(쿠키 없음) 기본값
  let ctx = await b.newContext({ viewport: VIEW, locale: 'en-US' });
  let p = await ctx.newPage();
  log.steps.push({ step: '1 default home', home: await homeEntryPoints(p, 'duckduckgo.com', '01-home-default') });
  await openAiTab(p);
  await p.screenshot({ path: 'screens/raw-02-settings-ai-default.png', fullPage: true });
  log.steps.push({ step: '2 default AI tab', ai: await aiState(p), cookies: await cookies(ctx) });

  // 2. 홈의 AI Settings 버튼이 여는 것
  await p.goto('https://duckduckgo.com/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(2000);
  const btn = p.getByText('AI Settings', { exact: true }).first();
  if (await btn.count()) {
    await btn.click(); await p.waitForTimeout(2500);
    await p.screenshot({ path: 'screens/raw-03-home-ai-settings-button.png' });
    log.steps.push({ step: '3 AI Settings button', url: p.url(), text: (await p.evaluate(() => document.body.innerText)).slice(0, 1500) });
  }

  // 3. Duck.ai만 끄기
  await openAiTab(p);
  await p.locator('#setting_kbg').locator('xpath=..').click(); await p.waitForTimeout(800);
  await save(p);
  log.steps.push({ step: '4 after Duck.ai off', cookies: await cookies(ctx), home: await homeEntryPoints(p, 'duckduckgo.com', '04-home-duckai-off') });

  // 4. 나머지 AI 설정도 끄기: Search Assist Never, Explore More Never, Hide AI images On
  await openAiTab(p);
  await p.selectOption('#setting_kbe', '0');
  await p.waitForTimeout(1500);
  const modalInfo = async (label) => {
    const m = await p.$('.set-noai-modal.is-showing');
    if (!m) return { label, modal: false };
    await p.screenshot({ path: `screens/raw-noai-modal-${label}.png` });
    const info = await p.evaluate(() => { const m = document.querySelector('.set-noai-modal.is-showing'); return { text: m.innerText, links: [...m.querySelectorAll('a')].map(a => a.innerText.trim() + ' -> ' + a.href), buttons: [...m.querySelectorAll('button')].map(b => (b.innerText || b.getAttribute('aria-label') || '').trim()) }; });
    // 닫기
    const close = await p.$('.set-noai-modal.is-showing button');
    if (close) { await close.click(); } else { await p.keyboard.press('Escape'); }
    await p.waitForTimeout(1000);
    return { label, modal: true, ...info, stillShowing: !!(await p.$('.set-noai-modal.is-showing')) };
  };
  log.steps.push({ step: '5a modal after Search Assist Never', ...(await modalInfo('search-assist-never')) });
  await p.selectOption('#setting_kbl', '0');
  await p.waitForTimeout(1500);
  log.steps.push({ step: '5b modal after Explore More Never', ...(await modalInfo('explore-more-never')) });
  if (!(await p.isChecked('#setting_kbj'))) await p.locator('#setting_kbj').locator('xpath=..').click();
  await p.waitForTimeout(800);
  await p.screenshot({ path: 'screens/raw-05-settings-ai-all-off.png', fullPage: true });
  await save(p);
  await openAiTab(p);
  log.steps.push({ step: '5 after all AI off', ai: await aiState(p), cookies: await cookies(ctx) });

  // 5. 북마크용 설정 주소 (Show Bookmarklet and Settings Data)
  const sb = p.getByText('Show Bookmarklet and Settings Data', { exact: true }).first();
  let settingsUrl = null;
  if (await sb.count()) {
    await sb.click(); await p.waitForTimeout(2000);
    await p.screenshot({ path: 'screens/raw-06-bookmarklet-data.png', fullPage: true });
    const txt = await p.evaluate(() => document.body.innerText);
    const m = txt.match(/https:\/\/duckduckgo\.com\/\?[^\s]+/g);
    settingsUrl = m ? m[0] : null;
    log.steps.push({ step: '6 bookmarklet data', urls: m, snippet: txt.slice(txt.indexOf('Bookmarklet'), txt.indexOf('Bookmarklet') + 1200) });
  }
  // 재시작 대신 같은 프로필 새 탭에서 유지 확인
  const p2 = await ctx.newPage();
  log.steps.push({ step: '7 same profile new tab', home: await homeEntryPoints(p2) });
  await ctx.close();

  // 6. 쿠키를 지운 것과 같은 새 프로필
  ctx = await b.newContext({ viewport: VIEW, locale: 'en-US' });
  p = await ctx.newPage();
  log.steps.push({ step: '8 new profile (cookies cleared)', home: await homeEntryPoints(p, 'duckduckgo.com', '08-home-after-cookie-clear') });
  await openAiTab(p);
  log.steps.push({ step: '9 new profile AI tab', ai: await aiState(p) });

  // 7. 설정 주소를 새 프로필에서 열기
  if (settingsUrl) {
    const u = settingsUrl.replace(/&q=[^&]*/, '');
    await p.goto(u, { waitUntil: 'networkidle' }); await p.waitForTimeout(2500);
    await p.screenshot({ path: 'screens/raw-10-settings-url.png' });
    log.steps.push({ step: '10 settings URL in new profile', url: u, finalUrl: p.url(), textHead: (await p.evaluate(() => document.body.innerText)).slice(0, 300), cookies: await cookies(ctx) });
  }
  await ctx.close();

  // 8. noai 홈
  ctx = await b.newContext({ viewport: VIEW, locale: 'en-US' });
  p = await ctx.newPage();
  log.steps.push({ step: '11 noai home', home: await homeEntryPoints(p, 'noai.duckduckgo.com', '11-noai-home'), cookies: await cookies(ctx) });
  await ctx.close();
  await b.close();
  log.finishedAt = new Date().toISOString();
  fs.writeFileSync('run-log.json', JSON.stringify(log, null, 2));
  console.log(JSON.stringify(log, null, 2));
})();
