import glob, os, time
from playwright.sync_api import sync_playwright
os.makedirs('out/pixlr', exist_ok=True)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args=['--no-sandbox'])
    ctx=b.new_context(viewport={'width':1366,'height':900}, user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', locale='en-US', accept_downloads=True)
    for img in sorted(glob.glob('in/*.jpg')):
        name=os.path.basename(img)[:-4]; dst=f'out/pixlr/{name}.png'
        if os.path.exists(dst): continue
        pg=ctx.new_page()
        try:
            pg.goto('https://pixlr.com/remove-background/', wait_until='domcontentloaded'); pg.wait_for_timeout(5000)
            try: pg.get_by_text('Reject', exact=True).first.click(timeout=1500)
            except Exception: pass
            pg.keyboard.press('Escape'); pg.wait_for_timeout(800)
            t0=time.time()
            with pg.expect_file_chooser() as fc:
                pg.get_by_text('Browse', exact=True).first.click()
            fc.value.set_files(img)
            pg.get_by_text('Save', exact=True).first.wait_for(state='attached', timeout=90000); pg.wait_for_timeout(2000)
            pg.hover('text=Fine tune') if False else None
            with pg.expect_download(timeout=60000) as dl:
                pg.get_by_text('Save', exact=True).first.click(force=True)
            dl.value.save_as(dst); print(name,'ok',round(time.time()-t0,1),dl.value.suggested_filename, flush=True)
        except Exception as e:
            print(name,'FAIL',str(e)[:200], flush=True); pg.screenshot(path=f'probe/pxfail_{name}.png')
        pg.close()
    b.close()
