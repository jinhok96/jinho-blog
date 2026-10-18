"""두 W-9 합친 PDF의 양식 점검: python forms.py <merged.pdf>
쪽 수, 필드 수(고유 이름), 1쪽·7쪽(두 번째 W-9 첫 쪽) Name 위젯이 가리키는 필드 이름과 값, 두 위젯이 같은 필드를 공유하는지를 JSON으로 출력
"""
import json, sys
from pathlib import Path
import pikepdf

pk = pikepdf.open(sys.argv[1])
def fullname(f):
    parts = []
    while f is not None:
        if "/T" in f: parts.append(str(f.T))
        f = f.get("/Parent")
    return ".".join(reversed(parts))
def value(f):
    while f is not None:
        if "/V" in f: return str(f.V)
        f = f.get("/Parent")
    return None
names = set()
af = pk.Root.get("/AcroForm")
def walk(f):
    kids = f.get("/Kids")
    if kids is not None and any("/T" in k for k in kids):
        for k in kids: walk(k)
    else:
        names.add(fullname(f))
if af is not None:
    for f in af.get("/Fields", []): walk(f)
name_widgets = []
for i, p in enumerate(pk.pages):
    for a in p.get("/Annots", []):
        if a.get("/Subtype") == "/Widget" and "f1_01[0]" in fullname(a):
            name_widgets.append({"page": i + 1, "field": fullname(a), "value": value(a), "objgen": list(a.objgen)})
shared = len(name_widgets) == 2 and name_widgets[0]["field"] == name_widgets[1]["field"]
print(json.dumps({"file": Path(sys.argv[1]).name, "bytes": Path(sys.argv[1]).stat().st_size, "pages": len(pk.pages),
  "acroform": af is not None, "unique_fields": len(names), "name_widgets": name_widgets, "same_field_name": shared}, ensure_ascii=False))
