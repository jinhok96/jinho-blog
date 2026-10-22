"""도구별 결과 분석: 남은 메타데이터 항목·세로 사진 방향·픽셀 동일 여부·크기

사용: /tmp/hero/bin/python -I analyze.py {결과 폴더(도구별 하위 폴더)} > summary.json
- 원본: /tmp/meta/set/{nn}.jpg
- 메타데이터는 ExifTool 12.76 (-j -G1)로 읽음
- 방향: 원본을 화면에 보이는 방향(EXIF Orientation 적용)으로 연 크기·픽셀과, 결과를 같은 방식으로 연 것을 비교
- 픽셀: 결과를 화면 방향으로 연 픽셀이 원본과 완전히 같으면 identical, 아니면 SSIM(회색조, 8x8 창 근사)
- raw_pixels_identical: 회전 정보를 무시하고 파일에 저장된 픽셀끼리 비교 (다시 압축했는지)
"""
import json, os, subprocess, sys, glob
from PIL import Image, ImageOps
import numpy as np

SET = '/tmp/meta/set'
FIELDS = {
    'gps': lambda m: any(k.startswith('GPS:') or k.endswith(':GPSPosition') or k.endswith(':GPSLatitude') for k in m),
    'camera': lambda m: any(k.endswith(':Make') or k.endswith(':Model') for k in m),
    'serial': lambda m: any(k.endswith(':SerialNumber') for k in m),
    'date': lambda m: any(k.endswith(':DateTimeOriginal') or k.endswith(':CreateDate') for k in m if not k.startswith('File:')),
    'author': lambda m: any(k.endswith(':Artist') or k.endswith(':Creator') or k.endswith(':Copyright') for k in m),
    'xmp_iptc_city': lambda m: any(k.endswith(':City') or k.endswith(':Location') for k in m),
    'thumbnail': lambda m: any(k.endswith(':ThumbnailImage') for k in m),
    'icc': lambda m: any(k.startswith('ICC') for k in m),
    'orientation_tag': lambda m: any(k.endswith(':Orientation') for k in m),
}


def meta(path):
    r = subprocess.run(['exiftool', '-j', '-G1', path], capture_output=True, text=True)
    m = json.loads(r.stdout)[0]
    return {k: v for k, v in m.items() if not k.startswith(('System:', 'ExifTool:', 'File:'))}


def ssim(a, b):
    a = a.astype(np.float64); b = b.astype(np.float64)
    h, w = (min(a.shape[0], b.shape[0]) // 8) * 8, (min(a.shape[1], b.shape[1]) // 8) * 8
    a, b = a[:h, :w].reshape(h // 8, 8, w // 8, 8), b[:h, :w].reshape(h // 8, 8, w // 8, 8)
    ma, mb = a.mean((1, 3)), b.mean((1, 3))
    va, vb = a.var((1, 3)), b.var((1, 3))
    cov = ((a - ma[:, None, :, None]) * (b - mb[:, None, :, None])).mean((1, 3))
    c1, c2 = (0.01 * 255) ** 2, (0.03 * 255) ** 2
    return float((((2 * ma * mb + c1) * (2 * cov + c2)) / ((ma ** 2 + mb ** 2 + c1) * (va + vb + c2))).mean())


def shown(path):
    return ImageOps.exif_transpose(Image.open(path)).convert('RGB')


def main(root):
    out = {}
    for tool in sorted(os.listdir(root)):
        rows = {}
        for f in sorted(glob.glob(os.path.join(root, tool, '*.jp*g'))):
            n = os.path.basename(f)[:2]
            ref = shown(os.path.join(SET, n + '.jpg'))
            res = shown(f)
            m = meta(f)
            row = {k: fn(m) for k, fn in FIELDS.items()}
            row['remaining_tags'] = sorted(m.keys())
            row['size_in'] = os.path.getsize(os.path.join(SET, n + '.jpg'))
            row['size_out'] = os.path.getsize(f)
            row['shown_size'] = list(res.size)
            row['orientation_ok'] = res.size == ref.size
            if res.size == ref.size:
                a, b = np.asarray(ref), np.asarray(res)
                row['pixels_identical'] = bool((a == b).all())
                row['ssim'] = 1.0 if row['pixels_identical'] else round(ssim(np.asarray(ref.convert('L')), np.asarray(res.convert('L'))), 4)
            else:
                row['pixels_identical'] = False
                row['ssim'] = None
            # 회전 정보를 무시하고 저장된 픽셀 그대로 비교 (재압축 여부 판단용)
            raw_ref, raw_res = Image.open(os.path.join(SET, n + '.jpg')).convert('RGB'), Image.open(f).convert('RGB')
            row['raw_pixels_identical'] = raw_ref.size == raw_res.size and bool((np.asarray(raw_ref) == np.asarray(raw_res)).all())
            rows[n] = row
        out[tool] = rows
    json.dump(out, sys.stdout, indent=1)


if __name__ == '__main__':
    main(sys.argv[1])
