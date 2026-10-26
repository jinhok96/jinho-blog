"""Google이 실제로 본 내부 링크 점검 (ToolProof 운영 실험용)

색인 안 된 글마다 "Google이 마지막으로 크롤링한 판에 그 글로 가는 링크가 있었는지"를 확인한다.
링크를 넣어도 링크한 글을 Google이 다시 크롤링하기 전에는 발견 경로가 되지 않으므로,
링크 보강(README 개선 세션 1번)이 아직 효과를 낼 수 있었는지 판단하는 데 쓴다 (traffic-playbook 노하우 9).

실행: /tmp/gsc/bin/python -I apps/ad-blog/experiment/tools/link_seen.py
      (설치는 gsc_report.py와 같음. URL 검사 할당량을 글 수 + 4회 씀)

- 크롤링된 페이지: 색인된 글과 홈·카테고리 첫 페이지 (URL 검사 lastCrawlTime)
- 그 시점의 판: origin/main 첫 부모 이력에서 크롤링 시각 이전 마지막 커밋 (배포 지연 몇 분은 무시)
- 그 판이 가진 링크: 글은 본문 `/posts/{slug}` 링크 + 관련 글 3개 + 이전·다음 글,
  홈은 허브(`hub: true`) + 최신 12편, 카테고리는 그 카테고리 최신 12편 (src/entities/post 규칙과 같게)
- `git fetch origin main`을 먼저 해 둬야 최신 이력을 봄
- dashboard_data.py가 `seen_links()`로 같은 계산을 회차마다 대시보드 DB(posts `seenLinks`·`firstSeenLinkAt`)에 남김
"""

import datetime as dt
import pathlib
import re
import subprocess
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import gsc_report as gsc  # noqa: E402

REPO = pathlib.Path(__file__).resolve().parents[4]
POSTS = "apps/ad-blog/content/posts"
SITE = "sc-domain:tool-proof.com"
PER_PAGE = 12  # src/core/config POSTS_PER_PAGE
RELATED = 3  # getRelatedPosts 기본 limit
CATEGORIES = ["ai-tools", "software", "news"]


def git(*args: str) -> str:
    return subprocess.run(["git", "-C", str(REPO), *args], capture_output=True, text=True, check=True).stdout


def parse_post(text: str) -> dict:
    """frontmatter에서 목록·관련 글 계산에 필요한 값만 읽음"""
    fm = text.split("---", 2)[1] if text.startswith("---") else ""
    tags = re.findall(r"^\s+-\s+(.+?)\s*$", fm.split("tags:", 1)[1], re.M) if "tags:" in fm else []

    def get(key: str) -> str:
        m = re.search(rf"^{key}:\s*(.+)$", fm, re.M)
        return m.group(1).strip().strip("'\"") if m else ""

    return {
        "category": get("category"),
        "createdAt": get("createdAt"),
        "hub": get("hub") == "true",
        "draft": get("draft") == "true",
        "tags": [t.strip("'\"") for t in tags],
        "links": set(re.findall(r"/posts/([a-z0-9-]+)", text.split("---", 2)[2] if fm else text)),
    }


def posts_at(rev: str) -> dict[str, dict]:
    names = [n for n in git("ls-tree", "--name-only", f"{rev}:{POSTS}").split() if n.endswith(".mdx")]
    posts = {n[:-4]: parse_post(git("show", f"{rev}:{POSTS}/{n}")) for n in names}
    return {slug: p for slug, p in posts.items() if not p["draft"]}


def newest_first(posts: dict[str, dict]) -> list[str]:
    return sorted(posts, key=lambda s: posts[s]["createdAt"], reverse=True)


