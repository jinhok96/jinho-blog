# ezgif WebP to JPG 웹 화면을 Chromium으로 조작: Upload → Convert to JPG(기본 옵션) → 결과 이미지 저장
import glob, os, sys
from playwright.sync_api import sync_playwright
UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
files=sys.argv[1:] or sorted(glob.glob('/tmp/w/set/*.webp'))
os.makedirs('/tmp/w/out/ezgif',exist_ok=True)
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args=['--no-sandbox'])
    for img in files:
        name=os.path.basename(img)[:-5]
        ctx=b.new_context(viewport={'width':1366,'height':900}, user_agent=UA, locale='en-US', accept_downloads=True)
        pg=ctx.new_page()
        try:
            pg.goto('https://ezgif.com/webp-to-jpg', wait_until='domcontentloaded'); pg.wait_for_timeout(2000)
            pg.set_input_files('input[type=file]', img)
            pg.locator('input[type=submit], button[type=submit]').first.click(); pg.wait_for_load_state('domcontentloaded'); pg.wait_for_timeout(3000)
            if name in ('logo','animated'): open(f'/tmp/w/probe/ez_{name}_form.txt','w').write(str(pg.eval_on_selector_all('form input, form select', 'els=>els.map(e=>[e.name,e.type,e.value,e.checked])')))
            pg.locator('input[type=submit][value*="JPG" i], button:has-text("Convert")').first.click(); pg.wait_for_timeout(6000)
            if name in ('logo','animated'): open(f'/tmp/w/probe/ez_{name}_out.txt','w').write(pg.inner_text('body'))
            link=pg.locator('#output a.save').first
            with pg.expect_download(timeout=60000) as dl: link.click()
            dl.value.save_as(f'/tmp/w/out/ezgif/{name}__'+dl.value.suggested_filename)
            print(name,'ok',flush=True)
        except Exception as e:
            print(name,'FAIL',str(e)[:300],flush=True)
            open(f'/tmp/w/probe/ezfail_{name}.txt','w').write(pg.inner_text('body') if pg else '')
        ctx.close()
    b.close()
