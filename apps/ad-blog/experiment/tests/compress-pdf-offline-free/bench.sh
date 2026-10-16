#!/bin/bash
# 설정별 압축 실행 + 시간·최대 RAM 기록. 사용: bench.sh IN_DIR OUT_DIR REPEAT
# gs 10.08.0(소스 빌드)·qpdf 12.4.2(공식 Linux 바이너리 zip)를 PATH 맨 앞에 둬 OCRmyPDF도 같은 Ghostscript를 쓰게 함
set -u
IN=$1; OUT=$2; R=${3:-3}
export PATH=/tmp/w/gs108/bin:/tmp/w/qpdf/bin/bin:/tmp/pv/bin:$PATH
mkdir -p "$OUT"; LOG=$OUT/timing.tsv; : > "$LOG"
GS="gs -q -dNOPAUSE -dBATCH -dSAFER -sDEVICE=pdfwrite"
run() { # name doc cmd...
  local name=$1 doc=$2; shift 2
  for r in $(seq 1 "$R"); do
    /usr/bin/time -f '%e\t%M' -o "$OUT/.t" "$@" >/dev/null 2>"$OUT/.err" || echo "FAIL $name $doc: $(tail -2 $OUT/.err)" >&2
    printf '%s\t%s\t%s\t%s\n' "$name" "$doc" "$r" "$(cat $OUT/.t)" >> "$LOG"
  done
}
for f in "$IN"/*.pdf; do
  d=$(basename "$f" .pdf)
  run qpdf "$d" qpdf --object-streams=generate --compress-streams=y --recompress-flate --compression-level=9 "$f" "$OUT/qpdf__$d.pdf"
  run qpdf-oi "$d" qpdf --object-streams=generate --compress-streams=y --recompress-flate --compression-level=9 --optimize-images "$f" "$OUT/qpdf-oi__$d.pdf"
  run gs-default "$d" $GS -o "$OUT/gs-default__$d.pdf" "$f"
  for s in screen ebook printer prepress; do
    run gs-$s "$d" $GS -dPDFSETTINGS=/$s -o "$OUT/gs-${s}__$d.pdf" "$f"
  done
  for o in 1 2 3; do
    run ocrmypdf-O$o "$d" ocrmypdf -q --ocr-engine none --skip-text --output-type pdf -O $o "$f" "$OUT/ocrmypdf-O${o}__$d.pdf"
  done
done
