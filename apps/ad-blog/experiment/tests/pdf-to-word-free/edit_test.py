"""편집 테스트: 변환된 05-newsletter.docx 첫 본문 문단에 문장 1개를 넣고, 문단이 다시 흘러가는지(reflow) 확인 (2026-10-20).

convert-pdf-to-word-offline-free/edit_test.py 와 같은 방식. Sejda 무료판은 01-letter를 변환하지 못해(하루 3회) 3개 도구가
모두 변환한 05-newsletter(2단 뉴스레터)를 씀. 렌더링은 LibreOffice Writer(시스템 24.2)로 PDF 변환 후 pdftoppm.

사용: python edit_test.py <변환 결과 폴더> <결과 폴더>
"""

import sys
import zipfile
from pathlib import Path

OUT, DEST = Path(sys.argv[1]), Path(sys.argv[2])
DEST.mkdir(parents=True, exist_ok=True)
NEEDLE = "blushing for her mother."
ADDED = " (This sentence was typed in after converting, to see whether the rest of the paragraph moves down.)"

for tool in ["libreoffice", "sejda", "ilovepdf"]:
    src = OUT / tool / "05-newsletter.docx"
    dst = DEST / f"{tool}-05-newsletter-edited.docx"
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
