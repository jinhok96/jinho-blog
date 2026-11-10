"""Cloudflare Web Analytics 조회수 (ToolProof 운영 실험용)

실제 방문자의 페이지뷰(JS 비컨, 쿠키 없음)를 Cloudflare GraphQL Analytics API로 읽는다.
대시보드 글 순위표의 조회수 원본 (dashboard_data.py가 import해서 씀).

환경변수 (클라우드 환경 설정 → 새 세션부터 적용, 값은 절대 출력하지 않음):
- CF_API_TOKEN: API 토큰 (권한: Account → Account Analytics → Read)
- CF_ACCOUNT_ID: Cloudflare 계정 ID (대시보드 주소 dash.cloudflare.com/{계정 ID}/...)
- CF_SITE_TAG (선택): Web Analytics 사이트 태그. 없으면 사이트 도메인(requestHost)으로 거름
  (사이트 목록 REST API는 Account Analytics Read 토큰으로 403이라 쓰지 않음, 2026-10-25 확인)

실행: python3 -I apps/ad-blog/experiment/tools/cf_analytics.py [--days 7]  → 경로별 조회수 상위 20
- 필요 도메인: api.cloudflare.com
- 날짜는 UTC 기준 (Search Console 날짜는 태평양 시간이라 하루 경계가 8~9시간 다름)
"""

import argparse
import datetime as dt
import json
import os
import sys
import urllib.request

API = 'https://api.cloudflare.com/client/v4'
SITE_HOSTS = ('tool-proof.com', 'www.tool-proof.com')  # 비컨은 이 도메인에서만 로드됨 (광고 블로그 core/analytics)
CHUNK_DAYS = 7  # 한 번에 조회하는 기간 (조회 범위·행 수 제한 대비)
# 실제 독자가 아닌 방문 (2026-11-10): Cloudflare가 봇으로 표시한 방문(bot=1, ChromeHeadless 등)과 한국(운영자 확인, 영어·미국 대상 사이트).
# period_filter는 기본으로 둘 다 뺌. Web Analytics는 표본 수집이라 값은 표본 간격(sampleInterval, 2026-11-10 기준 10)을 곱한 추정치
OPERATOR_COUNTRY = 'KR'

QUERY = """
query ($accountTag: string!, $filter: AccountRumPageloadEventsAdaptiveGroupsFilter_InputObject) {
  viewer {
    accounts(filter: { accountTag: $accountTag }) {
      rumPageloadEventsAdaptiveGroups(limit: 10000, filter: $filter) {
        count
        sum { visits }
        dimensions { date requestPath }
      }
    }
  }
}
"""


def available() -> bool:
    return bool(os.environ.get('CF_API_TOKEN', '').strip() and os.environ.get('CF_ACCOUNT_ID', '').strip())


def _request(method: str, url: str, body: dict | None = None) -> dict:
    req = urllib.request.Request(url, method=method, data=json.dumps(body).encode() if body else None)
    req.add_header('Authorization', f"Bearer {os.environ['CF_API_TOKEN'].strip()}")
    req.add_header('Content-Type', 'application/json')
    with urllib.request.urlopen(req, timeout=30) as res:
        return json.load(res)


def site_filter() -> dict:
    """측정 대상 필터: CF_SITE_TAG가 있으면 사이트 태그, 없으면 사이트 도메인"""
    tag = os.environ.get('CF_SITE_TAG', '').strip()
    if tag:
        return {'siteTag': tag}
    return {'OR': [{'requestHost': host} for host in SITE_HOSTS]}


def period_filter(start: dt.date, end: dt.date, human: bool = True, only: str | None = None) -> dict:
    """[start, end] (UTC 날짜) + 측정 대상. human = 봇·운영자(한국) 제외, only = 'operator' | 'bot'이면 그 방문만"""
    parts = [{'datetime_geq': f'{start}T00:00:00Z', 'datetime_lt': f'{end + dt.timedelta(days=1)}T00:00:00Z'}, site_filter()]
    if only == 'operator':
        parts.append({'countryName': OPERATOR_COUNTRY})
    elif only == 'bot':
        parts += [{'bot': 1}, {'countryName_neq': OPERATOR_COUNTRY}]
    elif human:
        parts += [{'bot': 0}, {'countryName_neq': OPERATOR_COUNTRY}]
    return {'AND': parts}


