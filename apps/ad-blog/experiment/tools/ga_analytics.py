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
# 실제 독자가 아닌 방문 (2026-11-10): 영어·미국 대상 사이트라 한국 방문은 운영자 확인으로 보고, 화면 800x600은 헤드리스 브라우저 기본값
# (Council Bluffs 데이터센터·참여 0초 방문이 모두 이 크기, 2026-11-10 확인). report()는 기본으로 둘 다 빼고 셈
OPERATOR_COUNTRY = 'South Korea'
HEADLESS_SCREEN = '800x600'


def available() -> bool:
    return bool(os.environ.get('GSC_SERVICE_ACCOUNT_JSON_B64', '').strip())


def load_token() -> str:
    """GA4 읽기 전용 토큰 (Search Console과 같은 키, 범위만 다름). 실패는 예외로 올려 대시보드 갱신이 계속되게 함"""
    info = json.loads(base64.b64decode(os.environ['GSC_SERVICE_ACCOUNT_JSON_B64'].strip()))
    creds = service_account.Credentials.from_service_account_info(info, scopes=SCOPES)
    creds.refresh(Request())
    return creds.token


def _exact(field: str, value: str) -> dict:
    return {'filter': {'fieldName': field, 'stringFilter': {'matchType': 'EXACT', 'value': value}}}


def host_filter(event: str | None = None, human: bool = True, only: str | None = None) -> dict:
    """사이트 도메인 (+ 이벤트 이름) 필터. human = 운영자(한국)·헤드리스(800x600) 방문 제외,
    only = 'operator' | 'bot'이면 그 방문만 (제외한 수를 셀 때)"""
    expressions = [{'filter': {'fieldName': 'hostName', 'inListFilter': {'values': list(SITE_HOSTS)}}}]
    if event:
        expressions.append(_exact('eventName', event))
    if only == 'operator':
        expressions.append(_exact('country', OPERATOR_COUNTRY))
    elif only == 'bot':
        expressions += [_exact('screenResolution', HEADLESS_SCREEN), {'notExpression': _exact('country', OPERATOR_COUNTRY)}]
    elif human:
        expressions += [{'notExpression': _exact('country', OPERATOR_COUNTRY)}, {'notExpression': _exact('screenResolution', HEADLESS_SCREEN)}]
    return {'andGroup': {'expressions': expressions}}


