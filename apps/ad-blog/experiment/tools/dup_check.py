"""글끼리 그대로 겹치는 문장·8단어 묶음(shingle)을 찾는다 (대량 생산처럼 보이는 반복 문구 점검).

2026-11-04 세션 79 (`seo-audit` 문제 찾기): AdSense "가치가 별로 없는 콘텐츠" 거절 대응으로
같은 문장이 여러 글에 찍혀 있는지 확인. 실행: python3 -I apps/ad-blog/experiment/tools/dup_check.py
- 8단어 이상 문장이 2편 이상에 그대로 나오는 경우, 글 쌍의 8단어 shingle 겹침 비율, 글별 겹침 비율
- 이미지·링크 주소·HTML 태그는 빼고, 링크 글자와 표 칸 글자는 셈
"""
import re
import sys
from collections import defaultdict
from itertools import combinations
from pathlib import Path

POSTS = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).resolve().parents[2] / "content" / "posts"
MIN_WORDS = 8
N = 8


def body(text):
    text = re.sub(r"^---\n.*?\n---\n", "", text, flags=re.S)
    text = re.sub(r"!\[[^\]]*\]\([^)]*\)", " ", text)
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)
    text = re.sub(r"<[^>]+>", " ", text)
    return text


def sentences(text):
    out = []
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("|") and set(line) <= set("|-: "):
            continue
        line = re.sub(r"^(#+|\d+\.|[-*>])\s*", "", line)
        cells = [c.strip() for c in line.split("|")] if line.startswith("|") else [line]
        for cell in cells:
            for s in re.split(r"(?<=[.!?])\s+", cell):
                s = s.strip()
                if s:
                    out.append(s)
    return out


def norm(s):
    s = s.lower().replace("**", "")
    s = re.sub(r"[^a-z0-9%$ ]+", " ", s)
    return " ".join(s.split())


posts = {p.stem: body(p.read_text()) for p in sorted(POSTS.glob("*.mdx"))}
where = defaultdict(set)
orig = {}
for slug, text in posts.items():
    for s in sentences(text):
        n = norm(s)
        if len(n.split()) >= MIN_WORDS:
            where[n].add(slug)
            orig.setdefault(n, s)

dups = sorted(((len(v), k) for k, v in where.items() if len(v) >= 2), reverse=True)
print(f"## 2편 이상에 그대로 나오는 문장 ({MIN_WORDS}단어 이상): {len(dups)}개\n")
for cnt, k in dups:
    print(f"- {cnt}편: {orig[k][:160]}  ← {', '.join(sorted(where[k]))}")

shingles = {}
for slug, text in posts.items():
    words = norm(" ".join(sentences(text))).split()
    shingles[slug] = {" ".join(words[i:i + N]) for i in range(len(words) - N + 1)}

print(f"\n## 글 쌍 {N}단어 shingle 겹침 상위 15 (작은 쪽 기준 비율)\n")
pairs = []
for a, b in combinations(shingles, 2):
    inter = len(shingles[a] & shingles[b])
    if inter:
        pairs.append((inter / min(len(shingles[a]), len(shingles[b])), inter, a, b))
for ratio, inter, a, b in sorted(pairs, reverse=True)[:15]:
    print(f"- {ratio:.1%} ({inter}개): {a} ↔ {b}")

print("\n## 글별: 다른 글과 겹치는 shingle 비율 상위 10\n")
rows = []
for slug, sh in shingles.items():
    others = set().union(*(shingles[o] for o in shingles if o != slug))
    rows.append((len(sh & others) / max(len(sh), 1), slug, len(sh)))
for ratio, slug, total in sorted(rows, reverse=True)[:10]:
    print(f"- {ratio:.1%}: {slug} ({total}개 중)")
