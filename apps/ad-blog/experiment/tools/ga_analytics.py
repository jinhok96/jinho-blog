"""GA4 참여 시간·스크롤 (ToolProof 운영 실험용)

광고 블로그의 GA4(측정 ID G-GMRVKRVMHS, 사이트 코드 core/analytics)가 모은 페이지별 조회·사용자·참여 시간·90% 스크롤을
Google Analytics Data API로 읽는다. 대시보드 `engagement` 문서와 글별 `engagement`의 원본 (dashboard_data.py가 import해서 씀).

- 인증: Search Console과 같은 서비스 계정 키(환경변수 GSC_SERVICE_ACCOUNT_JSON_B64, 값은 절대 출력하지 않음).
  서비스 계정은 GA4 속성의 뷰어, GCP 프로젝트에서 Google Analytics Data API 사용 설정 (둘 다 2026-11-05 사용자 설정)
- 필요 도메인: oauth2.googleapis.com(토큰), analyticsdata.googleapis.com(API)
- 날짜는 GA4 속성 시간대(한국) 기준 (Cloudflare는 UTC, Search Console은 태평양 시간)
- 참여 시간 = 페이지가 화면 앞에 있던 시간의 합 (userEngagementDuration, 초). 스크롤 = 향상된 측정 `scroll` 이벤트(페이지 90% 도달)
- 유럽(EEA·영국·스위스) 방문은 동의 전 쿠키 없이 측정돼 GA4 보고서에서 빠질 수 있음 → 전체 조회수는 Cloudflare 기준
- AI 답변 유입: 세션 소스가 AI_SOURCES(chatgpt.com·perplexity.ai·gemini.google.com 등)인 세션을 서비스·첫 페이지별로 표시 (2026-11-08)
- 유입 채널: 세션 소스·매체를 CHANNELS(Google·Bing·기타 검색·AI 답변·Pinterest·기타 소셜·기타 사이트·직접)로 나눔 → 대시보드 `sources` 문서 (2026-11-10).
  ChatGPT는 리퍼러 없이 utm_source만 붙여 Cloudflare에서는 직접으로 잡히므로, 채널 판단은 GA4 기준
- 방문이 적은 동안(28일 방문 71, 2026-11-04)은 글별 값으로 판단하지 않고 사이트 전체 값만 기준선으로 기록

설치: python3 -m venv /tmp/gsc && /tmp/gsc/bin/pip install google-auth requests (gsc_report.py와 같은 환경)
실행: /tmp/gsc/bin/python -I apps/ad-blog/experiment/tools/ga_analytics.py [--days 28]  → 사이트 전체 + 경로별 표
"""

import argparse
import base64
import datetime as dt
import json
import os
import sys
import time

import requests
from google.auth.transport.requests import Request
from google.oauth2 import service_account

PROPERTY_ID = '486901575'  # GA4 속성 ID (관리 > 속성 설정 > 속성 세부정보, 비밀 값 아님)
API = f'https://analyticsdata.googleapis.com/v1beta/properties/{PROPERTY_ID}:runReport'
SCOPES = ['https://www.googleapis.com/auth/analytics.readonly']
SITE_HOSTS = ('tool-proof.com', 'www.tool-proof.com')  # GA4는 이 도메인에서만 로드됨 (광고 블로그 core/analytics)
METRICS = ('screenPageViews', 'activeUsers', 'userEngagementDuration')
# AI 답변에서 온 유입: GA4 세션 소스(참조 도메인 또는 ChatGPT가 붙이는 utm_source) → 서비스 이름
AI_SOURCES = {
    'chatgpt.com': 'ChatGPT', 'chat.openai.com': 'ChatGPT', 'openai.com': 'ChatGPT',
    'perplexity.ai': 'Perplexity', 'www.perplexity.ai': 'Perplexity',
    'gemini.google.com': 'Gemini', 'bard.google.com': 'Gemini',
    'copilot.microsoft.com': 'Copilot', 'edgeservices.bing.com': 'Copilot',
    'claude.ai': 'Claude', 'meta.ai': 'Meta AI', 'www.meta.ai': 'Meta AI',
    'chat.deepseek.com': 'DeepSeek', 'grok.com': 'Grok', 'you.com': 'You.com',
}
RETRY_WAITS = (5, 20, 60)  # 일시 오류(시간 초과·연결 끊김·5xx) 재시도 대기(초)


def available() -> bool:
    return bool(os.environ.get('GSC_SERVICE_ACCOUNT_JSON_B64', '').strip())


