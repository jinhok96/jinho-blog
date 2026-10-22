#!/bin/bash
# 메타데이터 테스트 세트: CC0 사진 8장(PD12M) → 4032x3024 JPG(품질 92), 개인 정보 메타데이터를 직접 기록
# 03·06은 세로 사진을 가로 픽셀로 저장 + EXIF Orientation=6 (휴대폰 사진과 같은 방식)
# 모든 파일: EXIF(제조사·모델·일련번호·렌즈·촬영 시각·GPS·작성자·소프트웨어·내장 썸네일) + XMP(도시·작성자) + IPTC(도시·키워드) + sRGB ICC (ICC는 Pillow ImageCms sRGB로 생성)
set -e
cd /tmp/meta; mkdir -p set
for n in $(seq -w 01 08); do
  if [ "$n" = "03" ] || [ "$n" = "06" ]; then
    convert orig/$n.jpg -auto-orient -strip -resize 3024x4032^ -gravity center -extent 3024x4032 -rotate -90 -quality 92 set/$n.jpg
    ORI=6
  else
    convert orig/$n.jpg -auto-orient -strip -resize 4032x3024^ -gravity center -extent 4032x3024 -quality 92 set/$n.jpg
    ORI=1
  fi
  convert set/$n.jpg -resize 160x120 -quality 80 /tmp/meta/thumb_$n.jpg
  exiftool -q -overwrite_original \
    -Make=ToolProof -Model="Metadata Test Phone" -SerialNumber=TP-0042-7781 -LensModel="Test Lens 26mm f/1.8" \
    -DateTimeOriginal="2026:10:01 12:00:00" -CreateDate="2026:10:01 12:00:00" -OffsetTimeOriginal="-04:00" \
    -GPSLatitude=40.6892 -GPSLatitudeRef=N -GPSLongitude=74.0445 -GPSLongitudeRef=W -GPSAltitude=12 -GPSAltitudeRef=0 \
    -Artist="Jane Example" -Copyright="Jane Example" -Software="ToolProof test 1.0" -Orientation#=$ORI \
    "-ThumbnailImage<=/tmp/meta/thumb_$n.jpg" \
    -XMP-photoshop:City="New York" -XMP-dc:Creator="Jane Example" -XMP-iptcCore:Location="Liberty Island" \
    -IPTC:City="New York" -IPTC:Keywords="test" \
    "-ICC_Profile<=/tmp/meta/srgb.icc" set/$n.jpg
done
