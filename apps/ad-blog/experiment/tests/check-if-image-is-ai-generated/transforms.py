"""Apply everyday edits to a C2PA-signed JPEG.

Usage: python -I transforms.py <signed.jpg> <out_dir>

All Pillow edits open the file and save a new file, the way most simple editors and
converters do. Byte-level edits (t08, t09) manipulate JPEG segments directly to model
tools that only touch metadata or that copy metadata blindly.
"""
import shutil
import struct
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageDraw

src, out = Path(sys.argv[1]), Path(sys.argv[2])
out.mkdir(parents=True, exist_ok=True)


def segments(data: bytes):
    """Yield (marker, start, end) for JPEG segments before SOS; then ('SOS', start, len)."""
    assert data[:2] == b"\xff\xd8", "not a JPEG"
    i = 2
    while i < len(data):
        assert data[i] == 0xFF, f"bad marker at {i}"
        marker = data[i + 1]
        if marker == 0xDA:  # SOS: rest is entropy-coded data
            yield (marker, i, len(data))
            return
        length = struct.unpack(">H", data[i + 2 : i + 4])[0]
        yield (marker, i, i + 2 + length)
        i += 2 + length


def is_exif_or_xmp(data, s, e):
    body = data[s + 4 : e]
    return body.startswith(b"Exif\x00") or body.startswith(b"http://ns.adobe.com/xap/1.0/")


data = src.read_bytes()
im = Image.open(src)
im.load()
w, h = im.size
results = []


def note(name, how):
    results.append((name, how))


# t00 control
shutil.copy(src, out / "t00_original.jpg")
note("t00_original.jpg", "unchanged copy (control)")

# t01 re-save JPEG q85
im.save(out / "t01_resave_q85.jpg", "JPEG", quality=85)
note("t01_resave_q85.jpg", "Pillow: open, save as JPEG quality=85")

# t02 resize 50%
im.resize((w // 2, h // 2), Image.LANCZOS).save(out / "t02_resize50.jpg", "JPEG", quality=85)
note("t02_resize50.jpg", "Pillow: resize to 50% (LANCZOS), JPEG q85")

# t03 crop center 80%
cw, ch = int(w * 0.8), int(h * 0.8)
l, t = (w - cw) // 2, (h - ch) // 2
im.crop((l, t, l + cw, t + ch)).save(out / "t03_crop80.jpg", "JPEG", quality=85)
note("t03_crop80.jpg", "Pillow: crop to center 80%, JPEG q85")

# t04 rotate 90
im.rotate(90, expand=True).save(out / "t04_rotate90.jpg", "JPEG", quality=85)
note("t04_rotate90.jpg", "Pillow: rotate 90 degrees, JPEG q85")

# t05 to PNG
im.save(out / "t05_to_png.png", "PNG")
note("t05_to_png.png", "Pillow: convert to PNG")

# t06 to WebP
im.save(out / "t06_to_webp.webp", "WEBP", quality=85)
note("t06_to_webp.webp", "Pillow: convert to WebP quality=85")

# t07 ImageMagick strip all metadata (pixels re-encoded at same size)
subprocess.run(["convert", str(src), "-strip", str(out / "t07_im_strip.jpg")], check=True)
note("t07_im_strip.jpg", "ImageMagick 6: convert -strip")

# t07b ImageMagick re-save WITHOUT -strip (does a metadata-preserving tool keep the C2PA block?)
subprocess.run(["convert", str(src), "-quality", "85", str(out / "t07b_im_resave_q85.jpg")], check=True)
note("t07b_im_resave_q85.jpg", "ImageMagick 6: convert -quality 85 (no -strip)")

# t08 remove EXIF/XMP only, leave C2PA (APP11) and pixels untouched (byte-level)
kept = bytearray(b"\xff\xd8")
removed = 0
for m, s, e in segments(data):
    if m == 0xE1 and is_exif_or_xmp(data, s, e):
        removed += 1
        continue
    kept += data[s:e]
(out / "t08_exif_removed_only.jpg").write_bytes(bytes(kept))
note("t08_exif_removed_only.jpg", f"byte edit: removed {removed} EXIF/XMP APP1 segment(s); C2PA APP11 and pixels untouched")

# t09 pixel edit, C2PA block copied over (models an editor that blindly copies all metadata)
edited = im.copy()
ImageDraw.Draw(edited).rectangle((40, 40, 240, 140), fill=(255, 0, 0))
tmp = out / "_t09_tmp.jpg"
edited.save(tmp, "JPEG", quality=92)
new = tmp.read_bytes()
tmp.unlink()
app11 = b"".join(data[s:e] for m, s, e in segments(data) if m == 0xEB)
segs = list(segments(new))
# insert original APP11 segments right after the first APP0/APP1 block of the new file
insert_at = 2
for m, s, e in segs:
    if m in (0xE0, 0xE1):
        insert_at = e
    else:
        break
(out / "t09_pixel_edit_c2pa_copied.jpg").write_bytes(new[:insert_at] + app11 + new[insert_at:])
note("t09_pixel_edit_c2pa_copied.jpg", f"Pillow: draw red box, re-save; then copy original C2PA APP11 ({len(app11)} bytes) into new file")

for name, how in results:
    print(f"{name}\t{how}")
