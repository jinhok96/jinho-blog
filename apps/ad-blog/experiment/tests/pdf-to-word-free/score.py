"""변환된 .docx를 정답(truth.json)과 비교해 summary.json 생성 (2026-10-20 GUI 앱 측정판).

convert-pdf-to-word-offline-free/score.py 와 같은 지표. 바뀐 점: 도구 목록(LibreOffice Writer·Sejda Desktop·iLovePDF 웹),
시간·메모리 측정 제외(GUI·웹이라 /usr/bin/time 없음), 일부 파일만 변환한 도구(Sejda 무료판 하루 3회)는 있는 파일만 채점,
3개 도구가 모두 변환한 파일(COMMON)만으로 따로 평균, iLovePDF OCR 결과(11-scanned-ocr.docx)도 채점.

지표
  word_recall    정답 단어(본문·제목·목록·표 셀) 중 결과에 있는 비율 (순서 무시)
  para_intact    정답 본문 문단이 결과의 '한 문단' 안에 그대로 있는 비율 → 고치기 쉬운 문단으로 남았나
  order_intact   정답 본문 문단이 결과 전체 텍스트에 순서대로 이어져 있는 비율 (줄마다 끊겨도 순서만 맞으면 인정)
  textbox_share  결과 글자 중 텍스트 상자(w:txbxContent) 안에 있는 비율 → 높을수록 편집이 불편
  tables_ok      정답 표 중 실제 Word 표로 다시 만들어지고 셀의 90% 이상이 같은 칸에 맞게 들어간 표 수
  images         결과에 들어간 그림 수 (정답 그림 수와 비교)
  sec / rss      bench.sh의 /usr/bin/time 결과 3회 중앙값

사용: python score.py <pdf 폴더(truth.json 포함)> <변환 결과 폴더(도구별 하위 폴더)>
"""

import json
import re
import statistics
import sys
import zipfile
from collections import Counter
from pathlib import Path

from lxml import etree

PDFS, OUT = Path(sys.argv[1]), Path(sys.argv[2])
TOOLS = ["libreoffice", "sejda", "ilovepdf"]
COMMON = ["03-invoice", "05-newsletter", "09-word-report"]
W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
NS = {"w": W, "mc": "http://schemas.openxmlformats.org/markup-compatibility/2006", "a": "http://schemas.openxmlformats.org/drawingml/2006/main", "v": "urn:schemas-microsoft-com:vml"}
truth = json.loads((PDFS / "truth.json").read_text())


def words(s):
    s = s.replace("­", "").replace("’", "'").replace("‘", "'").replace("“", '"').replace("”", '"')
    return re.findall(r"[a-z0-9$]+(?:['.,][a-z0-9]+)*", s.lower())


def norm(s):
    return " ".join(words(s))


def load(docx):
    with zipfile.ZipFile(docx) as z:
        root = etree.fromstring(z.read("word/document.xml"))
    # 호환용 대체 내용(mc:Fallback)은 같은 텍스트를 한 번 더 담으므로 제외
    for fb in root.iter(f"{{{NS['mc']}}}Fallback"):
        fb.getparent().remove(fb)
    body = root.find("w:body", NS)
    paras, box_chars, all_chars = [], 0, 0
    for p in body.iter(f"{{{W}}}p"):
        if p.find(".//w:p", NS) is not None:  # 텍스트 상자를 품은 문단은 안쪽 문단에서 셈
            own = [t for t in p.iter(f"{{{W}}}t") if next(iter([a for a in t.iterancestors(f"{{{W}}}p")]), None) is p]
            text = "".join(t.text or "" for t in own)
        else:
            text = ""
            for el in p.iter(f"{{{W}}}t", f"{{{W}}}tab", f"{{{W}}}br"):
                text += el.text or "" if el.tag == f"{{{W}}}t" else " "
        if not text.strip():
            continue
        in_box = any(a.tag == f"{{{W}}}txbxContent" for a in p.iterancestors())
        paras.append(text)
        all_chars += len(text)
        box_chars += len(text) if in_box else 0
    tables = []
    for tbl in body.iter(f"{{{W}}}tbl"):
        rows = []
        for tr in tbl.findall("w:tr", NS):
            rows.append([norm("".join(t.text or "" for t in tc.iter(f"{{{W}}}t"))) for tc in tr.findall("w:tc", NS)])
        tables.append(rows)
    images = len(body.findall(".//a:blip", NS)) + len(body.findall(".//v:imagedata", NS))
    return paras, tables, images, (box_chars / all_chars if all_chars else 0.0)


