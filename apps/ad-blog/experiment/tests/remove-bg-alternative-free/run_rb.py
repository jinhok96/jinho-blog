import sys, glob, os, time
from playwright.sync_api import sync_playwright
os.makedirs('out/removebg', exist_ok=True)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args=['--no-sandbox'])
    for img in sorted(glob.glob('in/*.jpg')):
        name=os.path.basename(img)[:-4]; dst=f'out/removebg/{name}.png'
        if os.path.exists(dst): continue
        ctx=b.new_context(viewport={'width':1366,'height':900}, user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36', locale='en-US', accept_downloads=True)
        pg=ctx.new_page()
        try:
            pg.goto('https://www.remove.bg/upload', wait_until='domcontentloaded'); pg.wait_for_timeout(3000)
            t0=time.time()
            with pg.expect_file_chooser() as fc:
                pg.get_by_text('Upload Image', exact=True).first.click()
            fc.value.set_files(img)
            pg.get_by_role('button', name='Download').first.wait_for(timeout=90000); pg.wait_for_timeout(2500)
            pg.get_by_role('button', name='Download').first.click(); pg.wait_for_timeout(1000)
            with pg.expect_download(timeout=60000) as dl:
                pg.get_by_text('Preview', exact=True).first.click()
            dl.value.save_as(dst); print(name, 'ok', round(time.time()-t0,1), flush=True)
        except Exception as e:
            print(name, 'FAIL', str(e)[:200], flush=True); pg.screenshot(path=f'probe/rbfail_{name}.png')
        ctx.close()
    b.close()
