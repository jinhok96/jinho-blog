"""Mean absolute pixel difference between two images of the same size. Usage: python -I pixdiff.py a b"""
import sys
from PIL import Image, ImageChops, ImageStat
a, b = (Image.open(p).convert("RGB") for p in sys.argv[1:3])
print(sys.argv[2].rsplit("/", 1)[-1], a.size, b.size, "mean abs diff per channel:", [round(x, 2) for x in ImageStat.Stat(ImageChops.difference(a, b)).mean] if a.size == b.size else "size differs")