def table_score(expected, found):
    exp = [[norm(c) for c in r] for r in expected]
    best = 0.0
    for t in found:
        hit = sum(1 for i, r in enumerate(exp) for j, c in enumerate(r) if i < len(t) and j < len(t[i]) and t[i][j] == c)
        best = max(best, hit / sum(len(r) for r in exp))
    return best


def score(docx, t):
    paras, tables, images, box = load(docx)
    out_norm = [norm(p) for p in paras]
    joined = " ".join(x for x in out_norm if x)
    exp_words = Counter(w for s in t["paragraphs"] + t["lines"] + [c for tb in t["tables"] for r in tb for c in r] for w in words(s))
    got_words = Counter(w for p in paras for w in words(p))
    recall = sum(min(c, got_words[w]) for w, c in exp_words.items()) / sum(exp_words.values())
    intact = sum(1 for p in t["paragraphs"] if any(norm(p) in o for o in out_norm)) / len(t["paragraphs"])
    order = sum(1 for p in t["paragraphs"] if norm(p) in joined) / len(t["paragraphs"])
    tscores = [table_score(tb, tables) for tb in t["tables"]]
    return {
        "word_recall": round(recall, 4),
        "para_intact": round(intact, 4),
        "order_intact": round(order, 4),
        "textbox_share": round(box, 4),
        "out_paragraphs": len(paras),
        "out_tables": len(tables),
        "tables_expected": len(t["tables"]),
        "tables_ok": sum(1 for s in tscores if s >= 0.9),
        "table_cell_scores": [round(s, 3) for s in tscores],
        "images": images,
        "images_expected": t["images"],
    }


def overall(per, names):
    names = [n for n in names if n in per]
    if not names:
        return None
    mean = lambda k: round(statistics.mean(per[n][k] for n in names), 4)
    return {
        "docs": len(names),
        "word_recall": mean("word_recall"),
        "para_intact": mean("para_intact"),
        "order_intact": mean("order_intact"),
        "textbox_share": mean("textbox_share"),
        "tables_ok": sum(per[n]["tables_ok"] for n in names),
        "tables_expected": sum(per[n]["tables_expected"] for n in names),
        "images": sum(per[n]["images"] for n in names),
        "images_expected": sum(per[n]["images_expected"] for n in names),
    }


summary = {}
for tool in TOOLS:
    per = {name: score(OUT / tool / f"{name}.docx", t) for name, t in truth.items() if (OUT / tool / f"{name}.docx").exists()}
    ocr = OUT / tool / "11-scanned-ocr.docx"
    if ocr.exists():
        per["11-scanned-ocr"] = score(ocr, truth["11-scanned"])
    text_docs = [n for n in truth if n != "11-scanned"]
    summary[tool] = {
        "docs": per,
        "overall_text": overall(per, text_docs),
        "overall_common": overall(per, COMMON),
        "scanned_word_recall": per.get("11-scanned", {}).get("word_recall"),
        "scanned_ocr_word_recall": per.get("11-scanned-ocr", {}).get("word_recall"),
    }

(OUT / "summary.json").write_text(json.dumps(summary, indent=1))
for tool, s in summary.items():
    print(tool, "text", json.dumps(s["overall_text"]))
    print(tool, "common", json.dumps(s["overall_common"]), "scan", s["scanned_word_recall"], "ocr", s["scanned_ocr_word_recall"])
