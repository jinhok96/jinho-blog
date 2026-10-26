"""운영 대시보드(claude.ai 아티팩트) 데이터 생성 (ToolProof 운영 실험용)

Search Console API·글 frontmatter·clusters.md·내부 링크·README 목표 지표·traffic-playbook·log.md를 읽어 대시보드 DB 문서를 JSON 파일로 만든다.
업로드는 세션에서 `ArtifactData` 도구로 한다 (README "운영 대시보드" 절차).

실행: /tmp/gsc/bin/python -I apps/ad-blog/experiment/tools/dashboard_data.py --prev /tmp/dashboard-prev/stats/posts.json [--out /tmp/dashboard] [--no-inspect] [--versions '{"summary": 3, ...}']
출력: {out}/stats/{doc_id}.json + {out}/history/*.json + {out}/writes.json (ArtifactData batch의 writes 값 그대로)
      + {out}/data.js (비로그인 열람용 스냅숏, 아티팩트 파일 `data.js`로 발행)

`stats`는 화면이 읽는 최신 값이라 회차마다 바뀌고, 같은 내용을 `history` 컬렉션에 회차별 새 문서
(`{summary.updatedAt}_{doc_id}` = {runAt, doc, data})로 함께 남긴다. history는 만들기만 하고 고치거나 지우지 않는다.

`stats` 컬렉션 하나에 문서 몇 개만 둔다 (세션마다 버전을 옮겨 적는 수를 줄이려고). 기존 문서를 덮어쓰려면
`ArtifactData list stats`로 본 버전을 `--versions`에 넘긴다 (없는 문서는 새로 만듦).
- summary: 갱신 시각·28일 합계·사이트맵 상태·linkAudit(link_audit.py 문제 항목별 건수, 문제 있는 항목만)
           ·goals(README 목표 지표 표 + 현재 값·진행률)
           ·crawl(URL 검사 회차만: latest = 색인된 페이지 중 가장 최근 크롤링, listPages = 홈·카테고리 첫 페이지별 lastCrawlTime,
                  unindexed = 색인 안 된 글 수, unindexedSeen = 그중 Google이 본 링크가 있는 글 수)
- daily-YYYY-MM: {rows: [{date, clicks, impressions, ctr, position, state}]} (state = final 확정 | fresh 미확정)
- posts: {rows: [{slug, title, category, createdAt, updatedAt?, images, words, tags, cluster, inbound, 28일 지표, queries, daily, sources,
                  firstDays, move, index, indexedAt, firstCrawlAt, firstImpressionAt}],
         otherPages: [{path, 28일 지표, queries, daily, sources}]}
         (cluster = clusters.md의 {id, name, priority, role} 또는 null(미지정), inbound = 이 글로 링크하는 글 slug,
          28일 지표 = 웹 검색, queries = 검색어 상위 10, daily = 날짜별 노출·클릭·순위(최근 28일),
          sources = 검색 유형별 28일 노출·클릭(노출 있는 유형만),
          views·visits = Cloudflare Web Analytics 28일 조회수·방문 (CF 환경변수가 있을 때만, daily 각 날짜에도 views·visits,
          조회수만 있고 검색 노출이 없는 날은 노출 0으로 추가. 날짜는 UTC), firstDays = 발행일부터 날짜별 누적 노출(최대 D+28),
          move = 최근 7일 vs 직전 7일 순위 {pos, prevPos, imp, prevImp, delta} 또는 null(최근 7일 노출 없음),
          색인 시점 3가지 (Search Console은 색인된 날짜를 주지 않아 회차마다 처음 본 값을 고정, 한번 정하면 바꾸지 않음):
          indexedAt = URL 검사가 처음 PASS인 회차 시각, firstCrawlAt = 그때의 lastCrawl(마지막 크롤링은 이후 바뀌므로 첫 값),
          firstImpressionAt = 웹 검색 노출이 처음 생긴 날짜(Search Console 날짜, 태평양 시간).
          앞의 두 값은 이전 posts 문서(--prev)에서 이어받음. 2026-10-24 이전 색인분은 log.md URL 검사 기록으로 날짜만 소급),
          seenLinks = (색인 안 된 글만) Google이 마지막으로 크롤링한 판에서 이 글로 가던 링크 [{page, kind, crawl}] (link_seen.py),
          firstSeenLinkAt = 그 링크를 Google이 처음 본 크롤링 시각 (--prev에서 이어받아 고정, 색인 뒤에도 유지 → 노하우 9 판정)
          (2026-10-26 회차부터. 그 전 회차 history에는 없음)
- traffic: (Cloudflare 환경변수가 있을 때만) 사이트 전체 실제 조회수 {range, views, visits, daily: [{date, views, visits}](UTC 날짜, 빠진 날 0),
           referers: 유입 사이트별 28일 조회수·방문 상위 10 (자기 사이트·직접 방문은 'direct')}
- breakdown: 28일 기기별·국가별(상위 10)·검색 유형별(웹·이미지·동영상·뉴스·Discover) 지표, 사이트 검색어 상위 20,
             movers(최근 7일 vs 직전 7일 검색어 순위: up 오른·down 내린·new 처음 노출, 각 상위 10)
- experiments: {rows: traffic-playbook 검증 기록 표}
- knowhow: {rows: traffic-playbook 노하우 상태 표}
- sessions: {rows: log.md 세션 제목 (date, title, order)}
"""

