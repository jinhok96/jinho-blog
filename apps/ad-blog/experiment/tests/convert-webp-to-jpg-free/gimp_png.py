# GIMP 3 python-fu 배치: 투명 WebP → PNG 기본 내보내기 (투명 유지 확인)
import os, glob
from gi.repository import Gimp, Gio
src = os.environ['SRC']; dst = os.environ['DST']
for n in ['logo','sticker','cutout']:
    img = Gimp.file_load(Gimp.RunMode.NONINTERACTIVE, Gio.File.new_for_path(os.path.join(src, n + '.webp')))
    Gimp.file_save(Gimp.RunMode.NONINTERACTIVE, img, Gio.File.new_for_path(os.path.join(dst, n + '.png')), None)
    img.delete()
