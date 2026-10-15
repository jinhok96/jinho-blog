#!/bin/bash
# HEIC 테스트 세트 생성: 4032x3024 Display P3, EXIF 날짜·GPS, 세로 사진 4장은 가로 픽셀 + irot + EXIF Orientation=6
set -e
M=/tmp/heic/dl/squashfs-root/AppRun
SRGB=/usr/share/color/icc/ghostscript/srgb.icc
P3=/tmp/heic/DisplayP3.icc
cd /tmp/heic; mkdir -p ref p3 heic
for n in $(seq -w 1 20); do
  $M orig/$n.jpg -auto-orient -strip -resize 4032x3024^ -gravity center -extent 4032x3024 -depth 8 ref/$n.png
  $M ref/$n.png -profile $SRGB -profile $P3 -depth 8 p3/$n.png
  heif-enc -q 70 p3/$n.png -o heic/$n.heic >/dev/null
done
k=21
for n in 03 08 11 16; do
  $M ref/$n.png -gravity center -crop 2268x3024+0+0 +repage -resize 3024x4032! -depth 8 ref/$k.png
  $M ref/$k.png -profile $SRGB -profile $P3 -depth 8 p3/$k.png
  $M p3/$k.png -rotate -90 -quality 98 /tmp/heic/tmp_land.jpg
  exiftool -q -overwrite_original -Orientation#=6 /tmp/heic/tmp_land.jpg
  heif-enc -q 70 /tmp/heic/tmp_land.jpg -o heic/$k.heic >/dev/null
  k=$((k+1))
done
for f in heic/*.heic; do
  exiftool -q -overwrite_original -Make=ToolProof -Model="HEIC test file" -DateTimeOriginal="2026:10:01 12:00:00" -CreateDate="2026:10:01 12:00:00" \
    -GPSLatitude=40.6892 -GPSLatitudeRef=N -GPSLongitude=74.0445 -GPSLongitudeRef=W "$f"
done
