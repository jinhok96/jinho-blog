"""Brave 1.98.63 Leo 스위치를 하나씩 끄며 진입점이 어떻게 바뀌는지 확인한다.

사용: /tmp/pw/bin/python chain.py {프로필}  (이 폴더에서, Xvfb :99·시험 페이지 서버 8767이 떠 있어야 함)
단계마다 설정을 화면에서 바꾼 뒤 Brave를 닫고 다시 열어(설정이 저장·유지되는지 함께 확인) probe()를 돌린다.
"""

import json
import os
import sys
import time

from playwright.sync_api import sync_playwright

from common import deep_text_js, run_brave, shot, stop_brave, toggles_js, xdo
from probe import probe

profile = sys.argv[1]
PREFS = f'/tmp/brave-prof/{profile}/Default/Preferences'
results = []


def prefs_snapshot():
    """Brave를 닫은 뒤 Preferences의 Leo 관련 값만 모은다."""
    try:
        data = json.load(open(PREFS))
    except Exception as e:
        return {'error': str(e)}
    out = {}

    def walk(d, path):
        if isinstance(d, dict):
            for k, v in d.items():
                walk(v, f'{path}.{k}' if path else k)
        else:
            low = path.lower()
            if any(w in low for w in ('ai_chat', 'leo', 'sidebar', 'tab_organization', 'toolbar', 'omnibox')):
                out[path] = d
    walk(data, '')
    return out


def find_toggle(page, label):
    for t in page.evaluate(toggles_js()):
        if t['label'].startswith(label) and t['tag'] in ('CR-TOGGLE', 'CR-CHECKBOX'):
            return t
    return None


def set_switch(url, label, want):
    """설정 화면의 스위치·체크박스를 화면에서 눌러 want 상태로 만든다."""
    with sync_playwright() as p:
        b = p.chromium.connect_over_cdp('http://127.0.0.1:9340')
        ctx = b.contexts[0]
        page = ctx.pages[0]
        page.bring_to_front()
        try:
            page.goto(url, wait_until='load', timeout=20000)
        except Exception:
            pass
        time.sleep(2.5)
        # 대상이 화면 안에 오도록 스크롤
        page.evaluate("""(label) => {
          const walk = (root) => { for (const el of root.querySelectorAll('*')) {
            if (el.shadowRoot) { const r = walk(el.shadowRoot); if (r) return r; }
            if ((el.tagName === 'CR-TOGGLE' || el.tagName === 'CR-CHECKBOX')) {
              const row = el.closest('div') || el;
              const txt = (row.innerText || el.innerText || '') + ' ' + ((el.getRootNode().host && el.getRootNode().host.getAttribute('label')) || '');
              if (txt.includes(label)) { el.scrollIntoView({block: 'center'}); return true; }
            }
          } return null; };
          walk(document);
        }""", label)
        time.sleep(1)
        t = find_toggle(page, label)
        before = t['checked'] if t else None
        if t and t['checked'] != want:
            page.mouse.click(t['x'], t['y'])
            time.sleep(1.5)
        t2 = find_toggle(page, label)
        name = f"{profile}-set-{label[:24].replace(' ', '_')}"
        shot(name)
        return {'label': label, 'before': before, 'after': t2['checked'] if t2 else None}


def hide_toolbar_button():
    """툴바의 Leo AI 버튼을 오른쪽 클릭 → Hide Leo AI icon(메뉴 마지막 항목)."""
    xdo('mousemove', '1229', '59')
    xdo('click', '3')
    time.sleep(1.5)
    shot(f'{profile}-toolbar-menu')
    xdo('key', 'Up')
    time.sleep(0.4)
    shot(f'{profile}-toolbar-menu-hide')
    xdo('key', 'Return')
    time.sleep(1.5)
    return {'action': 'toolbar right-click > last item'}


