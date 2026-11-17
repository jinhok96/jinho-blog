"""Publisher(.pub) 파일 안의 글자(Quill CONTENTS의 TEXT 블록)를 꺼내 정답 텍스트로 저장.
Apache POI HPBF QuillContents 구조(0x20부터 24바이트 항목: 0x18 0x00, 종류 4자, 옵션, 블록 종류 4자, 시작, 길이)를 따름.
실행: python -I scripts/pub_text.py samples/X.pub > reference/X.txt
"""
import sys
import olefile

path = sys.argv[1]
ole = olefile.OleFileIO(path)
data = ole.openstream('Quill/QuillSub/CONTENTS').read()
assert data[:8] == b'CHNKINK ', data[:8]
texts = []
for i in range(0, 200):
    off = 0x20 + i * 24
    if data[off] != 0x18 or data[off + 1] != 0x00:
        break
    thing = data[off + 2:off + 6].decode('latin-1')
    bit = data[off + 12:off + 16].decode('latin-1')
    start = int.from_bytes(data[off + 16:off + 20], 'little')
    length = int.from_bytes(data[off + 20:off + 24], 'little')
    if thing == 'TEXT':
        texts.append(data[start:start + length].decode('utf-16-le', errors='replace'))
out = '\n'.join(texts).replace('\r', '\n')
sys.stdout.write(out)
