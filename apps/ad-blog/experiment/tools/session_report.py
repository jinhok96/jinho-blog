"""세션 지표 블록 생성 — log.md '지표' 블록을 데이터 파일에서 결정론적으로 만든다 (ToolProof 운영 실험용)

세션이 도구 출력을 읽고 손으로 쓰던 log.md 세션 기록의 **지표** 블록을 같은 입력이면 같은 글자로 만든다.
세션은 출력을 그대로 붙이고, 해석은 블록 밖에 따로 쓴다. log.md는 읽지도 쓰지도 않는다 (stdout, `--write`는 저장소 밖만).

실행:
  python3 -I apps/ad-blog/experiment/tools/session_report.py --out {스크래치패드}/daily
      → --out = daily_metrics.py 1단계 출력 폴더 (stats/summary.json·stats/posts.json)
  python3 -I apps/ad-blog/experiment/tools/session_report.py --out {폴더} --prev {이전 회차 폴더} [--no-compare] [--write FILE]

입력:
- 이번 회차: {out}/stats/summary.json(28일 합계·sitemaps·adsense·crawl)·posts.json(글별 28일 지표·index·otherPages)
- 이전 회차(증감·굵게 표시): 기본은 experiment/dashboard/runs.jsonl에서 이번 회차(summary.updatedAt)보다 앞선 마지막 줄
  (28일 클릭·노출·순위·색인 수·latestCrawl·unindexedSeen만 있음). `--prev DIR`이면 그 출력 폴더 전체와 비교
  (주별 클릭·sitemap·글별 coverage·lastCrawl까지). 이전 회차가 없으면 증감 없이 값만
- 성과 검증: traffic-playbook.md `### 검증 기록` 표에서 판정이 `-`이고 오늘(한국 날짜) >= 판단 시점인 행.
  대상 글 칸 첫 백틱이 글 slug이고 지표가 ctr·impressions·position이면 `gsc_report.py --compare` 출력을 그대로 넣고
  (판단 시점 전이면 그 문구도 그대로), 나머지(사이트 전체·색인 상태)는 '수동 판정 필요'. `--no-compare`면 명령만 출력
- link_audit.py --only-problems 결과, 허브(frontmatter `hub: true`) 글별 URL 검사 상태

- 출력 순서는 모두 명시적으로 정렬한다 (글별 노출: 노출 내림차순 → 클릭 내림차순 → slug, 허브·크롤링: slug·시각순)
- 시각은 UTC `MM-DD HH:MM` (이번 회차와 다른 해면 연도 포함), 숫자는 천 단위 쉼표
- 이전 회차와 값이 다르면 이번 값을 굵게 (`이전 → **이번**`)
- AdSense 줄은 gsc_report.py adsense_lines() 첫 줄과 같은 문구를 summary.adsense로 만든다 (문구를 바꾸면 두 곳을 함께 고침)
"""

import argparse
import datetime as dt
import json
import re
import subprocess
import sys
from collections import Counter
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[3]
EXPERIMENT = ROOT / 'apps/ad-blog/experiment'
POSTS_DIR = ROOT / 'apps/ad-blog/content/posts'
RUNS = EXPERIMENT / 'dashboard/runs.jsonl'
PLAYBOOK = EXPERIMENT / 'traffic-playbook.md'
GSC_REPORT = 'apps/ad-blog/experiment/tools/gsc_report.py'  # 저장소 루트 기준 (traffic-playbook 절차의 명령과 같게)
VENV_PY = Path('/tmp/gsc/bin/python')  # daily_metrics.py 1단계가 만드는 가상환경 (google-auth·requests)
KST = dt.timezone(dt.timedelta(hours=9))

sys.dont_write_bytecode = True  # 저장소 tools/에 __pycache__를 만들지 않음
sys.path.insert(0, str(HERE))
# frontmatter `hub`·`draft` 읽기 (link_audit.py는 표준 라이브러리만 씀)
from link_audit import parse_post  # noqa: E402