def set_flag(name, value):
    """brave://flags에서 실험 기능 값을 바꾼다 (Default / Enabled / Disabled)."""
    with sync_playwright() as p:
        b = p.chromium.connect_over_cdp('http://127.0.0.1:9340')
        ctx = b.contexts[0]
        page = ctx.pages[0]
        page.bring_to_front()
        page.goto(f'brave://flags/#{name}', wait_until='load')
        time.sleep(2.5)
        res = page.evaluate("""([name, value]) => {
          const find = (root) => { for (const el of root.querySelectorAll('*')) {
            if (el.shadowRoot) { const r = find(el.shadowRoot); if (r) return r; }
            if (el.tagName === 'SELECT' && el.closest && el.closest('[id="' + name + '"]')) return el;
          } return null; };
          let sel = find(document);
          if (!sel) {
            const all = []; const collect = (root) => { for (const el of root.querySelectorAll('*')) { if (el.shadowRoot) collect(el.shadowRoot); if (el.tagName === 'SELECT') all.push(el); } };
            collect(document);
            sel = all.find(s => (s.getAttribute('aria-labelledby') || '').includes(name) || (s.parentElement && s.parentElement.innerHTML.includes(name)));
          }
          if (!sel) return 'select not found';
          const opt = [...sel.options].find(o => o.textContent.trim().startsWith(value));
          sel.value = opt.value;
          sel.dispatchEvent(new Event('change', {bubbles: true}));
          sel.scrollIntoView({block: 'center'});
          return [...sel.options].map(o => o.textContent.trim()).join('|') + ' -> ' + opt.textContent.trim();
        }""", [name, value])
        time.sleep(1.5)
        shot(f'{profile}-flag-{name}-{value}')
        return {'flag': name, 'value': value, 'result': res}


def page_text(url, name):
    with sync_playwright() as p:
        b = p.chromium.connect_over_cdp('http://127.0.0.1:9340')
        ctx = b.contexts[0]
        page = ctx.pages[0]
        page.bring_to_front()
        try:
            page.goto(url, wait_until='load', timeout=20000)
        except Exception as e:
            print('goto', url, e)
        time.sleep(3)
        try:
            text = page.evaluate(deep_text_js())
            tg = page.evaluate(toggles_js())
        except Exception as e:
            text, tg = f'error {e}', []
        final = page.url
        open(f'screens/{name}.txt', 'w').write(f'URL {final}\n\n{text}\n\nTOGGLES\n{json.dumps(tg, indent=1)}\n')
        shot(name)
        return {'url': url, 'final': final, 'chars': len(text)}


steps = [
    ('s0-default', None),
    ('s1-toolbar-hidden', hide_toolbar_button),
    ('s2-sidebar-off', lambda: set_switch('brave://settings/leo-ai', 'Show Leo icon in the sidebar', False)),
    ('s3-context-off', lambda: set_switch('brave://settings/leo-ai', 'Show Leo in the context menu', False)),
    ('s4-autocomplete-off', lambda: set_switch('brave://settings/appearance', 'Leo AI Assistant', False)),
    ('s5-tabfocus-off', lambda: set_switch('brave://settings/leo-ai', 'Tab Focus Mode', False)),
]

def main():
    only = sys.argv[2] if len(sys.argv) > 2 else None
    proc, _ = run_brave(profile)
    for name, action in steps:
        if only and name != only:
            continue
        entry = {'step': name}
        if action:
            entry['action'] = action()
            stop_brave(proc)  # 닫았다 다시 열어 저장·유지 확인
            entry['prefs'] = prefs_snapshot()
            proc, _ = run_brave(profile)
        entry['probe'] = probe(f'{profile}-{name}')
        results.append(entry)
        json.dump(results, open(f'chain-{profile}.json', 'w'), indent=1)
        print(name, 'done', entry.get('action'))

    stop_brave(proc)
    print('prefs final', json.dumps(prefs_snapshot(), indent=1)[:3000])


if __name__ == '__main__':
    main()
