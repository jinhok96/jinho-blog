const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto(process.argv[2], { waitUntil: 'networkidle', timeout: 60000 }).catch(()=>{});
  const links = await p.$$eval('main a', as => as.map(a => a.innerText.trim().slice(0,80) + ' | ' + a.href));
  console.log(links.filter(l => !l.startsWith(' |')).join('\n')); await b.close();
})();