def normalize_path(path: str) -> str:
    """쿼리 문자열·끝 슬래시를 빼서 Search Console 페이지 경로와 맞춤 (홈은 '/')"""
    return path.split('?', 1)[0].rstrip('/') or '/'


def merge_rows(rows: list[dict], into: dict[str, dict[str, dict]]) -> None:
    """GraphQL 행 → {경로: {날짜: {views, visits}}} 누적"""
    for r in rows:
        d = r['dimensions']
        cell = into.setdefault(normalize_path(d['requestPath']), {}).setdefault(d['date'], {'views': 0, 'visits': 0})
        cell['views'] += int(r['count'])
        cell['visits'] += int((r.get('sum') or {}).get('visits') or 0)


def page_views(start: dt.date, end: dt.date) -> dict[str, dict[str, dict]]:
    """[start, end] (UTC 날짜) 경로·날짜별 조회수(views = 페이지 로드)·방문(visits = 다른 사이트에서 들어온 페이지 로드)"""
    account = os.environ['CF_ACCOUNT_ID'].strip()
    out: dict[str, dict[str, dict]] = {}
    day = start
    while day <= end:
        stop = min(end, day + dt.timedelta(days=CHUNK_DAYS - 1))
        res = _request('POST', f'{API}/graphql', {'query': QUERY, 'variables': {'accountTag': account, 'filter': period_filter(day, stop)}})
        if res.get('errors'):
            raise RuntimeError(f"GraphQL 오류: {res['errors'][0].get('message')}")
        accounts = res['data']['viewer']['accounts']
        merge_rows(accounts[0]['rumPageloadEventsAdaptiveGroups'] if accounts else [], out)
        day = stop + dt.timedelta(days=1)
    return out


REFERER_QUERY = """
query ($accountTag: string!, $filter: AccountRumPageloadEventsAdaptiveGroupsFilter_InputObject) {
  viewer {
    accounts(filter: { accountTag: $accountTag }) {
      rumPageloadEventsAdaptiveGroups(limit: 50, filter: $filter, orderBy: [count_DESC]) {
        count
        sum { visits }
        dimensions { refererHost }
      }
    }
  }
}
"""


def referers(start: dt.date, end: dt.date, limit: int = 10) -> list[dict]:
    """[start, end] 유입 사이트별 조회수·방문 (자기 사이트·주소 없음(직접 방문)은 'direct'로 묶음), 조회수 많은 순"""
    account = os.environ['CF_ACCOUNT_ID'].strip()
    res = _request('POST', f'{API}/graphql', {'query': REFERER_QUERY, 'variables': {'accountTag': account, 'filter': period_filter(start, end)}})
    if res.get('errors'):
        raise RuntimeError(f"GraphQL 오류: {res['errors'][0].get('message')}")
    accounts = res['data']['viewer']['accounts']
    return group_referers(accounts[0]['rumPageloadEventsAdaptiveGroups'] if accounts else [], limit)


def group_referers(rows: list[dict], limit: int, own_host: str = 'tool-proof.com') -> list[dict]:
    by: dict[str, dict] = {}
    for r in rows:
        host = (r['dimensions'].get('refererHost') or '').lower().removeprefix('www.')
        key = 'direct' if not host or host == own_host else host
        cell = by.setdefault(key, {'key': key, 'views': 0, 'visits': 0})
        cell['views'] += int(r['count'])
        cell['visits'] += int((r.get('sum') or {}).get('visits') or 0)
    return sorted(by.values(), key=lambda x: (-x['views'], x['key']))[:limit]


