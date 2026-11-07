"""글별 주 검색어의 Google Trends 상대 검색량 (README 가설 H6 판정용, 2026-11-06 세션 85)

H6: 주 검색어가 구체적인 롱테일인 글이 상위 검색어 글보다 발행 4주 노출이 많고 순위가 높다.
글마다 사실 확인표(tests/{slug}/factcheck.md, 옛 글은 facts.md)의 `- 주 검색어 (가설 H6): \`키워드\`` 줄을 읽고,
같은 기준 키워드(`remove background`)와 함께 4개씩 Trends에 물어 `dashboard/keyword-trends.json`에 쌓는다.
`dashboard_data.py`가 이 파일을 읽어 `posts`의 글별 `keyword`(검색어·상대량·롱테일/상위)로 올린다.

실행:
  python3 -I apps/ad-blog/experiment/tools/keyword_trends.py          # 파일에 없는 주 검색어만 측정 (새 글)
  python3 -I apps/ad-blog/experiment/tools/keyword_trends.py --all    # 모든 글 다시 측정 (같은 날 한 번에 재야 값끼리 비교 가능)
  python3 -I apps/ad-blog/experiment/tools/keyword_trends.py --check  # 측정 없이 빠진 줄·빠진 값만 출력

- 값은 요청마다 기준 키워드의 최고 지점을 100으로 맞춘 평균 (기준보다 높은 키워드가 섞이면 Trends가 그 키워드 최고점을 100으로
  두므로, 기준 최고점으로 다시 나눔). 기준 3개월 평균은 2026-11-06에 약 40
- H6 경계는 5 (README 가설 H6: 기준 `remove background`로 잰 상대량 5 미만 롱테일, 5 이상 상위). 검색량이 아주 작으면 0
- 측정 시점이 다르면 기간(최근 3개월)이 달라 값이 조금 바뀜 → 판정 때는 measuredAt을 함께 봄
"""

import argparse
import datetime as dt
import json
import pathlib
import re
import sys
import time

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from trends_compare import get_json, opener  # noqa: E402

EXPERIMENT = pathlib.Path(__file__).resolve().parents[1]
POSTS_DIR = EXPERIMENT.parent / 'content' / 'posts'
TESTS = EXPERIMENT / 'tests'
OUT_FILE = EXPERIMENT / 'dashboard' / 'keyword-trends.json'
FACT_FILES = ('factcheck.md', 'facts.md')
KEYWORD_LINE = re.compile(r'주 검색어 \(가설 H6\)[^`\n]*`([^`]+)`')
REFERENCE = 'remove background'
GEO = 'US'
TIME = 'today 3-m'
THRESHOLD = 5  # README 가설 H6: 이 값 미만이면 롱테일, 이상이면 상위
BATCH = 4  # 한 요청 최대 5개 = 주 검색어 4개 + 기준 1개
PAUSE = 8  # 요청 사이 대기(초). 연속 호출하면 429


def primary_keyword(slug: str, tests: pathlib.Path = TESTS) -> str | None:
    """사실 확인표의 '주 검색어 (가설 H6)' 줄에서 백틱 안 검색어 (소문자). 없으면 None"""
    for name in FACT_FILES:
        path = tests / slug / name
        if path.exists():
            for line in path.read_text(encoding='utf-8').splitlines():
                if m := KEYWORD_LINE.search(line):
                    return m.group(1).strip().lower()
    return None


def load(path: pathlib.Path = OUT_FILE) -> dict:
    if path.exists():
        return json.loads(path.read_text(encoding='utf-8'))
    return {'reference': REFERENCE, 'geo': GEO, 'time': TIME, 'threshold': THRESHOLD, 'keywords': {}}


def measure(op, keywords: list[str]) -> dict[str, dict]:
    """키워드 최대 4개 + 기준 → {키워드: {avg, max, recent7, raw, refAvg, refMax}} (avg·max·recent7은 기준 최고점 = 100)"""
    words = [*keywords, REFERENCE]
    items = [{'keyword': k, 'geo': GEO, 'time': TIME} for k in words]
    widgets = get_json(op, 'explore', {'comparisonItem': items, 'category': 0, 'property': ''})['widgets']
    ts = next(w for w in widgets if w['id'] == 'TIMESERIES')
    timeline = get_json(op, 'widgetdata/multiline', ts['request'], ts['token'])['default']['timelineData']
    series = {k: [t['value'][i] for t in timeline] for i, k in enumerate(words)}
    ref = series[REFERENCE]
    scale = 100 / max(ref)  # 기준이 가장 높으면 1, 기준보다 높은 키워드가 있으면 기준 최고점에 맞춤
    out = {}
    for k in keywords:
        v = series[k]
        out[k] = {
            'avg': round(sum(v) / len(v) * scale, 2), 'max': round(max(v) * scale, 1), 'recent7': round(sum(v[-7:]) / 7 * scale, 2),
            'raw': round(sum(v) / len(v), 2), 'refAvg': round(sum(ref) / len(ref) * scale, 2), 'refMax': max(ref),
            'points': len(timeline),
        }
    return out


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('--all', action='store_true', help='파일에 있는 값도 모두 다시 측정')
    ap.add_argument('--check', action='store_true', help='측정 없이 빠진 줄·값만 출력')
    args = ap.parse_args()

    data = load()
    posts = {p.stem: primary_keyword(p.stem) for p in sorted(POSTS_DIR.glob('*.mdx'))}
    missing_line = [s for s, k in posts.items() if not k]
    for slug in missing_line:
        print(f'주 검색어 (가설 H6) 줄 없음: tests/{slug}/factcheck.md', file=sys.stderr)
    wanted = sorted({k for k in posts.values() if k and (args.all or k not in data['keywords'])})
    print(f'글 {len(posts)}편 · 주 검색어 {len({k for k in posts.values() if k})}개 · 측정할 검색어 {len(wanted)}개')
    if args.check or not wanted:
        return 1 if missing_line else 0

    op = opener()
    today = dt.date.today().isoformat()
    for i in range(0, len(wanted), BATCH):
        batch = wanted[i:i + BATCH]
        if i:
            time.sleep(PAUSE)
        for k, v in measure(op, batch).items():
            data['keywords'][k] = {**v, 'measuredAt': today}
            print(f"{k}: {v['avg']} (기준 평균 {v['refAvg']}, 원값 {v['raw']}, 기준 최고 {v['refMax']})")
        OUT_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=1, sort_keys=True) + '\n', encoding='utf-8')  # 중간에 끊겨도 남게
    print(f'→ {OUT_FILE}')
    return 1 if missing_line else 0


if __name__ == '__main__':
    sys.exit(main())