import argparse
import datetime as dt
import hashlib
import json
import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from gsc_report import API, POSTS_DIR, SITE_ORIGIN, call, load_token, search_analytics, site_path  # noqa: E402
import cf_analytics  # noqa: E402
import link_seen  # noqa: E402
from link_audit import CLUSTERS_FILE, ROLES, SECTIONS, audit, parse_clusters, parse_post  # noqa: E402

EXPERIMENT = pathlib.Path(__file__).resolve().parents[1]
LAUNCH = dt.date(2026, 10, 10)  # 도메인 연결 전날부터 집계
SEARCH_TYPES = ('web', 'image', 'video', 'news', 'discover', 'googleNews')
BRAND = re.compile(r'tool\s*-?\s*proof', re.I)  # 브랜드 검색어 (목표 지표 "비브랜드 검색어"에서 제외)
# README 목표 지표 표의 지표 이름 → 현재 값 키. 표에 없는 키워드의 행은 현재 값 없이 목표만 표시
GOAL_KEYS = (('색인율', 'indexRate'), ('28일 노출', 'impressions'), ('10위 안', 'top10Queries'), ('허브', 'hubClusters'), ('받는 링크', 'weakInbound'))
RATIO_GOALS = {'indexRate', 'hubClusters'}  # 0~1 비율로 비교 ("17/32 (53%)"·"2/4"·"전부")
LOWER_BETTER = {'weakInbound'}
FIRST_DAYS = 28  # 경과일별 누적 노출: 발행일(D+0)부터 D+28까지
MOVE_MIN_IMP = 2  # 순위 변화: 두 기간 모두 노출이 이만큼 있어야 비교 (노출 1회짜리 순위는 크게 흔들림)
MOVE_MIN_DELTA = 1.0  # 이보다 작게 움직인 검색어는 목록에서 뺌


def metrics(row: dict | None) -> dict:
    row = row or {}
    return {
        'clicks': int(row.get('clicks', 0)),
        'impressions': int(row.get('impressions', 0)),
        'ctr': round(row.get('ctr', 0), 4),
        'position': round(row.get('position', 0), 1) if row.get('impressions') else None,
    }


def frontmatter(path: pathlib.Path) -> dict:
    text = path.read_text(encoding='utf-8')
    head = text.split('---', 2)[1]
    fm = {}
    for key in ('title', 'category', 'createdAt', 'updatedAt'):
        m = re.search(rf'^{key}:\s*(.+)$', head, re.M)
        if m:
            fm[key] = m.group(1).strip().strip('\'"')
    fm['images'] = len(re.findall(r'!\[[^\]]*\]\(', text))
    fm['tags'] = re.findall(r'^\s+-\s+(.+)$', head.split('tags:', 1)[1], re.M) if 'tags:' in head else []
    body = re.sub(r'!\[[^\]]*\]\([^)]*\)', '', text.split('---', 2)[2])
    fm['words'] = len(re.findall(r"[A-Za-z0-9][A-Za-z0-9'’.-]*", body))
    return fm


def cluster_map(clusters: list[dict]) -> dict[str, dict]:
    """slug → {id, name, priority, role} (clusters.md 클러스터 맵. 여러 곳에 있으면 link_audit처럼 첫 번째)"""
    out: dict[str, dict] = {}
    for c in clusters:
        for role in ROLES:
            for slug in c[role]:
                out.setdefault(slug, {'id': c['id'], 'name': c['name'], 'priority': c['priority'], 'role': role})
    return out


