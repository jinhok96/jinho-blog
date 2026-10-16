"""출력 JPG를 Tesseract로 읽어 원본 PDF 텍스트(pdftotext) 대비 단어 재현율 계산.
사용: python3 -I score.py <작업 폴더> <설정1,설정2,...|all> [결과 json]
- word_recall: 정답 단어(소문자, 구두점 제거) 중 OCR 결과에 있는 비율(순서 무시, 다중 집합)
- fine_recall: mixed 문서 7pt 각주 단어 재현율
- 출력 파일 크기·픽셀 크기·JPEG 품질도 함께 기록
"""
import json, re, subprocess, sys
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

W = Path(sys.argv[1]); OUT = W / "out"
cfgs = sorted(p.name for p in OUT.iterdir()) if sys.argv[2] == "all" else sys.argv[2].split(",")
res_path = Path(sys.argv[3]) if len(sys.argv) > 3 else W / "scores.json"
MAGICK = str(W / "dl/squashfs-root/AppRun")
FINE = ("Fine print test at 7 points: Terms apply. Reference number 4821-7730-1956. Contact support within 30 days "
        "of purchase for a full refund. Version 2.14, printed October 16, 2026.")

def words(t):
    t = t.replace("’", "'").replace("‘", "'").replace("—", " ").replace("–", "-").lower()
    return [w for w in (x.strip(".,;:!?\"'()[]") for x in t.split()) if re.search(r"[a-z0-9]", w)]

def recall(ref, hyp):
    rc, hc = Counter(ref), Counter(hyp)
    n = sum(rc.values())
    return sum(min(c, hc[w]) for w, c in rc.items()) / n if n else None

def truth(doc, page=None):
    rng = ["-f", str(page), "-l", str(page)] if page else []
    return words(subprocess.run(["pdftotext", *rng, str(W / "in" / f"{doc}.pdf"), "-"], capture_output=True, text=True).stdout)

def ocr(img):
    return subprocess.run(["tesseract", str(img), "-", "--psm", "3"], capture_output=True, text=True,
                          env={"OMP_THREAD_LIMIT": "1", "PATH": "/usr/bin:/bin"}).stdout

def info(img):
    o = subprocess.run([MAGICK, "identify", "-format", "%w %h %Q", str(img)], capture_output=True, text=True).stdout.split()
    return {"w": int(o[0]), "h": int(o[1]), "q": int(o[2]), "bytes": img.stat().st_size}

if __name__ == "__main__":
    T = {d: truth(d) for d in ("irs-1040", "mixed")}
    T1 = truth("irs-1040", 1)
    jobs = [(c, d, f) for c in cfgs for d in ("irs-1040", "mixed", "photos") for f in sorted((OUT / c / d).glob("*.jpg"))]
    with ThreadPoolExecutor(4) as ex:
        texts = list(ex.map(lambda j: ocr(j[2]) if j[1] != "photos" else "", jobs))
    res = json.loads(res_path.read_text()) if res_path.exists() else {}
    for c in cfgs:
        res[c] = {}
        for d in ("irs-1040", "mixed", "photos"):
            sel = [(j, t) for j, t in zip(jobs, texts) if j[0] == c and j[1] == d]
            files = [info(j[2]) for j, _ in sel]
            r = {"pages": len(files), "bytes": sum(f["bytes"] for f in files), "files": files}
            if d != "photos":
                hyp = words(" ".join(t for _, t in sel))
                r["word_recall"] = round(recall(T[d], hyp), 4)
                if d == "irs-1040" and sel:
                    r["p1_recall"] = round(recall(T1, words(sel[0][1])), 4)
                if d == "mixed":
                    r["fine_recall"] = round(recall(words(FINE), hyp), 4)
            res[c][d] = r
            print(c, d, r["pages"], r["bytes"], r.get("word_recall"), r.get("p1_recall"), r.get("fine_recall"))
    res_path.write_text(json.dumps(res, indent=1))
