"""대형 IT 블로그 제목·본문 패턴 분석 (ToolProof 운영 실험용)

표준 라이브러리만 사용한다. 대형 블로그 RSS에서 최근 글을 받아 글 유형 비율, 유형별 제목 특징,
본문 구조(분량·소제목·이미지·표·목록·링크)를 집계해 Markdown으로 출력한다.
결과 해석은 experiment/traffic-playbook.md에 기록한다. 원문은 저장소에 커밋하지 않는다.

실행:
  python3 -I apps/ad-blog/experiment/tools/blog_patterns.py [--cache 디렉터리]

- 피드별로 실패해도 나머지는 계속 집계한다 (네트워크 정책이 바뀔 수 있음)
- 유형 분류는 제목 정규식 기반이라 오분류가 있다. 비율은 경향을 보는 용도
"""

import argparse
import html
import os
import re
import statistics
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

UA = "Mozilla/5.0 (X11; Linux x86_64)"
TIMEOUT = 30

# 피드: 이름 → (URL, 본문 포함 여부)
FEEDS = {
    "Tom's Guide": ("https://www.tomsguide.com/feeds.xml", True),
    "TechRadar": ("https://www.techradar.com/feeds.xml", True),
    "Windows Central": ("https://www.windowscentral.com/feeds.xml", True),
    "Laptop Mag": ("https://www.laptopmag.com/feeds.xml", True),
    "Lifehacker": ("https://lifehacker.com/feed/rss", True),
    "PCWorld": ("https://www.pcworld.com/feed", True),
    "Ars Technica": ("https://arstechnica.com/feed/", True),
    "9to5Google": ("https://9to5google.com/feed/", False),
    "9to5Mac": ("https://9to5mac.com/feed/", False),
    "PCMag": ("https://www.pcmag.com/feeds/rss/latest", False),
    "Engadget": ("https://www.engadget.com/rss.xml", False),
    "Wired": ("https://www.wired.com/feed/rss", False),
}

# 글 유형 (위에서부터 먼저 맞는 것 하나)
TYPES = [
    ("deal", r"\bdeals?\b|% off|\bsale\b|price drop|prime day|\bcoupon"),
    ("recurring", r"hints and answers|\btoday \(|\bthis week\b|\(oct\.|week \d+\b|\bnyt\b|how to watch|live stream|what to watch"),
    ("howto", r"^how to\b|\bhow to\b|^how i\b|\bhere's how\b"),
    ("fix", r"\bhow to fix\b|\bfix(ed|es)? (your|the|my|it)\b|not working|\berror\b|won't (turn|work|open|load|connect|charge|start|sync)|doesn't work"),
    ("best", r"^(the )?best\b|\bbest \w+ (for|in|of)\b|top picks|\bour \d+ (top|favorite)"),
    ("vs", r"\bvs\.?\b|\bversus\b"),
    ("firstperson", r"\bi (tried|tested|used|switched|stopped|asked|turned|found|ditched|replaced|made|put|spent|gave|compared|wore|ran)\b|\bi've\b|\bi'm\b|\bmy \w+ (is|was|for|after)\b"),
    ("explainer", r"^(what|why|is|are|should|can|does|do|when)\b|\bshould you\b|\bwhat to know\b|\bexplained\b|\beverything you need"),
    ("listicle", r"^(\d+|these \d+|the \d+)\b|\b\d+ (ways|things|reasons|tips|features|settings|apps|tools|tricks|mistakes|signs)\b"),
    ("review", r"\breview\b|\bhands-on\b"),
]

# 제목 특징
FEATURES = {
    "숫자로 시작/목록 수": r"^(\d+|these \d+|the \d+)\b|\b\d+ (ways|things|reasons|tips|features|settings|apps|tools|tricks|mistakes|signs)\b",
    "you/your": r"\byou\b|\byour\b|\byou're\b",
    "1인칭 I/my": r"\bi\b|\bi've\b|\bi'm\b|\bmy\b",
    "here's/what to know": r"here'?s\b|what to know|need to know",
    "질문형(?)": r"\?",
    "연도": r"\b20\d\d\b",
    "콜론·대시 2단 구조": r":| — | – | - ",
    "test/tried": r"\btest(ed|ing)?\b|\btried\b",
    "free": r"\bfree\b",
    "new/just": r"\bnew\b|\bjust\b",
}


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
        return r.read()


def text(el):
    return (el.text or "") if el is not None else ""


def parse_items(raw):
    root = ET.fromstring(raw)
    items = []
    for it in root.iter("item"):
        fields = {}
        for c in it:
            tag = c.tag.split("}")[-1]
            val = c.text or ""
            # content:encoded / content / description 중 가장 긴 것을 본문으로
            if tag in ("encoded", "content", "description") and len(val) > len(fields.get("body", "")):
                fields["body"] = val
            elif tag in ("title", "link") and tag not in fields:
                fields[tag] = val
        items.append(fields)
    return items


def classify(title):
    t = title.lower()
    for name, pattern in TYPES:
        if re.search(pattern, t):
            return name
    return "news/other"


