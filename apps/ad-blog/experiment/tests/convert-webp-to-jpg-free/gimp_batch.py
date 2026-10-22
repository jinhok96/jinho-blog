# GIMP 3 python-fu 배치: 기본 내보내기 설정으로 WebP → JPG (GUI File > Export As와 같은 내보내기 경로)
import os, glob
from gi.repository import Gimp, Gio
src = os.environ['SRC']; dst = os.environ['DST']
for f in sorted(glob.glob(os.path.join(src, '*.webp'))):
    img = Gimp.file_load(Gimp.RunMode.NONINTERACTIVE, Gio.File.new_for_path(f))
    print(os.path.basename(f), 'layers', len(img.get_layers()), flush=True)
    out = os.path.join(dst, os.path.basename(f)[:-5] + '.jpg')
    Gimp.file_save(Gimp.RunMode.NONINTERACTIVE, img, Gio.File.new_for_path(out), None)
    img.delete()
