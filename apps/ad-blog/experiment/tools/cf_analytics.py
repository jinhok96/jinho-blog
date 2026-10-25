"""Cloudflare Web Analytics 조회수 (ToolProof 운영 실험용)

실제 방문자의 페이지뷰(JS 비컨, 쿠키 없음)를 Cloudflare GraphQL Analytics API로 읽는다.
대시보드 글 순위표의 조회수 원본 (dashboard_data.py가 import해서 씀).

환경변수 (클라우드 환경 설정 → 새 세션부터 적용, 값은 절대 출력하지 않음):
- CF_API_TOKEN: API 토큰 (권한: Account → Account Analytics → Read)
- CF_ACCOUNT_ID: Cloudflare 계정 ID (대시보드 주소 dash.cloudflare.com/{계정 ID}/...)
- CF_SITE_TAG (선택): Web Analytics 사이트 태그. 없으면 사이트 목록에서 비컨 토큰(SITE_TOKEN)으로 찾음

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
# 광고 블로그 core/config/internal/analytics.ts의 CF_WEB_ANALYTICS_TOKEN과 같은 값 (공개 값)
SITE_TOKEN = '11ff5f9f67bb4894aadec935d7891e61'
CHUNK_DAYS = 7  # 한 번에 조회하는 기간 (조회 범위·행 수 제한 대비)

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


def site_tag() -> str:
    tag = os.environ.get('CF_SITE_TAG', '').strip()
    if tag:
        return tag
    account = os.environ['CF_ACCOUNT_ID'].strip()
    res = _request('GET', f'{API}/accounts/{account}/rum/site_info/list?per_page=100')
    for site in res.get('result') or []:
        if site.get('site_token') == SITE_TOKEN:
            return site['site_tag']
    raise RuntimeError('Web Analytics 사이트 목록에 비컨 토큰이 일치하는 사이트가 없음 (CF_SITE_TAG로 직접 지정 가능)')


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
    account, tag = os.environ['CF_ACCOUNT_ID'].strip(), site_tag()
    out: dict[str, dict[str, dict]] = {}
    day = start
    while day <= end:
        stop = min(end, day + dt.timedelta(days=CHUNK_DAYS - 1))
        flt = {'AND': [{'datetime_geq': f'{day}T00:00:00Z', 'datetime_lt': f'{stop + dt.timedelta(days=1)}T00:00:00Z'}, {'siteTag': tag}]}
        res = _request('POST', f'{API}/graphql', {'query': QUERY, 'variables': {'accountTag': account, 'filter': flt}})
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
    account, tag = os.environ['CF_ACCOUNT_ID'].strip(), site_tag()
    flt = {'AND': [{'datetime_geq': f'{start}T00:00:00Z', 'datetime_lt': f'{end + dt.timedelta(days=1)}T00:00:00Z'}, {'siteTag': tag}]}
    res = _request('POST', f'{API}/graphql', {'query': REFERER_QUERY, 'variables': {'accountTag': account, 'filter': flt}})
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
