"""주제 발굴·수요 확인 리포트 (ToolProof 운영 실험용)

표준 라이브러리만 사용한다 (설치 불필요). 출력은 Markdown이며 log.md·backlog.md 근거로 붙여 넣는 용도.

실행:
  python3 -I apps/ad-blog/experiment/tools/demand_check.py discover [--days 7]
      → Google Trends 미국 급상승 + 공식 릴리스 피드 + CISA 악용 취약점(소비자 제품)의 최근 항목
  python3 -I apps/ad-blog/experiment/tools/demand_check.py suggest "windows 10 esu" ["키워드" ...]
      → Google·Bing·YouTube 자동완성 하위 검색어 (수요 확인, 소제목·FAQ 후보)

- 소스별로 실패해도 나머지는 계속 출력한다 (네트워크 정책이 바뀔 수 있음)
- 자동완성은 검색량 수치가 아니다. 하위 검색어가 여러 곳에서 나오면 수요가 있다고 본다
"""

import argparse
import datetime as dt
import email.utils
import json
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

UA = "Mozilla/5.0 (X11; Linux x86_64)"
TIMEOUT = 20

TRENDS_RSS = "https://trends.google.com/trending/rss?geo=US"

# 공식 릴리스·공지 피드 (RSS 또는 Atom)
FEEDS = {
    "Windows Blog": "https://blogs.windows.com/feed/",
    "Chrome Releases": "https://chromereleases.googleblog.com/feeds/posts/default",
    "Google Workspace Updates": "https://workspaceupdates.googleblog.com/feeds/posts/default",
    "Google Blog": "https://blog.google/rss/",
    "OpenAI News": "https://openai.com/news/rss.xml",
    "Apple Newsroom": "https://www.apple.com/newsroom/rss-feed.rss",
}

# 피드별 제목 필터 (Chrome Releases는 Dev·Beta·ChromeOS 항목이 많아 데스크톱·모바일 Stable만)
TITLE_FILTERS = {
    "Chrome Releases": lambda title: "Stable" in title and "ChromeOS" not in title,
}

# 피드가 없거나 HTML이라 직접 열어 확인하는 곳
MANUAL_PAGES = {
    "Windows 메시지 센터 (종료·인증서 만료 공지)": "https://learn.microsoft.com/en-us/windows/release-health/windows-message-center",
    "Gemini 릴리스 노트": "https://gemini.google/release-notes/",
    "Anthropic 뉴스": "https://www.anthropic.com/news",
    "Apple 보안 업데이트": "https://support.apple.com/en-us/100100",
    "Microsoft 365 로드맵": "https://www.microsoft.com/en-us/microsoft-365/roadmap",
    "Chrome 도움말 커뮤니티 (질문 제목)": "https://support.google.com/chrome/community",
    "Apple Discussions (질문 제목)": "https://discussions.apple.com/",
}

CISA_KEV = "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json"
CONSUMER_VENDORS = {"Microsoft", "Google", "Apple", "Mozilla", "Samsung", "Adobe", "Zoom"}

SUGGEST = {
    "Google": "https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=us&q={q}",
    "Bing": "https://api.bing.com/osjson.aspx?query={q}",
    "YouTube": "https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=en&gl=us&q={q}",
}


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as res:
        return res.read()


def md(text: str) -> str:
    return " ".join(text.split()).replace("|", "\\|")


def parse_date(text: str | None) -> dt.datetime | None:
    if not text:
        return None
    text = text.strip()
    try:
        parsed = email.utils.parsedate_to_datetime(text)
    except (TypeError, ValueError):
        try:
            parsed = dt.datetime.fromisoformat(text.replace("Z", "+00:00"))
        except ValueError:
            return None
    return parsed if parsed.tzinfo else parsed.replace(tzinfo=dt.timezone.utc)


def feed_items(xml: bytes) -> list[tuple[dt.datetime | None, str, str]]:
    """RSS 2.0과 Atom 모두 (날짜, 제목, 링크) 목록으로 변환"""
    root = ET.fromstring(xml)
    atom = "{http://www.w3.org/2005/Atom}"
    items = []
    for item in root.iter("item"):
        items.append((parse_date(item.findtext("pubDate")), item.findtext("title") or "", item.findtext("link") or ""))
    for entry in root.iter(f"{atom}entry"):
        link = ""
        for el in entry.findall(f"{atom}link"):
            if el.get("rel", "alternate") == "alternate":
                link = el.get("href", "")
        date = entry.findtext(f"{atom}published") or entry.findtext(f"{atom}updated")
        items.append((parse_date(date), entry.findtext(f"{atom}title") or "", link))
    return items


