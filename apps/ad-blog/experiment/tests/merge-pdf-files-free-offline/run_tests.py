"""도구별 PDF 합치기 (기본 명령) → {W}/out/{tool}.pdf, 시간·최대 메모리 → runs.jsonl
순서: report-a(3) + w9-a(6) + w9-b(6) + photos(3) + report-b(3) = 21쪽
실행: /tmp/pdfm/bin/python -I run_tests.py [W] [반복 횟수]
"""
import json
import os
import subprocess
import sys
import time
from pathlib import Path

W = Path(sys.argv[1] if len(sys.argv) > 1 else "/tmp/merge")
N = int(sys.argv[2]) if len(sys.argv) > 2 else 3
IN = [str(W / "in" / f) for f in ("report-a.pdf", "w9-a.pdf", "w9-b.pdf", "photos.pdf", "report-b.pdf")]
OUT = W / "out"
OUT.mkdir(exist_ok=True)
PY = "/tmp/pdfm/bin/python"
QPDF = "/tmp/qpdf/bin/qpdf"  # 12.4.2 GitHub Releases
# 원본 실행 시 PDFUNITE·GS는 Ubuntu 패키지(24.02, 10.02.1)였고, 최신 버전으로 두 도구만 다시 실행함
PDFUNITE = "/tmp/pop/poppler-26.10.0/build/utils/pdfunite"  # Poppler 26.10.0 소스 빌드 (Ubuntu 24.02와 결과 같음)
GS = "/tmp/gsb/ghostscript-10.08.0/bin/gs"  # 10.08.0 소스 빌드

PYPDF = """
import sys
from pypdf import PdfWriter
w = PdfWriter()
for f in sys.argv[2:]:
    w.append(f)
w.write(sys.argv[1])
"""
# 문서에 나온 해결법: 양식마다 상위 이름을 붙여 같은 이름 충돌을 막음 (pypdf "Merging forms")
PYPDF_TOPNAME = """
import sys
from pypdf import PdfReader, PdfWriter
w = PdfWriter()
for i, f in enumerate(sys.argv[2:]):
    r = PdfReader(f)
    if r.get_fields():
        r.add_form_topname(f"file{i + 1}")
    w.append(r)
w.write(sys.argv[1])
"""
PYMUPDF = """
import sys, pymupdf
d = pymupdf.open()
for f in sys.argv[2:]:
    d.insert_pdf(pymupdf.open(f))
d.save(sys.argv[1])
"""

def cmds(o):
    return {
        "qpdf": [QPDF, "--empty", "--pages", *IN, "--", o],
        "pdfunite": [PDFUNITE, *IN, o],
        "ghostscript": [GS, "-q", "-o", o, "-sDEVICE=pdfwrite", *IN],
        "pdftk": ["pdftk", *IN, "cat", "output", o],
        "pypdf": [PY, "-I", "-c", PYPDF, o, *IN],
        "pymupdf": [PY, "-I", "-c", PYMUPDF, o, *IN],
        # 변형: 첫 파일을 기본 입력으로 (qpdf 문서: 책갈피 등 문서 수준 정보는 기본 입력에서만 가져옴)
        "qpdf-primary": [QPDF, IN[0], "--pages", ".", *IN[1:], "--", o],
        "pypdf-topname": [PY, "-I", "-c", PYPDF_TOPNAME, o, *IN],
    }

tools = sys.argv[3:] or list(cmds("x"))
# 실행 예: run_tests.py /tmp/merge 3  (변형만: run_tests.py /tmp/merge 3 qpdf-primary pypdf-topname)
with open(Path(__file__).parent / "runs.jsonl", "a") as log:
    for t in tools:
        o = str(OUT / f"{t}.pdf")
        for i in range(N):
            t0 = time.perf_counter()
            pr = subprocess.Popen(cmds(o)[t], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            _, _, ru = os.wait4(pr.pid, 0)
            dt = time.perf_counter() - t0
            err = pr.stderr.read().decode(errors="replace")[-400:]
            rec = {"tool": t, "run": i, "sec": round(dt, 3), "maxrss_mb": round(ru.ru_maxrss / 1024, 1),
                   "rc": pr.returncode if pr.returncode is not None else 0, "stderr": err, "bytes": Path(o).stat().st_size if Path(o).exists() else None}
            log.write(json.dumps(rec) + "\n")
            print(rec["tool"], rec["sec"], rec["maxrss_mb"], rec["bytes"], err[:200].replace("\n", " | "))
