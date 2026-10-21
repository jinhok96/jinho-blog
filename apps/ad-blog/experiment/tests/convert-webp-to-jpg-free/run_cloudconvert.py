# CloudConvert WEBP to JPG 웹 화면을 Chromium으로 조작: 파일 1개씩 Select File → Convert → Download (기본 옵션)
import glob, os, sys
from playwright.sync_api import sync_playwright
UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
files=sys.argv[1:] or sorted(glob.glob('/tmp/w/set/*.webp'))
os.makedirs('/tmp/w/out/cloudconvert',exist_ok=True)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args=['--no-sandbox'])
    for img in files:
        name=os.path.basename(img)[:-5]
        ctx=b.new_context(viewport={'width':1366,'height':900}, user_agent=UA, locale='en-US', accept_downloads=True)
        pg=ctx.new_page()
        try:
            pg.goto('https://cloudconvert.com/webp-to-jpg', wait_until='domcontentloaded'); pg.wait_for_timeout(4000)
            pg.set_input_files('input[type=file]', img); pg.wait_for_timeout(3000)
            if name=='logo': pg.screenshot(path='/tmp/w/probe/cc_before.png', timeout=60000)
            pg.get_by_role('button', name='Convert').last.click()
            dlb=pg.get_by_role('link', name='Download').first
            dlb.wait_for(timeout=180000); pg.wait_for_timeout(1000)
            if name=='logo': pg.screenshot(path='/tmp/w/probe/cc_after.png', timeout=60000)
            with pg.expect_download(timeout=60000) as dl: dlb.click()
            dl.value.save_as(f'/tmp/w/out/cloudconvert/{name}__'+dl.value.suggested_filename); print(name,'ok',dl.value.suggested_filename,flush=True)
        except Exception as e:
            print(name,'FAIL',str(e)[:300],flush=True)
            try: pg.screenshot(path=f'/tmp/w/probe/ccfail_{name}.png', timeout=30000)
            except Exception: pass
        ctx.close()
    b.close()
