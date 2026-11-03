"""Brave 1.98 실험 공통 함수: Xvfb에서 띄운 Brave에 CDP로 붙어 화면을 열고 캡처한다.

실행: /tmp/pw/bin/python {스크립트} (이 폴더에서). Brave는 run_brave()가 새 프로필로 띄움.
"""

import json
import os
import subprocess
import time
import urllib.request

BRAVE = '/tmp/brave-dl/ex/opt/brave.com/brave/brave'
DISPLAY = ':99'
HERE = os.path.dirname(os.path.abspath(__file__))
SCREENS = os.path.join(HERE, 'screens')


def run_brave(profile, port=9340, extra=()):
    """새 프로필(또는 기존 프로필)로 Brave를 띄우고 CDP 주소를 돌려준다."""
    env = dict(os.environ, DISPLAY=DISPLAY)
    args = [
        BRAVE,
        f'--user-data-dir=/tmp/brave-prof/{profile}',
        '--no-first-run',
        '--no-sandbox',
        '--test-type',
        '--lang=en-US',
        f'--remote-debugging-port={port}',
        '--window-size=1280,900',
        '--window-position=0,0',
        *extra,
        'about:blank',
    ]
    proc = subprocess.Popen(args, env=env, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(60):
        try:
            with urllib.request.urlopen(f'http://127.0.0.1:{port}/json/version', timeout=2) as r:
                json.load(r)
                break
        except Exception:
            time.sleep(0.5)
    time.sleep(2)
    return proc, f'http://127.0.0.1:{port}'


def stop_brave(proc):
    proc.terminate()
    try:
        proc.wait(timeout=15)
    except subprocess.TimeoutExpired:
        proc.kill()
    time.sleep(1)


def shot(name):
    """Xvfb 화면 전체(브라우저 창 포함)를 PNG로 저장."""
    path = os.path.join(SCREENS, f'{name}.png')
    subprocess.run(['import', '-display', DISPLAY, '-window', 'root', path], check=True)
    return path


def xdo(*args):
    subprocess.run(['xdotool', *args], env=dict(os.environ, DISPLAY=DISPLAY), check=True)


def deep_text_js():
    """shadow DOM까지 들어가 보이는 글자를 모으는 스크립트."""
    return r"""
    () => {
      const out = [];
      const walk = (node) => {
        if (!node) return;
        if (node.nodeType === 3) {
          const t = node.textContent.replace(/\s+/g, ' ').trim();
          if (t) out.push(t);
          return;
        }
        if (node.nodeType !== 1 && node.nodeType !== 11) return;
        if (node.nodeType === 1) {
          const st = getComputedStyle(node);
          if (st.display === 'none' || st.visibility === 'hidden') return;
          if (node.tagName === 'STYLE' || node.tagName === 'SCRIPT') return;
        }
        if (node.shadowRoot) walk(node.shadowRoot);
        for (const c of node.childNodes) walk(c);
      };
      walk(document.body);
      return out.join('\n');
    }
    """


def toggles_js():
    """설정 화면의 토글(cr-toggle·settings-toggle-button)의 이름·상태·좌표."""
    return r"""
    () => {
      const res = [];
      const walk = (root) => {
        const els = root.querySelectorAll('*');
        for (const el of els) {
          if (el.shadowRoot) walk(el.shadowRoot);
          if (el.tagName === 'CR-TOGGLE' || el.tagName === 'CR-CHECKBOX' || el.tagName === 'LEO-TOGGLE' || el.tagName === 'LEO-CHECKBOX') {
            const r = el.getBoundingClientRect();
            if (r.width === 0) continue;
            let host = el.getRootNode().host;
            let label = '';
            let h = host;
            for (let i = 0; i < 4 && h; i++) {
              const l = h.getAttribute && (h.getAttribute('label') || h.label);
              if (l) { label = l; break; }
              h = h.getRootNode && h.getRootNode().host;
            }
            if (!label) {
              const p = el.closest('.settings-row, .cr-row, div');
              label = p ? p.innerText.replace(/\s+/g, ' ').trim().slice(0, 120) : '';
            }
            res.push({
              label: label || (el.innerText || '').trim().slice(0, 120),
              tag: el.tagName,
              checked: el.hasAttribute('checked') || el.checked === true,
              disabled: el.hasAttribute('disabled') || el.disabled === true,
              x: Math.round(r.x + r.width / 2),
              y: Math.round(r.y + r.height / 2),
            });
          }
        }
      };
      walk(document);
      return res;
    }
    """
