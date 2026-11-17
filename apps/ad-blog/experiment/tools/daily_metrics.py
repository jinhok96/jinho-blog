"""매일 대시보드 지표 갱신 — 결정론적 절차 (2026-11-18 사용자 결정: "대시보드 지표 업데이트는 매일, 결정론적 방식으로")

모든 정기 세션(월~일)이 같은 순서로 실행한다. 판단이 들어가는 단계는 없고, 세션은 출력된 다음 단계를 그대로 따른다.
대시보드 데이터는 claude.ai 아티팩트 DB에 있어 `ArtifactData` batch(세션 도구)만 쓸 수 있으므로, 그 한 단계만 세션이 하고
나머지(환경 준비·데이터 생성·검증·버전 반영·실행 기록·커밋 파일 목록)는 이 스크립트가 한다.

1단계 (준비 + 생성 + 검증):
    python3 -I apps/ad-blog/experiment/tools/daily_metrics.py --out {스크래치패드}/dashboard
    - /tmp/gsc 가상환경(google-auth·requests)을 없으면 만들고, 얕은 클론이면 origin/main 이력을 받음(link_seen용)
    - 출력 폴더를 비우고 dashboard_data.py를 실행 (Search Console·URL 검사·GA4·Cloudflare → stats 13 + history 13)
    - writes.json 검증: 문서 수, 모든 file_path 존재, stats 문서의 if_version = dashboard/versions.json 값, history는 if_version 없음
    - 통과하면 마지막에 "다음 단계"를 출력
2단계 (세션): {out}/writes.json 내용을 그대로 `ArtifactData` action "batch"의 writes로 보냄 (url = 대시보드 주소)
    - 결과가 "committed atomically"이고 문서별 버전이 {out}/versions-after.json과 같으면 3단계
    - 버전이 어긋나 거부되면 README '운영 대시보드' 절차의 버전 확인 방법으로 versions.json을 고친 뒤 1단계부터
3단계 (마무리):
    python3 -I apps/ad-blog/experiment/tools/daily_metrics.py --finalize --out {같은 폴더}
    - versions-after.json → experiment/dashboard/versions.json
    - experiment/dashboard/runs.jsonl에 이번 회차 요약 1줄 추가 (회차 시각·28일 클릭·노출·순위·색인·AdSense 조건 + 다음 회차 비교용 snapshot:
      글별 URL 검사 상태·주별 클릭·sitemap 다운로드·목록 페이지 크롤링)
    - 커밋할 파일 목록과 커밋 메시지를 출력 (세션이 그대로 커밋 → PR → CI 통과 후 머지)
"""

import argparse
import datetime as dt
import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
EXPERIMENT = ROOT / 'apps/ad-blog/experiment'
TOOLS = EXPERIMENT / 'tools'
VERSIONS = EXPERIMENT / 'dashboard/versions.json'
FIRST_SEEN = EXPERIMENT / 'dashboard/first-seen.json'
RUNS = EXPERIMENT / 'dashboard/runs.jsonl'
VENV = Path('/tmp/gsc')
DASHBOARD_URL = 'https://claude.ai/artifact/4nL6tkJXzL4YQd2FXis8Cb'
KST = dt.timezone(dt.timedelta(hours=9))


def run(cmd: list[str], **kw) -> subprocess.CompletedProcess:
    print('$', ' '.join(str(c) for c in cmd), flush=True)
    return subprocess.run(cmd, check=True, **kw)


def ensure_venv() -> Path:
    py = VENV / 'bin/python'
    if not py.exists():
        run([sys.executable, '-m', 'venv', str(VENV)])
    probe = subprocess.run([str(py), '-c', 'import google.auth, requests'], capture_output=True)
    if probe.returncode != 0:
        run([str(py), '-m', 'pip', 'install', '-q', 'google-auth', 'requests'])
    return py


def ensure_history() -> None:
    shallow = subprocess.run(['git', '-C', str(ROOT), 'rev-parse', '--is-shallow-repository'],
                             capture_output=True, text=True).stdout.strip()
    if shallow == 'true':
        # link_seen이 origin/main 이력으로 '그 크롤링 때 있던 링크'를 계산함. 실패해도 dashboard_data는 그 값만 빼고 진행
        subprocess.run(['git', '-C', str(ROOT), 'fetch', '-q', '--unshallow', 'origin', 'main'])
    else:
        subprocess.run(['git', '-C', str(ROOT), 'fetch', '-q', 'origin', 'main'])


def validate(out: Path) -> list[dict]:
    writes = json.loads((out / 'writes.json').read_text(encoding='utf-8'))
    versions = json.loads(VERSIONS.read_text(encoding='utf-8')) if VERSIONS.exists() else {}
    errors = []
    stats = [w for w in writes if w['collection'] == 'stats']
    history = [w for w in writes if w['collection'] == 'history']
    if not stats or len(stats) != len(history):
        errors.append(f'stats {len(stats)}개 · history {len(history)}개 (같아야 함)')
    if len(writes) > 50:
        errors.append(f'batch 한도 50개 초과: {len(writes)}')
    for w in writes:
        if not Path(w['file_path']).exists():
            errors.append(f"파일 없음: {w['file_path']}")
    for w in stats:
        expected = versions.get(w['doc_id'])
        if expected is not None and w.get('if_version') != expected:
            errors.append(f"{w['doc_id']}: if_version {w.get('if_version')} ≠ versions.json {expected}")
    for w in history:
        if 'if_version' in w:
            errors.append(f"history {w['doc_id']}에 if_version이 있음")
    size = sum(Path(w['file_path']).stat().st_size for w in writes if Path(w['file_path']).exists())
    if size > 1024 * 1024:
        errors.append(f'batch 본문 1 MiB 초과 가능: 파일 합계 {size} bytes')
    if errors:
        sys.exit('writes.json 검증 실패 — batch를 보내지 않음:\n- ' + '\n- '.join(errors))
    return writes


