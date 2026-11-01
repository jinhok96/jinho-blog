// Chromium 설정의 Manage search engines and site search에서 noai를 사이트 검색으로 추가하고 기본값으로 만드는 과정 확인
const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  fs.rmSync('/tmp/claude-0/chrome-profile', { recursive: true, force: true });
  const ctx = await chromium.launchPersistentContext('/tmp/claude-0/chrome-profile', { channel: 'chromium', viewport: { width: 1280, height: 1000 }, locale: 'en-US' });
  const b = ctx;
  const p = await ctx.newPage();
  await p.goto('chrome://settings/searchEngines');
  await p.waitForTimeout(3000);
  await p.screenshot({ path: 'probe/chrome-se-1.png' });
  const txt = await p.evaluate(() => {
    const out = [];
    const walk = (n) => { if (n.nodeType === 3 && n.textContent.trim()) out.push(n.textContent.trim()); if (n.shadowRoot) walk(n.shadowRoot); for (const c of n.childNodes) walk(c); };
    walk(document.body); return out.join(' | ');
  });
  fs.writeFileSync('probe/chrome-se-1.txt', txt);
  console.log(txt.slice(0, 3000));
  await b.close();
})();