def _groups(dataset: str, body: str, start: dt.date, end: dt.date, limit: int = 100, **filter_kw) -> list[dict]:
    """rum{dataset}AdaptiveGroups 한 번 조회 (dataset: PageloadEvents·PerformanceEvents·WebVitalsEvents)"""
    account = os.environ['CF_ACCOUNT_ID'].strip()
    query = (f'query ($a: string!, $f: AccountRum{dataset}AdaptiveGroupsFilter_InputObject) {{ viewer {{ accounts(filter: {{ accountTag: $a }}) {{ '
             f'rum{dataset}AdaptiveGroups(limit: {limit}, filter: $f) {body} }} }} }}')
    res = _request('POST', f'{API}/graphql', {'query': query, 'variables': {'a': account, 'f': period_filter(start, end, **filter_kw)}})
    if res.get('errors'):
        raise RuntimeError(f"GraphQL 오류: {res['errors'][0].get('message')}")
    accounts = res['data']['viewer']['accounts']
    return accounts[0][f'rum{dataset}AdaptiveGroups'] if accounts else []


def excluded(start: dt.date, end: dt.date) -> dict:
    """지표에서 뺀 방문 {operator: {views, visits}, bot: {views, visits}} (표본 추정치)"""
    out = {}
    for kind in ('operator', 'bot'):
        rows = _groups('PageloadEvents', '{ count sum { visits } }', start, end, human=False, only=kind)
        out[kind] = {'views': int(rows[0]['count']) if rows else 0, 'visits': int((rows[0].get('sum') or {}).get('visits') or 0) if rows else 0}
    return out


def _us(value) -> float | None:
    """마이크로초 → 밀리초 (-1·None = 표본 부족)"""
    return None if value is None or value < 0 else round(value / 1000, 1)


VITALS = ('lcp', 'inp', 'cls', 'fcp', 'ttfb')
VITAL_QUANTILES = {'lcp': 'largestContentfulPaintP75', 'inp': 'interactionToNextPaintP75', 'cls': 'cumulativeLayoutShiftP75', 'fcp': 'firstContentfulPaintP75', 'ttfb': 'timeToFirstByteP75'}


def _vital_cells(row: dict) -> dict:
    """한 행 → {lcp: {p75, good, ni, poor, total}, ...}. 시간 지표 p75는 ms, CLS는 Cloudflare 원값(표본이 없으면 None)"""
    q, s = row.get('quantiles') or {}, row.get('sum') or {}
    out = {}
    for v in VITALS:
        raw = q.get(VITAL_QUANTILES[v])
        p75 = (None if raw is None or raw < 0 else raw) if v == 'cls' else _us(raw)
        good, ni, poor = int(s.get(f'{v}Good', 0)), int(s.get(f'{v}NeedsImprovement', 0)), int(s.get(f'{v}Poor', 0))
        out[v] = {'p75': p75, 'good': good, 'ni': ni, 'poor': poor, 'total': good + ni + poor}
    return out