def report(
    token: str, start: dt.date, end: dt.date, dims: list[str], metrics: list[str] | tuple[str, ...], event: str | None = None,
    human: bool = True, only: str | None = None,
) -> list[tuple[list[str], list[float]]]:
    """runReport → [(차원 값들, 지표 값들)]. 데이터가 없으면 빈 목록. 기본으로 운영자·헤드리스 방문 제외 (host_filter)"""
    body = {
        'dateRanges': [{'startDate': str(start), 'endDate': str(end)}],
        'dimensions': [{'name': d} for d in dims],
        'metrics': [{'name': m} for m in metrics],
        'dimensionFilter': host_filter(event, human, only),
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


SCROLL_DEPTHS = ('25', '50', '75', '90')  # percent_scrolled 값 (25·50·75는 사이트 이벤트 2026-11-10부터, 90은 향상된 측정)


def empty() -> dict:
    return {'views': 0, 'users': 0, 'engagementSeconds': 0, 'scrolls': 0, 'depth': {d: 0 for d in SCROLL_DEPTHS}}


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
    for (path, depth), values in report(token, start, end, ['pagePath', 'percentScrolled'], ['eventCount'], event='scroll'):
        cell = out.setdefault(normalize_path(path), empty())
        if depth == '90':
            cell['scrolls'] += int(values[0])  # 90% 도달 (예전 값과 같은 뜻 유지)
        if depth in cell['depth']:
            cell['depth'][depth] += int(values[0])
    return out


def iso_date(value: str) -> str:
    """GA4 date 차원(YYYYMMDD) → YYYY-MM-DD"""
    return f'{value[:4]}-{value[4:6]}-{value[6:]}'


def site_doc(token: str, start: dt.date, end: dt.date) -> dict:
    """사이트 전체 문서: 기간 합계 + 세션·참여 세션 + 날짜별(빠진 날 0)"""
    totals = {k: v for k, v in empty().items() if k != 'depth'} | {'sessions': 0, 'engagedSessions': 0}
    for _, values in report(token, start, end, [], (*METRICS, 'sessions', 'engagedSessions')):
        add(totals, values)
        totals['sessions'] += int(values[3])
        totals['engagedSessions'] += int(values[4])
    by_date: dict[str, dict] = {}
    day = lambda: {k: v for k, v in empty().items() if k != 'depth'}  # noqa: E731 - 날짜별 칸에는 깊이를 두지 않음
    for (d,), values in report(token, start, end, ['date'], METRICS):
        add(by_date.setdefault(iso_date(d), day()), values)
    # 90% 도달만 셈 (25·50·75 사이트 이벤트가 섞여도 예전 값과 같은 뜻)
    for (d, depth), values in report(token, start, end, ['date', 'percentScrolled'], ['eventCount'], event='scroll'):
        if depth == '90':
            by_date.setdefault(iso_date(d), day())['scrolls'] += int(values[0])
    totals['scrolls'] = sum(c['scrolls'] for c in by_date.values())
    days = [str(start + dt.timedelta(days=i)) for i in range((end - start).days + 1)]
    return {
        'range': {'start': str(start), 'end': str(end)},
        'propertyId': PROPERTY_ID,
        **totals,
        'daily': [{'date': d, **by_date.get(d, day())} for d in days],
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


SITE_ORIGINS = tuple(f'https://{h}' for h in SITE_HOSTS)
SESSION_METRICS = ('sessions', 'engagedSessions', 'userEngagementDuration', 'screenPageViews')


def _session_rows(token: str, start: dt.date, end: dt.date, dim: str, limit: int | None = None) -> list[dict]:
    """한 차원별 세션·참여 세션·참여 시간·조회 (세션 많은 순)"""
    rows = [
        {'key': key, 'sessions': int(s), 'engagedSessions': int(e), 'engagementSeconds': round(sec), 'views': int(v)}
        for (key,), (s, e, sec, v) in report(token, start, end, [dim], SESSION_METRICS)
    ]
    rows.sort(key=lambda r: (-r['sessions'], r['key']))
    return rows[:limit] if limit else rows


def excluded(token: str, start: dt.date, end: dt.date) -> dict:
    """지표에서 뺀 방문 수 {operator: {sessions, views}, bot: {sessions, views}} (host_filter의 human 규칙)"""
    out = {}
    for kind in ('operator', 'bot'):
        rows = report(token, start, end, [], ['sessions', 'screenPageViews'], human=False, only=kind)
        out[kind] = {'sessions': int(rows[0][1][0]) if rows else 0, 'views': int(rows[0][1][1]) if rows else 0}
    return out


def audience_doc(token: str, start: dt.date, end: dt.date) -> dict:
    """방문자·행동 문서 (운영자·헤드리스 제외, 2026-11-10): 사용자·재방문·참여율·이탈률, 기기·국가·시간대·요일,
    첫 페이지 품질, 스크롤 깊이, 내부 이동(내 사이트 → 페이지), 외부 링크 클릭, 첫 유입 채널, 광고 지표(AdSense 연결 후)"""
    t1 = report(token, start, end, [], ['activeUsers', 'newUsers', 'totalUsers', 'sessions', 'engagedSessions', 'engagementRate', 'bounceRate', 'averageSessionDuration', 'sessionsPerUser', 'screenPageViewsPerSession'])
    t2 = report(token, start, end, [], ['userEngagementDuration', 'screenPageViews', 'scrolledUsers', 'eventsPerSession'])
    v1, v2 = (t1[0][1] if t1 else [0] * 10), (t2[0][1] if t2 else [0] * 4)
    totals = {
        'activeUsers': int(v1[0]), 'newUsers': int(v1[1]), 'totalUsers': int(v1[2]), 'sessions': int(v1[3]), 'engagedSessions': int(v1[4]),
        'engagementRate': round(v1[5], 4), 'bounceRate': round(v1[6], 4), 'averageSessionDuration': round(v1[7], 1),
        'sessionsPerUser': round(v1[8], 2), 'viewsPerSession': round(v1[9], 2),
        'engagementSeconds': round(v2[0]), 'views': int(v2[1]), 'scrolledUsers': int(v2[2]), 'eventsPerSession': round(v2[3], 2),
    }
    returning = [
        {'key': key, 'users': int(u), 'sessions': int(s), 'engagedSessions': int(e), 'engagementSeconds': round(sec)}
        for (key,), (u, s, e, sec) in report(token, start, end, ['newVsReturning'], ['activeUsers', 'sessions', 'engagedSessions', 'userEngagementDuration'])
        if key in ('new', 'returning')
    ]
    landing = []
    for (page,), (s, e, sec, v, bounce) in report(token, start, end, ['landingPage'], (*SESSION_METRICS, 'bounceRate')):
        landing.append({'page': normalize_path(page), 'sessions': int(s), 'engagedSessions': int(e), 'engagementSeconds': round(sec), 'views': int(v), 'bounceRate': round(bounce, 4)})
    landing.sort(key=lambda r: (-r['sessions'], r['page']))
    depth = {d: {'events': 0, 'users': 0} for d in SCROLL_DEPTHS}
    for (d,), (events, users) in report(token, start, end, ['percentScrolled'], ['eventCount', 'totalUsers'], event='scroll'):
        if d in depth:
            depth[d] = {'events': int(events), 'users': int(users)}
    internal: dict[tuple[str, str], int] = {}
    for (ref, page), (views,) in report(token, start, end, ['pageReferrer', 'pagePath'], ['screenPageViews']):
        if ref.startswith(SITE_ORIGINS):
            src = normalize_path(ref.split('://', 1)[1].split('/', 1)[1] if '/' in ref.split('://', 1)[1] else '/')
            src = src if src.startswith('/') else '/' + src
            dst = normalize_path(page)
            if src != dst:
                internal[(src, dst)] = internal.get((src, dst), 0) + int(views)
    outbound = [
        {'domain': domain, 'url': url, 'page': normalize_path(page), 'clicks': int(n)}
        for (domain, url, page, out), (n,) in report(token, start, end, ['linkDomain', 'linkUrl', 'pagePath', 'outbound'], ['eventCount'], event='click')
        if out == 'true' or (domain and not any(h in domain for h in SITE_HOSTS))
    ]
    outbound.sort(key=lambda r: (-r['clicks'], r['domain']))
    first: dict[str, int] = {}
    for (source, medium), (n,) in report(token, start, end, ['firstUserSource', 'firstUserMedium'], ['newUsers']):
        key = channel(source, medium)
        first[key] = first.get(key, 0) + int(n)
    hours = {h: 0 for h in range(24)}
    for (h,), (n,) in report(token, start, end, ['hour'], ['sessions']):
        hours[int(h)] += int(n)
    weekdays = {d: 0 for d in range(7)}
    for (d,), (n,) in report(token, start, end, ['dayOfWeek'], ['sessions']):
        weekdays[int(d)] += int(n)
    return {
        'range': {'start': str(start), 'end': str(end)},
        'timezone': 'Asia/Seoul',  # GA4 속성 시간대 (시간대·요일 차원 기준)
        'excluded': excluded(token, start, end),
        'totals': totals,
        'newVsReturning': returning,
        'devices': _session_rows(token, start, end, 'deviceCategory'),
        'countries': _session_rows(token, start, end, 'countryId', 10),  # ISO 2자리 코드 (화면이 한국어 이름으로 바꿈, Cloudflare와 같은 형식)
        'os': _session_rows(token, start, end, 'operatingSystem', 8),
        'hours': [{'hour': h, 'sessions': n} for h, n in hours.items()],
        'weekdays': [{'day': d, 'sessions': n} for d, n in weekdays.items()],  # 0 = 일요일
        'landing': landing[:20],
        'scrollDepth': [{'percent': int(d), **v} for d, v in depth.items()],
        'internal': [{'from': f, 'to': t, 'views': n} for (f, t), n in sorted(internal.items(), key=lambda x: (-x[1], x[0]))][:20],
        'outbound': outbound[:20],
        'firstChannels': first,
        'ads': ads_doc(token, start, end),
    }


def ads_doc(token: str, start: dt.date, end: dt.date) -> dict:
    """AdSense 지표 (GA4에 AdSense를 연결해야 채워짐, 그 전에는 0·빈 목록): 합계와 글별 광고 노출·클릭·수익"""
    metrics = ['publisherAdImpressions', 'publisherAdClicks', 'totalAdRevenue']
    try:
        total = report(token, start, end, [], metrics)
        pages = report(token, start, end, ['pagePath'], metrics)
        units = report(token, start, end, ['adFormat'], metrics)
    except (requests.RequestException, RuntimeError) as error:
        return {'linked': False, 'error': str(error)[:200]}
    t = total[0][1] if total else [0, 0, 0]
    row = lambda k, v: {'key': k, 'impressions': int(v[0]), 'clicks': int(v[1]), 'revenue': round(v[2], 2)}  # noqa: E731
    return {
        'linked': bool(t[0] or t[1] or t[2]),
        'total': row('total', t),
        'pages': sorted((row(normalize_path(k), v) for (k,), v in pages if v[0] or v[1]), key=lambda r: -r['impressions'])[:20],
        'formats': [row(k, v) for (k,), v in units if v[0] or v[1]],
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
