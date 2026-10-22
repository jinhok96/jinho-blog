"""웹 도구 실행: Chromium(Playwright)으로 사진을 올려 메타데이터 제거 → 결과 내려받기, 사진이 서버로 전송됐는지 기록

사용: /tmp/gsc/bin/python -I run_web.py {사이트} [사진 번호 …]
- 결과: /tmp/meta/res/{사이트}/{nn}.jpg, 네트워크 기록: /tmp/meta/net/{사이트}.json
- 업로드 판정: 브라우저가 보낸 요청의 Content-Length(CDP) 중 올린 사진 크기의 50% 이상인 요청이 있으면 서버로 보낸 것으로 봄
- 계정 없이, 각 사이트 기본 설정 그대로. 웹 폰트 요청만 막음(스크린샷 시간 초과 방지)
"""
import json, os, sys, zipfile, io, shutil
from playwright.sync_api import sync_playwright

SET = '/tmp/meta/set'
CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'


def save_download(dl, dst):
    tmp = dst + '.part'
    dl.save_as(tmp)
    data = open(tmp, 'rb').read()
    if data[:2] == b'PK':
        z = zipfile.ZipFile(io.BytesIO(data))
        names = [n for n in z.namelist() if not n.endswith('/')]
        open(dst, 'wb').write(z.read(names[0]))
    else:
        shutil.move(tmp, dst)
    if os.path.exists(tmp):
        os.remove(tmp)


def exifremove(pg, f, dst):
    pg.goto('https://exifremove.com/', timeout=60000)
    pg.set_input_files('input[type=file]', f)
    pg.wait_for_timeout(1500)
    pg.get_by_role('button', name='REMOVE METADATA').click()
    pg.wait_for_timeout(4000)
    with pg.expect_download(timeout=60000) as d:
        pg.get_by_text('Download cleaned JPEG', exact=False).first.click()
    save_download(d.value, dst)


def jimpl(pg, f, dst):
    pg.goto('https://jimpl.com/', timeout=60000)
    pg.set_input_files('input[type=file]', f)
    pg.wait_for_url('**/results/**', timeout=90000)
    pg.wait_for_timeout(2000)
    with pg.expect_download(timeout=180000) as d:
        pg.get_by_text('REMOVE METADATA', exact=False).first.click()
    save_download(d.value, dst)


def verexif(pg, f, dst):
    # Remove Exif를 누르면 결과 JPG가 바로 내려받아짐 (페이지 이동 없음)
    pg.goto('https://www.verexif.com/en/', timeout=60000)
    pg.set_input_files('input[type=file]', f)
    with pg.expect_download(timeout=120000) as d:
        pg.get_by_text('Remove Exif', exact=True).first.click()
    save_download(d.value, dst)


def imgonline(pg, f, dst):
    pg.goto('https://www.imgonline.com.ua/eng/delete-exif.php', timeout=60000)
    pg.set_input_files('input[type=file]', f)
    pg.locator('input[type=submit]').first.click()
    pg.wait_for_load_state('load', timeout=90000)
    pg.wait_for_timeout(2000)
    pg.screenshot(path=f'/tmp/meta/probe/imgonline_result_{os.path.basename(f)}.png', full_page=True)
    with pg.expect_download(timeout=90000) as d:
        pg.get_by_text('Download processed image', exact=False).first.click()
    save_download(d.value, dst)


SITES = {'exifremove': exifremove, 'jimpl': jimpl, 'verexif': verexif, 'imgonline': imgonline}


def main():
    site = sys.argv[1]
    nums = sys.argv[2:] or ['01', '03', '05', '06']
    os.makedirs(f'/tmp/meta/res/{site}', exist_ok=True)
    os.makedirs('/tmp/meta/net', exist_ok=True)
    log = {}
    with sync_playwright() as p:
        b = p.chromium.launch(executable_path=CHROME)
        for n in nums:
            f = os.path.join(SET, n + '.jpg')
            size = os.path.getsize(f)
            ctx = b.new_context(viewport={'width': 1280, 'height': 900}, accept_downloads=True)
            pg = ctx.new_page()
            pg.route('**/*', lambda r: r.abort() if r.request.resource_type == 'font' else r.continue_())
            reqs = []

            # multipart 업로드는 Playwright에서 본문이 비어 보임 → CDP로 실제 전송 헤더의 Content-Length를 읽음
            cdp = ctx.new_cdp_session(pg)
            cdp.send('Network.enable')

            def on_extra(e):
                h = {k.lower(): v for k, v in e['headers'].items()}
                cl = h.get('content-length', '')
                if cl.isdigit() and int(cl) > 0:
                    reqs.append({'host': h.get(':authority', ''), 'path': h.get(':path', '')[:60], 'bytes': int(cl)})
            cdp.on('Network.requestWillBeSentExtraInfo', on_extra)
            try:
                SITES[site](pg, f, f'/tmp/meta/res/{site}/{n}.jpg')
                ok = True
            except Exception as e:
                ok = False
                print(n, 'FAIL', str(e)[:300])
                pg.screenshot(path=f'/tmp/meta/probe/{site}_fail_{n}.png', full_page=True)
            big = [r for r in reqs if r['bytes'] >= size * 0.5]
            log[n] = {'ok': ok, 'file_bytes': size, 'uploaded': bool(big), 'upload_requests': big}
            print(n, 'ok' if ok else 'fail', 'uploaded' if big else 'no-upload', big[:2])
            ctx.close()
        b.close()
    json.dump(log, open(f'/tmp/meta/net/{site}.json', 'w'), indent=1)


if __name__ == '__main__':
    main()
