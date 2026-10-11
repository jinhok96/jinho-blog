"""Print JPEG segment markers and sizes. Usage: python -I segments.py <file.jpg> ..."""
import struct, sys
for fn in sys.argv[1:]:
    d = open(fn, "rb").read(); i = 2; out = []
    while i < len(d):
        m = d[i + 1]
        if m == 0xDA:
            out.append("SOS"); break
        L = struct.unpack(">H", d[i + 2:i + 4])[0]
        tag = {0xE0: "APP0", 0xE1: "APP1", 0xE2: "APP2", 0xEB: "APP11", 0xEE: "APP14", 0xFE: "COM", 0xDB: "DQT", 0xC0: "SOF0", 0xC2: "SOF2", 0xC4: "DHT"}.get(m, hex(m))
        out.append(f"{tag}({L})"); i += 2 + L
    print(fn.rsplit("/", 1)[-1], " ".join(out))
