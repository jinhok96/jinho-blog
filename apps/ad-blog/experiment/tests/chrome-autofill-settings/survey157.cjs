const { chromium } = require('playwright');
const fs = require('fs');
const S = process.argv[2];
const DEEP = `() => { const out=[]; const walk=(n)=>{ if(n.nodeType===1 && (n.tagName==='STYLE'||n.tagName==='SCRIPT')) return; if(n.nodeType===3){const s=n.textContent.trim(); if(s) out.push(s);} if(n.shadowRoot) walk(n.shadowRoot); for(const c of n.childNodes) walk(c);}; walk(document.body); return out.join(' | '); }`;
const TOG = `() => { const res=[]; const walk=(n)=>{ if(n.nodeType===1){ if(n.tagName==='CR-TOGGLE'){ let p=n; let label=''; for(let i=0;i<8&&p;i++){ p=p.parentNode||p.host; if(p&&p.host) p=p.host; if(p&&p.getAttribute&&p.getAttribute('label')){label=p.getAttribute('label');break;} } const r=n.getBoundingClientRect(); res.push({label, checked:n.checked, disabled:n.disabled, visible: r.width>0}); } if(n.shadowRoot) walk(n.shadowRoot);} for(const c of (n.childNodes||[])) walk(c);}; walk(document.body); return res; }`;
(async () => {
  const ctx = await chromium.launchPersistentContext(S + '/c157/profile', {
    executablePath: S + '/cft157/chrome-linux64/chrome', headless: false,
    args: ['--no-first-run', '--no-default-browser-check', '--lang=en-US', '--window-size=1280,900'],
    viewport: null,
  });
  const pg = ctx.pages()[0] || await ctx.newPage();
  const out = {};
  const pages = ['chrome://version', 'chrome://settings/autofill', 'chrome://settings/addresses', 'chrome://settings/payments', 'chrome://settings/identityDocs', 'chrome://settings/travel', 'chrome://settings/autofill/enhanced', 'chrome://settings/enhancedAutofill', 'chrome://password-manager/settings'];
  for (const u of pages) {
    try {
      await pg.goto(u, { timeout: 15000 }); await pg.waitForTimeout(3500);
      out[u] = { url: pg.url(), text: (await pg.evaluate(eval(DEEP))).slice(0, 5000), toggles: await pg.evaluate(eval(TOG)) };
      await pg.screenshot({ path: S + '/c157/' + u.replace(/[^a-z]/gi, '_') + '.png' });
    } catch (e) { out[u] = { error: String(e) }; }
  }
  fs.writeFileSync(S + '/c157/survey.json', JSON.stringify(out, null, 1));
  await ctx.close();
})();
