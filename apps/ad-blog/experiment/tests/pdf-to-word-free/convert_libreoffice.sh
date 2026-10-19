#!/bin/sh
# LibreOffice 26.8.1: 01-letter는 Writer GUI(File > Open, 파일 형식 "PDF - Portable Document Format (Writer)" → Save As
# "Word 2010–365 Document (.docx)")로 변환. 나머지 10개는 같은 가져오기 필터(writer_pdf_import)·내보내기 필터로 일괄 변환.
# GUI 결과와 일괄 변환 결과의 document.xml 텍스트가 같음을 확인 (md5 06abf9af…, 2026-10-19).
for f in /tmp/p2w/in/*.pdf; do
  /tmp/lo/root/opt/libreoffice26.8/program/soffice -env:UserInstallation=file:///tmp/p2w/lo-hl --headless \
    --infilter=writer_pdf_import --convert-to 'docx:MS Word 2007 XML' --outdir /tmp/p2w/out/libreoffice "$f"
done
