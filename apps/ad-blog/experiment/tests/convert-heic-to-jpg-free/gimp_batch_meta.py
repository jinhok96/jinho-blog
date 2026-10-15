# GIMP 3 python-fu 배치: Save Exif·Save color profile을 켠 내보내기
import os, glob
from gi.repository import Gimp, Gio
src = os.environ['SRC']; dst = os.environ['DST']
proc = Gimp.get_pdb().lookup_procedure('file-jpeg-export')
for f in sorted(glob.glob(os.path.join(src, '*.heic'))):
    img = Gimp.file_load(Gimp.RunMode.NONINTERACTIVE, Gio.File.new_for_path(f))
    out = os.path.join(dst, os.path.basename(f)[:-5] + '.jpg')
    cfg = proc.create_config()
    cfg.set_property('run-mode', Gimp.RunMode.NONINTERACTIVE)
    cfg.set_property('image', img)
    cfg.set_property('file', Gio.File.new_for_path(out))
    cfg.set_property('include-exif', True)
    cfg.set_property('include-color-profile', True)
    proc.run(cfg)
    img.delete()
