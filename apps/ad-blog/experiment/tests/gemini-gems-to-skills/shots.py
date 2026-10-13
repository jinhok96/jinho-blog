"""실제 변환 결과(results/*.json, out/SKILL.md)를 HTML로 렌더링해 스크린샷 (1200px 폭 webp)."""
import asyncio
import html
import json
import subprocess
from pathlib import Path

from PIL import Image
from playwright.async_api import async_playwright

CSS = """body{margin:0;background:#fcfcfb;font-family:'DejaVu Sans',sans-serif;color:#0b0b0b}
.wrap{padding:36px 40px}h1{font-size:28px;margin:0 0 6px}p.sub{color:#52514e;margin:0 0 22px;font-size:17px}
.term{background:#1e1f22;color:#e8e6e3;border-radius:10px;padding:22px 26px;font:16px/1.55 'DejaVu Sans Mono',monospace;white-space:pre-wrap}
.ok{color:#1f7a3a}.bad{color:#b3261e}.warn{color:#8a5a00}.term .ok{color:#7cc68a}.dim{color:#9a9893}
table{border-collapse:collapse;width:100%;font-size:17px}td,th{border-bottom:1px solid #e4e3df;padding:10px 12px;text-align:left;vertical-align:top}
th{color:#52514e;font-weight:600}code{font-family:'DejaVu Sans Mono',monospace;font-size:15px}
.grid{display:grid;grid-template-columns:1fr 1.25fr;gap:26px}.foot{color:#52514e;font-size:14px;margin-top:18px}"""


def page(body):
    return f'<html><head><meta charset="utf-8"><style>{CSS}</style></head><body><div class="wrap">{body}</div></body></html>'


rep = json.loads(Path('results/convert-report.json').read_text())
skill_md = Path('out/weekly-newsletter-writer/SKILL.md').read_text()
zipl = subprocess.run(['unzip', '-Z1', 'out/weekly-newsletter-writer.zip'], capture_output=True, text=True).stdout.split()
val = Path('results/validate.txt').read_text().strip()
cls = {'ok': 'ok'}
rows = ''.join(
    f"<tr><td><code>{html.escape(f['file'])}</code></td><td class='{'ok' if f['verdict']=='ok' else 'bad'}'>"
    f"{'Keep' if f['verdict']=='ok' else ('Remove: hidden system file' if f['verdict'].startswith('remove') else 'Convert: .docx is not supported')}</td></tr>"
    for f in rep['files'])
p1 = page(f"""<h1>A Gem rebuilt as a skill: what we got</h1><p class="sub">Sample Gem "{rep['gem_name']}" with 4 knowledge files, converted with our script and checked with skills-ref 0.1.1</p>
<div class="grid"><div><table><tr><th>Gem knowledge file</th><th>Result</th></tr>{rows}</table>
<div class="term" style="margin-top:22px"><span class="dim">$ unzip -Z1 weekly-newsletter-writer.zip</span>
{chr(10).join(zipl)}
<span class="dim">$ agentskills validate weekly-newsletter-writer</span>
<span class="ok">{html.escape(val.replace('out/', ''))}</span></div></div>
<div class="term">{html.escape(skill_md)}</div></div>
<p class="foot">ToolProof test, Oct 13, 2026 · Linux · Python 3.11 · rules from Google's Gemini Apps Help upload requirements</p>""")
names = json.loads(Path('results/name-tests.json').read_text())
r2 = ''
for n in names:
    e = n['skills_ref_errors']
    if not e and n['spec_regex_ok']:
        res = "<span class='ok'>Passes</span>"
    elif not e:
        res = "<span class='warn'>Passes the checker, breaks the spec (a-z only)</span>"
    else:
        res = "<span class='bad'>" + html.escape(e[0].split(':')[0] if len(e[0]) > 60 else e[0]) + '</span>'
    r2 += f"<tr><td><code>{html.escape(n['name_as_typed'])}</code></td><td>{res}</td><td><code>{html.escape(n['converted'])}</code></td></tr>"
p2 = page(f"""<h1>Gem names that fail the skill name rules</h1><p class="sub">Each name used as-is in a SKILL.md file and checked with the Agent Skills reference validator (skills-ref 0.1.1)</p>
<table><tr><th>Name as typed</th><th>Validator result</th><th>Name that works</th></tr>{r2}</table>
<p class="foot">ToolProof test, Oct 13, 2026 · rule: lowercase a-z, 0-9 and single hyphens, 64 characters max, folder name must match</p>""")


async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome')
        for name, src in [('gem-converted-to-skill', p1), ('skill-name-check', p2)]:
            pg = await b.new_page(viewport={'width': 1200, 'height': 600})
            await pg.set_content(src)
            await pg.screenshot(path=f'/tmp/{name}.png', full_page=True)
            Image.open(f'/tmp/{name}.png').convert('RGB').save(f'img/{name}.webp', 'WEBP', quality=90)
            print(name, Image.open(f'img/{name}.webp').size)
        await b.close()

asyncio.run(main())
