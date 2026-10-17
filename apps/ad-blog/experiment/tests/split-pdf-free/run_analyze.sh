#!/bin/sh
# 앱별 결과 파일(GUI로 직접 만든 것)을 analyze.py로 점검 → results.jsonl
# 결과 파일 위치: /tmp/split/out/{pdfsam-extract,pdfsam-split,pa,pa-all2,chrome}
W=/tmp/split
A="$(dirname "$0")/analyze.py"
run() { printf '{"app": "%s", "task": "%s", "result": ' "$1" "$2"; /tmp/pdfs/bin/python -W ignore -I "$A" $W/in/packet.pdf "$3" "$4" | tr -d '\n'; echo '}'; }
{
run "PDFsam Basic 6.0.6 (Extract)" "pages 1-4" $W/out/pdfsam-extract/1_PDFsam_packet.pdf 1
run "PDFsam Basic 6.0.6 (Extract)" "pages 5-10" $W/out/pdfsam-extract/5_PDFsam_packet.pdf 5
run "PDF Arranger 1.14.0 (Export Selection to a Single File)" "pages 1-4" $W/out/pa/pages1-4.pdf 1
run "PDF Arranger 1.14.0 (Export Selection to a Single File)" "pages 5-10" $W/out/pa/pages5-10.pdf 5
run "Chrome 141 (Print > Save as PDF, Custom pages)" "pages 1-4" $W/out/chrome/pages1-4.pdf 1
run "Chrome 141 (Print > Save as PDF, Custom pages)" "pages 5-10" $W/out/chrome/pages5-10.pdf 5
run "Chrome 141 (Print > Save as PDF, Custom pages)" "page 11" $W/out/chrome/page11.pdf 11
for i in $(seq 1 12); do run "PDFsam Basic 6.0.6 (Split > Every page)" "page $i" $W/out/pdfsam-split/${i}_PDFsam_packet.pdf $i; done
for i in $(seq 1 12); do run "PDF Arranger 1.14.0 (Export All Pages to Individual Files)" "page $i" $W/out/pa-all2/page-$(printf %03d $i).pdf $i; done
} > "$(dirname "$0")/results.jsonl"
