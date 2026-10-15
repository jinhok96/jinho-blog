"""변환 결과 분석: 화면에 보이는 그대로(EXIF 방향 적용, 내장 ICC → sRGB, 없으면 sRGB로 간주) 원본 기준 이미지와 비교"""
import glob, os, json, subprocess, io, sys
import numpy as np
from PIL import Image, ImageOps, ImageCms
from skimage.metrics import structural_similarity
from skimage.color import rgb2lab, deltaE_ciede2000
REF='/tmp/heic/ref'; OUT='/tmp/heic/out'
SRGB=ImageCms.createProfile('sRGB')
def displayed(path):
    im=Image.open(path); icc=im.info.get('icc_profile')
    im=ImageOps.exif_transpose(im).convert('RGB')
    if icc:
        src=ImageCms.ImageCmsProfile(io.BytesIO(icc))
        im=ImageCms.profileToProfile(im,src,SRGB,renderingIntent=1,outputMode='RGB')  # relative colorimetric
    return im,bool(icc)
def meta(paths):
    r=subprocess.run(['exiftool','-j','-GPSLatitude','-DateTimeOriginal','-Orientation','-ProfileDescription',*paths],capture_output=True,text=True)
    return {os.path.basename(d['SourceFile']):d for d in json.loads(r.stdout)}
def analyze(tool):
    files=sorted(glob.glob(f'{OUT}/{tool}/*.jpg')); md=meta(files); rows=[]
    for f in files:
        n=os.path.basename(f)[:2]
        ref=Image.open(f'{REF}/{n}.png').convert('RGB')
        im,has_icc=displayed(f)
        ok_orient=im.size==ref.size
        row=dict(file=n,bytes=os.path.getsize(f),icc=has_icc,gps='GPSLatitude' in md[os.path.basename(f)],
                 date='DateTimeOriginal' in md[os.path.basename(f)],orientation_ok=ok_orient)
        if ok_orient:
            a=np.asarray(im); b=np.asarray(ref)
            ga=np.asarray(im.convert('L'),dtype=float); gb=np.asarray(ref.convert('L'),dtype=float)
            row['ssim']=round(float(structural_similarity(ga,gb,data_range=255)),4)
            sa=np.asarray(im.resize((1008,756) if im.width>im.height else (756,1008),Image.BOX))/255.0
            sb=np.asarray(ref.resize(im.size if False else ((1008,756) if im.width>im.height else (756,1008)),Image.BOX))/255.0
            row['deltaE']=round(float(deltaE_ciede2000(rgb2lab(sa),rgb2lab(sb)).mean()),2)
        rows.append(row); print(tool,row,flush=True)
    return rows
if __name__=='__main__':
    res={t:analyze(t) for t in sys.argv[1].split(',')}
    for t,r in res.items(): json.dump(r,open(f'/tmp/heic/results/quality_{t}.json','w'),indent=1)
