# JPG → PDF 변환 측정: 도구·설정별로 24장(가로 20 + EXIF Orientation=6 세로 4)을 PDF로 만들고
# 크기·시간·최대 메모리·삽입 이미지 정보를 기록. 화질·방향 분석은 analyze.py
import json, os, subprocess, sys, time, glob, shutil
W = '/tmp/j2p'
IN = sorted(glob.glob(f'{W}/in/*.jpg'))
MAGICK = f'{W}/dl/squashfs-root/AppRun'
SOFFICE = glob.glob(f'{W}/dl/lo/opt/libreoffice*/program/soffice')[0]
PY = f'{W}/venv/bin/python'
OUT = f'{W}/out'

def run(cmd, env=None):
    t = time.perf_counter()
    p = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, env=env)
    _, status, ru = os.wait4(p.pid, 0)
    err = p.stderr.read().decode(errors='replace')
    p.returncode = os.waitstatus_to_exitcode(status)
    return time.perf_counter() - t, ru.ru_maxrss / 1024, p.returncode, err

PILLOW = f'''
import sys
from PIL import Image, ImageOps
ims = [Image.open(p) for p in sys.argv[2:]]
ims[0].save(sys.argv[1], save_all=True, append_images=ims[1:])
'''
CHROME = f'''
import sys, pathlib
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
    pg = b.new_page()
    for src in sys.argv[2:]:
        pg.goto(pathlib.Path(src).as_uri())
        pg.pdf(path=sys.argv[1] + "/" + pathlib.Path(src).stem + ".pdf")  # 기본값 = Letter, 여백 기본
    b.close()
'''
open(f'{W}/scripts/_pillow.py', 'w').write(PILLOW)
open(f'{W}/scripts/_chrome.py', 'w').write(CHROME)

CONFIGS = {
    'img2pdf':          lambda o: [f'{W}/venv/bin/img2pdf', *IN, '-o', o],
    'img2pdf-letter':   lambda o: [f'{W}/venv/bin/img2pdf', '--pagesize', 'Letter', *IN, '-o', o],
    'imagemagick':      lambda o: [MAGICK, *IN, o],
    'imagemagick-orient': lambda o: [MAGICK, *IN, '-auto-orient', o],
    'pillow':           lambda o: [PY, '-I', f'{W}/scripts/_pillow.py', o, *IN],
    'libreoffice':      lambda o: [SOFFICE, '--headless', '-env:UserInstallation=file:///tmp/j2p/lo-profile', '--convert-to', 'pdf', '--outdir', o, *IN],
    'chromium':         lambda o: [PY, '-I', f'{W}/scripts/_chrome.py', o, *IN],
}
MULTI = {'libreoffice', 'chromium'}  # 이미지마다 PDF 1개

def main(reps=3):
    res = []
    # LibreOffice 첫 실행(프로필 생성)은 측정에서 제외
    subprocess.run([SOFFICE, '--headless', '-env:UserInstallation=file:///tmp/j2p/lo-profile', '--terminate_after_init'], capture_output=True)
    for name, cmd in CONFIGS.items():
        for r in range(reps):
            o = f'{OUT}/{name}' + ('' if name in MULTI else '.pdf')
            shutil.rmtree(o, ignore_errors=True) if name in MULTI else (os.path.exists(o) and os.remove(o))
            if name in MULTI: os.makedirs(o)
            env = dict(os.environ, MAGICK_THREAD_LIMIT='4')
            sec, mb, rc, err = run(cmd(o), env)
            files = sorted(glob.glob(o + '/*.pdf')) if name in MULTI else [o]
            size = sum(os.path.getsize(f) for f in files if os.path.exists(f))
            res.append(dict(config=name, rep=r, sec=round(sec, 2), max_rss_mb=round(mb), rc=rc, bytes=size, files=len(files), err=err.strip()[-300:]))
            print(res[-1], flush=True)
    json.dump(res, open(f'{W}/timing.json', 'w'), indent=1)

if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    main(int(sys.argv[1]) if len(sys.argv) > 1 else 3)
