"""내부 링크·클러스터 점검 리포트 (ToolProof 운영 실험용)

clusters.md `## 클러스터 맵` 표와 content/posts/*.mdx 본문의 내부 링크(`](/posts/{slug})`)를 대조해
허브 ↔ 상시 글 ↔ 뉴스 칼럼 링크 규칙(clusters.md "규칙")을 지키는지 Markdown으로 출력한다.
표준 라이브러리만 사용한다. 출력은 log.md에 붙여 넣는 용도이며, 리포트라 종료 코드는 항상 0이다.

실행:
  python3 -I apps/ad-blog/experiment/tools/link_audit.py [--posts DIR] [--clusters FILE]
  python3 -I apps/ad-blog/experiment/tools/link_audit.py --only-problems
      → 문제 목록 중 문제가 있는 항목만 (세션 중 빠른 확인용)

- 클러스터 표는 열 이름(ID·허브·상시 글·뉴스 칼럼)으로 찾는다. slug는 백틱으로 감싸고, 없으면 `-`
- 내부 링크는 같은 글 쌍을 1개로 센다 (앵커 차이·자기 링크 무시)
- 초안(`draft: true`)도 점검하고 slug 옆에 (초안)으로 표시한다
"""

import argparse
import datetime as dt
import pathlib
import re
import sys
from collections import Counter, defaultdict

HERE = pathlib.Path(__file__).resolve().parent
POSTS_DIR = HERE.parents[1] / "content" / "posts"
CLUSTERS_FILE = HERE.parent / "clusters.md"

# 본문 내부 링크: Markdown `](/posts/slug…)`와 JSX `href="/posts/slug…"` (사이트 전체 URL 포함)
LINK_RE = re.compile(r"""(?:\]\(|href=["'])\s*(?:https?://(?:www\.)?tool-proof\.com)?/posts/([\w-]+)""")
MAP_HEADING_RE = re.compile(r"^##\s+클러스터 맵\s*$")
ROLES = ["허브", "상시 글", "뉴스 칼럼"]
# 태그 앞에 붙어도 같은 대상을 가리키는 회사 이름 (비슷한 태그 판단용)
BRANDS = {"google", "apple", "microsoft", "meta", "samsung", "adobe", "openai"}
SECTIONS = [
    "클러스터 미지정 글",
    "허브 → 상시 글 링크 누락",
    "상시 글 → 허브 링크 누락",
    "같은 클러스터 링크 없음",
    "뉴스 칼럼 → 상시 글 링크 없음",
    "받는 링크 2개 미만",
    "깨진 내부 링크",
]


def unquote(value: str) -> str:
    return re.sub(r"""^(['"])(.*)\1$""", r"\2", value.strip())


def parse_post(path: pathlib.Path) -> dict:
    """frontmatter(category·draft·tags)와 본문 내부 링크 대상 slug 집합"""
    text = path.read_text(encoding="utf-8")
    meta: dict = {"tags": []}
    body = text
    m = re.match(r"---\r?\n(.*?)\r?\n---(?:\r?\n|$)(.*)", text, re.DOTALL)
    if m:
        front, body = m.groups()
        key = None
        for line in front.splitlines():
            item = re.match(r"\s+-\s+(.+)", line)
            kv = re.match(r"([\w-]+):\s*(.*)", line)
            if item and key == "tags":
                meta["tags"].append(unquote(item.group(1)))
            elif kv:
                key, value = kv.groups()
                if key == "tags":
                    if value.startswith("["):  # tags: [a, b] 형식
                        meta["tags"] = [unquote(v) for v in value.strip("[]").split(",")]
                else:
                    meta[key] = unquote(value)
    return {
        "category": meta.get("category", ""),
        "draft": meta.get("draft", "").lower() == "true",
        "tags": [t for t in dict.fromkeys(meta["tags"]) if t],
        "links": set(LINK_RE.findall(body)) - {path.stem},
    }


def parse_clusters(path: pathlib.Path) -> tuple[list[dict], str | None]:
    """`## 클러스터 맵` 아래 첫 표 → [{id, name, priority, 허브, 상시 글, 뉴스 칼럼}]. 읽지 못하면 (빈 목록, 사유)"""
    if not path.is_file():
        return [], f"{path} 파일 없음"
    lines = path.read_text(encoding="utf-8").splitlines()
    start = next((i for i, line in enumerate(lines) if MAP_HEADING_RE.match(line)), None)
    if start is None:
        return [], "`## 클러스터 맵` 제목 없음"
    rows = []
    for line in lines[start + 1:]:
        s = line.strip()
        if s.startswith("|") and s.endswith("|"):
            rows.append([c.strip() for c in re.split(r"(?<!\\)\|", s)[1:-1]])  # `\|`는 칸 구분이 아님
        elif rows or s.startswith("#"):
            break
    if not rows:
        return [], "`## 클러스터 맵` 아래 표 없음"
    col = {name: i for i, name in enumerate(rows[0])}
    missing = [name for name in ["ID", *ROLES] if name not in col]
    if missing:
        return [], f"클러스터 표에 열 없음: {', '.join(missing)}"
    clusters = []
    for row in rows[1:]:
        if all(re.fullmatch(r":?-{3,}:?", c) for c in row):  # 구분선
            continue
        cells = {name: row[i] if i < len(row) else "" for name, i in col.items()}
        cluster = {"id": cells["ID"].strip("` "), "name": cells.get("클러스터", ""), "priority": cells.get("우선순위", "")}
        for role in ROLES:
            cluster[role] = re.findall(r"`([^`]+)`", cells[role])
        clusters.append(cluster)
    return clusters, None


