from playwright.sync_api import sync_playwright
UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args=['--no-sandbox'])
    pg=b.new_page(viewport={'width':1366,'height':900}, user_agent=UA, locale='en-US')
    pg.goto('https://cloudconvert.com/webp-to-jpg', wait_until='domcontentloaded'); pg.wait_for_timeout(4000)
    pg.set_input_files('input[type=file]', '/tmp/w/set/sticker.webp'); pg.wait_for_timeout(3000)
    pg.get_by_role('button', name='Options').first.click(); pg.wait_for_timeout(2500)
    pg.screenshot(path='/tmp/w/probe/cc_options.png', timeout=60000)
    open('/tmp/w/probe/cc_options.txt','w').write(pg.inner_text('body'))
    pg2=b.new_page(viewport={'width':1366,'height':900}, user_agent=UA, locale='en-US')
    pg2.route('**/*.{woff,woff2,ttf}', lambda r: r.abort())
    pg2.goto('https://ezgif.com/webp-to-jpg', wait_until='domcontentloaded'); pg2.wait_for_timeout(2000)
    pg2.set_input_files('input[type=file]', '/tmp/w/set/sticker.webp')
    pg2.locator('input[type=submit], button[type=submit]').first.click(); pg2.wait_for_load_state('domcontentloaded'); pg2.wait_for_timeout(3000)
    pg2.locator('input[type=submit][value*="JPG" i]').first.click(); pg2.wait_for_timeout(6000)
    pg2.screenshot(path='/tmp/w/probe/ez_page.png', full_page=True, timeout=60000)
    b.close()