def load_token() -> str:
    """GA4 읽기 전용 토큰 (Search Console과 같은 키, 범위만 다름). 실패는 예외로 올려 대시보드 갱신이 계속되게 함"""
    info = json.loads(base64.b64decode(os.environ['GSC_SERVICE_ACCOUNT_JSON_B64'].strip()))
    creds = service_account.Credentials.from_service_account_info(info, scopes=SCOPES)
    creds.refresh(Request())
    return creds.token


def host_filter(event: str | None = None) -> dict:
    """사이트 도메인 (+ 이벤트 이름) 필터"""
    expressions = [{'filter': {'fieldName': 'hostName', 'inListFilter': {'values': list(SITE_HOSTS)}}}]
    if event:
        expressions.append({'filter': {'fieldName': 'eventName', 'stringFilter': {'matchType': 'EXACT', 'value': event}}})
    return {'andGroup': {'expressions': expressions}}


def report(token: str, start: dt.date, end: dt.date, dims: list[str], metrics: list[str] | tuple[str, ...], event: str | None = None) -> list[tuple[list[str], list[float]]]:
    """runReport → [(차원 값들, 지표 값들)]. 데이터가 없으면 빈 목록"""
    body = {
        'dateRanges': [{'startDate': str(start), 'endDate': str(end)}],
        'dimensions': [{'name': d} for d in dims],
        'metrics': [{'name': m} for m in metrics],
        'dimensionFilter': host_filter(event),
        'limit': 10000,
    }
    for wait in (*RETRY_WAITS, None):
        try:
            res = requests.post(API, headers={'Authorization': f'Bearer {token}'}, json=body, timeout=30)
        except (requests.Timeout, requests.ConnectionError):
            if wait is None:
                raise
        else:
            if res.status_code < 500 or wait is None:
                break
        print(f'GA4 일시 오류 → {wait}초 뒤 다시 시도', file=sys.stderr)
        time.sleep(wait)
    if res.status_code == 403:
        raise RuntimeError(f'GA4 403: Data API 사용 설정과 서비스 계정의 속성 뷰어 권한을 확인하세요. {res.text[:200]}')
    res.raise_for_status()
    return [([v['value'] for v in r.get('dimensionValues', [])], [float(v['value']) for v in r['metricValues']]) for r in res.json().get('rows', [])]


def normalize_path(path: str) -> str:
    """쿼리 문자열·끝 슬래시를 빼서 Search Console·Cloudflare 경로와 맞춤 (홈은 '/')"""
    return path.split('?', 1)[0].rstrip('/') or '/'


def empty() -> dict:
    return {'views': 0, 'users': 0, 'engagementSeconds': 0, 'scrolls': 0}


def add(cell: dict, values: list[float]) -> None:
    """METRICS 순서 값을 누적 (사용자는 기간 고유 수라 경로가 합쳐질 때만 더해짐)"""
    cell['views'] += int(values[0])
    cell['users'] += int(values[1])
    cell['engagementSeconds'] += round(values[2])


def page_engagement(token: str, start: dt.date, end: dt.date) -> dict[str, dict]:
    """[start, end] 경로별 합계 {views, users, engagementSeconds, scrolls}"""
    out: dict[str, dict] = {}
    for (path,), values in report(token, start, end, ['pagePath'], METRICS):
        add(out.setdefault(normalize_path(path), empty()), values)
    for (path,), values in report(token, start, end, ['pagePath'], ['eventCount'], event='scroll'):
        out.setdefault(normalize_path(path), empty())['scrolls'] += int(values[0])
    return out


def iso_date(value: str) -> str:
    """GA4 date 차원(YYYYMMDD) → YYYY-MM-DD"""
    return f'{value[:4]}-{value[4:6]}-{value[6:]}'


def site_doc(token: str, start: dt.date, end: dt.date) -> dict:
    """사이트 전체 문서: 기간 합계 + 세션·참여 세션 + 날짜별(빠진 날 0)"""
    totals = empty() | {'sessions': 0, 'engagedSessions': 0}
    for _, values in report(token, start, end, [], (*METRICS, 'sessions', 'engagedSessions')):
        add(totals, values)
        totals['sessions'] += int(values[3])
        totals['engagedSessions'] += int(values[4])
    by_date: dict[str, dict] = {}
    for (d,), values in report(token, start, end, ['date'], METRICS):
        add(by_date.setdefault(iso_date(d), empty()), values)
    for (d,), values in report(token, start, end, ['date'], ['eventCount'], event='scroll'):
        by_date.setdefault(iso_date(d), empty())['scrolls'] += int(values[0])
    totals['scrolls'] = sum(c['scrolls'] for c in by_date.values())
    days = [str(start + dt.timedelta(days=i)) for i in range((end - start).days + 1)]
    return {
        'range': {'start': str(start), 'end': str(end)},
        'propertyId': PROPERTY_ID,
        **totals,
        'daily': [{'date': d, **by_date.get(d, empty())} for d in days],
    }


