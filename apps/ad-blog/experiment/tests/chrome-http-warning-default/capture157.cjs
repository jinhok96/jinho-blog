// Chrome 157 정식판(Linux deb) 재확인: capture.py(156)와 같은 순서를 Node Playwright로.
// Chrome을 직접 실행하고 CDP로 붙음 (Playwright 기본 인자로 띄우면 HTTP 경고가 꺼짐, factcheck.md 측정 메모).
// 실행: DISPLAY=:99 node capture157.cjs <chrome 실행 파일> <출력 폴더> <프로필 폴더> <단계: first|second|warn|enhanced>
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs');

const [CH, OUT, PROF, STEP] = process.argv.slice(2);
const PROXY = (process.env.HTTPS_PROXY || '').replace(/^https?:\/\//, '');
const DEEP = `() => { const out=[]; const walk=(n)=>{ if(n.nodeType===1 && (n.tagName==='STYLE'||n.tagName==='SCRIPT')) return; if(n.nodeType===3){const s=n.textContent.trim(); if(s) out.push(s);} if(n.shadowRoot) walk(n.shadowRoot); for(const c of n.childNodes) walk(c);}; walk(document.body); return out.join(' | '); }`;
const TOG = `() => { const res=[]; const walk=(n)=>{ if(n.nodeType===1){ if(n.tagName==='CR-TOGGLE'){ let p=n; let label=''; for(let i=0;i<8&&p;i++){ p=p.parentNode||p.host; if(p&&p.host) p=p.host; if(p&&p.getAttribute&&p.getAttribute('label')){label=p.getAttribute('label');break;} } res.push({label, checked:n.checked}); } if(n.shadowRoot) walk(n.shadowRoot);} for(const c of (n.childNodes||[])) walk(c);}; walk(document.body); return res; }`;
const RADIO = `() => { const res=[]; const walk=(n)=>{ if(n.nodeType===1){ if(/RADIO-BUTTON$/.test(n.tagName)){ res.push({tag:n.tagName.toLowerCase(), label:n.getAttribute('label')||'', checked:n.checked===true||n.hasAttribute('checked')}); } if(n.shadowRoot) walk(n.shadowRoot);} for(const c of (n.childNodes||[])) walk(c);}; walk(document.body); return res; }`;
const shot = (name) => execFileSync('import', ['-window', 'root', '-crop', '1200x860+0+0', `${OUT}/${name}.png`]);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const proc = spawn(CH, [`--user-data-dir=${PROF}`, '--remote-debugging-port=9333', '--no-first-run', '--no-sandbox', '--test-type',
    '--no-default-browser-check', '--lang=en-US', `--proxy-server=https=${PROXY}`, '--proxy-bypass-list=*neverssl.com;*badssl.com',
    '--window-size=1200,860', '--window-position=0,0', 'about:blank'], { stdio: 'ignore' });
  await wait(8000);
  const b = await chromium.connectOverCDP('http://127.0.0.1:9333');
  const pg = b.contexts()[0].pages()[0];
  const out = { step: STEP };
  const visit = async (u, ms) => { try { await pg.goto(u, { timeout: 30000 }); } catch (e) { out[`err ${u}`] = String(e).slice(0, 120); } await wait(ms); };

  if (STEP === 'first' || STEP === 'second') {
    await visit('chrome://version', 1500);
    out.version = (await pg.evaluate(eval(DEEP))).slice(0, 300);
    await visit('chrome://settings/security', 3500);
    out.toggles = await pg.evaluate(eval(TOG));
    out.radios = await pg.evaluate(eval(RADIO));
    out.text = await pg.evaluate(eval(DEEP));
    shot(`${STEP}_settings`);
    await visit('http://neverssl.com/', 8000);
    out.neverssl = pg.url();
    shot(`${STEP}_http`);
  } else if (STEP === 'warn') {
    await visit('http://http.badssl.com/', 8000);
    out.before = pg.url();
    shot('warn1_dialog');
    out.dialogText = await pg.evaluate(eval(DEEP)).catch((e) => String(e));
    execFileSync('xdotool', ['mousemove', '432', '302', 'click', '1']);
    await wait(6000);
    out.afterContinue = `${pg.url()} | ${await pg.title()}`;
    shot('warn2_loaded');
    await visit('chrome://version', 2000);
    await visit('http://http.badssl.com/', 6000);
    out.revisit = `${pg.url()} | ${await pg.title()}`;
    shot('warn3_revisit');
  } else if (STEP === 'enhanced') {
    await visit('chrome://settings/security', 3500);
    try { await pg.getByRole('button', { name: 'Enhanced protection' }).first().click(); await wait(2000); } catch (e) { out.expandErr = String(e).slice(0, 120); }
    shot('enh1_expanded');
    out.text = await pg.evaluate(eval(DEEP));
  }
  fs.writeFileSync(`${OUT}/${STEP}.json`, JSON.stringify(out, null, 1));
  await b.close().catch(() => {});
  proc.kill();
})();
