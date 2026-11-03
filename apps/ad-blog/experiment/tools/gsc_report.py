"""Search Console 리포트 (ToolProof 운영 실험용)

환경변수 GSC_SERVICE_ACCOUNT_JSON_B64(서비스 계정 JSON 키를 base64로 인코딩한 값)로 인증해
검색 성과·사이트맵 상태·글별 색인 상태·AdSense 재신청 조건(운영 일수·색인율·월~일 확정 주 클릭 연속 증가)을
Markdown으로 출력한다. 출력은 log.md에 붙여 넣는 용도.

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
import time
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
RETRY_WAITS = (5, 20, 60)  # 일시 오류(시간 초과·연결 끊김·5xx) 재시도 대기(초). URL 검사 API가 간헐적으로 500·시간 초과를 냄 (2026-10-29 세션 64)

# AdSense 재신청 조건 (README 결정사항 "AdSense 재신청", 2026-11-01 사용자 결정)과 같게 유지
LAUNCH_DATE = dt.date(2026, 10, 11)  # 도메인 운영 시작
ADSENSE_AFTER = dt.date(2027, 1, 11)  # ① 운영 3개월
ADSENSE_INDEX_RATE = 0.7  # ② 색인율
ADSENSE_CLICK_STREAK = 4  # ③ 주간 검색 클릭이 직전 주보다 늘어난 주가 연속 4주
KST = dt.timezone(dt.timedelta(hours=9))  # 운영 일수는 한국 날짜로 셈 (log.md 세션 날짜와 같게)


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
    for wait in (*RETRY_WAITS, None):
        try:
            res = requests.request(method, url, headers={"Authorization": f"Bearer {token}"}, json=body, timeout=30)
        except (requests.Timeout, requests.ConnectionError):
            if wait is None:
                raise
        else:
            if res.status_code < 500 or wait is None:
                break
        print(f"일시 오류 → {wait}초 뒤 다시 시도: {url}", file=sys.stderr)
        time.sleep(wait)
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


def first_monday() -> dt.date:
    """주간 집계 시작일: 운영 시작일 당일이 월요일이면 그날, 아니면 다음 월요일 (운영 하루뿐인 첫 주를 빼야 첫 증가가 부풀지 않음)"""
    return LAUNCH_DATE + dt.timedelta(days=(7 - LAUNCH_DATE.weekday()) % 7)


def weekly_clicks(days: list[dict], final_dates: set[str]) -> list[dict]:
    """월~일 주별 웹 검색 클릭·노출 [{start, end, clicks, impressions, complete}] (AdSense 조건 ③).

    days = 날짜 차원 search_analytics 행(미확정 포함), final_dates = 확정(final) 데이터가 있는 날짜.
    날짜는 Search Console 날짜(태평양 시간). 첫 월요일부터 마지막 집계일이 든 주까지, 행이 없는 주는 0.
    complete = 그 주 일요일까지 확정 데이터가 있음. 미확정 날짜가 섞인 주는 조건 판정에 쓰지 않음
    (끝 날짜를 매일 옮기는 7일 창은 미확정 2~3일 때문에 마지막 주가 작게 나와 증가 판정이 흔들림, 2026-11-03 세션 76)"""
    start = first_monday()
    by_date = {r["keys"][0]: r for r in days if r["keys"][0] >= str(start)}
    if not by_date:
        return []
    last_day = max(dt.date.fromisoformat(d) for d in by_date)
    last_final = max((dt.date.fromisoformat(d) for d in final_dates), default=None)
    weeks = []
    monday = start
    while monday <= last_day:
        sunday = monday + dt.timedelta(days=6)
        rows = [by_date[str(monday + dt.timedelta(days=i))] for i in range(7) if str(monday + dt.timedelta(days=i)) in by_date]
        weeks.append({
            "start": str(monday),
            "end": str(sunday),
            "clicks": int(sum(r["clicks"] for r in rows)),
            "impressions": int(sum(r["impressions"] for r in rows)),
            "complete": last_final is not None and sunday <= last_final,
        })
        monday += dt.timedelta(days=7)
    return weeks


def adsense_status(weeks: list[dict], indexed: int | None, total: int, today: dt.date | None = None) -> dict:
    """AdSense 재신청 조건 3개의 현재 값. indexed = URL 검사 PASS 글 수 (검사를 건너뛰면 None → 조건 ② 판정 없음).
    clickStreak = 마지막 확정 주부터 거슬러 올라가며 직전 주보다 클릭이 많았던 주가 몇 주 연속인지"""
    today = today or dt.datetime.now(KST).date()
    done = [w for w in weeks if w["complete"]]
    streak = 0
    for prev, cur in zip(reversed(done[:-1]), reversed(done)):
        if cur["clicks"] <= prev["clicks"]:
            break
        streak += 1
    rate = round(indexed / total, 3) if indexed is not None and total else None
    met = {
        "age": today >= ADSENSE_AFTER,
        "indexRate": None if rate is None else rate >= ADSENSE_INDEX_RATE,
        "clicks": streak >= ADSENSE_CLICK_STREAK,
    }
    return {
        "today": str(today),
        "operatingDays": (today - LAUNCH_DATE).days,
        "requiredDays": (ADSENSE_AFTER - LAUNCH_DATE).days,
        "eligibleFrom": str(ADSENSE_AFTER),
        "indexed": indexed,
        "total": total,
        "indexRate": rate,
        "indexRateTarget": ADSENSE_INDEX_RATE,
        "weeks": weeks,
        "clickStreak": streak,
        "clickStreakTarget": ADSENSE_CLICK_STREAK,
        "met": met,
        "allMet": all(met.values()),
    }


def adsense_lines(status: dict) -> list[str]:
    """log.md에 그대로 붙이는 AdSense 재신청 조건 요약 (한 줄 + 주별 표)"""
    s = status
    age = f"운영 {s['operatingDays']}일/{s['requiredDays']}일({s['eligibleFrom']})"
    if s["indexRate"] is None:
        index = "색인율 - (URL 검사 생략)"
    else:
        index = f"색인율 {round(s['indexRate'] * 100)}%({s['indexed']}/{s['total']}, 목표 {round(s['indexRateTarget'] * 100)}%)"
    done = [w for w in s["weeks"] if w["complete"]]
    span = " → ".join(f"{w['start'][5:]}~{w['end'][5:]} {w['clicks']}" for w in done[-(s["clickStreakTarget"] + 1):]) or "확정 주 없음"
    clicks = f"주간 클릭 증가 {s['clickStreak']}주/{s['clickStreakTarget']}주 (월~일 확정 주: {span})"
    verdict = "**모두 충족 → 사용자: AdSense 재신청**" if s["allMet"] else "미충족"
    lines = [f"- {age} · {index} · {clicks} → {verdict}", "", "| 주 (월~일, 태평양 시간) | 클릭 | 노출 | 확정 |", "| --- | --- | --- | --- |"]
    lines += [f"| {w['start']} ~ {w['end'][5:]} | {w['clicks']} | {w['impressions']} | {'확정' if w['complete'] else '미확정 포함'} |" for w in s["weeks"]]
    return lines


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

    indexed = None
    urls = post_urls()
    if not args.no_inspect:
        indexed = 0
        print("\n### 글별 색인 상태 (URL 검사)\n")
        print("| URL | 판정 | 상태 | 마지막 크롤링 | 가져오기 |\n| --- | --- | --- | --- | --- |")
        for url in urls:
            body = {"inspectionUrl": url, "siteUrl": args.site}
            result = call("POST", f"{API}/v1/urlInspection/index:inspect", token, body)
            idx = result.get("inspectionResult", {}).get("indexStatusResult", {})
            indexed += idx.get("verdict") == "PASS"
            print(
                f"| {url.removeprefix(SITE_ORIGIN)} | {idx.get('verdict', '-')} | {idx.get('coverageState', '-')} "
                f"| {idx.get('lastCrawlTime', '-')} | {idx.get('pageFetchState', '-')} |"
            )

    # AdSense 재신청 조건: 주간 클릭은 --days와 상관없이 첫 월요일부터 월~일 주로 셈
    since, until = str(first_monday()), str(dt.date.today())
    final_dates = {r["keys"][0] for r in search_analytics(token, args.site, since, until, ["date"], 1000, data_state="final")}
    days = search_analytics(token, args.site, since, until, ["date"], 1000)
    print("\n### AdSense 재신청 조건\n")
    print("\n".join(adsense_lines(adsense_status(weekly_clicks(days, final_dates), indexed, len(urls)))))


if __name__ == "__main__":
    main()
