"""목표 용량(1MB·500KB·200KB·100KB·50KB)별 이미지 압축 측정.

입력: /tmp/ci/in/{01..20}.jpg (4032x3024, 품질 92 JPEG, build_set.sh)
방법:
  im    ImageMagick 7.1.2-34  magick in.jpg [-resize LxL] -define jpeg:extent=TKB out.jpg
  jo    jpegoptim 1.5.6       jpegoptim --size=T out.jpg (원본 크기 그대로)
  webp  cwebp 1.6.0           cwebp [-resize w h] -size T*1000 -pass 10 in.jpg -o out.webp
점수: SSIMULACRA2 (libjxl 0.11.1 ssimulacra2)
  screen = 원본·결과를 모두 1600x1200으로 맞춘 뒤 비교 (노트북 화면 크기로 볼 때)
결과: results.json
"""
import json, os, subprocess, sys, time, shutil
from multiprocessing import Pool

from PIL import Image

os.environ['MAGICK_THREAD_LIMIT'] = '1'  # 4개 프로세스 병렬 실행
M = '/tmp/ci/dl/squashfs-root/AppRun'
JO = '/tmp/ci/dl/jo/jpegoptim'
CWEBP = '/tmp/ci/dl/libwebp-1.6.0-linux-x86-64/bin/cwebp'
S2 = '/tmp/ci/dl/jxl/tools/ssimulacra2'
IN = '/tmp/ci/in'
OUT = '/tmp/ci/out'
TARGETS = [1000, 500, 200, 100, 50]  # KB
LONG = [4032, 3200, 2560, 1920, 1600, 1280, 1024, 800, 640]


def run(cmd):
    t = time.perf_counter()
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return time.perf_counter() - t


def to_screen(src, dst):
    # 화면 보기 기준: 1600x1200으로 맞춤 (작은 결과는 확대, 큰 결과는 축소). Pillow Lanczos
    Image.open(src).convert('RGB').resize((1600, 1200), Image.LANCZOS).save(dst, compress_level=1)


def screen_ref(n):
    p = f'{OUT}/ref_{n}_screen.png'
    if not os.path.exists(p):
        to_screen(f'{IN}/{n}.jpg', p)
    return p


def score(n, path):
    tmp = path + '.screen.png'
    to_screen(path, tmp)
    r = subprocess.run([S2, screen_ref(n), tmp], check=True, capture_output=True, text=True)
    os.remove(tmp)
    return float(r.stdout.strip())


def job(args):
    n, t, method, L = args
    os.makedirs(f'{OUT}/{n}', exist_ok=True)
    src = f'{IN}/{n}.jpg'
    if method == 'im':
        out = f'{OUT}/{n}/im_{t}_{L}.jpg'
        cmd = [M, src] + ([] if L == 4032 else ['-resize', f'{L}x{L}']) + ['-define', f'jpeg:extent={t}KB', out]
        sec = run(cmd)
        q = subprocess.run([M, 'identify', '-format', '%Q %w', out], capture_output=True, text=True).stdout.split()
    elif method == 'jo':
        out = f'{OUT}/{n}/jo_{t}_{L}.jpg'
        shutil.copy(src, out)
        sec = run([JO, '-q', f'--size={t}', out])
        q = subprocess.run([M, 'identify', '-format', '%Q %w', out], capture_output=True, text=True).stdout.split()
    else:
        out = f'{OUT}/{n}/webp_{t}_{L}.webp'
        h = L * 3 // 4
        cmd = [CWEBP, '-quiet', '-size', str(t * 1000), '-pass', '10'] + ([] if L == 4032 else ['-resize', str(L), str(h)]) + [src, '-o', out]
        sec = run(cmd)
        q = [None, str(L)]
    size = os.path.getsize(out)
    return dict(n=n, target_kb=t, method=method, long_edge=L, bytes=size, quality=(int(q[0]) if q[0] else None),
                width=int(q[1]), sec=round(sec, 3), screen=round(score(n, out), 2))


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    photos = [f'{i:02d}' for i in range(1, 21)]
    jobs = []
    for n in photos:
        for t in TARGETS:
            jobs.append((n, t, 'jo', 4032))
            for L in LONG:
                jobs.append((n, t, 'im', L))
                jobs.append((n, t, 'webp', L))
    for n in photos:
        screen_ref(n)
    log = open(OUT + '/results.jsonl', 'a')
    with Pool(4) as p:
        res = []
        for i, r in enumerate(p.imap_unordered(job, jobs)):
            res.append(r)
            log.write(json.dumps(r) + '\n'); log.flush()
            if i % 100 == 0:
                print(i, len(jobs), flush=True)
    res.sort(key=lambda r: (r['n'], -r['target_kb'], r['method'], -r['long_edge']))
    json.dump(res, open(sys.argv[1] if len(sys.argv) > 1 else 'results.json', 'w'), indent=0)
