"""변환된 PDF를 정답 텍스트(.pub 안의 글자)와 비교해 채점.
- 쪽 수·쪽 크기(인치)
- 글자: 정답 단어 중 PDF에 있는 비율(recall), 정답보다 더 나온 단어 비율(중복), PDF에만 있는 단어(워터마크 등)
- 그림: 쪽마다 그림 객체 수(양식 XObject 안까지)
- 겹친 글자: 다른 줄의 글자 상자와 30% 이상 겹치는 글자 비율 (글자끼리 포개져 읽을 수 없는 부분)
PDF 읽기는 Chrome·Edge PDF 보기 엔진과 같은 PDFium(pypdfium2).
실행: python -I scripts/score.py reference/X.txt out/도구/X.pdf [...]
"""
import json
import re
import sys
from collections import Counter

import pypdfium2 as pdfium
import pypdfium2.raw as raw

WORD = re.compile(r"[A-Za-z0-9][A-Za-z0-9'’]*")


def words(text):
    # 줄 끝 자동 하이픈(PDFium은 U+FFFE·U+00AD·'-'로 줌)으로 나뉜 단어를 다시 붙임
    text = re.sub(r'[￾­\x02]\s*', '', text)
    text = re.sub(r'(?<=[a-z])-\s*\r?\n\s*(?=[a-z])', '', text)
    return [w.lower().replace('’', "'") for w in WORD.findall(text)]


def count_images(page):
    n = 0
    stack = list(page.get_objects())
    while stack:
        o = stack.pop()
        if o.type == raw.FPDF_PAGEOBJ_IMAGE:
            n += 1
        elif o.type == raw.FPDF_PAGEOBJ_FORM:
            cnt = raw.FPDFFormObj_CountObjects(o.raw)
            for i in range(cnt):
                stack.append(pdfium.PdfObject(raw.FPDFFormObj_GetObject(o.raw, i), page=page, pdf=page.pdf))
    return n


def overlap_ratio(textpage):
    n = textpage.count_chars()
    boxes = []
    for i in range(n):
        ch = textpage.get_text_range(i, 1)
        if not ch.strip():
            continue
        l, b, r, t = textpage.get_charbox(i)
        if r - l <= 0.3 or t - b <= 0.3:
            continue
        boxes.append((i, l, b, r, t))
    grid = {}
    cell = 12.0
    for k, (i, l, b, r, t) in enumerate(boxes):
        for gx in range(int(l // cell), int(r // cell) + 1):
            for gy in range(int(b // cell), int(t // cell) + 1):
                grid.setdefault((gx, gy), []).append(k)
    bad = set()
    for idxs in grid.values():
        for a in range(len(idxs)):
            for c in range(a + 1, len(idxs)):
                i1, l1, b1, r1, t1 = boxes[idxs[a]]
                i2, l2, b2, r2, t2 = boxes[idxs[c]]
                if abs(i1 - i2) <= 1:
                    continue
                w = min(r1, r2) - max(l1, l2)
                h = min(t1, t2) - max(b1, b2)
                if w <= 0 or h <= 0:
                    continue
                inter = w * h
                a1 = (r1 - l1) * (t1 - b1)
                a2 = (r2 - l2) * (t2 - b2)
                if inter >= 0.3 * min(a1, a2):
                    bad.add(idxs[a])
                    bad.add(idxs[c])
    return len(bad), len(boxes)


def score(ref_path, pdf_path):
    ref = Counter(words(open(ref_path, encoding='utf-8').read()))
    pdf = pdfium.PdfDocument(pdf_path)
    text = []
    pages = []
    ov_bad = ov_all = 0
    for p in pdf:
        tp = p.get_textpage()
        text.append(tp.get_text_range())
        w, h = p.get_size()
        bad, allc = overlap_ratio(tp)
        ov_bad += bad
        ov_all += allc
        pages.append({'size_in': [round(w / 72, 2), round(h / 72, 2)], 'images': count_images(p),
                      'overlap_chars': bad, 'chars': allc})
    out = Counter(words('\n'.join(text)))
    ref_total = sum(ref.values())
    found = sum(min(c, out[w]) for w, c in ref.items())
    extra_dup = sum(max(0, out[w] - c) for w, c in ref.items() if c)
    only_pdf = {w: c for w, c in out.items() if w not in ref}
    return {
        'pdf': pdf_path, 'pages': len(pages), 'page_detail': pages,
        'ref_words': ref_total, 'found_words': found, 'recall': round(found / ref_total, 4),
        'extra_words_of_ref': extra_dup, 'extra_ratio': round(extra_dup / ref_total, 4),
        'words_not_in_ref': sorted(only_pdf.items(), key=lambda x: -x[1])[:25],
        'images_total': sum(p['images'] for p in pages),
        'overlap_ratio': round(ov_bad / ov_all, 4) if ov_all else None,
    }


if __name__ == '__main__':
    ref = sys.argv[1]
    for f in sys.argv[2:]:
        print(json.dumps(score(ref, f), ensure_ascii=False))