def ai_service(source: str) -> str | None:
    """GA4 sessionSource → AI 서비스 이름 (AI가 아니면 None)"""
    return AI_SOURCES.get(source.strip().lower())


def ai_referrals(token: str, start: dt.date, end: dt.date) -> list[dict]:
    """AI 답변에서 들어온 세션 (서비스·첫 페이지별, 세션 많은 순)"""
    cells: dict[tuple[str, str], dict] = {}
    for (source, landing), (sessions, seconds) in report(token, start, end, ['sessionSource', 'landingPage'], ['sessions', 'userEngagementDuration']):
        service = ai_service(source)
        if service is None:
            continue
        cell = cells.setdefault((service, normalize_path(landing)), {'sessions': 0, 'engagementSeconds': 0})
        cell['sessions'] += int(sessions)
        cell['engagementSeconds'] += int(seconds)
    rows = [{'service': service, 'landingPage': path, **cell} for (service, path), cell in cells.items()]
    return sorted(rows, key=lambda r: (-r['sessions'], r['service'], r['landingPage']))


# 유입 채널 (대시보드 '유입 경로', 2026-11-10). 순서 = 화면 순서. GA4 세션 소스·매체와 Cloudflare 리퍼러 호스트를 같은 규칙으로 나눔
CHANNELS = (
    ('google', 'Google 검색'), ('bing', 'Bing 검색'), ('search', '기타 검색'), ('ai', 'AI 답변'),
    ('pinterest', 'Pinterest'), ('social', '기타 소셜'), ('referral', '기타 사이트'), ('direct', '직접·알 수 없음'),
)
DIRECT_SOURCES = {'', '(direct)', '(not set)', 'direct', 'tool-proof.com'}
# 이름(점 없는 값)은 도메인 조각 하나와 같을 때, 도메인(점 있는 값)은 같거나 하위 도메인일 때 일치 (t.co가 microsoft.com에 걸리지 않게)
SEARCH_ENGINES = ('duckduckgo', 'yahoo', 'ecosia', 'naver', 'yandex', 'baidu', 'startpage', 'qwant', 'search.brave.com', 'daum', 'seznam', 'aol')
SOCIAL_SITES = ('facebook', 'fb.com', 'instagram', 'threads', 't.co', 'twitter', 'x.com', 'reddit', 'linkedin', 'lnkd.in', 'youtube', 'tiktok', 'quora', 'news.ycombinator.com', 'bsky.app', 'mastodon')


def _matches(host: str, name: str) -> bool:
    if '.' in name:
        return host == name or host.endswith('.' + name)
    return name in host.split('.')


def channel(source: str, medium: str = '') -> str:
    """세션 소스(또는 리퍼러 호스트)·매체 → CHANNELS 키.
    AI(utm_source=chatgpt.com 등, GA4 매체 ai-assistant)를 Google보다 먼저 봐서 gemini.google.com이 AI로 감.
    search.google.com은 Search Console 화면에서 연 방문이라 검색이 아닌 기타 사이트. Pinterest는 GA4가 organic 매체로 줘서 검색보다 먼저 봄"""
    s = source.strip().lower().removeprefix('www.')
    m = medium.strip().lower()
    if s in DIRECT_SOURCES:
        return 'direct'
    if ai_service(s) or m == 'ai-assistant':
        return 'ai'
    if 'pinterest' in s or s == 'pin.it':
        return 'pinterest'
    if s == 'search.google.com':
        return 'referral'
    if s == 'google' or s.startswith('google.') or 'googlequicksearchbox' in s:
        return 'google'
    if s == 'bing' or s == 'bing.com' or s.endswith('.bing.com'):
        return 'bing'
    if any(_matches(s, site) for site in SOCIAL_SITES):
        return 'social'
    if m == 'organic' or any(_matches(s, engine) for engine in SEARCH_ENGINES):
        return 'search'
    return 'referral'


