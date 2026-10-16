# 결과 PDF 분석: 페이지 크기·회전, 삽입 이미지(인코딩·픽셀 크기·원본과 픽셀 동일 여부), 방향(렌더링 후 기준 이미지와 비교),
# SSIMULACRA2(원본 해상도 기준, 줄어든 이미지는 Lanczos로 원본 크기로 되돌려 비교)
import glob, json, os, re, subprocess, sys, tempfile, concurrent.futures as cf
import numpy as np
from PIL import Image
W = '/tmp/j2p'; SS = f'{W}/dl/tools/ssimulacra2'
IN = sorted(glob.glob(f'{W}/in/*.jpg'))
CONFIGS = ['img2pdf', 'img2pdf-letter', 'imagemagick', 'imagemagick-orient', 'pillow', 'libreoffice', 'chromium']
MULTI = {'libreoffice', 'chromium'}

def page_of(cfg, i):  # (pdf 경로, 페이지 번호)
    return (f'{W}/out/{cfg}/{i+1:02d}.pdf', 1) if cfg in MULTI else (f'{W}/out/{cfg}.pdf', i + 1)

def pdfinfo(pdf, p):
    t = subprocess.run(['pdfinfo', '-f', str(p), '-l', str(p), pdf], capture_output=True, text=True).stdout
    w, h = map(float, re.search(rf'Page +{p} size: +([\d.]+) x ([\d.]+)', t).groups())
    rot = int(re.search(rf'Page +{p} rot: +(\d+)', t).group(1))
    return w, h, rot

def orientation_ok(pdf, p, ref):
    with tempfile.TemporaryDirectory() as d:
        subprocess.run(['pdftoppm', '-f', str(p), '-l', str(p), '-scale-to', '400', '-png', pdf, f'{d}/r'], check=True)
        im = Image.open(glob.glob(f'{d}/r*.png')[0]).convert('L')
    a = np.asarray(im).astype(float)
    mask = a < 250  # 흰 여백 잘라 내기
    ys, xs = np.where(mask)
    im = im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))
    r = Image.open(ref).convert('L')
    best = None
    for ang in (0, 90, 180, 270):
        rr = r.rotate(ang, expand=True)
        if (rr.width > rr.height) != (im.width > im.height):
            continue
        x = np.asarray(im.resize((64, 64))).astype(float); y = np.asarray(rr.resize((64, 64))).astype(float)
        e = ((x - y) ** 2).mean()
        if best is None or e < best[1]: best = (ang, e)
    return best[0] == 0, best[0]

def analyze(cfg, i):
    pdf, p = page_of(cfg, i)
    w, h, rot = pdfinfo(pdf, p)
    with tempfile.TemporaryDirectory() as d:
        subprocess.run(['pdfimages', '-f', str(p), '-l', str(p), '-j', pdf, f'{d}/x'], check=True)
        lst = subprocess.run(['pdfimages', '-f', str(p), '-l', str(p), '-list', pdf], capture_output=True, text=True).stdout.splitlines()[2:]
        imgs = [l.split() for l in lst if l.split()[2] == 'image']
        files = sorted(f for f in glob.glob(f'{d}/x-*') )
        main_idx = max(range(len(imgs)), key=lambda k: int(imgs[k][3]) * int(imgs[k][4]))
        enc = imgs[main_idx][8]
        x = Image.open(files[main_idx]); x.load(); x = x.convert('RGB')
        o = Image.open(IN[i]); o.load()
        o_raw = o.convert('RGB')
        if x.size == (o_raw.height, o_raw.width):
            from PIL import ImageOps
            o_cmp = ImageOps.exif_transpose(o).convert('RGB')
        else:
            o_cmp = o_raw
        identical = x.size == o_cmp.size and np.array_equal(np.asarray(x), np.asarray(o_cmp))
        emb_size = x.size
        score = 100.0
        if not identical:
            xx = x if x.size == o_cmp.size else x.resize(o_cmp.size, Image.LANCZOS)
            xx.save(f'{d}/a.png'); o_cmp.save(f'{d}/b.png')
            score = float(subprocess.run([SS, f'{d}/b.png', f'{d}/a.png'], capture_output=True, text=True).stdout.strip())
    ok, ang = orientation_ok(pdf, p, f'{W}/ref/{i+1:02d}.png')
    return dict(config=cfg, n=i + 1, page_pt=[round(w, 1), round(h, 1)], rot=rot, images=len(imgs), enc=enc,
                emb_px=list(emb_size), identical=bool(identical), ssimulacra2=round(score, 2), orientation_ok=ok, seen_rotation=ang)

if __name__ == '__main__':
    jobs = [(c, i) for c in CONFIGS for i in range(len(IN))]
    with cf.ProcessPoolExecutor(4) as ex:
        res = list(ex.map(analyze, *zip(*jobs)))
    with open(f'{W}/results.jsonl', 'w') as f:
        for r in res: f.write(json.dumps(r) + '\n')
    print(len(res))
