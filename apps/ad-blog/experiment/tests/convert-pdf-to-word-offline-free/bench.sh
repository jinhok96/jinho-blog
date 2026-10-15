#!/usr/bin/env bash
# PDF 11개를 3개 도구로 .docx 변환, 파일마다 시간·최대 메모리(/usr/bin/time -v) 기록.
# 각 도구는 PDF 1개당 프로세스 1번 (사용자가 파일 하나씩 변환하는 상황). 3회 반복 → score.py가 중앙값 사용.
# 사용: bash bench.sh <pdf 폴더> <출력 폴더> <LibreOffice soffice 경로> <pdf2docx 경로>
set -u
PDFS=$1 OUT=$2 SOFFICE=$3 PDF2DOCX=$4
PROFILE=$(mktemp -d)
mkdir -p "$OUT"/{libreoffice,pdf2docx,calibre} "$OUT/time"

# LibreOffice 첫 실행은 사용자 프로필을 만들므로 측정 전에 한 번 실행
"$SOFFICE" -env:UserInstallation=file://$PROFILE --headless --infilter=writer_pdf_import --convert-to docx --outdir "$OUT/warmup" "$PDFS/01-letter.pdf" >/dev/null 2>&1

for run in 1 2 3; do
  for pdf in "$PDFS"/*.pdf; do
    name=$(basename "$pdf" .pdf)
    /usr/bin/time -v -o "$OUT/time/libreoffice-$name-$run.txt" \
      "$SOFFICE" -env:UserInstallation=file://$PROFILE --headless --infilter=writer_pdf_import --convert-to docx --outdir "$OUT/libreoffice" "$pdf" >/dev/null 2>&1
    /usr/bin/time -v -o "$OUT/time/pdf2docx-$name-$run.txt" \
      "$PDF2DOCX" convert "$pdf" "$OUT/pdf2docx/$name.docx" >"$OUT/pdf2docx/$name.log" 2>&1
    /usr/bin/time -v -o "$OUT/time/calibre-$name-$run.txt" \
      ebook-convert "$pdf" "$OUT/calibre/$name.docx" >"$OUT/calibre/$name.log" 2>&1
  done
done
echo done