def generate(out: Path, no_inspect: bool) -> None:
    py = ensure_venv()
    ensure_history()
    if out.exists():
        shutil.rmtree(out)
    cmd = [str(py), '-I', str(TOOLS / 'dashboard_data.py'), '--out', str(out)]
    if no_inspect:
        cmd.append('--no-inspect')
    run(cmd, cwd=ROOT)
    writes = validate(out)
    summary = json.loads((out / 'stats/summary.json').read_text(encoding='utf-8'))
    print()
    print(f"검증 통과: 회차 {summary['updatedAt']} · 쓰기 {len(writes)}개 (stats {len(writes) // 2} + history {len(writes) // 2})")
    print('다음 단계 (그대로 따름):')
    print(f'  2. ArtifactData action "batch", url "{DASHBOARD_URL}", writes = {out / "writes.json"} 파일 내용 그대로')
    print(f'     결과 버전이 {out / "versions-after.json"}와 같은지 확인')
    print(f'  3. python3 -I apps/ad-blog/experiment/tools/daily_metrics.py --finalize --out {out}')


def snapshot(out: Path, s: dict) -> dict:
    """이번 회차 비교용 요약: 글별 URL 검사 {verdict, coverage, lastCrawl}, 주별 클릭·노출, sitemap 마지막 다운로드, 목록 페이지 크롤링"""
    posts_path = out / 'stats/posts.json'
    rows = json.loads(posts_path.read_text(encoding='utf-8')).get('rows', []) if posts_path.exists() else []
    index = {}
    for r in sorted(rows, key=lambda r: r['slug']):
        idx = r.get('index') or {}
        if idx.get('coverage'):
            index[r['slug']] = {k: idx.get(k) for k in ('verdict', 'coverage', 'lastCrawl')}
    crawl = s.get('crawl') or {}
    return {
        'posts': index or None,
        'weeks': (s.get('adsense') or {}).get('weeks'),
        'sitemaps': {sm.get('path'): sm.get('lastDownloaded') for sm in s.get('sitemaps') or []} or None,
        'listPages': crawl.get('listPages'),
    }


def finalize(out: Path) -> None:
    after = out / 'versions-after.json'
    summary_path = out / 'stats/summary.json'
    if not after.exists() or not summary_path.exists():
        sys.exit(f'{out}에 1단계 결과가 없음 (versions-after.json·stats/summary.json)')
    shutil.copyfile(after, VERSIONS)
    s = json.loads(summary_path.read_text(encoding='utf-8'))
    a = s.get('adsense', {})
    crawl = s.get('crawl') or {}
    run_at = s['updatedAt']
    weekday = '월화수목금토일'[dt.datetime.fromisoformat(run_at.replace('Z', '+00:00')).astimezone(KST).weekday()]
    row = {
        'runAt': run_at,
        'kstWeekday': weekday,
        'range': s.get('range'),
        'clicks28': s.get('clicks'),
        'impressions28': s.get('impressions'),
        'position28': s.get('position'),
        'indexed': a.get('indexed'),
        'total': a.get('total'),
        'indexRate': a.get('indexRate'),
        'operatingDays': a.get('operatingDays'),
        'clickStreak': a.get('clickStreak'),
        'adsenseAllMet': a.get('allMet'),
        'latestCrawl': (crawl.get('latest') or {}).get('lastCrawl') if isinstance(crawl.get('latest'), dict) else crawl.get('latest'),
        'unindexedSeen': crawl.get('unindexedSeen'),
        # 다음 회차 session_report.py가 '이전 회차 대비'(색인 상태 변화·새 크롤링·주별 클릭·sitemap)를 계산하는 데 씀
        'snapshot': snapshot(out, s),
    }
    existing = RUNS.read_text(encoding='utf-8').splitlines() if RUNS.exists() else []
    if not any(json.loads(line).get('runAt') == run_at for line in existing if line.strip()):
        with RUNS.open('a', encoding='utf-8') as f:
            f.write(json.dumps(row, ensure_ascii=False) + '\n')
    rel = [str(p.relative_to(ROOT)) for p in (VERSIONS, FIRST_SEEN, RUNS)]
    print(json.dumps(row, ensure_ascii=False))
    print()
    print('커밋 (그대로):')
    print('  git add ' + ' '.join(rel))
    print(f'  메시지: Document: 대시보드 지표 갱신 (회차 {run_at})')
    if a.get('allMet'):
        print('AdSense 재신청 조건 모두 충족 → log.md 다음 할 일·user-todos.md에 사용자: AdSense 재신청')


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--out', required=True, help='출력 폴더 (스크래치패드 안, 1·3단계 같은 값)')
    ap.add_argument('--finalize', action='store_true', help='3단계: batch 성공 뒤 버전 반영·실행 기록')
    ap.add_argument('--no-inspect', action='store_true', help='URL 검사 생략 (하루 2,000회 할당량을 넘을 때만)')
    args = ap.parse_args()
    out = Path(args.out).resolve()
    if args.finalize:
        finalize(out)
    else:
        generate(out, args.no_inspect)


if __name__ == '__main__':
    main()