TOP_POSTS = 8  # 글별 노출 상위 몇 편
WEEKS_SHOWN = 8  # 주간 클릭 줄에 보일 확정 주 수 (그 뒤 미확정 주는 모두)
COMPARE_METRICS = ('ctr', 'impressions', 'position')  # gsc_report.py --metric 선택지
PLAYBOOK_HEADING = re.compile(r'^###\s+검증 기록\s*$')
PLAYBOOK_COLUMNS = ('ID', '대상 글', '배포일', '지표', '판단 시점', '판정')
COVERAGE_LABELS = {  # URL 검사 coverageState → 짧은 이름 (log.md에서 쓰던 이름)
    'Submitted and indexed': '색인',
    'Discovered - currently not indexed': 'Discovered',
    'URL is unknown to Google': 'URL is unknown',
}
COVERAGE_ORDER = ['Crawled - currently not indexed', 'Discovered', 'URL is unknown']  # 미색인 상태 표시 순서 (나머지는 이름순)
COVERAGE_ALWAYS = {'Discovered', 'URL is unknown'}  # 0편이어도 표시 (나머지 상태는 있을 때만)


def parse_ts(value) -> dt.datetime | None:
    if not value:
        return None
    try:
        return dt.datetime.fromisoformat(str(value).replace('Z', '+00:00')).astimezone(dt.timezone.utc)
    except ValueError:
        return None


def num(value) -> str:
    return '-' if value is None else f'{value:,}'


def pos(value) -> str:
    return '-' if value is None else f'{value:.1f}'


def bold(text: str, on: bool) -> str:
    return f'**{text}**' if on else text


def change(prev, cur, fmt=num) -> str:
    """이전 값이 있으면 `이전 → 이번` (다르면 이번 값을 굵게), 없으면 이번 값만. 비교는 표시 글자 기준"""
    c = fmt(cur)
    if prev is None:
        return c
    p = fmt(prev)
    return f'{p} → {bold(c, c != p)}'


def coverage_label(coverage: str | None) -> str:
    return COVERAGE_LABELS.get(coverage, coverage) if coverage else 'URL 검사 없음'


def read_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except (OSError, ValueError) as error:
        sys.exit(f'{path}를 읽지 못함: {error}')


def load_run(folder: Path, role: str) -> dict:
    """daily_metrics.py 1단계 출력 폴더 → {summary, rows, other}. 필요한 파일·키가 없으면 종료"""
    need = [folder / 'stats/summary.json', folder / 'stats/posts.json']
    missing = [str(p.relative_to(folder)) for p in need if not p.is_file()]
    if missing:
        sys.exit(f'{role} 폴더 {folder}에 daily_metrics.py 1단계 결과가 없음: {" · ".join(missing)}\n'
                 f'먼저 python3 -I apps/ad-blog/experiment/tools/daily_metrics.py --out {folder} 실행')
    summary, posts = (read_json(p) for p in need)
    if not summary.get('updatedAt') or not isinstance(posts.get('rows'), list):
        sys.exit(f'{role} 폴더 {folder}의 stats 형식이 다름 (summary.updatedAt·posts.rows 필요)')
    return {'summary': summary, 'rows': posts['rows'], 'other': posts.get('otherPages') or []}


def snapshot(run: dict, source: str) -> dict:
    """이번·이전 회차를 비교용 공통 모양으로. runs.jsonl에 없는 값(주별·sitemap·글별 상태)은 폴더에서만 채움"""
    s = run['summary']
    adsense = s.get('adsense') or {}
    crawl = s.get('crawl') or {}
    inspected = [r for r in run['rows'] if (r.get('index') or {}).get('coverage')]
    return {
        'source': source,
        'runAt': s['updatedAt'],
        'clicks': s.get('clicks'),
        'impressions': s.get('impressions'),
        'position': s.get('position'),
        'indexed': sum(r['index'].get('verdict') == 'PASS' for r in inspected) if inspected else None,
        'total': len(run['rows']) if inspected else None,
        'coverage': Counter(coverage_label(r['index']['coverage']) for r in inspected if r['index'].get('verdict') != 'PASS')
        if inspected else None,
        'unindexedSeen': crawl.get('unindexedSeen'),
        'latestCrawl': crawl.get('latest'),
        'weeks': adsense.get('weeks'),
        'sitemaps': {sm.get('path'): sm.get('lastDownloaded') for sm in s.get('sitemaps') or []} or None,
        'posts': {r['slug']: r['index'] for r in inspected} if inspected else None,
        'listPages': crawl.get('listPages') if crawl else None,
    }


