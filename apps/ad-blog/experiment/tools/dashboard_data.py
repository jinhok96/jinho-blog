"""운영 대시보드(claude.ai 아티팩트) 데이터 생성 (ToolProof 운영 실험용)

Search Console API·글 frontmatter·사실 확인표·traffic-playbook·log.md를 읽어 대시보드 DB 문서를 JSON 파일로 만든다.
업로드는 세션에서 `ArtifactData` 도구로 한다 (README "운영 대시보드" 절차).

실행: /tmp/gsc/bin/python -I apps/ad-blog/experiment/tools/dashboard_data.py [--out /tmp/dashboard] [--no-inspect] [--versions '{"summary": 3, ...}']
출력: {out}/stats/{doc_id}.json + {out}/writes.json (ArtifactData batch의 writes 값 그대로)
      + {out}/data.js (비로그인 열람용 스냅숏, 아티팩트 파일 `data.js`로 발행)

`stats` 컬렉션 하나에 문서 몇 개만 둔다 (세션마다 버전을 옮겨 적는 수를 줄이려고). 기존 문서를 덮어쓰려면
`ArtifactData list stats`로 본 버전을 `--versions`에 넘긴다 (없는 문서는 새로 만듦).
- summary: 갱신 시각·28일 합계·사이트맵 상태
- daily-YYYY-MM: {rows: [{date, clicks, impressions, ctr, position, state}]} (state = final 확정 | fresh 미확정)
- posts: {rows: [{slug, title, category, createdAt, updatedAt?, images, words, tags, channel, 28일 지표, queries, daily, index}],
         otherPages: [{path, 28일 지표, queries, daily}]}  (queries = 검색어 상위 10, daily = 날짜별 노출·클릭)
- breakdown: 28일 기기별·국가별(상위 10)·검색 유형별(웹·이미지·동영상·뉴스·Discover) 지표, 사이트 검색어 상위 20
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

EXPERIMENT = pathlib.Path(__file__).resolve().parents[1]
LAUNCH = dt.date(2026, 10, 10)  # 도메인 연결 전날부터 집계


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


def channel(slug: str) -> str | None:
    for name in ('facts.md', 'factcheck.md'):
        f = EXPERIMENT / 'tests' / slug / name
        if f.exists():
            m = re.search(r'채널:\s*\**(검색형|피드형)', f.read_text(encoding='utf-8'))
            if m:
                return m.group(1)
    return None


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
    ap.add_argument('--versions', help='기존 문서 버전 JSON (예: \'{"summary": 3, "posts": 3}\')')
    args = ap.parse_args()

    token = load_token()
    today = dt.date.today()
    start, end = str(LAUNCH), str(today)
    docs: dict[str, dict] = {}

    # 날짜별: 미확정 포함 값을 쓰고, 확정 데이터에 있는 날짜는 final로 표시. 달마다 문서 1개
    final_dates = {r['keys'][0] for r in search_analytics(token, args.site, start, end, ['date'], 1000, data_state='final')}
    for r in search_analytics(token, args.site, start, end, ['date'], 1000):
        d = r['keys'][0]
        docs.setdefault(f'daily-{d[:7]}', {'rows': []})['rows'].append({'date': d, **metrics(r), 'state': 'final' if d in final_dates else 'fresh'})

    # 글별: 최근 28일 지표 + 검색어 + 날짜별 추이 + 색인 상태
    since = str(today - dt.timedelta(days=28))
    by_page = {r['keys'][0]: r for r in search_analytics(token, args.site, since, end, ['page'], 1000)}
    queries: dict[str, list] = {}
    for r in search_analytics(token, args.site, since, end, ['page', 'query'], 5000):
        queries.setdefault(r['keys'][0], []).append({'query': r['keys'][1], **metrics(r)})
    page_daily: dict[str, list] = {}
    for r in search_analytics(token, args.site, since, end, ['page', 'date'], 5000):
        page_daily.setdefault(r['keys'][0], []).append({'date': r['keys'][1], 'clicks': int(r['clicks']), 'impressions': int(r['impressions'])})

    def page_extra(url: str) -> dict:
        q = sorted(queries.get(url, []), key=lambda x: (-x['impressions'], -x['clicks']))[:10]
        return {'queries': q, 'daily': sorted(page_daily.get(url, []), key=lambda x: x['date'])}

    posts = []
    for path in sorted(POSTS_DIR.glob('*.mdx')):
        slug = path.stem
        url = f'{SITE_ORIGIN}/posts/{slug}'
        doc = {'slug': slug, **frontmatter(path), 'channel': channel(slug), **metrics(by_page.get(url)), **page_extra(url)}
        if not args.no_inspect:
            res = call('POST', f'{API}/v1/urlInspection/index:inspect', token, {'inspectionUrl': url, 'siteUrl': args.site})
            idx = res.get('inspectionResult', {}).get('indexStatusResult', {})
            google_canonical = idx.get('googleCanonical')
            doc['index'] = {
                'verdict': idx.get('verdict'), 'coverage': idx.get('coverageState'), 'lastCrawl': idx.get('lastCrawlTime'),
                'crawledAs': idx.get('crawledAs'), 'fetch': idx.get('pageFetchState'),
                'canonicalOk': None if not google_canonical else google_canonical == url,
            }
        posts.append(doc)
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
    for t in ('web', 'image', 'video', 'news', 'discover', 'googleNews'):
        rows = search_analytics(token, args.site, since, end, [], 1, search_type=t)
        types.append({'key': t, **metrics(rows[0] if rows else None)})
    docs['breakdown'] = {'devices': dim('device', 5), 'countries': dim('country', 10), 'queries': dim('query', 20), 'searchTypes': types}
    docs['experiments'] = {'rows': experiments()}
    docs['knowhow'] = {'rows': knowhow()}
    docs['sessions'] = {'rows': sessions()}

    total = search_analytics(token, args.site, since, end, [], 1)
    sitemaps = call('GET', f'{API}/webmasters/v3/sites/{site_path(args.site)}/sitemaps', token).get('sitemap', [])
    sm = sitemaps[0] if sitemaps else {}
    docs['summary'] = {
        'updatedAt': dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
        'range': {'start': since, 'end': end},
        **metrics(total[0] if total else None),
        'sitemap': {'lastDownloaded': sm.get('lastDownloaded'), 'errors': int(sm.get('errors', 0)), 'warnings': int(sm.get('warnings', 0))},
    }

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
    (out.parent / 'writes.json').write_text(json.dumps(writes, ensure_ascii=False), encoding='utf-8')
    # 비로그인 열람용 스냅숏 (아티팩트 DB는 로그인한 사람만 읽을 수 있음). 아티팩트 파일 data.js로 발행
    snapshot = json.dumps({'docs': docs}, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    (out.parent / 'data.js').write_text(f'window.DASHBOARD_SNAPSHOT = {snapshot};\n', encoding='utf-8')
    new = [w['doc_id'] for w in writes if 'if_version' not in w]
    print(f'{len(writes)}개 문서 → {out.parent}/writes.json' + (f' (새 문서: {", ".join(new)})' if new else ''))


if __name__ == '__main__':
    main()
