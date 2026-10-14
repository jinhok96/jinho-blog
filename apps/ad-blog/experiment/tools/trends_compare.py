"""Google Trends 키워드 상대 검색량·관련 검색어 (ToolProof 운영 실험용)

표준 라이브러리만 사용한다. Trends API는 쿠키 없이 부르면 429가 나지만, 홈(`/trends/?geo=US`)에서
`NID` 쿠키를 먼저 받으면 explore → widgetdata 순서로 호출할 수 있다 (2026-10-14 확인).

실행:
  python3 -I apps/ad-blog/experiment/tools/trends_compare.py "gemini skills" "gemini gems" "remove background"
  python3 -I apps/ad-blog/experiment/tools/trends_compare.py --time "now 7-d" --related "키워드" ...
  python3 -I apps/ad-blog/experiment/tools/trends_compare.py --property youtube --cat 5 "키워드" ...
  python3 -I apps/ad-blog/experiment/tools/trends_compare.py --suggest "gemini"   # 주제(엔티티) ID 찾기

옵션 (pytrends 4.9.2의 build_payload·related_topics·suggestions에서 가져옴):
- `--property`: web(기본)·youtube·news·images·froogle(쇼핑) 검색 기준
- `--cat`: 카테고리 ID로 뜻 좁히기 (예: "gemini" 별자리 제외). 5 Computers & Electronics(32 Software, 314 Computer Security),
  13 Internet & Telecom(1142 Web Apps & Online Tools). 전체 목록은 `/trends/api/explore/pickers/category`
- 키워드 대신 주제 ID(`/g/…`, `/m/…`)를 넣으면 철자·표현이 달라도 같은 대상을 묶어 셈. ID는 `--suggest`로 찾음
- `--related`: 키워드마다 관련 검색어(상위·급상승). 키워드가 1개면 관련 주제도 출력 (여러 개면 Google이 주지 않음, 2026-10-14 시험에서는 늘 비어 있었음)

- 한 번에 최대 5개. 값은 요청 안에서 가장 높은 지점을 100으로 둔 상대값이라 절대 검색량이 아니다
- 요청끼리 비교하려면 같은 기준 키워드(예: 이미 발행한 글의 주 검색어)를 매번 함께 넣는다
- 검색량이 아주 작은 키워드는 0으로 나온다 (Trends 표본 하한)
- 관련 검색어·주제는 가끔 429가 나면 건너뛴다
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


def suggest(op, word: str) -> int:
    url = f'{BASE}/api/autocomplete/{urllib.parse.quote(word)}?hl=en-US&tz=0'
    topics = json.loads(op.open(url, timeout=TIMEOUT).read().decode().split('\n', 1)[1])['default']['topics']
    print(f'## "{word}" 주제(엔티티) 후보\n')
    print('| 주제 ID | 이름 | 종류 |')
    print('| --- | --- | --- |')
    for t in topics:
        print(f"| `{t['mid']}` | {t['title']} | {t['type']} |")
    return 0


def ranked(op, widget: dict, label: str, fmt) -> None:
    """관련 검색어·주제 위젯(상위·급상승) 출력. 실패해도 나머지는 계속."""
    try:
        lists = get_json(op, 'widgetdata/relatedsearches', widget['request'], widget['token'])['default']['rankedList']
    except Exception as e:  # 관련 데이터는 간헐적으로 429
        print(f'\n{label} 실패: {e}', file=sys.stderr)
        return
    if not lists:
        print(f'\n**{label}**: 없음')
    for title, lst in zip(['상위', '급상승'], lists):
        rows = ', '.join(fmt(k) for k in lst['rankedKeyword'][:10])
        print(f'\n**{label} {title}**: {rows or "없음"}')


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('keywords', nargs='*')
    ap.add_argument('--time', default='today 3-m', help='today 3-m, today 12-m, now 7-d 등')
    ap.add_argument('--geo', default='US')
    ap.add_argument('--property', default='web', choices=['web', 'youtube', 'news', 'images', 'froogle'])
    ap.add_argument('--cat', type=int, default=0, help='카테고리 ID (0 = 전체)')
    ap.add_argument('--related', action='store_true', help='관련 검색어(키워드 1개면 관련 주제도) 출력')
    ap.add_argument('--suggest', metavar='WORD', help='주제(엔티티) ID 후보만 출력')
    args = ap.parse_args()

    op = opener()
    if args.suggest:
        return suggest(op, args.suggest)
    if not 1 <= len(args.keywords) <= 5:
        ap.error('키워드는 1~5개')

    items = [{'keyword': k, 'geo': args.geo, 'time': args.time} for k in args.keywords]
    prop = '' if args.property == 'web' else args.property
    widgets = get_json(op, 'explore', {'comparisonItem': items, 'category': args.cat, 'property': prop})['widgets']
    ts = next(w for w in widgets if w['id'] == 'TIMESERIES')
    timeline = get_json(op, 'widgetdata/multiline', ts['request'], ts['token'])['default']['timelineData']

    print(f'## Google Trends 상대 검색량 ({args.geo}, {args.property}, 카테고리 {args.cat}, {args.time}, {len(timeline)}개 지점)\n')
    print('| 키워드 | 평균 | 최고 | 최근 7개 지점 평균 |')
    print('| --- | --- | --- | --- |')
    for i, k in enumerate(args.keywords):
        v = [t['value'][i] for t in timeline]
        print(f'| {k} | {sum(v) / len(v):.1f} | {max(v)} | {sum(v[-7:]) / 7:.1f} |')

    if args.related:
        # 키워드가 1개면 위젯 ID가 RELATED_QUERIES, 여러 개면 RELATED_QUERIES_{순번}
        queries = [w for w in widgets if w['id'].startswith('RELATED_QUERIES')]
        for k, w in zip(args.keywords, queries):
            ranked(op, w, f'{k} 관련 검색어', lambda x: f"{x['query']} ({x['formattedValue']})")
        for w in (w for w in widgets if w['id'].startswith('RELATED_TOPICS')):
            ranked(op, w, f'{args.keywords[0]} 관련 주제', lambda x: f"{x['topic']['title']} [{x['topic']['type']}] ({x['formattedValue']})")
    return 0


if __name__ == '__main__':
    sys.exit(main())
