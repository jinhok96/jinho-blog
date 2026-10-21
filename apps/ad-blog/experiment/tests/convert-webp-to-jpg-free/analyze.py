# 변환 결과 분석: 사진 크기·화질(SSIM·PSNR, 디코딩한 WebP 기준), 투명 영역 처리, 애니메이션 프레임
import glob, os, json, subprocess
import numpy as np
from PIL import Image
from skimage.metrics import structural_similarity as ssim, peak_signal_noise_ratio as psnr
W='/tmp/w'; TOOLS=['xnconvert','gimp','iloveimg','cloudconvert','ezgif']
def q(f):
    r=subprocess.run(['identify','-format','%Q',f],capture_output=True,text=True); return int(r.stdout or 0)
res={}
for t in TOOLS:
    d={'photos':{}, 'transparent':{}}
    for i in range(1,7):
        f=f'{W}/out/{t}/photo{i}.jpg'
        if not os.path.exists(f): continue
        src=np.asarray(Image.open(f'{W}/set/photo{i}.webp').convert('RGB')); out=np.asarray(Image.open(f).convert('RGB'))
        d['photos'][i]=dict(kb=round(os.path.getsize(f)/1024,1), webp_kb=round(os.path.getsize(f'{W}/set/photo{i}.webp')/1024,1),
            size=list(out.shape[1::-1]), quality=q(f), ssim=round(float(ssim(src,out,channel_axis=2)),4), psnr=round(float(psnr(src,out)),2))
    for n in ['logo','sticker','cutout']:
        f=f'{W}/out/{t}/{n}.jpg'
        if not os.path.exists(f): continue
        rgba=np.asarray(Image.open(f'{W}/set/{n}.webp').convert('RGBA')).astype(float)
        out=np.asarray(Image.open(f).convert('RGB')).astype(float)
        a=rgba[...,3:]/255
        on_white=rgba[...,:3]*a+255*(1-a)
        transp=rgba[...,3]==0; opaque=rgba[...,3]==255
        bg=out[transp].mean(0)
        # 보이는 정도: 불투명 부분과 투명(배경) 부분의 평균 밝기 차
        lum=lambda x: x@np.array([0.2126,0.7152,0.0722])
        contrast=abs(lum(out[opaque]).mean()-lum(out[transp]).mean())
        d['transparent'][n]=dict(bg_rgb=[round(x) for x in bg], fg_bg_luma_diff=round(float(contrast),1),
            mae_vs_white_composite=round(float(np.abs(out-on_white).mean()),2), mode=Image.open(f).mode)
    res[t]=d
# 애니메이션: 결과 JPG(또는 프레임 묶음)가 원본 몇 번째 프레임과 같은지
refs=[np.asarray(Image.open(f'{W}/ref/anim_{k:02d}.png').convert('RGB')).astype(float) for k in range(1,13)]
def which(f):
    o=np.asarray(Image.open(f).convert('RGB')).astype(float); e=[np.abs(o-r).mean() for r in refs]; return int(np.argmin(e))+1, round(min(e),2)
anim={}
for t in TOOLS:
    fs=sorted(glob.glob(f'{W}/out/{t}/anim/*.jpg'))
    if fs: anim[t]=dict(files=len(fs), full_size=sum(Image.open(f).size==(800,450) for f in fs), partial=[os.path.basename(f) for f in fs if Image.open(f).size!=(800,450)])
    elif os.path.exists(f'{W}/out/{t}/animated.jpg'): anim[t]=dict(files=1, frames=[which(f'{W}/out/{t}/animated.jpg')])
    else: anim[t]=dict(files=0)
summary={'tools':res,'animated':anim}
for t in TOOLS:
    ph=res[t]['photos']
    if ph:
        summary.setdefault('photo_summary',{})[t]=dict(n=len(ph), median_ssim=float(np.median([v['ssim'] for v in ph.values()])), median_psnr=float(np.median([v['psnr'] for v in ph.values()])),
            total_jpg_kb=round(sum(v['kb'] for v in ph.values()),1), total_webp_kb=round(sum(v['webp_kb'] for v in ph.values()),1),
            size_ratio=round(sum(v['kb'] for v in ph.values())/sum(v['webp_kb'] for v in ph.values()),2), quality=sorted({v['quality'] for v in ph.values()}),
            same_dims=all(v['size']==[1600,1067] for v in ph.values()))
json.dump(summary,open(f'{W}/summary.json','w'),indent=1)
print(json.dumps(summary.get('photo_summary'),indent=1)); print(json.dumps({t:res[t]['transparent'] for t in TOOLS},indent=0)); print(anim)