def links_of(page: str, posts: dict[str, dict]) -> dict[str, str]:
    """페이지가 그 판에서 링크하는 글 → 링크 종류"""
    order = newest_first(posts)
    if page == "/":
        found = {s: "홈 허브" for s in order if posts[s]["hub"]}
        found.update({s: "홈 목록" for s in order[:PER_PAGE] if s not in found})
        return found
    if page.startswith("/categories/"):
        cat = page.rsplit("/", 1)[1]
        return {s: "카테고리 목록" for s in [s for s in order if posts[s]["category"] == cat][:PER_PAGE]}
    slug = page.rsplit("/", 1)[1]
    if slug not in posts:
        return {}
    me = posts[slug]
    found = {s: "본문" for s in me["links"] if s in posts and s != slug}
    scored = [
        (s, (2 if posts[s]["category"] == me["category"] else 0) + len(set(posts[s]["tags"]) & set(me["tags"])))
        for s in order
        if s != slug
    ]
    for s, _ in sorted([x for x in scored if x[1] > 0], key=lambda x: -x[1])[:RELATED]:
        found.setdefault(s, "관련 글")
    i = order.index(slug)
    for s in [order[i - 1] if i > 0 else None, order[i + 1] if i + 1 < len(order) else None]:
        if s:
            found.setdefault(s, "이전·다음")
    return found


def inspect(token: str, page: str) -> dict:
    """URL 검사 indexStatusResult (page는 `/`·`/categories/…`·`/posts/…` 경로)"""
    body = {"inspectionUrl": gsc.SITE_ORIGIN + page, "siteUrl": SITE}
    res = gsc.call("POST", f"{gsc.API}/v1/urlInspection/index:inspect", token, body)
    return res.get("inspectionResult", {}).get("indexStatusResult", {})


def crawl_time(idx: dict) -> dt.datetime | None:
    """색인된(PASS) 페이지의 마지막 크롤링 시각. 색인 안 됐으면 None (Google이 본 판이 없음)"""
    if idx.get("verdict") == "PASS" and idx.get("lastCrawlTime"):
        return dt.datetime.fromisoformat(idx["lastCrawlTime"].replace("Z", "+00:00"))
    return None


def list_pages() -> list[str]:
    """홈·카테고리 첫 페이지 (글 목록으로 링크하는 페이지, 글은 따로 검사)"""
    return ["/", *[f"/categories/{c}" for c in CATEGORIES]]


def seen_links(crawled: dict[str, dt.datetime], targets: set[str]) -> dict[str, list[dict]]:
    """targets 글마다 크롤링된 판에서 받은 링크 [{page, kind, crawl}] (crawled = 경로 → 마지막 크롤링)"""
    revs = [line.split(" ", 1) for line in git("log", "--first-parent", "origin/main", "--format=%H %cI").splitlines()]
    revs = [(h, dt.datetime.fromisoformat(t)) for h, t in revs]
    cache: dict[str, dict] = {}
    seen: dict[str, list[dict]] = {slug: [] for slug in targets}
    for page, when in sorted(crawled.items()):
        rev = next((h for h, t in revs if t <= when), None)
        if rev is None:
            continue
        posts = cache.setdefault(rev, posts_at(rev))
        for slug, kind in links_of(page, posts).items():
            if slug in seen:
                seen[slug].append({"page": page, "kind": kind, "crawl": when.strftime("%Y-%m-%dT%H:%M:%SZ")})
    return seen


def main() -> None:
    token = gsc.load_token()
    pages = [*list_pages(), *[u.removeprefix(gsc.SITE_ORIGIN) for u in gsc.post_urls()]]

    crawled, unknown = {}, []
    for page in pages:
        idx = inspect(token, page)
        if when := crawl_time(idx):
            crawled[page] = when
        elif page.startswith("/posts/"):
            unknown.append((page.rsplit("/", 1)[1], idx.get("coverageState", "-")))

    seen = seen_links(crawled, {slug for slug, _ in unknown})
    print(f"## Google이 본 링크 ({dt.date.today()}, 크롤링된 페이지 {len(crawled)}개 기준)\n")
    print("| 색인 안 된 글 | 상태 | 크롤링된 판에서 받은 링크 |\n| --- | --- | --- |")
    for slug, state in unknown:
        links = [f"{s['page']} ({s['kind']}, {s['crawl'][5:10]} {s['crawl'][11:16]})" for s in seen[slug]]
        print(f"| `{slug}` | {state} | {'<br>'.join(links) or '없음'} |")
    print(f"\n- 링크를 본 글 {sum(1 for s in seen.values() if s)}편 / 색인 안 된 글 {len(unknown)}편")
    last = max(crawled.values()) if crawled else None
    print(f"- 크롤링된 페이지 중 가장 최근 크롤링: {last:%Y-%m-%d %H:%M} UTC" if last else "- 크롤링된 페이지 없음")


if __name__ == "__main__":
    main()
