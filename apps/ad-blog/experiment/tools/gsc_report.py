"""Search Console 리포트 (ToolProof 운영 실험용)

환경변수 GSC_SERVICE_ACCOUNT_JSON_B64(서비스 계정 JSON 키를 base64로 인코딩한 값)로 인증해
검색 성과·사이트맵 상태·글별 색인 상태를 Markdown으로 출력한다. 출력은 log.md에 붙여 넣는 용도.

설치: python3 -m venv /tmp/gsc && /tmp/gsc/bin/pip install google-auth requests
실행: /tmp/gsc/bin/python -I apps/ad-blog/experiment/tools/gsc_report.py [--days 28] [--site sc-domain:tool-proof.com]

- 키 값은 절대 출력하지 않는다
- 필요 도메인: oauth2.googleapis.com(토큰), searchconsole.googleapis.com(API)
- 서비스 계정은 Search Console 속성에 "제한된" 사용자로 추가돼 있어야 한다 (읽기 전용)
"""

import argparse
import base64
import datetime as dt
import json
import os
import pathlib
import sys
import urllib.parse

import requests
from google.auth.exceptions import RefreshError
from google.auth.transport.requests import Request
from google.oauth2 import service_account

SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"]
API = "https://searchconsole.googleapis.com"
SITE_ORIGIN = "https://tool-proof.com"
POSTS_DIR = pathlib.Path(__file__).resolve().parents[2] / "content" / "posts"


def load_token() -> str:
    raw = os.environ.get("GSC_SERVICE_ACCOUNT_JSON_B64", "").strip()
    if not raw:
        sys.exit("GSC_SERVICE_ACCOUNT_JSON_B64 환경변수가 없습니다 (클라우드 환경 설정 → 새 세션부터 적용).")
    try:
        info = json.loads(base64.b64decode(raw))
    except ValueError:
        sys.exit("GSC_SERVICE_ACCOUNT_JSON_B64를 base64 JSON으로 해석할 수 없습니다 (줄바꿈·따옴표 포함 여부 확인).")
    creds = service_account.Credentials.from_service_account_info(info, scopes=SCOPES)
    try:
        creds.refresh(Request())
    except RefreshError as error:
        sys.exit(f"토큰 발급 실패: 키가 삭제됐거나 잘못됐을 수 있습니다 (Google Cloud에서 키 상태 확인). {error.args[0]}")
    return creds.token


def call(method: str, url: str, token: str, body: dict | None = None) -> dict:
    res = requests.request(method, url, headers={"Authorization": f"Bearer {token}"}, json=body, timeout=30)
    if res.status_code == 403:
        sys.exit(f"403 권한 없음: 서비스 계정이 Search Console 속성의 사용자로 추가됐는지 확인하세요.\n{res.text[:300]}")
    res.raise_for_status()
    return res.json()


def site_path(site: str) -> str:
    return urllib.parse.quote(site, safe="")


def search_analytics(token: str, site: str, start: str, end: str, dimensions: list[str], limit: int = 25) -> list[dict]:
    body = {"startDate": start, "endDate": end, "dimensions": dimensions, "rowLimit": limit, "dataState": "all"}
    url = f"{API}/webmasters/v3/sites/{site_path(site)}/searchAnalytics/query"
    return call("POST", url, token, body).get("rows", [])


def fmt_row(row: dict) -> str:
    return f"{row.get('clicks', 0):.0f} | {row.get('impressions', 0):.0f} | {row.get('ctr', 0) * 100:.1f}% | {row.get('position', 0):.1f}"


def post_urls() -> list[str]:
    return sorted(f"{SITE_ORIGIN}/posts/{p.stem}" for p in POSTS_DIR.glob("*.mdx"))


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--site", default="sc-domain:tool-proof.com")
    parser.add_argument("--days", type=int, default=28)
    parser.add_argument("--no-inspect", action="store_true", help="글별 URL 검사 생략 (하루 2,000회 할당량)")
    args = parser.parse_args()

    token = load_token()
    end = dt.date.today()
    start = end - dt.timedelta(days=args.days)
    print(f"## Search Console ({args.site}, {start} ~ {end}, 최신 미확정 데이터 포함)\n")

    total = search_analytics(token, args.site, str(start), str(end), [], 1)
    print("| 클릭 | 노출 | CTR | 평균 순위 |\n| --- | --- | --- | --- |")
    print(f"| {fmt_row(total[0])} |" if total else "| 0 | 0 | - | - |")

    for dim, title in (("page", "페이지"), ("query", "검색어")):
        rows = search_analytics(token, args.site, str(start), str(end), [dim])
        print(f"\n### {title}별 (상위 {len(rows)})\n")
        if not rows:
            print("데이터 없음")
            continue
        print(f"| {title} | 클릭 | 노출 | CTR | 평균 순위 |\n| --- | --- | --- | --- | --- |")
        for row in rows:
            print(f"| {row['keys'][0]} | {fmt_row(row)} |")

    sitemaps = call("GET", f"{API}/webmasters/v3/sites/{site_path(args.site)}/sitemaps", token).get("sitemap", [])
    print("\n### 사이트맵\n")
    print("| 경로 | 제출 | 마지막 다운로드 | 대기 | 오류 | 경고 |\n| --- | --- | --- | --- | --- | --- |")
    for sm in sitemaps:
        print(
            f"| {sm.get('path')} | {sm.get('lastSubmitted', '-')} | {sm.get('lastDownloaded', '-')} "
            f"| {sm.get('isPending', False)} | {sm.get('errors', 0)} | {sm.get('warnings', 0)} |"
        )

    if args.no_inspect:
        return
    print("\n### 글별 색인 상태 (URL 검사)\n")
    print("| URL | 판정 | 상태 | 마지막 크롤링 | 가져오기 |\n| --- | --- | --- | --- | --- |")
    for url in post_urls():
        body = {"inspectionUrl": url, "siteUrl": args.site}
        result = call("POST", f"{API}/v1/urlInspection/index:inspect", token, body)
        idx = result.get("inspectionResult", {}).get("indexStatusResult", {})
        print(
            f"| {url.removeprefix(SITE_ORIGIN)} | {idx.get('verdict', '-')} | {idx.get('coverageState', '-')} "
            f"| {idx.get('lastCrawlTime', '-')} | {idx.get('pageFetchState', '-')} |"
        )


if __name__ == "__main__":
    main()