def traffic_sources(token: str, start: dt.date, end: dt.date) -> dict:
    """[start, end] 세션 소스·매체별 세션 → 채널 합계·소스 목록·채널별 도착 페이지(직접 제외)·날짜별 채널 세션 (2026-11-10)"""
    keys = [k for k, _ in CHANNELS]
    totals = {k: {'sessions': 0, 'views': 0, 'engagedSessions': 0, 'engagementSeconds': 0} for k in keys}
    sources = []
    for (source, medium), (sessions, views, engaged, seconds) in report(
        token, start, end, ['sessionSource', 'sessionMedium'], ['sessions', 'screenPageViews', 'engagedSessions', 'userEngagementDuration'],
    ):
        key = channel(source, medium)
        cell = totals[key]
        cell['sessions'] += int(sessions)
        cell['views'] += int(views)
        cell['engagedSessions'] += int(engaged)
        cell['engagementSeconds'] += round(seconds)
        sources.append({'source': source, 'medium': medium, 'channel': key, 'sessions': int(sessions), 'views': int(views), 'engagedSessions': int(engaged)})
    landing: dict[tuple[str, str], int] = {}
    for (source, medium, page), (sessions,) in report(token, start, end, ['sessionSource', 'sessionMedium', 'landingPage'], ['sessions']):
        key = channel(source, medium)
        if key != 'direct':
            cell = (key, normalize_path(page))
            landing[cell] = landing.get(cell, 0) + int(sessions)
    daily: dict[str, dict[str, int]] = {}
    for (d, source, medium), (sessions,) in report(token, start, end, ['date', 'sessionSource', 'sessionMedium'], ['sessions']):
        day = daily.setdefault(iso_date(d), {})
        key = channel(source, medium)
        day[key] = day.get(key, 0) + int(sessions)
    return {
        'range': {'start': str(start), 'end': str(end)},
        'firstDate': min(daily, default=None),  # GA4 데이터가 있는 첫날 (설치 2026-11-05)
        'sessions': sum(c['sessions'] for c in totals.values()),
        'channels': totals,
        'sources': sorted(sources, key=lambda r: (-r['sessions'], r['source']))[:30],
        'landing': [{'channel': k, 'page': p, 'sessions': n} for (k, p), n in sorted(landing.items(), key=lambda x: (-x[1], keys.index(x[0][0]), x[0][1]))][:30],
        'daily': [{'date': d, 'channels': daily[d]} for d in sorted(daily)],
    }


def per_view(seconds: int, views: int) -> str:
    return f'{seconds / views:.0f}초' if views else '-'


def rate(part: int, whole: int) -> str:
    return f'{part / whole:.0%}' if whole else '-'


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--days', type=int, default=28)
    args = ap.parse_args()
    if not available():
        sys.exit('GSC_SERVICE_ACCOUNT_JSON_B64 환경변수가 없습니다 (클라우드 환경 설정 → 새 세션부터 적용).')
    end = dt.datetime.now(dt.timezone(dt.timedelta(hours=9))).date()  # 속성 시간대(한국) 오늘
    start = end - dt.timedelta(days=args.days - 1)
    try:
        token = load_token()
        site = site_doc(token, start, end)
        pages = page_engagement(token, start, end)
        ai_rows = ai_referrals(token, start, end)
    except (RuntimeError, requests.RequestException, ValueError) as error:
        sys.exit(f'GA4를 읽지 못함: {error}')
    print(f"GA4 {start} ~ {end} (한국 날짜, 속성 {PROPERTY_ID})")
    print(f"사이트 전체: 조회 {site['views']} · 사용자 {site['users']} · 세션 {site['sessions']} (참여 세션 {rate(site['engagedSessions'], site['sessions'])})"
          f" · 조회당 참여 시간 {per_view(site['engagementSeconds'], site['views'])} · 90% 스크롤 {rate(site['scrolls'], site['views'])}")
    rows = sorted(pages.items(), key=lambda x: (-x[1]['views'], x[0]))
    print(f'\n| 경로 | 조회 | 사용자 | 조회당 참여 시간 | 90% 스크롤 |\n|---|---:|---:|---:|---:|')
    for path, c in rows[:20]:
        print(f"| {path} | {c['views']} | {c['users']} | {per_view(c['engagementSeconds'], c['views'])} | {rate(c['scrolls'], c['views'])} |")
    ai_total = sum(r['sessions'] for r in ai_rows)
    print(f"\nAI 답변 유입: 세션 {ai_total} (사이트 전체의 {rate(ai_total, site['sessions'])})")
    if ai_rows:
        print('| 서비스 | 첫 페이지 | 세션 | 세션당 참여 시간 |\n|---|---|---:|---:|')
        for r in ai_rows:
            print(f"| {r['service']} | {r['landingPage']} | {r['sessions']} | {per_view(r['engagementSeconds'], r['sessions'])} |")
    print(f'\n경로 {len(rows)}개. 글별 값은 방문이 쌓이기 전에는 판단에 쓰지 않음 (사이트 전체 값만 기준선으로 기록)')


if __name__ == '__main__':
    main()