def body_stats(body, site_host):
    h = body
    words = len(re.sub(r"<[^>]+>", " ", html.unescape(h)).split())
    first_h2 = re.search(r"<h2", h, re.I)
    lead = h[: first_h2.start()] if first_h2 else h
    lead_words = len(re.sub(r"<[^>]+>", " ", html.unescape(lead)).split())
    links = re.findall(r'<a [^>]*href="([^"]+)"', h, re.I)
    internal = sum(1 for u in links if site_host in urllib.parse.urlparse(u).netloc)
    low = h.lower()
    return {
        "words": words,
        "lead_words": lead_words,
        "h2": len(re.findall(r"<h2", h, re.I)),
        "h3": len(re.findall(r"<h3", h, re.I)),
        "img": len(re.findall(r"<img|<figure", h, re.I)),
        "table": len(re.findall(r"<table", h, re.I)),
        "ol": len(re.findall(r"<ol", h, re.I)),
        "ul": len(re.findall(r"<ul", h, re.I)),
        "internal_links": internal,
        "external_links": len(links) - internal,
        "faq": 1 if re.search(r">\s*(faq|frequently asked)", low) else 0,
        "jump": 1 if re.search(r"jump to|quick links|table of contents", low) else 0,
        "summary_box": 1 if re.search(r"key takeaways|quick list|the quick list|tl;dr|bottom line|our verdict|quick answer", low) else 0,
        "video": 1 if re.search(r"<iframe|youtube\.com/embed|jwplayer", low) else 0,
    }


def pct(n, d):
    return f"{n / d * 100:.0f}%" if d else "-"


def med(vals):
    return f"{statistics.median(vals):.0f}" if vals else "-"


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--cache", help="피드 원문을 저장·재사용할 디렉터리 (재분석용)")
    args = p.parse_args()

    rows = []
    for site, (url, has_body) in FEEDS.items():
        try:
            path = os.path.join(args.cache, re.sub(r"\W+", "_", site) + ".xml") if args.cache else None
            if path and os.path.exists(path):
                raw = open(path, "rb").read()
            else:
                raw = fetch(url)
                if path:
                    os.makedirs(args.cache, exist_ok=True)
                    open(path, "wb").write(raw)
            host = urllib.parse.urlparse(url).netloc.replace("www.", "")
            for it in parse_items(raw):
                title = html.unescape(it.get("title", "")).strip()
                if not title:
                    continue
                row = {"site": site, "title": title, "type": classify(title)}
                if has_body and len(it.get("body", "")) > 1500:
                    row.update(body_stats(it["body"], host))
                rows.append(row)
        except Exception as e:  # noqa: BLE001 - 피드별 실패는 기록만
            print(f"<!-- {site} 실패: {e} -->", file=sys.stderr)

    total = len(rows)
    sites = sorted({r["site"] for r in rows})
    print(f"# 대형 블로그 패턴 집계\n\n- 표본: {total}편, {len(sites)}개 사이트 ({', '.join(sites)})\n")

    # 1. 유형 비율
    type_names = [t for t, _ in TYPES] + ["news/other"]
    print("## 글 유형 비율\n\n| 유형 | 편수 | 비율 | 예시 |\n| --- | --- | --- | --- |")
    for t in type_names:
        rs = [r for r in rows if r["type"] == t]
        ex = rs[0]["title"][:90] if rs else ""
        print(f"| {t} | {len(rs)} | {pct(len(rs), total)} | {ex} |")

    # 2. 제목 특징 (전체 / 비뉴스 유형)
    evergreen = [r for r in rows if r["type"] not in ("news/other", "deal", "recurring")]
    print("\n## 제목 특징\n\n| 특징 | 전체 | 비뉴스(how-to·best·vs·설명·목록·1인칭 등) |\n| --- | --- | --- |")
    for name, pattern in FEATURES.items():
        a = sum(1 for r in rows if re.search(pattern, r["title"], re.I))
        b = sum(1 for r in evergreen if re.search(pattern, r["title"], re.I))
        print(f"| {name} | {pct(a, total)} | {pct(b, len(evergreen))} |")
    lens = [len(r["title"]) for r in rows]
    wl = [len(r["title"].split()) for r in rows]
    print(f"| 제목 길이 중앙값 | {med(lens)}자 / {med(wl)}단어 | {med([len(r['title']) for r in evergreen])}자 |")

    # 3. 유형별 본문 구조 (본문이 있는 피드만)
    keys = ["words", "lead_words", "h2", "h3", "img", "table", "ol", "internal_links", "external_links"]
    flags = ["faq", "jump", "summary_box", "video"]
    print("\n## 유형별 본문 구조 (중앙값, 본문 포함 피드만)\n")
    print("| 유형 | n | 단어 | 첫 소제목 전 단어 | h2 | h3 | 이미지 | 표 | 번호 목록 | 내부 링크 | 외부 링크 | FAQ | 목차 | 요약 박스 | 영상 |")
    print("| --- " * 16 + "|")
    for t in type_names:
        rs = [r for r in rows if r["type"] == t and "words" in r]
        if len(rs) < 3:
            continue
        cells = [med([r[k] for r in rs]) for k in keys] + [pct(sum(r[f] for r in rs), len(rs)) for f in flags]
        print(f"| {t} | {len(rs)} | " + " | ".join(cells) + " |")

    # 4. 사이트별 유형 분포
    print("\n## 사이트별 유형 분포\n\n| 사이트 | n | " + " | ".join(type_names) + " |\n| --- " * 1 + "| --- " * (len(type_names) + 1) + "|")
    for s in sites:
        rs = [r for r in rows if r["site"] == s]
        print(f"| {s} | {len(rs)} | " + " | ".join(pct(sum(1 for r in rs if r["type"] == t), len(rs)) for t in type_names) + " |")

    # 5. 유형별 제목 예시 (패턴 확인용)
    print("\n## 유형별 제목 예시\n")
    for t in type_names:
        rs = [r for r in rows if r["type"] == t][:6]
        if rs:
            print(f"- **{t}**: " + " / ".join(f"{r['title']} ({r['site']})" for r in rs))


if __name__ == "__main__":
    main()
