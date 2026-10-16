#!/bin/bash
# 입력 세트: convert-heic-to-jpg-free와 같은 CC0 사진 20장(PD12M, sources.json은 그 폴더 참고) → /tmp/j2p/orig/NN.jpg
# → 4032x3024 가운데 자르기 → 품질 92·4:2:0·72 DPI JPEG (01~20)
# + 세로 사진 4장(21~24 = 03·08·11·16의 세로 자르기): 픽셀은 가로로 저장하고 EXIF Orientation=6 (휴대폰 세로 사진처럼)
set -e
M=/tmp/j2p/dl/squashfs-root/AppRun   # ImageMagick 7.1.2-34 AppImage
cd /tmp/j2p; mkdir -p ref in
for n in $(seq -w 1 20); do
  $M orig/$n.jpg -auto-orient -strip -colorspace sRGB -resize 4032x3024^ -gravity center -extent 4032x3024 -depth 8 ref/$n.png
  $M ref/$n.png -quality 92 -sampling-factor 4:2:0 -density 72 -units PixelsPerInch in/$n.jpg
done
k=21
for n in 03 08 11 16; do
  $M ref/$n.png -gravity center -crop 2268x3024+0+0 +repage -resize 3024x4032! -depth 8 ref/$k.png
  $M ref/$k.png -rotate -90 -quality 92 -sampling-factor 4:2:0 -density 72 -units PixelsPerInch in/$k.jpg
  k=$((k+1))
done
# ImageMagick -orient은 EXIF가 없는 파일에 태그를 쓰지 않음 → 다시 인코딩 없이 EXIF APP1을 직접 삽입
python3 -I scripts/set_orientation.py 6 in/21.jpg in/22.jpg in/23.jpg in/24.jpg
