#!/bin/bash
# 입력 세트: convert-heic-to-jpg-free와 같은 CC0 사진 20장(PD12M, sources.json은 그 폴더 참고)
# → 4032x3024 가운데 자르기 → 품질 92·4:2:0 JPEG (휴대폰 12MP 사진과 비슷한 크기, 평균 2.69MB)
set -e
M=/tmp/ci/dl/squashfs-root/AppRun   # ImageMagick 7.1.2-34 AppImage
cd /tmp/ci; mkdir -p ref in
for n in $(seq -w 1 20); do
  $M orig/$n.jpg -auto-orient -strip -colorspace sRGB -resize 4032x3024^ -gravity center -extent 4032x3024 -depth 8 ref/$n.png
  $M ref/$n.png -quality 92 -sampling-factor 4:2:0 in/$n.jpg
done
