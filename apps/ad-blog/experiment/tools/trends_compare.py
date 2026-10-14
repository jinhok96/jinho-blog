"""Google Trends 키워드 상대 검색량·관련 검색어 (ToolProof 운영 실험용)

표준 라이브러리만 사용한다. Trends API는 쿠키 없이 부르면 429가 나지만, 홈(`/trends/?geo=US`)에서
`NID` 쿠키를 먼저 받으면 explore → widgetdata 순서로 호출할 수 있다 (2026-10-14 확인).

실행:
  python3 -I apps/ad-blog/experiment/tools/trends_compare.py "gemini skills" "gemini gems" "remove background"
  python3 -I apps/ad-blog/experiment/tools/trends_compare.py --time "now 7-d" --related "키워드" ...

- 한 번에 최대 5개. 값은 요청 안에서 가장 높은 지점을 100으로 둔 상대값이라 절대 검색량이 아니다
- 요청끼리 비교하려면 같은 기준 키워드(예: 이미 발행한 글의 주 검색어)를 매번 함께 넣는다
- 검색량이 아주 작은 키워드는 0으로 나온다 (Trends 표본 하한)
- `--related`: 첫 키워드의 관련 검색어(상위·급상승). 가끔 429가 나면 건너뛴다
"""

import argparse
import http.cookiejar
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'
BASE = 'https://trends.google.com/trends'
TIMEOUT = 20
RETRY_WAIT = [15, 45, 90]  # 429(요청 과다) 재시도 대기(초)


def opener() -> urllib.request.OpenerDirector:
    op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
    op.addheaders = [('User-Agent', UA), ('Accept-Language', 'en-US')]
    op.open(f'{BASE}/?geo=US', timeout=TIMEOUT).read()  # NID 쿠키 받기 (없으면 429)
    return op


def get_json(op, path: str, req: dict, token: str | None = None) -> dict:
    url = f'{BASE}/api/{path}?hl=en-US&tz=0&req={urllib.parse.quote(json.dumps(req))}'
    if token:
        url += f'&token={token}'
    for wait in [*RETRY_WAIT, None]:
        try:
            text = op.open(url, timeout=TIMEOUT).read().decode()
            break
        except urllib.error.HTTPError as e:
            if e.code != 429 or wait is None:
                raise
            print(f'429 → {wait}초 후 재시도', file=sys.stderr)
            time.sleep(wait)
    return json.loads(text.split('\n', 1)[1])  # XSSI 방지 접두사 `)]}'` 줄 제거


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('keywords', nargs='+')
    ap.add_argument('--time', default='today 3-m', help='today 3-m, today 12-m, now 7-d 등')
    ap.add_argument('--geo', default='US')
    ap.add_argument('--related', action='store_true', help='첫 키워드의 관련 검색어도 출력')
    args = ap.parse_args()
    if len(args.keywords) > 5:
        ap.error('키워드는 최대 5개')

    op = opener()
    items = [{'keyword': k, 'geo': args.geo, 'time': args.time} for k in args.keywords]
    widgets = get_json(op, 'explore', {'comparisonItem': items, 'category': 0, 'property': ''})['widgets']
    ts = next(w for w in widgets if w['id'] == 'TIMESERIES')
    timeline = get_json(op, 'widgetdata/multiline', ts['request'], ts['token'])['default']['timelineData']

    print(f'## Google Trends 상대 검색량 ({args.geo}, {args.time}, {len(timeline)}개 지점)\n')
    print('| 키워드 | 평균 | 최고 | 최근 7개 지점 평균 |')
    print('| --- | --- | --- | --- |')
    for i, k in enumerate(args.keywords):
        v = [t['value'][i] for t in timeline]
        print(f'| {k} | {sum(v) / len(v):.1f} | {max(v)} | {sum(v[-7:]) / 7:.1f} |')

    if args.related:
        rq = next((w for w in widgets if w['id'].startswith('RELATED_QUERIES')), None)
        try:
            ranked = get_json(op, 'widgetdata/relatedsearches', rq['request'], rq['token'])['default']['rankedList']
        except Exception as e:  # 관련 검색어는 간헐적으로 429
            print(f'\n관련 검색어 실패: {e}', file=sys.stderr)
            return 0
        for title, lst in zip(['상위', '급상승'], ranked):
            rows = ', '.join(f"{k['query']} ({k['formattedValue']})" for k in lst['rankedKeyword'][:10])
            print(f'\n**{args.keywords[0]} 관련 검색어 {title}**: {rows or "없음"}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
