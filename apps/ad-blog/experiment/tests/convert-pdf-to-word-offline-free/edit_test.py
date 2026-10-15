"""편집 테스트: 변환된 01-letter.docx 첫 본문 문단 중간에 문장 1개를 넣고, 문단이 다시 흘러가는지(reflow) 확인.

각 도구 결과의 word/document.xml에서 "I cannot make him out."을 찾아 뒤에 문장을 붙인 사본을 만든다.
렌더링은 LibreOffice Writer(시스템 24.2)로 PDF 변환 후 pdftoppm (charts.py에서 이미지로 사용).

사용: python edit_test.py <bench 출력 폴더> <결과 폴더>
"""

import shutil
import sys
import zipfile
from pathlib import Path

OUT, DEST = Path(sys.argv[1]), Path(sys.argv[2])
DEST.mkdir(parents=True, exist_ok=True)
NEEDLE = "I cannot make him out."
ADDED = " (This sentence was typed in after converting, to see whether the rest of the paragraph moves down.)"

for tool in ["libreoffice", "pdf2docx", "calibre"]:
    src = OUT / tool / "01-letter.docx"
    dst = DEST / f"{tool}-01-letter-edited.docx"
    with zipfile.ZipFile(src) as zin, zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as zout:
        for item in zin.infolist():
            data = zin.read(item.filename)
            if item.filename == "word/document.xml":
                xml = data.decode("utf-8")
                # LibreOffice 결과는 텍스트 상자 내용이 mc:Choice·mc:Fallback에 두 번 들어 있어 모두 바꿈
                assert xml.count(NEEDLE) >= 1, tool
                data = xml.replace(NEEDLE, NEEDLE + ADDED).encode("utf-8")
            zout.writestr(item, data)
    print("wrote", dst)
