#!/bin/sh
# GUI로 직접 만든 합친 결과를 점검 → results.jsonl
# 결과 파일 위치: /tmp/merge/out/{pdfsam,pa,sejda}
W=/tmp/merge
D="$(dirname "$0")"
P=/tmp/pdfs/bin/python
{
for a in pdfsam pa sejda; do
  printf '{"app": "%s", "test": "packet (report+W-9+photos)", "result": ' $a; $P -W ignore -I $D/analyze.py $W/in/packet.pdf $W/out/$a/packet.pdf 1 | tr -d '\n'; echo '}'
  printf '{"app": "%s", "test": "two W-9 forms", "result": ' $a; $P -W ignore -I $D/forms.py $W/out/$a/two-w9.pdf | tr -d '\n'; printf ', "shared": '; $P -W ignore -I $D/shared.py $W/out/$a/two-w9.pdf | tr -d '\n'; echo '}'
done
for f in two-w9-mergefields two-w9-flatten; do
  printf '{"app": "pdfsam", "test": "%s", "result": ' $f; $P -W ignore -I $D/forms.py $W/out/pdfsam/$f.pdf | tr -d '\n'; printf ', "shared": '; $P -W ignore -I $D/shared.py $W/out/pdfsam/$f.pdf | tr -d '\n'; echo '}'
done
for f in pdfsam/w9-first pa/w9-first pa/w9-first-unchecked; do
  printf '{"app": "%s", "test": "W-9 first, report second", "result": ' $f; $P -W ignore -I -c "
import json,sys,pymupdf
d=pymupdf.open(sys.argv[1]); links=[l for p in d for l in p.get_links() if l['kind']!=pymupdf.LINK_URI]
print(json.dumps({'pages':d.page_count,'bookmarks':d.get_toc(),'internal_links':len(links),'internal_links_resolve':sum(1 for l in links if l.get('page') is not None and l['page']>=0)}))" $W/out/$f.pdf | tr -d '\n'; echo '}'
done
} > "$D/results.jsonl"
