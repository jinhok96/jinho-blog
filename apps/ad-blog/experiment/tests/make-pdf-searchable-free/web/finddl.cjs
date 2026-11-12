// 화면에 보이는 'Download' 버튼(아이콘 글자 등 앞뒤 기호 허용, 20자 미만)을 모든 프레임에서 찾아 핸들을 돌려줌
module.exports = async function findDownload(p, debug = false) {
  for (const f of p.frames()) {
    const html = await f
      .evaluate((dbg) => {
        const all = [...document.querySelectorAll('a, button, [role=button], [onclick], .btn, div, span')];
        const cands = all.filter((e) => {
          const t = (e.innerText || '').replace(/\s+/g, ' ').trim();
          if (!/^[^A-Za-z0-9]*Download[^A-Za-z0-9]*$/.test(t)) return false;
          const r = e.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden';
        });
        if (dbg) return cands.map((e) => e.tagName + ' ' + e.outerHTML.slice(0, 160)).join('\n');
        const el = cands.map((e) => e.closest('a, button, [role=button], [onclick]') || e)[0];
        if (!el) return null;
        el.setAttribute('data-tp-dl', '1');
        return el.outerHTML.slice(0, 200);
      }, debug)
      .catch((e) => 'ERR ' + e.message);
    if (debug) {
      console.log('frame', f.url(), '\n', html);
      continue;
    }
    if (html && !html.startsWith('ERR')) {
      console.log('download element', html);
      return f.$('[data-tp-dl="1"]');
    }
  }
  return null;
};