def vitals_doc(start: dt.date, end: dt.date) -> dict:
    """Core Web Vitals·방문 환경 문서 (봇·운영자 제외, 2026-11-10): 사이트·기기·경로별 p75와 좋음/개선 필요/나쁨 수,
    LCP·CLS·INP 원인 요소, 페이지 로드 p75, 국가·기기·브라우저·OS·이동 방식(전체 로드 vs 사이트 안 이동)·시간대(UTC), 제외 수, 표본 간격"""
    sums = ' '.join(f'{v}Good {v}NeedsImprovement {v}Poor' for v in VITALS)  # 한 쿼리 필드 30개 제한 → Total은 세 값의 합으로
    quants = ' '.join(VITAL_QUANTILES.values())
    body = lambda dims: f'{{ count sum {{ visits {sums} }} quantiles {{ {quants} }}{f" dimensions {{ {dims} }}" if dims else ""} }}'  # noqa: E731
    site = _groups('WebVitalsEvents', body(''), start, end, 1)
    devices = _groups('WebVitalsEvents', body('deviceType'), start, end, 10)
    paths = _groups('WebVitalsEvents', body('requestPath'), start, end, 200)

    def elements(dim: str) -> list[dict]:
        rows = _groups('WebVitalsEvents', f'{{ count dimensions {{ {dim} }} }}', start, end, 20)
        return sorted(({'element': r['dimensions'][dim], 'count': int(r['count'])} for r in rows if r['dimensions'][dim]), key=lambda x: -x['count'])[:5]

    perf = _groups('PerformanceEvents', '{ count quantiles { pageLoadTimeP75 responseTimeP75 firstContentfulPaintP75 dnsTimeP75 connectionTimeP75 } }', start, end, 1)
    pq = (perf[0].get('quantiles') or {}) if perf else {}

    def breakdown(dim: str, limit: int = 10) -> list[dict]:
        rows = _groups('PageloadEvents', f'{{ count sum {{ visits }} dimensions {{ {dim} }} }}', start, end, 100)
        return sorted(({'key': str(r['dimensions'][dim]), 'views': int(r['count']), 'visits': int((r.get('sum') or {}).get('visits') or 0)} for r in rows), key=lambda x: (-x['views'], x['key']))[:limit]

    sample = _groups('PageloadEvents', '{ count avg { sampleInterval } }', start, end, 1)
    hours = {h: 0 for h in range(24)}
    for r in _groups('PageloadEvents', '{ count dimensions { datetimeHour } }', start, end, 1000):
        hours[int(r['dimensions']['datetimeHour'][11:13])] += int(r['count'])
    return {
        'range': {'start': str(start), 'end': str(end)},
        'sampleInterval': round((sample[0].get('avg') or {}).get('sampleInterval') or 1) if sample else None,
        'excluded': excluded(start, end),
        'site': {'visits': int((site[0].get('sum') or {}).get('visits') or 0) if site else 0, **(_vital_cells(site[0]) if site else {})},
        'devices': [{'key': r['dimensions']['deviceType'], 'count': int(r['count']), **_vital_cells(r)} for r in devices],
        'paths': sorted(({'path': normalize_path(r['dimensions']['requestPath']), 'count': int(r['count']), **_vital_cells(r)} for r in paths), key=lambda x: (-x['count'], x['path']))[:30],
        'elements': {'lcp': elements('largestContentfulPaintElement'), 'cls': elements('cumulativeLayoutShiftElement'), 'inp': elements('interactionToNextPaintElement')},
        'performance': {'pageLoad': _us(pq.get('pageLoadTimeP75')), 'response': _us(pq.get('responseTimeP75')), 'fcp': _us(pq.get('firstContentfulPaintP75')),
                        'dns': _us(pq.get('dnsTimeP75')), 'connection': _us(pq.get('connectionTimeP75'))},
        'countries': breakdown('countryName'),
        'devices_views': breakdown('deviceType'),
        'browsers': breakdown('userAgentBrowser'),
        'os': breakdown('userAgentOS'),
        'navigation': breakdown('navigationType'),
        'hours': [{'hour': h, 'views': n} for h, n in hours.items()],
    }


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--days', type=int, default=7)
    args = ap.parse_args()
    if not available():
        sys.exit('CF_API_TOKEN·CF_ACCOUNT_ID 환경변수가 없습니다 (클라우드 환경 설정 → 새 세션부터 적용).')
    today = dt.datetime.now(dt.timezone.utc).date()
    data = page_views(today - dt.timedelta(days=args.days - 1), today)
    totals = sorted(((p, sum(c['views'] for c in ds.values()), sum(c['visits'] for c in ds.values())) for p, ds in data.items()), key=lambda x: -x[1])
    print(f'| 경로 | 조회수 | 방문 |  (최근 {args.days}일, UTC)\n|---|---:|---:|')
    for path, views, visits in totals[:20]:
        print(f'| {path} | {views} | {visits} |')
    print(f'\n합계 조회수 {sum(t[1] for t in totals)} · 경로 {len(totals)}개')


if __name__ == '__main__':
    main()
