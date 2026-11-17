"""주간 SEO 점검 데이터 수집 — 점검 도구를 같은 순서·같은 옵션으로 한 번에 (2026-11-18 사용자 결정: 결정론적 방식 도입)

목요일 개선 세션이 README '주간 SEO 점검'을 하기 전에 실행한다. 판단(우선순위·고칠 것)은 세션이 이 보고를 읽고 정하고,
이 스크립트는 데이터만 모은다. 각 도구의 출력을 그대로 한 파일에 모으고 도구별 결과 줄 수·종료 코드·소요 시간을 요약한다.

실행: python3 -I apps/ad-blog/experiment/tools/weekly_checks.py --out {스크래치패드}/weekly.md [--skip source_diff,extlink] [--timeout 900]

순서 (도구별 시간 제한 안에서, 실패해도 다음 도구로):
1. link_audit      — 클러스터·내부 링크 문제 (`link_audit.py --only-problems`)
2. stale_check     — 날짜가 지나 낡은 미래형·상대 시점 문장 (`stale_check.py`)
3. dup_check       — 글끼리 반복되는 문장 (`dup_check.py`)
4. extlink         — 본문 외부 링크 깨짐·이동 (`extlink_check.py --only-problems`)
5. app_versions    — 글에서 시험한 앱·브라우저의 새 판 (`app_versions.py --only-outdated`)
6. source_diff     — 저장한 1차 출처 사본과 지금 페이지의 문장 차이 (`source_diff.cjs`, Playwright)
색인·크롤링·검색 지표는 같은 세션의 `daily_metrics.py`·`session_report.py` 결과를 함께 봄
"""

import argparse
import datetime as dt
import os
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
TOOLS = ROOT / 'apps/ad-blog/experiment/tools'
KST = dt.timezone(dt.timedelta(hours=9))

CHECKS = [
    ('link_audit', [sys.executable, '-I', str(TOOLS / 'link_audit.py'), '--only-problems']),
    ('stale_check', [sys.executable, '-I', str(TOOLS / 'stale_check.py')]),
    ('dup_check', [sys.executable, '-I', str(TOOLS / 'dup_check.py')]),
    ('extlink', [sys.executable, '-I', str(TOOLS / 'extlink_check.py'), '--only-problems']),
    ('app_versions', [sys.executable, '-I', str(TOOLS / 'app_versions.py'), '--only-outdated']),
    ('source_diff', ['node', str(TOOLS / 'source_diff.cjs')]),
]


def node_env() -> dict:
    env = dict(os.environ)
    if 'NODE_PATH' not in env:
        root = subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True).stdout.strip()
        if root:
            env['NODE_PATH'] = root  # source_diff.cjs가 전역 playwright를 require
    return env


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--out', required=True, help='보고 파일 (스크래치패드 안 .md)')
    ap.add_argument('--skip', default='', help='건너뛸 도구 이름 (쉼표)')
    ap.add_argument('--timeout', type=int, default=900, help='도구별 시간 제한(초)')
    args = ap.parse_args()
    skip = {s.strip() for s in args.skip.split(',') if s.strip()}
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    env = node_env()

    started = dt.datetime.now(KST)
    sections, summary = [], []
    for name, cmd in CHECKS:
        if name in skip:
            summary.append(f'| {name} | 건너뜀 | - | - |')
            continue
        print(f'[{name}] 실행 중…', flush=True)
        t0 = time.time()
        try:
            res = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, timeout=args.timeout, env=env)
            text, code = (res.stdout + ('\n' + res.stderr if res.stderr.strip() else '')).strip(), res.returncode
        except subprocess.TimeoutExpired as e:
            text, code = ((e.stdout or b'').decode() if isinstance(e.stdout, bytes) else (e.stdout or '')) + f'\n(시간 제한 {args.timeout}초 초과로 중단)', 'timeout'
        secs = round(time.time() - t0)
        lines = [ln for ln in text.splitlines() if ln.strip()]
        summary.append(f'| {name} | {code} | {len(lines)} | {secs}s |')
        shown = ' '.join(Path(c).name if i == 0 else c.replace(str(ROOT) + '/', '') for i, c in enumerate(cmd))
        sections.append(f'## {name}\n\n`{shown}` · 종료 코드 {code} · {secs}초\n\n```text\n{text}\n```\n')

    report = [
        f'# 주간 SEO 점검 데이터 ({started:%Y-%m-%d %H:%M} KST, `weekly_checks.py`)',
        '',
        '| 도구 | 종료 코드 | 출력 줄 수 | 소요 |',
        '| --- | --- | --- | --- |',
        *summary,
        '',
        *sections,
    ]
    out.write_text('\n'.join(report), encoding='utf-8')
    print('\n'.join(report[:4 + len(summary)]))
    print(f'\n보고 파일: {out}')


if __name__ == '__main__':
    main()