def first_days(created: str, by_date: dict[str, dict], last_day: dt.date) -> list[int]:
    """발행일부터 날짜별 누적 노출 [D+0, D+1, ...] (마지막 집계일까지, 최대 D+28).
    발행일은 createdAt의 UTC 날짜 (Search Console 날짜는 태평양 시간이라 하루 어긋날 수 있음)"""
    day0 = dt.date.fromisoformat(created[:10])
    out, total = [], 0
    for k in range(min(FIRST_DAYS, (last_day - day0).days) + 1):
        r = by_date.get(str(day0 + dt.timedelta(days=k)))
        total += int(r['impressions']) if r else 0
        out.append(total)
    return out


def first_impression(by_date: dict[str, dict]) -> str | None:
    """노출이 처음 생긴 날짜 (YYYY-MM-DD)"""
    return min((d for d, r in by_date.items() if r.get('impressions')), default=None)


def load_prev(path: str | None) -> dict[str, dict]:
    """이전 회차 posts 문서의 글별 행 {slug: row}. 색인 시점 필드를 이어받는 데 씀"""
    if not path:
        return {}
    data = json.loads(pathlib.Path(path).read_text(encoding='utf-8'))
    return {r['slug']: r for r in data.get('rows', []) if r.get('slug')}


def index_dates(prev: dict, index: dict | None, run_at: str, first_imp: str | None) -> dict:
    """색인 시점 3가지. 이전 값이 있으면 유지하고, 이번 회차에 처음 PASS면 지금 시각·lastCrawl로 정함"""
    indexed_at, first_crawl = prev.get('indexedAt'), prev.get('firstCrawlAt')
    if index and index.get('verdict') == 'PASS':
        indexed_at = indexed_at or run_at
        first_crawl = first_crawl or index.get('lastCrawl')
    imps = [d for d in (first_imp, prev.get('firstImpressionAt')) if d]
    return {'indexedAt': indexed_at, 'firstCrawlAt': first_crawl, 'firstImpressionAt': min(imps) if imps else None}


def seen_link_fields(token: str, site: str, posts: list[dict], crawled: dict[str, dt.datetime], prev: dict[str, dict]) -> dict:
    """색인 안 된 글에 Google이 본 링크(seenLinks)와 처음 본 시각(firstSeenLinkAt)을 붙이고 summary.crawl을 돌려줌 (노하우 9 판정용).

    seenLinks = Google이 마지막으로 크롤링한 판(홈·카테고리 첫 페이지·색인된 글)에서 그 글로 가던 링크 [{page, kind, crawl}].
    firstSeenLinkAt = 그 링크들의 크롤링 시각 중 가장 이른 값. 페이지가 다시 크롤링되면 crawl 값이 늦어지므로
    처음 정한 값을 이전 회차(--prev)에서 이어받고 바꾸지 않음 (색인된 뒤에도 유지 → indexedAt과 비교)
    """
    pages = {}
    for page in link_seen.list_pages():
        res = call('POST', f'{API}/v1/urlInspection/index:inspect', token, {'inspectionUrl': SITE_ORIGIN + page, 'siteUrl': site})
        idx = res.get('inspectionResult', {}).get('indexStatusResult', {})
        pages[page] = idx.get('lastCrawlTime')
        if when := link_seen.crawl_time(idx):
            crawled[page] = when
    unindexed = {p['slug'] for p in posts if p.get('index', {}).get('verdict') != 'PASS'}
    try:
        seen = link_seen.seen_links(crawled, unindexed)
    except Exception as error:  # noqa: BLE001 - git 이력이 없으면(origin/main 미fetch) 이 값만 빼고 갱신
        print(f'Google이 본 링크를 계산하지 못함 (seenLinks 없이 진행): {error}', file=sys.stderr)
        seen = None
    for p in posts:
        first = prev.get(p['slug'], {}).get('firstSeenLinkAt')
        if seen is not None and p['slug'] in unindexed:
            p['seenLinks'] = seen[p['slug']]
            first = first or min((s['crawl'] for s in p['seenLinks']), default=None)
        p['firstSeenLinkAt'] = first
    latest = max(crawled.values(), default=None)
    return {
        'latest': latest.strftime('%Y-%m-%dT%H:%M:%SZ') if latest else None,
        'listPages': pages,
        'unindexed': len(unindexed),
        'unindexedSeen': None if seen is None else sum(1 for s in seen.values() if s),
    }