def audit(posts: dict, clusters: list[dict], label) -> dict[str, list[tuple[set, str]]]:
    """문제 목록 → {섹션: [(관련 클러스터 ID 집합, 문장)]}"""
    problems: dict[str, list[tuple[set, str]]] = {name: [] for name in SECTIONS}
    add = lambda section, ids, text: problems[section].append(({i for i in ids if i}, text))

    listed = defaultdict(list)  # slug → [(클러스터 ID, 역할)]
    for c in clusters:
        for role in ROLES:
            for slug in c[role]:
                listed[slug].append((c["id"], role))
    home = {slug: places[0][0] for slug, places in listed.items()}

    # 클러스터 등재 상태: 미지정·중복·글 파일 없음·역할과 카테고리 불일치
    sec = SECTIONS[0]
    for slug in sorted(posts.keys() - listed.keys()):
        add(sec, [], f"미지정: {label(slug)} (category: {posts[slug]['category'] or '없음'})")
    for slug, places in listed.items():
        ids = [cid for cid, _ in places]
        where = ", ".join(f"{cid} {role}" for cid, role in places)
        if len(places) > 1:
            add(sec, ids, f"중복 등재: {label(slug)} ({where})")
        if slug not in posts:
            add(sec, ids, f"글 파일 없음: `{slug}` ({where})")
            continue
        category = posts[slug]["category"]
        for cid, role in places:
            if (role == "뉴스 칼럼") != (category == "news"):
                add(sec, [cid], f"역할·카테고리 불일치: {label(slug)} ({cid} {role}, category: {category or '없음'})")

    # 클러스터 안 링크 규칙 (글 파일이 있는 slug만)
    for c in clusters:
        cid = c["id"]
        hubs, evergreen, news = ([s for s in c[role] if s in posts] for role in ROLES)
        for hub in hubs:
            for slug in evergreen:
                if slug not in posts[hub]["links"]:
                    add(SECTIONS[1], [cid], f"{label(hub)} → {label(slug)}")
        for slug in evergreen:
            for hub in hubs:
                if hub not in posts[slug]["links"]:
                    add(SECTIONS[2], [cid], f"{label(slug)} → {label(hub)}")
            peers = set(evergreen) - set(hubs) - {slug}
            if len(evergreen) >= 2 and peers and not posts[slug]["links"] & peers:
                add(SECTIONS[3], [cid], f"{label(slug)} ({cid}, 같은 클러스터 상시 글 {len(peers)}편)")
        if hubs or evergreen:
            for slug in news:
                if not posts[slug]["links"] & set(hubs + evergreen):
                    add(SECTIONS[4], [cid], f"{label(slug)} ({cid})")

    # 받는 링크·깨진 링크 (클러스터와 무관하게 모든 글)
    incoming = defaultdict(set)
    for src in sorted(posts):
        for dst in sorted(posts[src]["links"]):
            if dst in posts:
                incoming[dst].add(src)
            else:
                add(SECTIONS[6], [home.get(src)], f"{label(src)} → `{dst}`")
    for slug in sorted(posts):
        srcs = sorted(incoming[slug])
        if len(srcs) < 2:
            via = f" (← {', '.join(label(s) for s in srcs)})" if srcs else ""
            add(SECTIONS[5], [home.get(slug)], f"{label(slug)} {len(srcs)}개{via}")
    return problems


