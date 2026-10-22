# WebP 테스트 세트: 사진 6장(손실 WebP q80, 1600px), 투명 3장(무손실 WebP, 알파), 애니메이션 1개(12프레임)
import subprocess, os
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
os.chdir('/tmp/w'); os.makedirs('set',exist_ok=True); os.makedirs('ref',exist_ok=True)
F='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
for i,n in enumerate(['01','02','03','04','05','06'],1):
    im=ImageOps.exif_transpose(Image.open(f'orig/{n}.jpg')).convert('RGB')
    im=ImageOps.fit(im,(1600,1067),Image.LANCZOS)
    im.save(f'ref/photo{i}.png')
    subprocess.run(['cwebp','-quiet','-q','80','-metadata','none',f'ref/photo{i}.png','-o',f'set/photo{i}.webp'],check=True)
# 투명 1: 검은 글자 로고 (투명 배경)
im=Image.new('RGBA',(1200,600),(0,0,0,0)); d=ImageDraw.Draw(im)
d.rounded_rectangle((60,60,300,300),40,fill=(20,20,20,255))
d.text((340,110),'ToolProof',font=ImageFont.truetype(F,150),fill=(15,15,15,255))
d.text((345,320),'black text on transparent',font=ImageFont.truetype(F,48),fill=(60,60,60,255))
im.save('ref/logo.png'); subprocess.run(['cwebp','-quiet','-lossless','-exact','ref/logo.png','-o','set/logo.webp'],check=True)
# 투명 2: 흰 글자 스티커 (투명 배경)
im=Image.new('RGBA',(1000,1000),(0,0,0,0)); d=ImageDraw.Draw(im)
d.ellipse((100,100,900,900),outline=(255,255,255,255),width=40)
d.text((235,420),'SALE',font=ImageFont.truetype(F,200),fill=(255,255,255,255))
im.save('ref/sticker.png'); subprocess.run(['cwebp','-quiet','-lossless','-exact','ref/sticker.png','-o','set/sticker.webp'],check=True)
# 투명 3: 사진 잘라내기(부드러운 가장자리)
ph=ImageOps.fit(Image.open('orig/04.jpg').convert('RGB'),(1200,1200),Image.LANCZOS)
m=Image.new('L',ph.size,0); ImageDraw.Draw(m).ellipse((150,150,1050,1050),fill=255); m=m.filter(ImageFilter.GaussianBlur(25))
ph.putalpha(m); ph.save('ref/cutout.png')
subprocess.run(['cwebp','-quiet','-q','85','-alpha_q','100','ref/cutout.png','-o','set/cutout.webp'],check=True)
# 애니메이션: 12프레임, 프레임 번호 표시
frames=[]
for k in range(12):
    f=Image.new('RGB',(800,450),(240,244,250)); d=ImageDraw.Draw(f)
    x=60+k*55; d.ellipse((x,150,x+150,300),fill=(37,99,235))
    d.text((30,20),f'frame {k+1}/12',font=ImageFont.truetype(F,48),fill=(17,24,39))
    frames.append(f); f.save(f'ref/anim_{k+1:02d}.png')
frames[0].save('set/animated.webp',save_all=True,append_images=frames[1:],duration=150,loop=0,quality=85)
for f in sorted(os.listdir('set')): print(f, os.path.getsize('set/'+f))