def position_move(now: dict | None, before: dict | None) -> dict | None:
    """두 기간 순위 비교 {pos, prevPos, imp, prevImp, delta}. delta = 직전 순위 - 최근 순위 (양수면 오름).
    한쪽 노출이 MOVE_MIN_IMP 미만이면 delta는 None"""
    if not now:
        return None
    move = {
        'pos': round(now['position'], 1), 'imp': int(now['impressions']),
        'prevPos': round(before['position'], 1) if before else None, 'prevImp': int(before['impressions']) if before else 0,
    }
    ok = before and move['imp'] >= MOVE_MIN_IMP and move['prevImp'] >= MOVE_MIN_IMP
    move['delta'] = round(before['position'] - now['position'], 1) if ok else None
    return move


def goal_number(text: str, ratio: bool) -> float | None:
    """목표 표 칸 → 숫자. 비율 지표는 0~1 ("80% 이상" 0.8, "17/32 (53%)" 0.53, "2/4" 0.5, "전부" 1)"""
    if ratio and '전부' in text:
        return 1.0
    if ratio and (m := re.search(r'(\d+(?:\.\d+)?)\s*%', text)):
        return float(m[1]) / 100
    if ratio and (m := re.search(r'(\d+)\s*/\s*(\d+)', text)):
        return int(m[1]) / int(m[2]) if int(m[2]) else None
    m = re.search(r'\d[\d,]*', text)
    return float(m[0].replace(',', '')) if m else None


def goals(current: dict[str, tuple[float, str] | None]) -> dict | None:
    """README `### 목표 지표` 표 → {baseDate, due, rows: [{label, baseText, targetText, check, current, currentText,
    progress, met, lowerBetter}]}. current = {키: (비교 값, 표시 문자열)}. 진행률은 기준일 값 → 목표 사이 위치 (0~1)"""
    text = (EXPERIMENT / 'README.md').read_text(encoding='utf-8')
    if '### 목표 지표' not in text:
        return None
    block = text.split('### 목표 지표', 1)[1].split('\n## ', 1)[0]
    year = re.match(r'\s*\((\d{4})-', block)
    head = re.search(r'^\|\s*지표\s*\|\s*현재 \((\d{2}-\d{2})\)\s*\|\s*목표 \((\d{2}-\d{2})\)', block, re.M)
    if not year or not head:
        return None
    rows = []
    for line in block.splitlines():
        if not line.lstrip().startswith('|'):  # 표 설명 문단 안의 `|`(열 형식 안내)를 행으로 읽지 않음
            continue
        cells = [c.strip() for c in line.strip().strip('|').split('|')]
        if len(cells) != 4 or cells[0] == '지표' or re.fullmatch(r':?-{3,}:?', cells[0]):
            continue
        label, base_text, target_text, check = cells
        key = next((k for word, k in GOAL_KEYS if word in label), None)
        ratio, lower = key in RATIO_GOALS, key in LOWER_BETTER
        base, target = goal_number(base_text, ratio), goal_number(target_text, ratio)
        value, value_text = current.get(key) or (None, None)
        progress = met = None
        if value is not None and target is not None:
            met = value <= target if lower else value >= target
            if met:
                progress = 1.0
            elif lower:
                progress = max(0.0, (base - value) / (base - target)) if base is not None and base > target else 0.0
            else:
                progress = max(0.0, value / target) if target else 1.0
            progress = round(progress, 3)
        rows.append({
            'label': label, 'baseText': base_text, 'targetText': target_text, 'check': check.replace('`', ''),
            'current': value, 'currentText': value_text, 'progress': progress, 'met': met, 'lowerBetter': lower,
        })
    return {'baseDate': f'{year[1]}-{head[1]}', 'due': f'{year[1]}-{head[2]}', 'rows': rows}


def knowhow() -> list[dict]:
    text = (EXPERIMENT / 'traffic-playbook.md').read_text(encoding='utf-8')
    block = text.split('## 노하우 상태', 1)[1].split('\n## ', 1)[0]
    rows = []
    for line in block.splitlines():
        cells = [c.strip() for c in line.strip().strip('|').split('|')]
        if len(cells) == 5 and cells[0].isdigit():
            rows.append({'num': int(cells[0]), 'title': cells[1], 'status': cells[2], 'record': cells[3], 'updated': cells[4]})
    return rows