def tag_report(posts: dict, label) -> None:
    count = Counter(t for p in posts.values() for t in p["tags"])
    singles = {slug: [t for t in p["tags"] if count[t] == 1] for slug, p in sorted(posts.items())}
    singles = {slug: tags for slug, tags in singles.items() if tags}
    print(f"#### 1개 글에만 쓴 태그 ({sum(map(len, singles.values()))}개 / 전체 {len(count)}개)\n")
    for slug, tags in singles.items():
        print(f"- {label(slug)}: {', '.join(tags)}")
    if not singles:
        print("없음")

    # 비슷한 태그 (같은 뜻으로 보이는 것만, 이어지는 것끼리 한 묶음): 소문자·공백·하이픈·끝 s 제거 후 같음,
    # 또는 회사 이름만 앞에 더 붙음 (Chrome · Google Chrome). Apple · Apple Card처럼 다른 대상은 묶지 않음
    def norm(tag: str) -> str:
        return re.sub(r"s$", "", re.sub(r"[\s-]", "", tag.lower()))

    def similar(a: str, b: str) -> bool:
        short, long = sorted((a.lower().split(), b.lower().split()), key=len)
        brand_prefix = len(long) == len(short) + 1 and long[0] in BRANDS and long[1:] == short
        return norm(a) == norm(b) or brand_prefix

    groups: list[list[str]] = []
    for tag in sorted(count):
        hits = [g for g in groups if any(similar(tag, t) for t in g)]
        groups = [g for g in groups if g not in hits] + [[tag, *(t for g in hits for t in g)]]
    groups = sorted((g for g in groups if len(g) > 1), key=lambda g: (-len(g), min(g).lower()))
    print(f"\n#### 비슷한 태그 ({len(groups)}묶음, 괄호는 글 수)\n")
    for g in groups:
        print("- " + " · ".join(f"{t} ({count[t]})" for t in sorted(g, key=lambda t: (-count[t], t.lower()))))
    if not groups:
        print("없음")


def main() -> int:
    parser = argparse.ArgumentParser(description="ToolProof 내부 링크·클러스터 점검")
    parser.add_argument("--posts", type=pathlib.Path, default=POSTS_DIR, metavar="DIR", help="글 디렉터리 (*.mdx)")
    parser.add_argument("--clusters", type=pathlib.Path, default=CLUSTERS_FILE, metavar="FILE", help="클러스터 맵 파일")
    parser.add_argument("--only-problems", action="store_true", help="문제 목록 중 문제가 있는 항목만 출력")
    args = parser.parse_args()

    if not args.posts.is_dir():
        print(f"글 디렉터리가 없습니다: {args.posts}")
        return 0
    posts = {path.stem: parse_post(path) for path in sorted(args.posts.glob("*.mdx"))}
    clusters, error = parse_clusters(args.clusters)
    label = lambda slug: f"`{slug}`" + (" (초안)" if slug in posts and posts[slug]["draft"] else "")
    problems = audit(posts, clusters, label)
    today = dt.date.today()

    if args.only_problems:
        print(f"## 내부 링크 점검 문제 ({today})\n")
        if error:
            print(f"클러스터 맵을 읽지 못함: {error}\n")
        found = [(name, items) for name, items in problems.items() if items]
        for name, items in found:
            print(f"### {name} ({len(items)}건)\n")
            print("\n".join(f"- {text}" for _, text in items) + "\n")
        if not found:
            print("문제 없음")
        return 0

    n = len(posts) or 1
    pairs = sum(len(p["links"]) for p in posts.values())
    broken = len(problems[SECTIONS[6]])
    drafts = sum(p["draft"] for p in posts.values())
    print(f"## 내부 링크 점검 ({today})\n")
    if error:
        print(f"클러스터 맵을 읽지 못함: {error} (모든 글이 미지정으로 나옴)\n")
    print("### 요약\n")
    print(f"- 글 {len(posts)}편" + (f" (초안 {drafts}편)" if drafts else ""))
    print(f"- 내부 링크 {pairs}개 (글 쌍 기준, 자기 링크 제외" + (f", 깨진 링크 {broken}개 포함)" if broken else ")"))
    print(f"- 글당 평균 나가는 링크 {pairs / n:.1f}개 · 받는 링크 {(pairs - broken) / n:.1f}개")

    print("\n### 클러스터\n")
    print("| ID | 허브 | 상시 글 | 뉴스 칼럼 | 상태 |\n| --- | --- | --- | --- | --- |")
    for c in clusters:
        issues = sum(c["id"] in ids for items in problems.values() for ids, _ in items)
        status = ["허브 필요"] if not c["허브"] and len(c["상시 글"]) >= 3 else []
        status += [f"문제 {issues}건"] if issues else []
        hub = ", ".join(label(s) for s in c["허브"]) or "-"
        print(f"| `{c['id']}` | {hub} | {len(c['상시 글'])} | {len(c['뉴스 칼럼'])} | {' · '.join(status) or '정상'} |")

    print("\n### 문제 목록\n")
    for name, items in problems.items():
        print(f"#### {name}" + (f" ({len(items)}건)" if items else "") + "\n")
        print(("\n".join(f"- {text}" for _, text in items) if items else "없음") + "\n")

    print("### 태그\n")
    tag_report(posts, label)
    return 0


if __name__ == "__main__":
    sys.exit(main())
