"""글 본문의 외부 링크(1차 출처)가 아직 살아 있는지 점검한다.

2026-11-07 세션 87 (`seo-audit` Content Quality: Properly sourced claims / Accurate information, Internal Linking: No broken links).
글은 공식 문서·릴리스 노트를 출처로 링크하므로, 문서가 옮겨지거나 지워지면 독자가 근거를 확인할 수 없음.
내부 링크는 `link_audit.py`가 보고, 이 도구는 `content/posts/*.mdx`의 http(s) 링크만 봄.

실행: python3 -I apps/ad-blog/experiment/tools/extlink_check.py [--only-problems] [--json 저장경로] [--slug 글]
- 링크마다 GET(브라우저 User-Agent, 리디렉트 따라감, 25초, 실패·429면 한 번 더) 후 분류
  - broken: 404·410·그 밖의 4xx(400·401·403·429 제외)·5xx
  - soft404: 200이지만 `<title>`·첫 `<h1>`이 '찾을 수 없음' 문구 (Page not found, no longer available 등. 메뉴·스크립트 글자는 보지 않음)
  - moved: 200이지만 최종 주소의 호스트·경로가 원래와 다름 (도움말 홈·목록으로 보내는 경우가 많음 → 사람이 확인)
  - blocked: 400·401·403·429·봇 확인 화면 (컨테이너에서 확인 불가, README 인프라 상태의 차단 도메인.
    Meta 도움말(help.instagram.com·facebook.com·faq.whatsapp.com)은 브라우저가 아니면 400 "Error" → Chromium으로 따로 확인)
  - error: 연결 실패·시간 초과
  - ok: 위에 걸리지 않음
- 고칠지는 사람이 판단 (moved는 같은 문서가 새 주소로 옮겨진 정상 리디렉트도 걸림)
"""
import argparse
import concurrent.futures as cf
import datetime as dt
import html
import json
import re
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import defaultdict
from pathlib import Path
from zoneinfo import ZoneInfo

POSTS = Path(__file__).resolve().parents[2] / "content" / "posts"
OWN_HOSTS = {"tool-proof.com", "www.tool-proof.com"}
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"
TIMEOUT = 25
PER_HOST = 2
LINK_RE = re.compile(r"\]\((https?://(?:[^()\s]|\([^()\s]*\))+)\)|<(https?://[^>\s]+)>|href=\"(https?://[^\"]+)\"")
TITLE_RE = re.compile(r"<title[^>]*>(.*?)</title>", re.I | re.S)
NOT_FOUND_RE = re.compile(
    r"page not found|404 not found|\b404\b.{0,40}\b(error|page)\b|page (?:isn't|is not|is no longer) available|"
    r"no longer available|(?:article|page|content) (?:you requested|you're looking for) (?:doesn't|does not|can't|cannot|could not|couldn't)|"
    r"we can(?:'|no)t find (?:that|the|this) page|this page doesn't exist|requested (?:url|page) was not found",
    re.I,
)
CHALLENGE_RE = re.compile(r"just a moment|attention required|client challenge|verify you are human|access denied|unusual traffic", re.I)

_host_locks: dict[str, threading.Semaphore] = defaultdict(lambda: threading.Semaphore(PER_HOST))
_host_guard = threading.Lock()


def collect(slug: str | None) -> dict[str, set[str]]:
    urls: dict[str, set[str]] = defaultdict(set)
    for f in sorted(POSTS.glob("*.mdx")):
        if slug and f.stem != slug:
            continue
        text = f.read_text(encoding="utf-8")
        for m in LINK_RE.finditer(text):
            url = next(g for g in m.groups() if g)
            url = html.unescape(url).rstrip(".,")
            if urllib.parse.urlsplit(url).hostname in OWN_HOSTS:
                continue
            urls[url].add(f.stem)
    return urls


def norm(url: str) -> tuple[str, str]:
    p = urllib.parse.urlsplit(url)
    host = (p.hostname or "").lower().removeprefix("www.")
    path = urllib.parse.unquote(p.path).rstrip("/").lower() or "/"
    path = re.sub(r"^/(en-us|en-gb|en)(?=/|$)", "", path) or "/"
    return host, path