def prev_from_runs(run_at: str) -> dict | None:
    """runs.jsonl에서 이번 회차보다 앞선 마지막 줄 (--finalize 전이어도 같은 결과)"""
    if not RUNS.is_file():
        return None
    now = parse_ts(run_at)
    rows = []
    for line in RUNS.read_text(encoding='utf-8').splitlines():
        try:
            row = json.loads(line)
        except ValueError:
            continue
        when = parse_ts(row.get('runAt'))
        if when and now and when < now:
            rows.append((when, row))
    if not rows:
        return None
    row = max(rows, key=lambda x: x[0])[1]
    return {
        'source': 'runs.jsonl',
        'runAt': row['runAt'],
        'clicks': row.get('clicks28'),
        'impressions': row.get('impressions28'),
        'position': row.get('position28'),
        'indexed': row.get('indexed'),
        'total': row.get('total'),
        'coverage': None,
        'unindexedSeen': row.get('unindexedSeen'),
        'latestCrawl': row.get('latestCrawl'),
        'weeks': None,
        'sitemaps': None,
        'posts': None,
        'listPages': None,
    }


def playbook_rows() -> tuple[list[dict], str | None]:
    """traffic-playbook.md `### 검증 기록` 첫 표 → [{열 이름: 칸}]. 읽지 못하면 (빈 목록, 사유)"""
    if not PLAYBOOK.is_file():
        return [], f'{PLAYBOOK.relative_to(ROOT)} 없음'
    lines = PLAYBOOK.read_text(encoding='utf-8').splitlines()
    start = next((i for i, line in enumerate(lines) if PLAYBOOK_HEADING.match(line)), None)
    if start is None:
        return [], '`### 검증 기록` 제목 없음'
    table = []
    for line in lines[start + 1:]:
        s = line.strip()
        if s.startswith('|') and s.endswith('|'):
            table.append([c.strip() for c in re.split(r'(?<!\\)\|', s)[1:-1]])
        elif table or s.startswith('#'):
            break
    if not table:
        return [], '`### 검증 기록` 아래 표 없음'
    col = {name: i for i, name in enumerate(table[0])}
    missing = [name for name in PLAYBOOK_COLUMNS if name not in col]
    if missing:
        return [], f'검증 기록 표에 열 없음: {", ".join(missing)}'
    rows = []
    for cells in table[1:]:
        if all(re.fullmatch(r':?-{3,}:?', c) for c in cells):
            continue
        rows.append({name: cells[i] if i < len(cells) else '' for name, i in col.items()})
    return rows, None


def first_date(text: str) -> dt.date | None:
    m = re.search(r'\d{4}-\d{2}-\d{2}', text)
    try:
        return dt.date.fromisoformat(m.group(0)) if m else None
    except ValueError:
        return None


def id_key(row_id: str) -> tuple[int, str]:
    m = re.search(r'\d+', row_id)
    return (int(m.group(0)) if m else 0, row_id)


def compare_cmd(slug: str, changed: str, metric: str) -> list[str]:
    return [str(VENV_PY), '-I', GSC_REPORT, '--compare', f'/posts/{slug}', '--changed', changed, '--metric', metric]


def run_compare(row_id: str, cmd: list[str]) -> str:
    """gsc_report.py --compare 출력 그대로. 실패하면 사유 한 줄"""
    if not VENV_PY.exists():
        return f'`--compare` 실행 못 함: {VENV_PY} 없음 (daily_metrics.py 1단계가 만듦)'
    print(f'{row_id} gsc_report.py --compare 실행 중 (약 30초)…', file=sys.stderr, flush=True)
    try:
        res = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, timeout=900, check=False)
    except subprocess.TimeoutExpired:
        return '`--compare` 실패: 15분 안에 끝나지 않음'
    if res.returncode != 0:
        reason = (res.stderr.strip() or res.stdout.strip()).splitlines()[-1:] or ['출력 없음']
        print(f'{row_id} --compare 실패:\n{res.stderr}', file=sys.stderr)
        return f'`--compare` 실패 (종료 코드 {res.returncode}): {reason[0]}'
    return res.stdout.rstrip()


def indent(text: str, spaces: int) -> str:
    pad = ' ' * spaces
    return '\n'.join(pad + line if line.strip() else '' for line in text.splitlines())


