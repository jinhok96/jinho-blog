"""지난 날짜를 미래형·상대 시점으로 쓴 문장을 찾는다 (날짜가 지나 낡은 문장 점검).

2026-11-05 세션 81 (`seo-audit` Content Quality: Outdated content not refreshed / Accurate information).
일정형 글(종료일·출시일·마감일)은 날짜가 지나면 "will"·"coming"·"next" 문장이 틀린 말이 되므로,
일정이 지난 뒤 개선 세션이 고칠 후보를 찾는 데 씀. 고칠지는 사람이 문장을 읽고 판단 (지난 일을 과거형으로 쓴 문장도 걸림).

실행: python3 -I apps/ad-blog/experiment/tools/stale_check.py [--today YYYY-MM-DD] [--since YYYY-MM-DD]
- 날짜 문장: 문장 안 날짜(`October 13`, `Oct. 13, 2026`, `2026-10-13`) 중 --since ≤ 날짜 < --today인 것이 있고
  미래형 표지(will·coming·expected·scheduled·next·until·starts 등)가 함께 있는 문장. 연도가 없으면 --today의 연도로 봄
- 상대 시점: "this week"·"this month"·"in the coming weeks"·"next week"처럼 쓴 날에 기대는 표현 (글의 마지막 수정일과 함께 출력)
- 이미지 alt·링크 주소는 빼고 링크 글자는 셈
"""
import argparse
import datetime as dt
import re
from pathlib import Path

POSTS = Path(__file__).resolve().parents[2] / "content" / "posts"
MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]
DATE_RE = re.compile(
    r"\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)"
    r"\.?\s+(\d{1,2})(?:,\s*(\d{4}))?\b"
)
ISO_RE = re.compile(r"\b(20\d\d)-(\d{2})-(\d{2})\b")
FUTURE = re.compile(
    r"\b(will|won't|is expected|are expected|expected to|coming|scheduled|plans? to|planned|upcoming|next|is set to|are set to|"
    r"until|by then|soon|starts?|begins?|arrives?|rolls? out|due)\b",
    re.I,
)
RELATIVE = re.compile(
    r"\b(this (?:week|month)(?:'s)?|next week|later this (?:week|month)|in the coming (?:days|weeks)|coming weeks|"
    r"in the next few (?:days|weeks)|over the next few weeks|by mid-\w+|in early \w+|by the end of \w+)\b",
    re.I,
)


def frontmatter(text: str) -> dict:
    head = text.split("---", 2)[1]
    return {k: (m.group(1).strip().strip("'\"") if (m := re.search(rf"^{k}:\s*(.+)$", head, re.M)) else None) for k in ("createdAt", "updatedAt", "category")}


def sentences(text: str) -> list[str]:
    body = text.split("---", 2)[2]
    body = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", body)
    body = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", body)
    return [s.strip() for s in re.split(r"(?<=[.!?])\s+|\n+", body) if s.strip()]


def dates_in(sentence: str, year: int) -> list[dt.date]:
    found = []
    for m in DATE_RE.finditer(sentence):
        try:
            found.append(dt.date(int(m[3]) if m[3] else year, MONTHS.index(m[1][:3].lower()) + 1, int(m[2])))
        except ValueError:
            pass
    for m in ISO_RE.finditer(sentence):
        try:
            found.append(dt.date(int(m[1]), int(m[2]), int(m[3])))
        except ValueError:
            pass
    return found


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--today", type=dt.date.fromisoformat, default=dt.date.today())
    parser.add_argument("--since", type=dt.date.fromisoformat, help="이 날짜 이후 날짜만 (기본: --today 60일 전)")
    args = parser.parse_args()
    since = args.since or args.today - dt.timedelta(days=60)
    total = 0
    for path in sorted(POSTS.glob("*.mdx")):
        text = path.read_text(encoding="utf-8")
        fm = frontmatter(text)
        hits = []
        for s in sentences(text):
            past = [d for d in dates_in(s, args.today.year) if since <= d < args.today]
            if past and FUTURE.search(s):
                hits.append(f"- 날짜 {max(past)} · {s[:260]}")
            elif m := RELATIVE.search(s):
                hits.append(f"- 상대 시점 \"{m[0]}\" · {s[:260]}")
        if hits:
            total += len(hits)
            print(f"\n## {path.stem} ({fm['category']}, 발행 {fm['createdAt'] or '-'}, 수정 {fm['updatedAt'] or '-'})")
            print("\n".join(hits))
    print(f"\n문장 {total}개 (기준일 {args.today}, 날짜 범위 {since} ~)")


if __name__ == "__main__":
    main()
