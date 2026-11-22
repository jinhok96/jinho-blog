// ezgif.com Rotate video: 업로드 뒤 회전 폼(항목·문구)을 저장
// node web_probe_ezgif.cjs CLIP SHOT
const { chromium } = require('playwright');
(async () => {
  const [clip, shot] = process.argv.slice(2);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1280, height: 1000 } });
  await p.goto('https://ezgif.com/rotate-video', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await p.setInputFiles('#new-image', clip);
  await Promise.all([p.waitForNavigation({ timeout: 600000 }), p.click('input[name=upload]')]);
  console.log('URL', p.url());
  const form = await p.evaluate(() => {
    const f = document.querySelector('form.ajax-form') || [...document.querySelectorAll('form')].find(x => /rotate/i.test(x.action));
    const items = [...document.querySelectorAll('form input, form select, form label')].map(e => `${e.tagName} ${e.name || ''} ${e.id || ''} ${e.type || ''} ${e.value || ''} ${e.checked ? 'checked' : ''} | ${(e.innerText || '').trim().slice(0, 80)}`);
    const sel = [...document.querySelectorAll('select')].map(s => s.name + ': ' + [...s.options].map(o => `${o.value}=${o.text}${o.selected ? '*' : ''}`).join(' / '));
    return { action: f && f.action, items, sel, text: (document.querySelector('#main') || document.body).innerText.slice(0, 2500) };
  });
  console.log(JSON.stringify(form, null, 1));
  await p.screenshot({ path: shot, fullPage: true });
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
