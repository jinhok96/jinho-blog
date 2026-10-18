"""두 W-9 합친 PDF에서 앞 6쪽과 뒤 6쪽 위젯이 같은 필드(객체)를 공유하는 수 + 평면화 시 보이는 이름 텍스트
실행: python shared.py <merged.pdf>"""
import json, sys
import pikepdf, pymupdf
pk = pikepdf.open(sys.argv[1])
def field_of(a):
    return a if "/T" in a else a.get("/Parent")
first, second = {}, {}
for i, p in enumerate(pk.pages):
    for a in p.get("/Annots", []):
        if a.get("/Subtype") == "/Widget":
            f = field_of(a)
            (first if i < 6 else second)[f.objgen] = 1
doc = pymupdf.open(sys.argv[1])
txt = " ".join(doc[i].get_text() for i in range(doc.page_count))
print(json.dumps({"file": sys.argv[1], "widgets_first": len(first), "widgets_second": len(second),
  "shared_fields": len(set(first) & set(second)),
  "visible_text": {n: txt.count(n) for n in ("TEST VENDOR ONE LLC", "TEST VENDOR TWO INC")}}))
