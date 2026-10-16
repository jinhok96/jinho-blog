"""PDF→JPG 변환 실행: 도구·설정별로 3개 입력 PDF를 변환하고 시간·메모리·출력 파일을 기록.
사용: python3 -I run_tests.py <작업 폴더(/tmp/p2j)> [반복 횟수]
출력: <작업>/out/{config}/{doc}/*.jpg, <작업>/runs.jsonl
"""
import json, os, shutil, subprocess, sys, time, statistics
from pathlib import Path

W = Path(sys.argv[1]); REP = int(sys.argv[2]) if len(sys.argv) > 2 else 3
IN = W / "in"; OUT = W / "out"
DOCS = ["irs-1040", "mixed", "photos"]
GS = "/opt/gs10080/bin/gs"
MAGICK = str(W / "dl/squashfs-root/AppRun")
SOFFICE = "/opt/libreoffice26.8/program/soffice"
ENV = dict(os.environ, PATH="/opt/poppler26/bin:/opt/gs10080/bin:" + os.environ["PATH"], MAGICK_THREAD_LIMIT="4",
           LD_LIBRARY_PATH="/opt/poppler26/lib:/opt/poppler26/lib64")  # Poppler 26.10.0 소스 빌드, Ghostscript 10.08.0 소스 빌드
PYMU = "import pymupdf,sys\nd=pymupdf.open(sys.argv[1])\nfor i,p in enumerate(d):\n p.get_pixmap({dpi}).save(f'{{sys.argv[2]}}/p-{{i+1}}.jpg'{q})"

def lo_filter(w, h):
    return 'jpg:draw_jpg_Export:{"PixelWidth":{"type":"long","value":"%d"},"PixelHeight":{"type":"long","value":"%d"}}' % (w, h)

# 설정: 이름 → (명령 함수(pdf, outdir) → argv)
CONFIGS = {
    "pdftoppm-default": lambda p, o: ["/opt/poppler26/bin/pdftoppm", "-jpeg", p, f"{o}/p"],
    "pdftocairo-default": lambda p, o: ["/opt/poppler26/bin/pdftocairo", "-jpeg", p, f"{o}/p"],
    "gs-default": lambda p, o: [GS, "-q", "-dNOPAUSE", "-dBATCH", "-sDEVICE=jpeg", f"-sOutputFile={o}/p-%d.jpg", p],
    "magick-default": lambda p, o: [MAGICK, p, f"{o}/p-%d.jpg"],
    "pymupdf-default": lambda p, o: ["python3", "-I", "-c", PYMU.format(dpi="", q=""), p, o],
    "libreoffice-default": lambda p, o: [SOFFICE, "--headless", "--convert-to", "jpg", "--outdir", o, p],
    # 300 DPI · 품질 90으로 맞춘 설정
    "pdftoppm-300": lambda p, o: ["/opt/poppler26/bin/pdftoppm", "-r", "300", "-jpeg", "-jpegopt", "quality=90", p, f"{o}/p"],
    "gs-300": lambda p, o: [GS, "-q", "-dNOPAUSE", "-dBATCH", "-sDEVICE=jpeg", "-r300", "-dJPEGQ=90", f"-sOutputFile={o}/p-%d.jpg", p],
    "gs-300-aa": lambda p, o: [GS, "-q", "-dNOPAUSE", "-dBATCH", "-sDEVICE=jpeg", "-r300", "-dJPEGQ=90", "-dTextAlphaBits=4", "-dGraphicsAlphaBits=4", f"-sOutputFile={o}/p-%d.jpg", p],
    "magick-300": lambda p, o: [MAGICK, "-density", "300", p, "-quality", "90", f"{o}/p-%d.jpg"],
    "magick-300-flat": lambda p, o: [MAGICK, "-density", "300", p, "-background", "white", "-alpha", "remove", "-quality", "90", f"{o}/p-%d.jpg"],
    "libreoffice-2550": lambda p, o: [SOFFICE, "--headless", "--convert-to", lo_filter(2550, 3300) if "photos" not in p else lo_filter(3300, 2550), "--outdir", o, p],
    "pymupdf-300": lambda p, o: ["python3", "-I", "-c", PYMU.format(dpi="dpi=300", q=", jpg_quality=90"), p, o],
}

# DPI·품질 스윕 (pdftoppm): pdftoppm-r{dpi}-q{q}
for _dpi in (72, 100, 150, 200, 300, 400, 600):
    for _q in (75, 90):
        CONFIGS[f"pdftoppm-r{_dpi}-q{_q}"] = (lambda d, q: lambda p, o: ["/opt/poppler26/bin/pdftoppm", "-r", str(d), "-jpeg", "-jpegopt", f"quality={q}", p, f"{o}/p"])(_dpi, _q)

def run(cfg, doc, keep):
    o = OUT / cfg / doc
    shutil.rmtree(o, ignore_errors=True); o.mkdir(parents=True)
    argv = CONFIGS[cfg](str(IN / f"{doc}.pdf"), str(o))
    t = time.perf_counter()
    p = subprocess.Popen(argv, env=ENV, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    _, _, ru = os.wait4(p.pid, 0)
    dt = time.perf_counter() - t
    err = p.stderr.read().decode(errors="replace")[-400:]
    return dt, ru.ru_maxrss / 1024, err

if __name__ == "__main__":
    only = sys.argv[3].split(",") if len(sys.argv) > 3 else [c for c in CONFIGS if "-r" not in c or c.endswith("-300")]
    with open(W / "runs.jsonl", "a") as f:
        for cfg in only:
            for doc in DOCS:
                ts, mem, err = [], 0, ""
                for i in range(REP):
                    dt, m, err = run(cfg, doc, i == REP - 1)
                    ts.append(dt); mem = max(mem, m)
                files = sorted(x.name for x in (OUT / cfg / doc).iterdir())
                rec = {"config": cfg, "doc": doc, "sec_median": round(statistics.median(ts), 3), "secs": [round(x, 3) for x in ts],
                       "max_rss_mb": round(mem), "files": files, "stderr": err.strip()}
                f.write(json.dumps(rec) + "\n"); f.flush()
                print(cfg, doc, rec["sec_median"], rec["max_rss_mb"], len(files), err.strip()[:120])
