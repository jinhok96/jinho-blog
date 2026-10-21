# iLoveIMG Convert to JPG 웹 화면을 Chromium으로 조작: 파일 1개씩 업로드 → Convert → Download
import glob, os, time, sys
from playwright.sync_api import sync_playwright
UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
files=sys.argv[1:] or sorted(glob.glob('/tmp/w/set/*.webp'))
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args=['--no-sandbox'])
    for img in files:
        name=os.path.basename(img)[:-5]
        ctx=b.new_context(viewport={'width':1366,'height':900}, user_agent=UA, locale='en-US', accept_downloads=True)
        pg=ctx.new_page()
        try:
            pg.goto('https://www.iloveimg.com/convert-to-jpg', wait_until='domcontentloaded'); pg.wait_for_timeout(3000)
            pg.set_input_files('input[type=file]', img); pg.wait_for_selector('#processTask', state='visible', timeout=30000); pg.wait_for_timeout(2000)
            if name in ('animated','logo'): pg.screenshot(path=f'/tmp/w/probe/il_{name}_before.png')
            pg.click('#processTask')
            pg.get_by_text('Download').first.wait_for(timeout=120000); pg.wait_for_timeout(1500)
            if name=='animated': pg.screenshot(path='/tmp/w/probe/il_animated_after.png')
            with pg.expect_download(timeout=60000) as dl:
                pg.locator('#pickfiles, a.downloader__btn, #download').first.click()
            dst=f'/tmp/w/out/iloveimg/{name}_'+dl.value.suggested_filename
            dl.value.save_as(dst); print(name,'ok',dl.value.suggested_filename, flush=True)
        except Exception as e:
            print(name,'FAIL',str(e)[:300], flush=True); pg.screenshot(path=f'/tmp/w/probe/ilfail_{name}.png')
        ctx.close()
    b.close()
