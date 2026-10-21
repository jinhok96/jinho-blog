import glob, os, time
from playwright.sync_api import sync_playwright
os.makedirs('out/iloveimg', exist_ok=True)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args=['--no-sandbox'])
    for img in sorted(glob.glob('in/*.jpg')):
        name=os.path.basename(img)[:-4]; dst=f'out/iloveimg/{name}.png'
        if os.path.exists(dst): continue
        ctx=b.new_context(viewport={'width':1366,'height':900}, user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', locale='en-US', accept_downloads=True)
        pg=ctx.new_page()
        try:
            pg.goto('https://www.iloveimg.com/remove-background', wait_until='domcontentloaded'); pg.wait_for_timeout(3000)
            t0=time.time()
            pg.set_input_files('input[type=file]', img); pg.wait_for_selector('#processTask', state='visible', timeout=30000); pg.wait_for_timeout(1500)
            pg.click('#processTask')
            pg.get_by_text('Download file').first.wait_for(timeout=120000)
            with pg.expect_download(timeout=60000) as dl:
                pg.get_by_text('Download file').first.click()
            dl.value.save_as(dst); print(name,'ok',round(time.time()-t0,1), dl.value.suggested_filename, flush=True)
        except Exception as e:
            print(name,'FAIL',str(e)[:200], flush=True); pg.screenshot(path=f'probe/ilfail_{name}.png')
        ctx.close()
    b.close()
