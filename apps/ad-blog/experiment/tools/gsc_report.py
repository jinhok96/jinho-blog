"""Search Console 리포트 (ToolProof 운영 실험용)

환경변수 GSC_SERVICE_ACCOUNT_JSON_B64(서비스 계정 JSON 키를 base64로 인코딩한 값)로 인증해
검색 성과·사이트맵 상태·글별 색인 상태를 Markdown으로 출력한다. 출력은 log.md에 붙여 넣는 용도.

설치: python3 -m venv /tmp/gsc && /tmp/gsc/bin/pip install google-auth requests
실행: /tmp/gsc/bin/python -I apps/ad-blog/experiment/tools/gsc_report.py [--days 28] [--site sc-domain:tool-proof.com]
개선 효과 판정: ... gsc_report.py --compare /posts/{slug} --changed YYYY-MM-DD --metric ctr|impressions|position
      [--window 28] [--type web|discover]
      → 변경 전후 같은 길이 기간을 비교하고, 같은 기간 나머지 글(대조군) 변화를 빼서 판정한다
        (판정 기준은 experiment/traffic-playbook.md "성과 검증")

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

# 개선 효과 판정 기준 (traffic-playbook.md "성과 검증"과 같게 유지)
MIN_IMPRESSIONS = 100  # 변경 전·후 기간 모두 이 이상이어야 판정
CTR_DELTA_PP = 1.0  # CTR: 대조군 대비 변화 ±1.0%p
IMPRESSIONS_LIFT = 1.2  # 노출: 대조군 대비 1.2배 이상 / 1/1.2배 이하
POSITION_DELTA = 2.0  # 평균 순위: 대조군 대비 ±2위
FINAL_DATA_LAG_DAYS = 3  # 확정 데이터 지연


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


def search_analytics(
    token: str,
    site: str,
    start: str,
    end: str,
    dimensions: list[str],
    limit: int = 25,
    *,
    page: str | None = None,
    search_type: str = "web",
    data_state: str = "all",
) -> list[dict]:
    body = {
        "startDate": start,
        "endDate": end,
        "dimensions": dimensions,
        "rowLimit": limit,
        "dataState": data_state,
        "type": search_type,
    }
    if page:
        body["dimensionFilterGroups"] = [{"filters": [{"dimension": "page", "operator": "equals", "expression": page}]}]
    url = f"{API}/webmasters/v3/sites/{site_path(site)}/searchAnalytics/query"
    return call("POST", url, token, body).get("rows", [])


def fmt_row(row: dict) -> str:
    return f"{row.get('clicks', 0):.0f} | {row.get('impressions', 0):.0f} | {row.get('ctr', 0) * 100:.1f}% | {row.get('position', 0):.1f}"


def post_urls() -> list[str]:
    return sorted(f"{SITE_ORIGIN}/posts/{p.stem}" for p in POSTS_DIR.glob("*.mdx"))


def window_stats(token: str, site: str, start: dt.date, end: dt.date, page: str, search_type: str) -> tuple[dict, dict]:
    """(대상 글, 대조군=사이트 전체-대상 글) 클릭·노출·CTR·평균 순위"""
    kwargs = {"search_type": search_type, "data_state": "final"}
    total = (search_analytics(token, site, str(start), str(end), [], 1, **kwargs) or [{}])[0]
    target = (search_analytics(token, site, str(start), str(end), [], 1, page=page, **kwargs) or [{}])[0]

    def pack(clicks: float, impressions: float, position: float) -> dict:
        return {"clicks": clicks, "impressions": impressions, "ctr": clicks / impressions if impressions else 0.0, "position": position}

    t_clicks, t_impr, t_pos = target.get("clicks", 0), target.get("impressions", 0), target.get("position", 0)
    a_clicks, a_impr, a_pos = total.get("clicks", 0), total.get("impressions", 0), total.get("position", 0)
    c_impr = a_impr - t_impr
    c_pos = (a_pos * a_impr - t_pos * t_impr) / c_impr if c_impr else 0.0
    return pack(t_clicks, t_impr, t_pos), pack(a_clicks - t_clicks, c_impr, c_pos)


def judge(metric: str, tb: dict, ta: dict, cb: dict, ca: dict) -> tuple[str, str]:
    """(판정, 근거) — 대상 글 변화에서 대조군 변화를 뺀 값으로 판정"""
    if tb["impressions"] < MIN_IMPRESSIONS or ta["impressions"] < MIN_IMPRESSIONS:
        return "보류", f"노출 부족 (전 {tb['impressions']:.0f} / 후 {ta['impressions']:.0f}, 기준 {MIN_IMPRESSIONS}회 이상)"
    if metric == "ctr":
        delta = ((ta["ctr"] - tb["ctr"]) - (ca["ctr"] - cb["ctr"])) * 100
        verdict = "효과 있음" if delta >= CTR_DELTA_PP else "역효과" if delta <= -CTR_DELTA_PP else "차이 없음"
        return verdict, f"CTR 대조군 대비 {delta:+.2f}%p (기준 ±{CTR_DELTA_PP}%p)"
    if metric == "impressions":
        t_ratio = ta["impressions"] / tb["impressions"]
        c_ratio = ca["impressions"] / cb["impressions"] if cb["impressions"] and ca["impressions"] else 1.0
        lift = t_ratio / c_ratio
        verdict = "효과 있음" if lift >= IMPRESSIONS_LIFT else "역효과" if lift <= 1 / IMPRESSIONS_LIFT else "차이 없음"
        return verdict, f"노출 대조군 대비 {lift:.2f}배 (대상 {t_ratio:.2f}배, 대조군 {c_ratio:.2f}배, 기준 {IMPRESSIONS_LIFT}배)"
    delta = (ta["position"] - tb["position"]) - (ca["position"] - cb["position"])
    verdict = "효과 있음" if delta <= -POSITION_DELTA else "역효과" if delta >= POSITION_DELTA else "차이 없음"
    return verdict, f"평균 순위 대조군 대비 {delta:+.1f}위 (음수가 개선, 기준 ±{POSITION_DELTA}위)"


def compare(token: str, args: argparse.Namespace) -> None:
    page = args.compare if args.compare.startswith("http") else f"{SITE_ORIGIN}{args.compare}"
    changed = dt.date.fromisoformat(args.changed)
    before = (changed - dt.timedelta(days=args.window), changed - dt.timedelta(days=1))
    after = (changed + dt.timedelta(days=1), changed + dt.timedelta(days=args.window))
    ready = after[1] + dt.timedelta(days=FINAL_DATA_LAG_DAYS)
    print(f"## 개선 효과 판정: {page.removeprefix(SITE_ORIGIN)} ({args.type}, 지표 {args.metric})\n")
    print(f"- 변경일 {changed}, 전 {before[0]} ~ {before[1]}, 후 {after[0]} ~ {after[1]} (각 {args.window}일, 확정 데이터)")
    if dt.date.today() < ready:
        print(f"- 판단 시점 전: {ready} 이후 다시 실행")
        return

    tb, cb = window_stats(token, args.site, *before, page, args.type)
    ta, ca = window_stats(token, args.site, *after, page, args.type)
    print("\n| 구분 | 클릭 | 노출 | CTR | 평균 순위 |\n| --- | --- | --- | --- | --- |")
    for label, row in (("대상 전", tb), ("대상 후", ta), ("대조군 전", cb), ("대조군 후", ca)):
        print(f"| {label} | {fmt_row(row)} |")
    verdict, reason = judge(args.metric, tb, ta, cb, ca)
    print(f"\n**판정: {verdict}** — {reason}")

    if args.type == "discover":  # Discover는 검색어 데이터가 없음
        return
    for label, (start, end) in (("전", before), ("후", after)):
        rows = search_analytics(token, args.site, str(start), str(end), ["query"], 10, page=page, search_type=args.type)
        print(f"\n### 대상 글 검색어 ({label}, 상위 {len(rows)})\n")
        if not rows:
            print("데이터 없음")
            continue
        print("| 검색어 | 클릭 | 노출 | CTR | 평균 순위 |\n| --- | --- | --- | --- | --- |")
        for row in rows:
            print(f"| {row['keys'][0]} | {fmt_row(row)} |")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--site", default="sc-domain:tool-proof.com")
    parser.add_argument("--days", type=int, default=28)
    parser.add_argument("--no-inspect", action="store_true", help="글별 URL 검사 생략 (하루 2,000회 할당량)")
    parser.add_argument("--compare", metavar="PAGE", help="개선 효과 판정 대상 글 (/posts/{slug} 또는 전체 URL)")
    parser.add_argument("--changed", metavar="YYYY-MM-DD", help="--compare: 변경을 배포한 날")
    parser.add_argument("--metric", choices=["ctr", "impressions", "position"], default="ctr", help="--compare: 판정 지표")
    parser.add_argument("--window", type=int, default=28, help="--compare: 전·후 비교 기간(일)")
    parser.add_argument("--type", choices=["web", "discover"], default="web", help="--compare: 검색 유형")
    args = parser.parse_args()
    if args.compare and not args.changed:
        parser.error("--compare에는 --changed가 필요합니다")
    if args.type == "discover" and args.metric == "position":
        parser.error("Discover에는 평균 순위가 없습니다 (--metric ctr 또는 impressions)")

    token = load_token()
    if args.compare:
        compare(token, args)
        return
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
