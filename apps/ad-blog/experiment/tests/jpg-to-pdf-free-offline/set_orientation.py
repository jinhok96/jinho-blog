# JPEG를 다시 인코딩하지 않고 SOI 바로 뒤에 EXIF(APP1, Orientation 태그 1개)를 끼워 넣음
import struct, sys
def exif_app1(orientation):
    tiff = b'MM\x00\x2a' + struct.pack('>I', 8)            # big-endian TIFF 헤더, IFD0 오프셋 8
    tiff += struct.pack('>H', 1)                            # 항목 1개
    tiff += struct.pack('>HHIHH', 0x0112, 3, 1, orientation, 0)  # Orientation SHORT
    tiff += struct.pack('>I', 0)                            # 다음 IFD 없음
    body = b'Exif\x00\x00' + tiff
    return b'\xff\xe1' + struct.pack('>H', len(body) + 2) + body
for path in sys.argv[2:]:
    data = open(path, 'rb').read()
    assert data[:2] == b'\xff\xd8'
    open(path, 'wb').write(data[:2] + exif_app1(int(sys.argv[1])) + data[2:])
