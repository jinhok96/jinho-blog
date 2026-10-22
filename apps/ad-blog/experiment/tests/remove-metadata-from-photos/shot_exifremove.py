from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome')
    pg=b.new_page(viewport={'width':1280,'height':900}, device_scale_factor=1)
    pg.route('**/*', lambda r: r.abort() if r.request.resource_type=='font' else r.continue_())
    pg.goto('https://exifremove.com/'); pg.set_input_files('input[type=file]',['/tmp/meta/set/01.jpg','/tmp/meta/set/03.jpg'])
    pg.wait_for_timeout(1500); pg.get_by_role('button', name='REMOVE METADATA').click(); pg.wait_for_timeout(5000)
    pg.screenshot(path='/tmp/meta/shots/exifremove_done.png', full_page=True)
    b.close()