def fetch(url: str) -> dict:
    host = urllib.parse.urlsplit(url).hostname or ""
    with _host_guard:
        sem = _host_locks[host]
    last: dict = {}
    for attempt in range(2):
        with sem:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en-US,en;q=0.9", "Accept": "text/html,*/*"})
            try:
                with urllib.request.urlopen(req, timeout=TIMEOUT) as res:
                    body = res.read(400_000).decode("utf-8", "ignore")
                    last = {"status": res.status, "final": res.geturl(), "body": body}
            except urllib.error.HTTPError as e:
                try:
                    body = e.read(200_000).decode("utf-8", "ignore")
                except Exception:  # noqa: BLE001
                    body = ""
                last = {"status": e.code, "final": e.geturl() or url, "body": body}
            except Exception as e:  # noqa: BLE001
                last = {"status": None, "final": url, "body": "", "error": f"{type(e).__name__}: {e}"[:160]}
        if last.get("status") not in (None, 429, 500, 502, 503, 504):
            break
        time.sleep(3)
    return last


def classify(url: str, r: dict) -> tuple[str, str]:
    status = r.get("status")
    body = r.get("body", "")
    m = TITLE_RE.search(body)
    title = re.sub(r"\s+", " ", html.unescape(m.group(1))).strip()[:120] if m else ""
    if status is None:
        return "error", title
    text = re.sub(r"<(script|style|noscript)[^>]*>.*?</\1>", " ", body[:120_000], flags=re.I | re.S)
    head = (title + " " + re.sub(r"<[^>]+>", " ", text))[:20_000]
    if status in (400, 401, 403, 429) or (status >= 500 and CHALLENGE_RE.search(head)) or (status == 200 and CHALLENGE_RE.search(title)):
        return "blocked", title
    if status >= 400:
        return "broken", title
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", text, re.I | re.S)
    h1_text = re.sub(r"<[^>]+>", " ", h1.group(1)) if h1 else ""
    if NOT_FOUND_RE.search(title) or NOT_FOUND_RE.search(h1_text):
        return "soft404", title
    if norm(url) != norm(r["final"]):
        return "moved", title
    return "ok", title


ORDER = ["broken", "soft404", "moved", "error", "blocked", "ok"]
LABEL = {
    "broken": "깨짐 (4xx·5xx)",
    "soft404": "찾을 수 없음 화면 (soft 404)",
    "moved": "다른 주소로 이동 (확인 필요)",
    "error": "연결 실패",
    "blocked": "컨테이너에서 확인 불가 (400·401·403·429·봇 확인)",
    "ok": "정상",
}


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--only-problems", action="store_true")
    ap.add_argument("--json", help="전체 결과를 JSON으로 저장")
    ap.add_argument("--slug", help="이 글만")
    ap.add_argument("--workers", type=int, default=10)
    args = ap.parse_args()

    urls = collect(args.slug)
    results: dict[str, dict] = {}
    with cf.ThreadPoolExecutor(args.workers) as ex:
        futs = {ex.submit(fetch, u): u for u in urls}
        for fut in cf.as_completed(futs):
            u = futs[fut]
            r = fut.result()
            kind, title = classify(u, r)
            results[u] = {"kind": kind, "status": r.get("status"), "final": r.get("final"), "title": title, "error": r.get("error"), "posts": sorted(urls[u])}

    by_kind: dict[str, list[str]] = defaultdict(list)
    for u, r in results.items():
        by_kind[r["kind"]].append(u)
    today = dt.datetime.now(ZoneInfo("Asia/Seoul")).strftime("%Y-%m-%d KST")
    print(f"## 외부 링크 점검 ({today}) — 고유 URL {len(results)}개, 글 {len({p for v in urls.values() for p in v})}편\n")
    print(" · ".join(f"{LABEL[k].split(' (')[0]} {len(by_kind[k])}" for k in ORDER))
    for k in ORDER:
        if args.only_problems and k in ("ok", "blocked"):
            continue
        if not by_kind[k]:
            continue
        print(f"\n### {LABEL[k]} ({len(by_kind[k])}개)\n")
        for u in sorted(by_kind[k], key=lambda x: (results[x]["posts"], x)):
            r = results[u]
            extra = f" → {r['final']}" if r["final"] and r["final"] != u else ""
            note = r["error"] or r["title"]
            print(f"- [{r['status']}] {u}{extra}" + (f" · \"{note}\"" if note else "") + f" · 글: {', '.join(r['posts'])}")
    if args.only_problems and by_kind["blocked"]:
        hosts = sorted({urllib.parse.urlsplit(u).hostname for u in by_kind["blocked"]})
        print(f"\n확인 불가 {len(by_kind['blocked'])}개 (호스트: {', '.join(hosts)})")
    if args.json:
        Path(args.json).write_text(json.dumps(results, ensure_ascii=False, indent=1), encoding="utf-8")


if __name__ == "__main__":
    main()
