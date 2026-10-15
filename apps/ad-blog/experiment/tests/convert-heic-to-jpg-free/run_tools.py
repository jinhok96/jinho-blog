"""HEIC→JPG 변환 도구 실행·시간·최대 메모리 측정 (파일 24개 일괄 변환, 기본 설정)"""
import subprocess, time, os, shutil, glob, json, sys, statistics
HEIC='/tmp/heic/heic'; OUT='/tmp/heic/out'
MAGICK='/tmp/heic/dl/squashfs-root/AppRun'
GIMP='/tmp/heic/dl/gx/squashfs-root/AppRun'
def fresh(d):
    shutil.rmtree(d, ignore_errors=True); os.makedirs(d)
def timed(cmd, env=None):
    t=time.time()
    r=subprocess.run(['/usr/bin/time','-f','%M',*cmd],capture_output=True,text=True,env=env)
    el=time.time()-t
    rss=int(r.stderr.strip().splitlines()[-1])//1024
    if r.returncode: print(r.stderr[-2000:])
    return el,rss
def run_magick(dst):
    return timed([MAGICK,'mogrify','-path',dst,'-format','jpg',*sorted(glob.glob(HEIC+'/*.heic'))])
def run_gimp(dst):
    env=dict(os.environ,SRC=HEIC,DST=dst)
    return timed([GIMP,'gimp-console','-i','-n','--quit','--batch-interpreter','python-fu-eval','-b','exec(open("/tmp/heic/scripts/gimp_batch.py").read())'],env)
def run_gimp_meta(dst):
    env=dict(os.environ,SRC=HEIC,DST=dst)
    return timed([GIMP,'gimp-console','-i','-n','--quit','--batch-interpreter','python-fu-eval','-b','exec(open("/tmp/heic/scripts/gimp_batch_meta.py").read())'],env)
def run_xnc(dst, keep_icc=False, keep_meta=True):
    # 입력 복사본 → XnConvert GUI(Xvfb)에 파일 목록 전달 → Convert 클릭 → 결과 24개가 다 생기면 종료
    ini='/root/.config/xnconvert/xnconvert.ini'; s=open(ini).read()
    s=s.replace('KeepIcc=true','KeepIcc=false') if not keep_icc else s.replace('KeepIcc=false','KeepIcc=true')
    s=s.replace('KeepMeta=true','KeepMeta=false') if not keep_meta else s.replace('KeepMeta=false','KeepMeta=true')
    open(ini,'w').write(s)
    work=dst+'_in'; fresh(work)
    for f in glob.glob(HEIC+'/*.heic'): shutil.copy(f,work)
    env=dict(os.environ,DISPLAY=':99',LANG='C.UTF-8')
    p=subprocess.Popen(['/opt/XnConvert/XnConvert',*sorted(glob.glob(work+'/*.heic'))],env=env,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    win=None
    for _ in range(60):
        time.sleep(0.5)
        r=subprocess.run(['xdotool','search','--onlyvisible','--name','^XnConvert$'],capture_output=True,text=True,env=env)
        if r.stdout.strip(): win=r.stdout.split()[0]; break
    time.sleep(3)
    subprocess.run(['xdotool','windowsize',win,'1400','900','windowmove',win,'0','0'],env=env); time.sleep(2)
    subprocess.run(['xdotool','mousemove','1262','876','click','1'],env=env)
    t=time.time()
    while len(glob.glob(work+'/*_result.jpg'))<24 and time.time()-t<600: time.sleep(0.05)
    # 마지막 파일 쓰기 완료 대기 (크기 안정)
    last=None
    while True:
        sz=sum(os.path.getsize(f) for f in glob.glob(work+'/*_result.jpg'))
        if sz==last: break
        last=sz; time.sleep(0.2)
    el=time.time()-t-0.2
    rss=int([l for l in open('/proc/%d/status'%p.pid) if l.startswith('VmHWM')][0].split()[1])//1024
    subprocess.run(['import','-window','root','/tmp/heic/shots/xnc_done_%s.png'%(('icc' if keep_icc else 'default')+('' if keep_meta else '_nometa'))],env=env)
    p.kill(); p.wait()
    fresh(dst)
    for f in glob.glob(work+'/*_result.jpg'): shutil.move(f, os.path.join(dst, os.path.basename(f).replace('_result','')))
    shutil.rmtree(work)
    return el,rss
TOOLS={'magick':run_magick,'gimp':run_gimp,'gimp_meta':run_gimp_meta,'xnconvert':run_xnc,'xnconvert_icc':lambda d: run_xnc(d,True),'xnconvert_icc_nometa':lambda d: run_xnc(d,True,False)}
res={}
reps=int(sys.argv[2]) if len(sys.argv)>2 else 3
for name in sys.argv[1].split(','):
    runs=[]
    for i in range(reps):
        dst=f'{OUT}/{name}'; fresh(dst)
        el,rss=TOOLS[name](dst)
        n=len(glob.glob(dst+'/*.jpg'))
        runs.append(dict(sec=round(el,2),rss_mb=rss,files=n)); print(name,i,runs[-1],flush=True)
    res[name]=dict(runs=runs,median_sec=statistics.median(r['sec'] for r in runs),max_rss_mb=max(r['rss_mb'] for r in runs))
os.makedirs('/tmp/heic/results',exist_ok=True)
for k,v in res.items(): json.dump(v,open(f'/tmp/heic/results/timing_{k}.json','w'),indent=1)
