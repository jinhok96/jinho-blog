#!/bin/bash
# 입력 PDF 3개 → /tmp/p2j/in, 기준 렌더 → /tmp/p2j/ref (2026-10-19 세션 25)
# 1) IRS Form 1040 (2025, 2쪽): https://www.irs.gov/pub/irs-pdf/f1040.pdf
# 2) mixed.pdf: ../pdf-to-jpg-high-quality/mixed-test-page.html 을 Chromium 141 headless로 인쇄 (흰 배경 없는 PDF, 7pt 각주)
#    사진 cat-small.jpg = PD12M 15번(CC0, ../convert-heic-to-jpg-free/sources.json) 900px 폭
# 3) photos.pdf: PD12M 14·15·18번 3000px 폭·품질 90 → img2pdf --pagesize 'Letter^T'
set -e
W=/tmp/p2j; T=$(dirname "$0")/..
mkdir -p $W/in $W/src $W/photos $W/ref $W/out $W/shots
python3 -I -c "
import json;d=json.load(open('$T/convert-heic-to-jpg-free/sources.json'))
for x in d:
  if x['n'] in (14,15,18): print(x['n'],x['url'])" | while read n u; do curl -sL -o $W/photos/$n.jpg "$u"; done
curl -sL -o $W/in/irs-1040.pdf https://www.irs.gov/pub/irs-pdf/f1040.pdf
for n in 14 15 18; do convert $W/photos/$n.jpg -auto-orient -strip -resize 3000x -quality 90 $W/photos/s$n.jpg; done
convert $W/photos/s15.jpg -resize 900x -quality 88 $W/src/cat-small.jpg
cp $T/pdf-to-jpg-high-quality/mixed-test-page.html $W/src/mixed.html
img2pdf --pagesize 'Letter^T' -o $W/in/photos.pdf $W/photos/s14.jpg $W/photos/s15.jpg $W/photos/s18.jpg
/opt/pw-browsers/chromium-1194/chrome-linux/chrome --headless --no-sandbox --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=$W/in/mixed.pdf file://$W/src/mixed.html
pdftoppm -r 300 -png $W/in/irs-1040.pdf $W/ref/irs
pdftoppm -r 300 -png $W/in/mixed.pdf $W/ref/mixed
pdftoppm -r 300 -png $W/in/photos.pdf $W/ref/photos
