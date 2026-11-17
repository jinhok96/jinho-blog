"""score.py·visual.py 결과를 results.json으로 모음 (charts.py·factcheck.md가 읽음)
실행: python -I scripts/collect.py
"""
import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parents[1]
TOOLS = ['zamzar', 'libreoffice-24.2.7', 'libreoffice-24.2.7-gui', 'cloudconvert', 'freeconvert']
FILES = ['SampleBrochure', 'SampleNewsletter']
res = {}
for t in TOOLS:
    for f in FILES:
        pdf = HERE / 'out' / t / f'{f}.pdf'
        if not pdf.exists():
            continue
        s = json.loads(subprocess.check_output([sys.executable, '-I', str(HERE / 'scripts/score.py'), str(HERE / 'reference' / f'{f}.txt'), str(pdf)]))
        if t != 'zamzar':
            v = json.loads(subprocess.check_output([sys.executable, '-I', str(HERE / 'scripts/visual.py'), str(HERE / 'out/zamzar' / f'{f}.pdf'), str(pdf)]))
            s['ssim_vs_publisher'] = v['ssim_mean']
        info = subprocess.run(['pdfinfo', str(pdf)], capture_output=True, text=True).stdout
        s['producer'] = next((l.split(':', 1)[1].strip() for l in info.splitlines() if l.startswith('Producer')), '')
        s['creator'] = next((l.split(':', 1)[1].strip() for l in info.splitlines() if l.startswith('Creator')), '')
        fonts = subprocess.run(['pdffonts', str(pdf)], capture_output=True, text=True).stdout.splitlines()[2:]
        s['fonts'] = sorted({l.split()[0].split('+')[-1] for l in fonts if l.strip()})
        s['bytes'] = pdf.stat().st_size
        s.pop('pdf', None)
        res.setdefault(t, {})[f] = s
(HERE / 'results.json').write_text(json.dumps(res, ensure_ascii=False, indent=1))
for t, v in res.items():
    for f, s in v.items():
        print(t, f, s['pages'], 'recall', s['recall'], 'extra', s['extra_ratio'], 'overlap', s['overlap_ratio'], 'ssim', s.get('ssim_vs_publisher'), s['producer'], s['bytes'])
