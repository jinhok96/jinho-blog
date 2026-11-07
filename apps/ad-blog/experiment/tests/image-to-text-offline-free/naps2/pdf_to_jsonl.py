"""NAPS2가 저장한 검색 가능 PDF에서 페이지별 텍스트를 뽑아 bench.py 형식 jsonl로 저장.
사용: python pdf_to_jsonl.py <pdf> <이미지 폴더(가져온 순서 = 파일 이름순)> <engine 이름> <out.jsonl>
"""
import json, subprocess, sys
from pathlib import Path
pdf, img_dir, engine, out = sys.argv[1], Path(sys.argv[2]), sys.argv[3], Path(sys.argv[4])
files = sorted(p.name for p in img_dir.iterdir() if p.suffix in (".jpg", ".png"))
n = int(next(l for l in subprocess.run(["pdfinfo", pdf], capture_output=True, text=True).stdout.splitlines() if l.startswith("Pages:")).split()[1])
assert n == len(files), (n, len(files))
lines = [json.dumps({"engine": engine, "load_s": None})]
for i, f in enumerate(files, 1):
    text = subprocess.run(["pdftotext", "-f", str(i), "-l", str(i), "-layout", pdf, "-"], capture_output=True, text=True).stdout
    lines.append(json.dumps({"file": f, "cond": f.rsplit("_", 1)[0], "text": text, "sec": 0.0}))
out.write_text("\n".join(lines) + "\n")
print(engine, n, "pages")
