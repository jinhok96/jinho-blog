"""Create a synthetic test image and sign it with a C2PA manifest using test certificates.

Usage: python -I make_source.py <cert_pem> <key_pem> <out_dir>

The certificate and key are the c2patool sample (test) credentials, NOT a real issuer.
The manifest declares digitalSourceType = trainedAlgorithmicMedia (the IPTC term for
generative-AI output), to mimic how AI image generators label their output.
"""
import io
import json
import math
import random
import sys
from pathlib import Path

import c2pa
from PIL import Image, ImageDraw

cert_path, key_path, out_dir = sys.argv[1], sys.argv[2], Path(sys.argv[3])
out_dir.mkdir(parents=True, exist_ok=True)

# 1. Synthetic image: gradient sky, sun, hills, light noise (so JPEG behaves like a photo).
W, H = 1600, 1067
img = Image.new("RGB", (W, H))
px = img.load()
for y in range(H):
    t = y / H
    for x in range(W):
        px[x, y] = (int(40 + 150 * t), int(90 + 100 * t), int(200 - 60 * t))
d = ImageDraw.Draw(img)
d.ellipse((1150, 120, 1350, 320), fill=(255, 214, 120))
for i, col in enumerate([(52, 110, 60), (40, 90, 48), (30, 70, 38)]):
    pts = [(0, H)]
    for x in range(0, W + 1, 20):
        pts.append((x, int(650 + i * 110 + 60 * math.sin(x / (180 + i * 40) + i))))
    pts.append((W, H))
    d.polygon(pts, fill=col)
rnd = random.Random(42)
for _ in range(60000):
    x, y = rnd.randrange(W), rnd.randrange(H)
    r, g, b = px[x, y]
    n = rnd.randint(-12, 12)
    px[x, y] = (max(0, min(255, r + n)), max(0, min(255, g + n)), max(0, min(255, b + n)))

# Add ordinary EXIF so we can later test "remove EXIF only".
exif = Image.Exif()
exif[0x0131] = "ToolProof synthetic test image"  # Software
exif[0x0132] = "2026:10:11 09:00:00"  # DateTime
exif[0x010E] = "C2PA strip test source"  # ImageDescription

unsigned = out_dir / "source_unsigned.jpg"
img.save(unsigned, "JPEG", quality=92, exif=exif.tobytes())

# 2. Sign with a C2PA manifest (test certificate, no timestamp authority: no network).
manifest = {
    "claim_generator_info": [{"name": "ToolProof C2PA strip test", "version": "1.0"}],
    "title": "source_signed.jpg",
    "format": "image/jpeg",
    "assertions": [
        {
            "label": "c2pa.actions",
            "data": {
                "actions": [
                    {
                        "action": "c2pa.created",
                        "digitalSourceType": "http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia",
                        "softwareAgent": {"name": "ToolProof test generator (not a real AI model)"},
                    }
                ]
            },
        }
    ],
}

cert = Path(cert_path).read_bytes()
key = Path(key_path).read_bytes()
signer = c2pa.Signer.from_info(c2pa.C2paSignerInfo(c2pa.C2paSigningAlg.ES256, cert, key, None))
builder = c2pa.Builder(json.dumps(manifest))
signed = out_dir / "source_signed.jpg"
with open(unsigned, "rb") as src, open(signed, "w+b") as dst:
    builder.sign(signer, "image/jpeg", src, dst)

print("c2pa-python", c2pa.__version__, "| c2pa-rs SDK", c2pa.sdk_version())
print("wrote", unsigned, unsigned.stat().st_size, "bytes")
print("wrote", signed, signed.stat().st_size, "bytes")