class Report:
    def __init__(self, run: dict, prev: dict | None, today: dt.date, no_compare: bool):
        self.s = run['summary']
        self.rows = sorted(run['rows'], key=lambda r: r['slug'])
        self.other = run['other']
        self.cur = snapshot(run, 'out')
        self.prev = prev
        self.p = prev or {}
        self.today = today
        self.no_compare = no_compare
        self.year = parse_ts(self.s['updatedAt']).year

    def ts(self, value) -> str | None:
        t = parse_ts(value)
        if t is None:
            return None
        return t.strftime('%m-%d %H:%M' if t.year == self.year else '%Y-%m-%d %H:%M')

    def day(self, d: dt.date) -> str:
        return d.strftime('%m-%d' if d.year == self.year else '%Y-%m-%d')

    def week_label(self, w: dict) -> str:
        start, end = w['start'][5:], w['end'][5:]
        return f"{start}~{end[3:] if end[:2] == start[:2] else end}"

    def header(self) -> str:
        r = self.s.get('range') or {}
        span = f"{r.get('start', '?')} ~ {r.get('end', '?')}"
        vs = f"이전 회차 {self.prev['runAt']} 대비" if self.prev else '이전 회차 없음'
        return f"**지표 (`daily_metrics.py` 회차 {self.s['updatedAt']}, {span}, {vs})**"

    def search_line(self) -> str:
        s, p = self.s, self.p
        clicks, impressions = s.get('clicks') or 0, s.get('impressions') or 0
        ctr = clicks / impressions if impressions else s.get('ctr')
        head = (f"- 노출 {change(p.get('impressions'), s.get('impressions'))}, 클릭 {change(p.get('clicks'), s.get('clicks'))}, "
                f"CTR {'-' if ctr is None else f'{ctr * 100:.1f}%'}, 평균 순위 {change(p.get('position'), s.get('position'), pos)}")
        top = sorted((r for r in self.rows if r.get('impressions')),
                     key=lambda r: (-r['impressions'], -(r.get('clicks') or 0), r['slug']))[:TOP_POSTS]
        detail = [f"글별 노출 상위 {len(top)}: " + ' / '.join(self.post_metric(f"`{r['slug']}`", r) for r in top)] if top else []
        slugs = {r['slug'] for r in self.rows}
        gone = sorted((o for o in self.other if o.get('path', '').startswith('/posts/') and o['path'][7:] not in slugs
                       and o.get('impressions')), key=lambda o: (-o['impressions'], o['path']))
        if gone:
            detail.append('지운 URL ' + ' / '.join(self.post_metric(f"`{o['path'][7:]}`", o) for o in gone))
        return head + (f" ({'. '.join(detail)})" if detail else '')

    @staticmethod
    def post_metric(label: str, r: dict) -> str:
        text = f"{label} {num(r.get('impressions'))}"
        if r.get('position') is not None:
            text += f"·{pos(r['position'])}위"
        if r.get('clicks'):
            text += f"·클릭 {num(r['clicks'])}"
        return text

    def weeks_line(self) -> str:
        weeks = (self.s.get('adsense') or {}).get('weeks') or []
        if not weeks:
            return '- 주간 검색 클릭 (월~일): 이 회차 데이터 없음'
        before = {w['start']: w for w in self.p['weeks']} if self.p.get('weeks') is not None else None

        def item(w: dict) -> str:
            old = before.get(w['start']) if before is not None else None
            clicks, impressions = num(w['clicks']), num(w['impressions'])

            def changed(key: str) -> bool:
                return before is not None and (old is None or old[key] != w[key])

            if w.get('complete'):
                if before is not None and (old is None or not old.get('complete')):  # 이전 회차 뒤 확정된 주
                    return f"**{self.week_label(w)} {clicks} (확정, 노출 {impressions})**"
                return f"{self.week_label(w)} {bold(clicks, old is not None and changed('clicks'))}"
            return f"{self.week_label(w)} {bold(clicks, changed('clicks'))} (미확정, 노출 {bold(impressions, changed('impressions'))})"

        done = [w for w in weeks if w.get('complete')]
        shown = done[-WEEKS_SHOWN:]
        pending = [w for w in weeks if not w.get('complete')]
        text = ' → '.join(item(w) for w in shown) or '확정 주 없음'
        if pending:
            text += ' · ' + ' · '.join(item(w) for w in pending)
        span = f', 최근 {WEEKS_SHOWN}주' if len(done) > WEEKS_SHOWN else ''
        return f'- 주간 검색 클릭 (월~일 확정 주{span}): {text}'

    def sitemap_line(self) -> str:
        sitemaps = sorted(self.s.get('sitemaps') or [], key=lambda sm: sm.get('path', ''))
        if not sitemaps and self.s.get('sitemap'):  # 2026-11-04까지 회차: sitemap 하나만
            sitemaps = [{'path': '/sitemap.xml', **self.s['sitemap']}]
        if not sitemaps:
            return '- sitemap: 이 회차 데이터 없음'
        before = self.p.get('sitemaps')
        items, changed_any = [], False
        for sm in sitemaps:
            cur = self.ts(sm.get('lastDownloaded')) or '다운로드 기록 없음'
            text = cur
            if before is not None and before.get(sm.get('path')) != sm.get('lastDownloaded'):
                changed_any = True
                text = f"{self.ts(before.get(sm.get('path'))) or '없음'} → **{cur}**"
            extra = (['대기 중'] if sm.get('isPending') else []) + [
                f"{name} {sm[key]}" for key, name in (('errors', '오류'), ('warnings', '경고')) if sm.get(key)]
            items.append(f"`{sm.get('path', '').lstrip('/')}` {text}" + (f" ({' · '.join(extra)})" if extra else ''))
        same = ' 그대로' if before is not None and not changed_any else ''
        return f"- sitemap 마지막 다운로드: {', '.join(items)} UTC{same}"

    def index_line(self) -> str:
        cur, p = self.cur, self.p
        crawl = self.s.get('crawl')
        if not crawl or cur['coverage'] is None:
            return '- URL 검사: 이 회차 생략 (`--no-inspect`)'
        idx_text = change(f"{p['indexed']}/{p['total']}" if p.get('indexed') is not None else None,
                          f"{cur['indexed']}/{cur['total']}", str)
        counts, before = cur['coverage'], p.get('coverage')
        labels = [c for c in COVERAGE_ORDER if c in COVERAGE_ALWAYS or c in counts or c in (before or {})]
        labels += sorted((set(counts) | set(before or {})) - set(labels))
        states = ' · '.join(f"{c} {change(before.get(c, 0) if before is not None else None, counts.get(c, 0))}" for c in labels)
        parts = [f'색인 {idx_text}, {states}']
        if crawl.get('unindexedSeen') is not None:
            parts[0] += (f", 미색인 {num(crawl.get('unindexed'))}편 중 Google이 본 링크가 있는 글 "
                         f"{change(p.get('unindexedSeen'), crawl['unindexedSeen'])}")
        latest = parse_ts(crawl.get('latest'))
        if latest:
            where = sorted([f"`{r['slug']}`" for r in self.rows if parse_ts((r.get('index') or {}).get('lastCrawl')) == latest]
                           + [f"`{page}`" for page, when in (crawl.get('listPages') or {}).items() if parse_ts(when) == latest])
            parts.append(f"가장 최근 크롤링(색인 페이지) {self.ts(latest)} UTC" + (f" ({', '.join(where)})" if where else ''))
        if self.prev:
            parts.append(self.new_crawls(crawl))
        return '- URL 검사: ' + '. '.join(parts)

    def new_crawls(self, crawl: dict) -> str:
        """이전 회차 뒤 새로 크롤링된 글·목록 페이지. --prev 폴더면 페이지별 lastCrawl 비교,
        runs.jsonl이면 그 회차 latestCrawl(색인 페이지 중 가장 최근) 뒤 크롤링"""
        pages = [(f"`{r['slug']}`", r.get('index') or {}, (self.p.get('posts') or {}).get(r['slug']) or {}) for r in self.rows]
        pages += [(f"`{page}`", {'lastCrawl': when, 'verdict': 'PASS'}, {'lastCrawl': (self.p.get('listPages') or {}).get(page)})
                  for page, when in sorted((crawl.get('listPages') or {}).items())]
        by_page = self.p.get('posts') is not None
        threshold = None if by_page else parse_ts(self.p.get('latestCrawl'))
        if by_page:
            title = '이전 회차 뒤 새로 크롤링된 페이지'
        elif threshold:
            title = f'이전 회차 가장 최근 크롤링({self.ts(threshold)}) 뒤 새로 크롤링된 페이지'
        else:
            return '이전 회차 크롤링 기록 없음 (새 크롤링 비교 안 함)'
        found = []
        for label, idx, old in pages:
            now, before = parse_ts(idx.get('lastCrawl')), parse_ts(old.get('lastCrawl'))
            if now and (now > threshold if threshold else (before is None or now > before)):
                state = '' if idx.get('verdict') == 'PASS' else f" ({coverage_label(idx.get('coverage'))})"
                found.append((now, label, f"{label} {self.ts(now)}{state}"))
        return f"{title}: {' / '.join(text for _, _, text in sorted(found)) or '없음'}"

    def hub_line(self) -> str:
        hubs = []
        for path in sorted(POSTS_DIR.glob('*.mdx')):
            meta = parse_post(path)
            if meta['hub']:
                hubs.append((path.stem, meta['draft']))
        if not hubs:
            return '- 허브: frontmatter `hub: true` 글 없음'
        by_slug = {r['slug']: r for r in self.rows}
        before = self.p.get('posts')
        items = []
        for slug, draft in hubs:
            label = f"`{slug}`" + (' (초안)' if draft else '')
            if slug not in by_slug:
                items.append(f'{label} 이 회차 데이터 없음')
                continue
            idx = by_slug[slug].get('index') or {}
            old = (before or {}).get(slug) if before is not None else None
            state = coverage_label(idx.get('coverage'))
            if old is not None and coverage_label(old.get('coverage')) != state:
                state = f"{coverage_label(old.get('coverage'))} → **{state}**"
            elif before is not None and old is None:
                state = bold(state, True)
            if idx.get('sitemaps'):
                state += f"({'·'.join(s.lstrip('/') for s in sorted(idx['sitemaps']))})"
            crawled = f"마지막 크롤링 {self.ts(idx['lastCrawl'])} UTC" if idx.get('lastCrawl') else '크롤링 기록 없음'
            if old is not None and old.get('lastCrawl') != idx.get('lastCrawl'):
                crawled = bold(crawled, True)
            items.append(f'{label} {state}·{crawled}' if idx else f'{label} URL 검사 없음')
        return f"- 허브 ({len(hubs)}편, `hub: true`): " + ' / '.join(items)

    def verification_lines(self) -> list[str]:
        rows, error = playbook_rows()
        head = f'- 성과 검증 (`traffic-playbook.md` 검증 기록 중 판정 `-`인 행, 기준일 {self.today} KST):'
        if error:
            return [f'- 성과 검증: 검증 기록 표를 읽지 못함 ({error})']
        open_rows = [r for r in rows if r['판정'].strip() == '-']
        due, waiting, undated = [], {}, []
        for r in open_rows:
            when = first_date(r['판단 시점'])
            if when is None:
                undated.append(r['ID'])
            elif when <= self.today:
                due.append((when, id_key(r['ID']), r))
            else:
                waiting.setdefault(when, []).append(r['ID'])
        lines = [head]
        for when, _, r in sorted(due, key=lambda x: x[:2]):
            slug = next(iter(re.findall(r'`([^`]+)`', r['대상 글'])), '')
            metric = r['지표'].strip().lower()
            changed = first_date(r['배포일'])
            if (POSTS_DIR / f'{slug}.mdx').is_file() and metric in COMPARE_METRICS and changed:
                cmd = compare_cmd(slug, str(changed), metric)
                title = f"  - {r['ID']} `{slug}` (지표 {metric}, 배포 {changed}, 판단 시점 {when})"
                if self.no_compare:
                    lines.append(f"{title}: `--no-compare`로 생략 → `{' '.join(cmd)}`")
                else:
                    lines.append(f'{title} `gsc_report.py --compare` 출력:')
                    lines.append('')
                    lines.append(indent(run_compare(r['ID'], cmd), 4))
            else:
                lines.append(f"  - 수동 판정 필요: {r['ID']} (판단 시점 {when})")
        if not due:
            lines.append('  - 판단 시점이 지난 행 없음')
        if waiting:
            groups = ' · '.join(f"{'·'.join(sorted(ids, key=id_key))} {self.day(when)}" for when, ids in sorted(waiting.items()))
            lines.append(f'  - 판단 시점 전: {groups}')
        if undated:
            lines.append(f"  - 판단 시점 날짜 없음: {', '.join(sorted(undated, key=id_key))}")
        return lines

    @staticmethod
    def link_audit_line() -> str:
        head = '- `link_audit.py --only-problems`:'
        res = subprocess.run([sys.executable, '-I', str(HERE / 'link_audit.py'), '--only-problems'],
                             cwd=ROOT, capture_output=True, text=True, check=False)
        if res.returncode != 0:
            reason = (res.stderr.strip().splitlines() or ['출력 없음'])[-1]
            return f'{head} 실행 실패 (종료 코드 {res.returncode}): {reason}'
        sections, notes = [], []
        for line in res.stdout.splitlines():
            if m := re.match(r'###\s+(.+?)\s+\((\d+)건\)\s*$', line):
                sections.append((m.group(1), int(m.group(2)), []))
            elif line.startswith('- ') and sections:
                sections[-1][2].append(line[2:])
            elif line.startswith('클러스터 맵을 읽지 못함'):
                notes.append(line.strip())
        total = sum(count for _, count, _ in sections)
        body = '; '.join(f"{name} {count}건: {' / '.join(items)}" for name, count, items in sections)
        text = f'{head} {total}건' + (f' ({body})' if body else ' (문제 없음)')
        return text + ''.join(f' · {n}' for n in notes)

    def adsense_line(self) -> str:
        """gsc_report.py adsense_lines() 첫 줄과 같은 문구 (summary.adsense 값으로)"""
        a = self.s.get('adsense')
        if not a:
            return '- **AdSense 재신청 조건**: 이 회차 데이터 없음'
        age = f"운영 {a['operatingDays']}일/{a['requiredDays']}일({a['eligibleFrom']})"
        if a.get('indexRate') is None:
            index = '색인율 - (URL 검사 생략)'
        else:
            index = f"색인율 {round(a['indexRate'] * 100)}%({a['indexed']}/{a['total']}, 목표 {round(a['indexRateTarget'] * 100)}%)"
        done = [w for w in a.get('weeks') or [] if w['complete']]
        span = ' → '.join(f"{w['start'][5:]}~{w['end'][5:]} {w['clicks']}" for w in done[-(a['clickStreakTarget'] + 1):]) or '확정 주 없음'
        clicks = f"주간 클릭 증가 {a['clickStreak']}주/{a['clickStreakTarget']}주 (월~일 확정 주: {span})"
        verdict = '**모두 충족 → 사용자: AdSense 재신청**' if a.get('allMet') else '미충족'
        return f'- **AdSense 재신청 조건**: {age} · {index} · {clicks} → {verdict}'

    def render(self) -> str:
        lines = [
            self.header(),
            '',
            self.search_line(),
            self.weeks_line(),
            self.sitemap_line(),
            self.index_line(),
            self.hub_line(),
            *self.verification_lines(),
            self.link_audit_line(),
            self.adsense_line(),
        ]
        return '\n'.join(lines) + '\n'


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--out', required=True, type=Path, metavar='DIR', help='daily_metrics.py 1단계 출력 폴더')
    ap.add_argument('--prev', type=Path, metavar='DIR', help='이전 회차 비교에 runs.jsonl 대신 쓸 다른 daily_metrics.py 출력 폴더')
    ap.add_argument('--no-compare', action='store_true', help='판단 시점이 지난 행의 gsc_report.py --compare 실행 생략 (명령만 출력)')
    ap.add_argument('--today', type=dt.date.fromisoformat, metavar='YYYY-MM-DD', help='성과 검증 기준일 (기본: 오늘 한국 날짜)')
    ap.add_argument('--write', type=Path, metavar='FILE', help='같은 내용을 파일로도 저장 (저장소 밖만, 예: 스크래치패드)')
    args = ap.parse_args()

    write = args.write.resolve() if args.write else None
    if write and write.is_relative_to(ROOT):
        sys.exit(f'--write는 저장소 밖 경로만 (log.md 등 저장소 파일을 고치지 않음): {write}')
    run = load_run(args.out.resolve(), '--out')
    if args.prev:
        prev = snapshot(load_run(args.prev.resolve(), '--prev'), str(args.prev))
        if parse_ts(prev['runAt']) >= parse_ts(run['summary']['updatedAt']):
            print(f"주의: --prev 회차 {prev['runAt']}가 이번 회차보다 늦거나 같음", file=sys.stderr)
    else:
        prev = prev_from_runs(run['summary']['updatedAt'])
    today = args.today or dt.datetime.now(KST).date()
    text = Report(run, prev, today, args.no_compare).render()
    sys.stdout.write(text)
    if write:
        write.parent.mkdir(parents=True, exist_ok=True)
        write.write_text(text, encoding='utf-8')
        print(f'저장: {write}', file=sys.stderr)
    return 0


if __name__ == '__main__':
    sys.exit(main())
