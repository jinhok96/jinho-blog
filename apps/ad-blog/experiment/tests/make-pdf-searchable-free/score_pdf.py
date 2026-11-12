"""검색 가능하게 만든 PDF를 정답과 비교해 채점.

사용: python score_pdf.py <truth.json> <결과 PDF> [<결과 PDF> ...]   (결과 이름: {도구}__{원본 이름}.pdf)
페이지마다
글자 층은 PDFium(Chrome·Edge의 PDF 보기 엔진, pypdfium2)으로 읽음 — pdftotext는 기울어진 스캔 쪽에서 단어를 다른 줄로 옮겨 읽어 실제 보기 프로그램과 다름 (2026-11-13 확인)
- word_recall: 정답 단어 중 PDF 글자 층에 있는 비율, 순서 무시 (다중 집합). 검색하면 찾히는 단어의 비율에 가까움
- cer: 문자 오류율 (jiwer, 대소문자·따옴표·공백 정규화). 줄 순서가 다르면 오류로 셈
- num_recall: 숫자가 들어간 정답 토큰(날짜·참조 번호·금액) 중 그대로 있는 비율 (표 페이지)
- phrase_hits: 정답에서 고른 4단어 구절 20개 중 글자 층(공백 정규화)에 그대로 있는 수
- search_hits: 같은 구절을 PDFium 찾기 기능(FPDFText_FindStart, 대소문자 무시)으로 찾은 수 — Chrome PDF 보기의 찾기와 같은 엔진
- images: 쪽의 그림 크기·ppi·압축 (pdfimages -list), digital_text_kept: 원래 글자 쪽에 그림이 새로 생겼는지
파일마다 크기·쪽수·링크 수(pypdf 주석)
"""

import json
import random
import re
import subprocess
import sys
from collections import Counter
from pathlib import Path

import jiwer
import pypdfium2 as pdfium
from pypdf import PdfReader


def norm(t: str) -> str:
    t = t.replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    t = t.replace("—", " - ").replace("–", "-").replace("ﬁ", "fi").replace("ﬂ", "fl")
    t = re.sub(r"-\s*\n\s*", "-", t)
    return re.sub(r"\s+", " ", t).strip().lower()


def words(t: str):
    return [w for w in (re.sub(r"[^\w$.,/-]", "", x).strip(".,;:!?\"'()") for x in norm(t).split()) if w]


def recall(ref, hyp):
    rc, hc = Counter(ref), Counter(hyp)
    total = sum(rc.values())
    return sum(min(c, hc[w]) for w, c in rc.items()) / total if total else 1.0


def page_text(doc, page: int) -> str:
    return doc[page - 1].get_textpage().get_text_range()


def search_hits(doc, page: int, phrases_: list[str]) -> int:
    tp = doc[page - 1].get_textpage()
    return sum(1 for p in phrases_ if tp.search(p, match_case=False).get_next() is not None)


def images(pdf: Path):
    out = subprocess.run(["pdfimages", "-list", str(pdf)], capture_output=True, text=True).stdout.splitlines()[2:]
    rows = {}
    for ln in out:
        c = ln.split()
        if len(c) < 15:
            continue
        rows.setdefault(int(c[0]), []).append({"w": int(c[3]), "h": int(c[4]), "color": c[5], "enc": c[8],
                                                "ppi": int(c[12]), "size": c[14]})
    return rows


def phrases(text: str, n=20, seed=0):
    ws = norm(text).split()
    r = random.Random(seed)
    starts = sorted(r.sample(range(0, max(1, len(ws) - 4)), min(n, max(1, len(ws) - 4))))
    return [" ".join(ws[s:s + 4]) for s in starts]


def main():
    truth = json.loads(Path(sys.argv[1]).read_text())
    results = {}
    for arg in sys.argv[2:]:
        pdf = Path(arg)
        tool, src = pdf.stem.split("__")
        src = src + ".pdf"
        reader = PdfReader(str(pdf))
        doc = pdfium.PdfDocument(str(pdf))
        links = sum(1 for p in reader.pages for a in (p.get("/Annots") or []) if a.get_object().get("/Subtype") == "/Link")
        imgs = images(pdf)
        pages = []
        for t in [t for t in truth if t["pdf"] == src]:
            n = t["page"]
            hyp = page_text(doc, n) if n <= len(reader.pages) else ""
            ref_w, hyp_w = words(t["text"]), words(hyp)
            nums_ref = [w for w in ref_w if re.search(r"\d", w)]
            hyp_norm = norm(hyp)
            ph = phrases(t["text"], seed=n)
            row = {
                "page": n, "kind": t["kind"],
                "word_recall": round(recall(ref_w, hyp_w), 4),
                "cer": round(jiwer.cer(norm(t["text"]), hyp_norm) if hyp_norm else 1.0, 4),
                "num_recall": round(recall(nums_ref, hyp_w), 4) if nums_ref else None,
                "phrase_hits": sum(1 for p in ph if p in hyp_norm), "phrases": len(ph),
                "search_hits": search_hits(doc, n, ph) if n <= len(reader.pages) else 0,
                "images": imgs.get(n, []),
            }
            if t["kind"] == "digital":
                row["digital_text_kept"] = not imgs.get(n)
            pages.append(row)
        results[pdf.name] = {"tool": tool, "src": src, "bytes": pdf.stat().st_size, "pages": len(reader.pages),
                             "links": links, "by_page": pages}
    print(json.dumps(results, indent=1))


if __name__ == "__main__":
    main()
