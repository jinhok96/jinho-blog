#!/bin/bash
# 입력 PDF 3개 → /tmp/p2j/in
# 1) IRS Form 1040 (2025, 2쪽, 공공 영역): https://www.irs.gov/pub/irs-pdf/f1040.pdf
# 2) mixed.pdf: mixed-test-page.html(이 폴더)을 Chromium 141 headless로 인쇄 (흰 배경을 칠하지 않는 브라우저 PDF)
#    사진 cat-small.jpg = PD12M 15번(CC0, convert-heic-to-jpg-free/sources.json) 900px 폭
# 3) photos.pdf: PD12M 14·15·18번을 3000px 폭·품질 90으로 줄인 뒤 img2pdf 0.6.3 --pagesize 'Letter^T'
set -e
W=/tmp/p2j; M=$W/dl/squashfs-root/AppRun   # ImageMagick 7.1.2-34 AppImage
mkdir -p $W/in $W/src
curl -sL -o $W/in/irs-1040.pdf https://www.irs.gov/pub/irs-pdf/f1040.pdf
for n in 14 15 18; do $M $W/photos/$n.jpg -auto-orient -strip -resize 3000x -quality 90 $W/photos/s$n.jpg; done
$M $W/photos/s15.jpg -resize 900x -quality 88 $W/src/cat-small.jpg
img2pdf --pagesize 'Letter^T' -o $W/in/photos.pdf $W/photos/s14.jpg $W/photos/s15.jpg $W/photos/s18.jpg
/opt/pw-browsers/chromium-1194/chrome-linux/chrome --headless --no-sandbox --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=$W/in/mixed.pdf file://$W/src/mixed.html
# 실행: python3 -I run_tests.py /tmp/p2j 3 → (스윕) run_tests.py /tmp/p2j 1 pdftoppm-r{72..600}-q{75,90} → score.py /tmp/p2j all → summarize.py → charts.py