def experiments() -> list[dict]:
    """traffic-playbook 검증 기록 표 (ID·노하우·대상 글·바꾼 내용·배포일·지표·판단 시점·판정·반영)."""
    text = (EXPERIMENT / 'traffic-playbook.md').read_text(encoding='utf-8')
    block = text.split('### 검증 기록', 1)[1].split('\n## ', 1)[0]
    keys = ['id', 'knowhow', 'target', 'change', 'deployed', 'metric', 'judgeAt', 'verdict', 'applied']
    rows = []
    for line in block.splitlines():
        cells = [c.strip() for c in line.strip().strip('|').split('|')]
        if len(cells) == 9 and re.fullmatch(r'V\d+', cells[0]):
            rows.append(dict(zip(keys, cells)))
    return rows


def sessions() -> list[dict]:
    text = (EXPERIMENT / 'log.md').read_text(encoding='utf-8')
    rows = []
    for order, m in enumerate(reversed(list(re.finditer(r'^## (\d{4}-\d{2}-\d{2}) · (.+)$', text, re.M)))):
        title = m.group(2).strip()
        # 문서 ID는 날짜 + 제목 해시 (세션이 추가돼도 기존 ID가 바뀌지 않게)
        doc_id = f"{m.group(1)}-{hashlib.sha1(title.encode()).hexdigest()[:6]}"
        rows.append({'id': doc_id, 'date': m.group(1), 'title': title, 'order': order})
    return rows


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument('--site', default='sc-domain:tool-proof.com')
    ap.add_argument('--out', default='/tmp/dashboard')
    ap.add_argument('--no-inspect', action='store_true', help='URL 검사 생략 (하루 2,000회 할당량)')
    ap.add_argument('--prev', required=True, help='이전 회차 posts 문서 JSON (ArtifactData list stats의 out_dir 저장본). 빠뜨리면 색인 시점이 지워짐')
    ap.add_argument('--versions', help='기존 문서 버전 JSON (예: \'{"summary": 3, "posts": 3}\')')
    args = ap.parse_args()
    prev_rows = load_prev(args.prev)
    run_at = dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')

    token = load_token()
    today = dt.date.today()
    start, end = str(LAUNCH), str(today)
    docs: dict[str, dict] = {}

    # 날짜별: 미확정 포함 값을 쓰고, 확정 데이터에 있는 날짜는 final로 표시. 달마다 문서 1개
    final_dates = {r['keys'][0] for r in search_analytics(token, args.site, start, end, ['date'], 1000, data_state='final')}
    site_days = search_analytics(token, args.site, start, end, ['date'], 1000)
    for r in site_days:
        d = r['keys'][0]
        docs.setdefault(f'daily-{d[:7]}', {'rows': []})['rows'].append({'date': d, **metrics(r), 'state': 'final' if d in final_dates else 'fresh'})
    # 마지막 집계일 (Search Console은 1~2일 늦게 채워져 오늘보다 이를 수 있음)
    last_day = max((dt.date.fromisoformat(r['keys'][0]) for r in site_days), default=today)

    # 글별: 최근 28일 지표 + 검색어 + 날짜별 추이 + 색인 상태
    since = str(today - dt.timedelta(days=28))
    by_page = {r['keys'][0]: r for r in search_analytics(token, args.site, since, end, ['page'], 1000)}
    queries: dict[str, list] = {}
    for r in search_analytics(token, args.site, since, end, ['page', 'query'], 5000):
        queries.setdefault(r['keys'][0], []).append({'query': r['keys'][1], **metrics(r)})
    # 페이지별 날짜 지표는 집계 시작일부터 받음: 상세 추이는 최근 28일만, 경과일별 누적 노출은 발행일부터
    page_dates: dict[str, dict[str, dict]] = {}
    for r in search_analytics(token, args.site, start, end, ['page', 'date'], 25000):
        page_dates.setdefault(r['keys'][0], {})[r['keys'][1]] = r
    page_daily = {
        url: [{'date': d, 'clicks': int(r['clicks']), 'impressions': int(r['impressions']), 'position': round(r['position'], 1)} for d, r in rows.items() if d >= since]
        for url, rows in page_dates.items()
    }
    # 실제 조회수 (Cloudflare Web Analytics, UTC 날짜): 환경변수가 있을 때만. 실패해도 나머지 갱신은 계속
    page_views: dict[str, dict[str, dict]] = {}
    if cf_analytics.available():
        try:
            page_views = {SITE_ORIGIN + path: days for path, days in cf_analytics.page_views(dt.date.fromisoformat(since), today).items()}
            docs['traffic'] = traffic_doc(page_views, dt.date.fromisoformat(since), today)
        except Exception as error:  # noqa: BLE001 - 조회수는 부가 지표라 대시보드 갱신을 막지 않음
            print(f'Cloudflare 조회수를 읽지 못함 (조회수 없이 진행): {error}', file=sys.stderr)
    for url, days in page_views.items():
        rows = {r['date']: r for r in page_daily.setdefault(url, [])}
        for d, v in days.items():
            if d < since:
                continue
            if d not in rows:
                rows[d] = {'date': d, 'clicks': 0, 'impressions': 0, 'position': None}
                page_daily[url].append(rows[d])
            rows[d].update(v)
    # 순위 변화: 마지막 집계일까지 최근 7일 vs 직전 7일 (기간 합산 = 노출 가중 평균 순위)
    recent = (last_day - dt.timedelta(days=6), last_day)
    prev = (recent[0] - dt.timedelta(days=7), recent[0] - dt.timedelta(days=1))

    def window(dims: list[str], w: tuple[dt.date, dt.date], limit: int = 1000) -> dict[str, dict]:
        return {r['keys'][0]: r for r in search_analytics(token, args.site, str(w[0]), str(w[1]), dims, limit)}

    page_now, page_prev = window(['page'], recent), window(['page'], prev)
    # 유입 경로: 검색 유형별 페이지 지표 (웹은 위 by_page 재사용)
    type_page = {'web': by_page}
    for t in SEARCH_TYPES[1:]:
        type_page[t] = {r['keys'][0]: r for r in search_analytics(token, args.site, since, end, ['page'], 1000, search_type=t)}

    def page_extra(url: str) -> dict:
        q = sorted(queries.get(url, []), key=lambda x: (-x['impressions'], -x['clicks']))[:10]
        sources = [{'key': t, 'clicks': int(rows[url]['clicks']), 'impressions': int(rows[url]['impressions'])} for t, rows in type_page.items() if rows.get(url, {}).get('impressions')]
        sources.sort(key=lambda x: (-x['impressions'], -x['clicks']))
        extra = {'queries': q, 'daily': sorted(page_daily.get(url, []), key=lambda x: x['date']), 'sources': sources}
        if page_views:  # 조회수를 읽은 회차만 (없으면 화면이 조회수 칸을 숨김)
            days = page_views.get(url, {}).values()
            extra.update(views=sum(v['views'] for v in days), visits=sum(v['visits'] for v in days))
        return extra

    cluster_rows, error = parse_clusters(CLUSTERS_FILE)
    if error:
        print(f'클러스터 표를 읽지 못함: {error}', file=sys.stderr)
    clusters = cluster_map(cluster_rows)
    # 내부 링크: 글마다 받는 링크(링크하는 글 slug)와 link_audit.py 문제 목록
    linked = {path.stem: parse_post(path) for path in sorted(POSTS_DIR.glob('*.mdx'))}
    inbound = {slug: sorted(src for src, p in linked.items() if slug in p['links']) for slug in linked}
    problems = audit(linked, cluster_rows, lambda slug: f'`{slug}`')

    posts = []
    crawled: dict[str, dt.datetime] = {}  # 색인된 페이지 경로 → 마지막 크롤링 (Google이 본 링크 계산용)
    for path in sorted(POSTS_DIR.glob('*.mdx')):
        slug = path.stem
        url = f'{SITE_ORIGIN}/posts/{slug}'
        doc = {'slug': slug, **frontmatter(path), 'cluster': clusters.get(slug), 'inbound': inbound[slug], **metrics(by_page.get(url)), **page_extra(url)}
        if doc.get('createdAt'):
            doc['firstDays'] = first_days(doc['createdAt'], page_dates.get(url, {}), last_day)
        doc['move'] = position_move(page_now.get(url), page_prev.get(url))
        if not args.no_inspect:
            res = call('POST', f'{API}/v1/urlInspection/index:inspect', token, {'inspectionUrl': url, 'siteUrl': args.site})
            idx = res.get('inspectionResult', {}).get('indexStatusResult', {})
            google_canonical = idx.get('googleCanonical')
            doc['index'] = {
                'verdict': idx.get('verdict'), 'coverage': idx.get('coverageState'), 'lastCrawl': idx.get('lastCrawlTime'),
                'crawledAs': idx.get('crawledAs'), 'fetch': idx.get('pageFetchState'),
                'canonicalOk': None if not google_canonical else google_canonical == url,
            }
            if when := link_seen.crawl_time(idx):
                crawled[f'/posts/{slug}'] = when
        doc.update(index_dates(prev_rows.get(slug, {}), doc.get('index'), run_at, first_impression(page_dates.get(url, {}))))
        posts.append(doc)
    crawl = None if args.no_inspect else seen_link_fields(token, args.site, posts, crawled, prev_rows)
    # 글 외 페이지(홈·카테고리·목록 등): 글별 표 합계를 사이트 전체 KPI와 맞추기 위해 따로 표시
    post_urls = {f"{SITE_ORIGIN}/posts/{p['slug']}" for p in posts}
    other = [{'path': url.removeprefix(SITE_ORIGIN) or '/', **metrics(r), **page_extra(url)} for url, r in by_page.items() if url not in post_urls]
    other.sort(key=lambda o: (-o['clicks'], -o['impressions']))
    docs['posts'] = {'rows': posts, 'otherPages': other}

    # 기기·국가·검색 유형·사이트 검색어
    def dim(name: str, limit: int) -> list[dict]:
        rows = search_analytics(token, args.site, since, end, [name], limit)
        return sorted(({'key': r['keys'][0], **metrics(r)} for r in rows), key=lambda x: (-x['impressions'], -x['clicks']))[:limit]

    types = []
    for t in SEARCH_TYPES:
        rows = search_analytics(token, args.site, since, end, [], 1, search_type=t)
        types.append({'key': t, **metrics(rows[0] if rows else None)})
    site_queries = dim('query', 1000)  # 화면에는 상위 20개, 목표 지표(10위 안 검색어 수)는 전체로 셈

    # 검색어 순위 변화: 오른·내린 검색어(두 기간 모두 노출 MOVE_MIN_IMP 이상) + 최근 7일에 처음 노출된 검색어
    q_now, q_prev = window(['query'], recent), window(['query'], prev)
    top_page: dict[str, str] = {}  # 검색어 → 최근 7일 노출이 가장 많은 페이지 경로
    for r in sorted(search_analytics(token, args.site, str(recent[0]), str(recent[1]), ['query', 'page'], 5000), key=lambda r: -r['impressions']):
        top_page.setdefault(r['keys'][0], r['keys'][1].removeprefix(SITE_ORIGIN) or '/')
    moves = [{'key': q, 'page': top_page.get(q), **position_move(r, q_prev.get(q))} for q, r in q_now.items()]
    changed = [m for m in moves if m['delta'] is not None and abs(m['delta']) >= MOVE_MIN_DELTA]
    movers = {
        'recent': [str(d) for d in recent], 'prev': [str(d) for d in prev],
        'up': sorted((m for m in changed if m['delta'] > 0), key=lambda m: (-m['delta'], -m['imp']))[:10],
        'down': sorted((m for m in changed if m['delta'] < 0), key=lambda m: (m['delta'], -m['imp']))[:10],
        'new': sorted((m for m in moves if m['key'] not in q_prev), key=lambda m: (-m['imp'], m['pos']))[:10],
    }
    docs['breakdown'] = {'devices': dim('device', 5), 'countries': dim('country', 10), 'queries': site_queries[:20], 'searchTypes': types, 'movers': movers}
    docs['experiments'] = {'rows': experiments()}
    docs['knowhow'] = {'rows': knowhow()}
    docs['sessions'] = {'rows': sessions()}

    total = search_analytics(token, args.site, since, end, [], 1)
    sitemaps = call('GET', f'{API}/webmasters/v3/sites/{site_path(args.site)}/sitemaps', token).get('sitemap', [])
    sm = sitemaps[0] if sitemaps else {}
    site = metrics(total[0] if total else None)

    # 목표 지표 현재 값 (README 표의 "확인" 방법과 같은 기준)
    indexed = sum(p['index']['verdict'] == 'PASS' for p in posts if 'index' in p)
    top10 = sum(1 for q in site_queries if q['position'] is not None and q['position'] <= 10 and not BRAND.search(q['key']))
    eligible = with_hub = 0  # 허브가 있거나 상시 글 3편 이상인 클러스터 (link_audit "허브 필요" 기준)
    for c in cluster_rows:
        hubs = [s for s in c['허브'] if s in inbound]
        if hubs or len([s for s in c['상시 글'] if s in inbound]) >= 3:
            eligible += 1
            with_hub += bool(hubs)
    weak = len(problems[SECTIONS[5]])  # 받는 링크 2개 미만
    current = {
        'indexRate': (indexed / len(posts), f'{indexed}/{len(posts)} ({round(indexed / len(posts) * 100)}%)') if posts and not args.no_inspect else None,
        'impressions': (site['impressions'], f"{site['impressions']:,}"),
        'top10Queries': (top10, f'{top10}개'),
        'hubClusters': (with_hub / eligible, f'{with_hub}/{eligible}') if eligible else None,
        'weakInbound': (weak, f'{weak}편'),
    }
    docs['summary'] = {
        'updatedAt': run_at,
        'range': {'start': since, 'end': end},
        **site,
        'sitemap': {'lastDownloaded': sm.get('lastDownloaded'), 'errors': int(sm.get('errors', 0)), 'warnings': int(sm.get('warnings', 0))},
        'linkAudit': {name: len(items) for name, items in problems.items() if items},
        'goals': goals(current),
    }
    if crawl:
        docs['summary']['crawl'] = crawl

    versions = json.loads(args.versions) if args.versions else {}
    out = pathlib.Path(args.out) / 'stats'
    out.mkdir(parents=True, exist_ok=True)
    writes = []
    for doc_id, data in docs.items():
        f = out / f'{doc_id}.json'
        f.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
        w = {'op': 'set', 'collection': 'stats', 'doc_id': doc_id, 'file_path': str(f)}
        if doc_id in versions:
            w['if_version'] = int(versions[doc_id])
        writes.append(w)
    writes += history_writes(docs, pathlib.Path(args.out) / 'history')
    (out.parent / 'writes.json').write_text(json.dumps(writes, ensure_ascii=False), encoding='utf-8')
    # 비로그인 열람용 스냅숏 (아티팩트 DB는 로그인한 사람만 읽을 수 있음). 아티팩트 파일 data.js로 발행
    snapshot = json.dumps({'docs': docs}, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    (out.parent / 'data.js').write_text(f'window.DASHBOARD_SNAPSHOT = {snapshot};\n', encoding='utf-8')
    new = [w['doc_id'] for w in writes if w['collection'] == 'stats' and 'if_version' not in w]
    recorded = sum(w['collection'] == 'history' for w in writes)
    print(f'stats {len(writes) - recorded}개 + history {recorded}개 → {out.parent}/writes.json' + (f' (새 stats 문서: {", ".join(new)})' if new else ''))


def traffic_doc(page_views: dict[str, dict[str, dict]], since: dt.date, today: dt.date) -> dict:
    """사이트 전체 조회수 문서: 날짜별(빠진 날 0)·28일 합계·유입 사이트 상위 10 (유입 사이트 조회 실패는 빈 목록)"""
    by_date: dict[str, dict] = {}
    for days in page_views.values():
        for d, v in days.items():
            cell = by_date.setdefault(d, {'views': 0, 'visits': 0})
            cell['views'] += v['views']
            cell['visits'] += v['visits']
    daily = [{'date': str(since + dt.timedelta(days=i)), **by_date.get(str(since + dt.timedelta(days=i)), {'views': 0, 'visits': 0})} for i in range((today - since).days + 1)]
    try:
        refs = cf_analytics.referers(since, today)
    except Exception as error:  # noqa: BLE001
        print(f'Cloudflare 유입 사이트를 읽지 못함: {error}', file=sys.stderr)
        refs = []
    return {
        'range': {'start': str(since), 'end': str(today)},
        'views': sum(r['views'] for r in daily), 'visits': sum(r['visits'] for r in daily),
        'daily': daily, 'referers': refs,
    }


def history_writes(docs: dict[str, dict], out: pathlib.Path) -> list[dict]:
    """회차 기록: stats 문서마다 history 컬렉션에 `{갱신 시각}_{문서 ID}` 새 문서를 만드는 쓰기 목록.
    if_version 없이 만들므로 같은 ID가 이미 있으면 서버가 거부함 (기록은 덮어쓰거나 지우지 않음, 2026-10-23 사용자 결정)"""
    run_at = docs['summary']['updatedAt']
    out.mkdir(parents=True, exist_ok=True)
    writes = []
    for doc_id, data in docs.items():
        hid = f'{run_at}_{doc_id}'
        f = out / f"{hid.replace(':', '-')}.json"
        f.write_text(json.dumps({'runAt': run_at, 'doc': doc_id, 'data': data}, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
        writes.append({'op': 'set', 'collection': 'history', 'doc_id': hid, 'file_path': str(f)})
    return writes


if __name__ == '__main__':
    main()
