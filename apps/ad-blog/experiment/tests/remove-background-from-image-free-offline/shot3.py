import asyncio, time
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/opt/pw-browsers/chromium-1194/chrome-linux/chrome')
        pg = await b.new_page(viewport={'width': 1280, 'height': 1240})
        await pg.goto('http://127.0.0.1:7000/', wait_until='networkidle')
        await pg.screenshot(path='ui-empty.png')
        await pg.set_input_files('input[type=file]', 'ex/cut/chelsea.png')
        await pg.wait_for_timeout(1500)
        await pg.get_by_label('Models').click(); await pg.wait_for_timeout(500)
        await pg.get_by_role('option', name='isnet-general-use', exact=True).click()
        await pg.wait_for_timeout(500)
        t = time.time()
        await pg.get_by_role('button', name='Submit').click()
        await pg.locator('.image-container img, [data-testid="image"] img').nth(1).wait_for(timeout=120000)
        print('sec', round(time.time() - t, 1))
        await pg.wait_for_timeout(1500)
        await pg.evaluate('window.scrollTo(0,0)')
        await pg.screenshot(path='ui-result.png')
        await b.close()
asyncio.run(main())
