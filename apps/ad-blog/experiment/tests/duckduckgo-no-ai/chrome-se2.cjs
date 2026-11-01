// Chromium 153 설정: Site search에 noai 추가 → Make default → 기본 검색 엔진 표시 확인
const { chromium } = require('playwright');
const fs = require('fs');
const out = {};
(async () => {
  fs.rmSync('/tmp/claude-0/chrome-profile', { recursive: true, force: true });
  const ctx = await chromium.launchPersistentContext('/tmp/claude-0/chrome-profile', { channel: 'chromium', viewport: { width: 1280, height: 1000 }, locale: 'en-US' });
  const p = await ctx.newPage();
  out.version = ctx.browser() ? ctx.browser().version() : null;
  await p.goto('chrome://settings/searchEngines'); await p.waitForTimeout(2500);
  await p.locator('#addSiteSearchButton, cr-button:has-text("Add")').first().click();
  await p.waitForTimeout(1500);
  const dlg = p.locator('settings-search-engine-edit-dialog');
  out.dialogText = (await dlg.innerText().catch(() => '')).slice(0, 600);
  const inputs = dlg.locator('cr-input');
  out.inputCount = await inputs.count();
  const labels = [];
  for (let i = 0; i < out.inputCount; i++) labels.push(await inputs.nth(i).getAttribute('label'));
  out.labels = labels;
  await inputs.nth(0).locator('input').fill('DuckDuckGo No AI');
  await inputs.nth(1).locator('input').fill('noai');
  await inputs.nth(2).locator('input').fill('https://noai.duckduckgo.com/?q=%s');
  await p.waitForTimeout(800);
  await p.screenshot({ path: 'screens/raw-chrome-add-site-search.png' });
  await dlg.locator('#actionButton, cr-button.action-button').first().click();
  await p.waitForTimeout(2000);
  await p.screenshot({ path: 'screens/raw-chrome-after-add.png', fullPage: true });
  // 새 항목의 점 3개 메뉴
  const row = p.locator('settings-search-engine-entry', { hasText: 'DuckDuckGo No AI' }).first();
  out.rowText = await row.innerText();
  await row.locator('cr-icon-button, #moreActions, button[aria-label*="More"]').last().click();
  await p.waitForTimeout(1200);
  await p.screenshot({ path: 'screens/raw-chrome-row-menu.png' });
  const menuItems = await p.locator('cr-action-menu button, cr-action-menu .dropdown-item').allInnerTexts();
  out.menuItems = menuItems;
  await p.getByRole('menuitem', { name: 'Make default' }).first().click().catch(async () => { await p.locator('button:has-text("Make default")').first().click(); });
  await p.waitForTimeout(2000);
  await p.screenshot({ path: 'screens/raw-chrome-made-default.png' });
  const engines = await p.locator('settings-search-engine-entry').allInnerTexts();
  out.enginesAfter = engines.map(t => t.replace(/\s+/g, ' ').trim()).slice(0, 8);
  // Search engine 첫 화면의 기본값 표시
  await p.goto('chrome://settings/search'); await p.waitForTimeout(2000);
  await p.screenshot({ path: 'screens/raw-chrome-search-engine-page.png' });
  out.searchPage = (await p.locator('settings-search-page').innerText()).replace(/\s+/g, ' ').slice(0, 600);
  fs.writeFileSync('chrome-site-search-log.json', JSON.stringify(out, null, 2));
  console.log(JSON.stringify(out, null, 2));
  await ctx.close();
})();