def discover(days: int) -> None:
    since = dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=days)
    print(f"## 주제 발굴 ({dt.date.today()} 기준 최근 {days}일)\n")

    print("### Google Trends 미국 급상승\n")
    try:
        titles = [title for _, title, _ in feed_items(fetch(TRENDS_RSS))]
        print(", ".join(md(t) for t in titles) or "항목 없음", "\n")
    except Exception as e:  # noqa: BLE001 - 소스별 실패는 기록만 하고 계속
        print(f"실패: {e}\n")

    print("### 공식 릴리스 피드\n")
    print("| 소스 | 날짜 | 제목 |\n| --- | --- | --- |")
    for name, url in FEEDS.items():
        try:
            keep = TITLE_FILTERS.get(name, lambda _: True)
            items = [i for i in feed_items(fetch(url)) if i[0] and i[0] >= since and keep(i[1])]
        except Exception as e:  # noqa: BLE001
            print(f"| {name} | - | 실패: {md(str(e))} |")
            continue
        if not items:
            print(f"| {name} | - | 최근 항목 없음 |")
        for date, title, link in sorted(items, key=lambda i: i[0], reverse=True):
            print(f"| {name} | {date:%Y-%m-%d} | [{md(title)}]({link}) |")

    print("\n### CISA 악용 취약점 (소비자 제품)\n")
    try:
        vulns = json.loads(fetch(CISA_KEV))["vulnerabilities"]
        recent = [
            v for v in vulns
            if v["vendorProject"] in CONSUMER_VENDORS and dt.date.fromisoformat(v["dateAdded"]) >= since.date()
        ]
        if not recent:
            print("최근 항목 없음")
        else:
            print("| 추가일 | 제품 | CVE | 이름 |\n| --- | --- | --- | --- |")
            for v in sorted(recent, key=lambda v: v["dateAdded"], reverse=True):
                print(f"| {v['dateAdded']} | {md(v['vendorProject'])} {md(v['product'])} | {v['cveID']} | {md(v['vulnerabilityName'])} |")
    except Exception as e:  # noqa: BLE001
        print(f"실패: {e}")

    print("\n### 직접 열어 확인할 곳\n")
    for name, url in MANUAL_PAGES.items():
        print(f"- [{name}]({url})")


def suggest(keywords: list[str]) -> None:
    print(f"## 자동완성 하위 검색어 ({dt.date.today()})\n")
    for keyword in keywords:
        q = urllib.parse.quote(keyword)
        found: dict[str, list[str]] = {}
        errors = []
        for source, template in SUGGEST.items():
            try:
                for phrase in json.loads(fetch(template.format(q=q)))[1]:
                    found.setdefault(phrase, []).append(source)
            except Exception as e:  # noqa: BLE001
                errors.append(f"{source} 실패: {e}")
        print(f"### {keyword}\n")
        print(f"하위 검색어 {len(found)}개 (여러 곳에서 나온 순)\n")
        print("| 검색어 | 출처 |\n| --- | --- |")
        for phrase, sources in sorted(found.items(), key=lambda kv: (-len(kv[1]), kv[0])):
            print(f"| {md(phrase)} | {', '.join(sources)} |")
        for err in errors:
            print(f"\n{err}")
        print()


def main() -> None:
    parser = argparse.ArgumentParser(description="ToolProof 주제 발굴·수요 확인")
    sub = parser.add_subparsers(dest="command", required=True)
    d = sub.add_parser("discover", help="급상승·공식 피드·CISA에서 새 주제 찾기")
    d.add_argument("--days", type=int, default=7)
    s = sub.add_parser("suggest", help="자동완성으로 수요 확인")
    s.add_argument("keywords", nargs="+")
    args = parser.parse_args()
    if args.command == "discover":
        discover(args.days)
    else:
        suggest(args.keywords)


if __name__ == "__main__":
    sys.exit(main())
