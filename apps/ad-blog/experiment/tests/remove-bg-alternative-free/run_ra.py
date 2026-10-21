import glob, os, time
from playwright.sync_api import sync_playwright
os.makedirs('out/removalai', exist_ok=True)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args=['--no-sandbox'])
    for img in sorted(glob.glob('in/*.jpg')):
        name=os.path.basename(img)[:-4]; dst=f'out/removalai/{name}.png'
        if os.path.exists(dst): continue
        ctx=b.new_context(viewport={'width':1366,'height':900}, user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', locale='en-US', accept_downloads=True)
        pg=ctx.new_page()
        try:
            pg.goto('https://removal.ai/upload/', wait_until='domcontentloaded', timeout=60000); pg.wait_for_timeout(4000)
            t0=time.time()
            pg.query_selector('input[type=file]').set_input_files(img)
            btn=pg.locator('text=/^\\s*Download\\s*$/').locator('visible=true').first
            btn.wait_for(timeout=90000); pg.wait_for_timeout(1500)
            with pg.expect_download(timeout=60000) as dl:
                btn.click()
            dl.value.save_as(dst); print(name,'ok',round(time.time()-t0,1),dl.value.suggested_filename, flush=True)
        except Exception as e:
            print(name,'FAIL',str(e)[:200], flush=True); pg.screenshot(path=f'probe/rafail_{name}.png')
        ctx.close()
    b.close()
