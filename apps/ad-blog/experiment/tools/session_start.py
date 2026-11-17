"""정기 세션 시작 — 세션 유형 판정·환경 준비·이번 주 발행 한도를 결정론적으로 (2026-11-18 사용자 결정: "모든 과정에서 결정론적 방식을 도입")

세션은 맨 처음 이 스크립트를 실행하고, 출력된 세션 유형과 순서를 그대로 따른다. 판단이 들어가는 단계(주제·개선 작업 고르기, 글쓰기)는
스크립트가 정하지 않는다.

실행: python3 -I apps/ad-blog/experiment/tools/session_start.py --log-dir {스크래치패드} [--now 2026-11-18T02:15:00+09:00] [--no-setup]

판정 규칙 (README 결정사항 '정기 실행', 2026-11-18):
- 한국 시간 00:00~07:59에 시작한 세션 = 02시 정기 실행 → 그날 요일로: 월·수 일반 · 화·목 개선(목요일은 주간 SEO 점검 먼저) · 금·토·일 지표
- 그 밖의 시각(수동 실행 등) = 개선 세션
- 일반 세션이라도 이번 주(월~일, 한국 날짜)에 이미 새 글 2편(허브 제외)이면 발행하지 않고 개선 세션으로
- 지난주(월~일)에 `news` 칼럼이 없으면 이번 일반 세션 1편을 영향 뉴스 칼럼으로 대신 쓸 수 있음 (선택)

환경 준비 (`--no-setup`이면 건너뜀):
- /tmp/gsc 가상환경(google-auth·requests), origin/main 이력(얕은 클론이면 unshallow — link_seen·daily_metrics용)
- 일반 세션이면 대표 이미지 엔진 준비 `hero_image.py --setup`을 백그라운드로 시작 (로그: {log-dir}/hero_setup.log)
"""

import argparse
import datetime as dt
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
EXPERIMENT = ROOT / 'apps/ad-blog/experiment'
POSTS = ROOT / 'apps/ad-blog/content/posts'
TOOLS = EXPERIMENT / 'tools'
KST = dt.timezone(dt.timedelta(hours=9))
WEEKLY_POSTS = 2  # 새 글 주 2편 (2026-11-18 사용자 결정)
WEEKDAY_TYPE = {0: '일반', 1: '개선', 2: '일반', 3: '개선', 4: '지표', 5: '지표', 6: '지표'}
NAMES = '월화수목금토일'


def frontmatter(path: Path) -> dict:
    text = path.read_text(encoding='utf-8')
    m = re.match(r'^---\n(.*?)\n---\n', text, re.S)
    out = {}
    if not m:
        return out
    for line in m.group(1).splitlines():
        kv = re.match(r'^([A-Za-z]+):\s*(.*)$', line)
        if kv:
            out[kv.group(1)] = kv.group(2).strip().strip("'\"")
    return out


def posts() -> list[dict]:
    rows = []
    for p in sorted(POSTS.glob('*.mdx')):
        fm = frontmatter(p)
        if not fm.get('createdAt'):
            continue
        created = dt.datetime.fromisoformat(fm['createdAt'].replace('Z', '+00:00')).astimezone(KST)
        rows.append({'slug': p.stem, 'category': fm.get('category'), 'hub': fm.get('hub') == 'true', 'created': created})
    return rows


def week_start(day: dt.date) -> dt.date:
    return day - dt.timedelta(days=day.weekday())


def setup(session: str, log_dir: Path) -> list[str]:
    done = []
    venv = Path('/tmp/gsc/bin/python')
    if not venv.exists():
        subprocess.run([sys.executable, '-m', 'venv', '/tmp/gsc'], check=True)
    if subprocess.run([str(venv), '-c', 'import google.auth, requests'], capture_output=True).returncode != 0:
        subprocess.run([str(venv), '-m', 'pip', 'install', '-q', 'google-auth', 'requests'], check=True)
    done.append('/tmp/gsc 가상환경 준비')
    shallow = subprocess.run(['git', '-C', str(ROOT), 'rev-parse', '--is-shallow-repository'], capture_output=True, text=True).stdout.strip()
    fetch = ['git', '-C', str(ROOT), 'fetch', '-q'] + (['--unshallow'] if shallow == 'true' else []) + ['origin', 'main']
    ok = subprocess.run(fetch).returncode == 0
    done.append('origin/main 이력 ' + ('확보' if ok else '받기 실패 (link_seen 값만 빠짐)'))
    if session == '일반':
        log_dir.mkdir(parents=True, exist_ok=True)
        log = log_dir / 'hero_setup.log'
        with log.open('w') as f:
            subprocess.Popen([sys.executable, '-I', str(TOOLS / 'hero_image.py'), '--setup'], cwd=ROOT, stdout=f, stderr=subprocess.STDOUT, start_new_session=True)
        done.append(f'대표 이미지 엔진 준비를 백그라운드로 시작 (로그 {log})')
    return done


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--now', help='판정 기준 시각 (ISO, 시험용). 빼면 지금')
    ap.add_argument('--log-dir', default='/tmp', help='백그라운드 작업 로그 폴더 (스크래치패드)')
    ap.add_argument('--no-setup', action='store_true', help='환경 준비 없이 판정만')
    ap.add_argument('--json', action='store_true', help='판정 결과를 JSON 한 줄로도 출력')
    args = ap.parse_args()

    now = dt.datetime.fromisoformat(args.now).astimezone(KST) if args.now else dt.datetime.now(KST)
    today = now.date()
    scheduled = 0 <= now.hour < 8
    session = WEEKDAY_TYPE[now.weekday()] if scheduled else '개선'
    reasons = [f"{now:%Y-%m-%d %H:%M} KST({NAMES[now.weekday()]}) 시작 → " + (f'02시 정기 실행, {NAMES[now.weekday()]}요일 = {session} 세션' if scheduled else '정기 시각(00:00~07:59) 밖 → 개선 세션')]

    rows = posts()
    this_week = [r for r in rows if not r['hub'] and week_start(r['created'].date()) == week_start(today) and r['created'] <= now]
    last_week_start = week_start(today) - dt.timedelta(days=7)
    last_week_news = [r for r in rows if r['category'] == 'news' and last_week_start <= r['created'].date() < week_start(today)]
    if session == '일반' and len(this_week) >= WEEKLY_POSTS:
        session = '개선'
        reasons.append(f"이번 주 새 글 {len(this_week)}편({', '.join(r['slug'] for r in this_week)})으로 주 {WEEKLY_POSTS}편 한도 → 발행하지 않고 개선 세션")
    weekly_check = session == '개선' and scheduled and now.weekday() == 3
    news_ok = session == '일반' and not last_week_news

    print(f'## 세션 유형: **{session} 세션**' + (' (주간 SEO 점검 먼저)' if weekly_check else ''))
    for r in reasons:
        print(f'- {r}')
    print(f"- 이번 주(월 {week_start(today):%m-%d}~) 새 글 {len(this_week)}/{WEEKLY_POSTS}편: " + (', '.join(f"`{r['slug']}`" for r in this_week) or '없음'))
    if session == '일반':
        print('- 뉴스 칼럼 대체: ' + ('가능 (지난주 `news` 칼럼 없음, 영향이 오래 가는 뉴스만)' if news_ok else f"불가 (지난주 칼럼 {', '.join(r['slug'] for r in last_week_news)})"))

    if not args.no_setup:
        for line in setup(session, Path(args.log_dir)):
            print(f'- 준비: {line}')

    print()
    print('### 순서 (README 세션 워크플로우, 그대로 따름)')
    common_metrics = [
        '앞 세션의 열린 PR 처리 (GitHub MCP)',
        f'지표: `python3 -I apps/ad-blog/experiment/tools/daily_metrics.py --out {args.log_dir}/dashboard` → 출력대로 `ArtifactData` batch → `--finalize`',
    ]
    if session == '지표':
        steps = common_metrics + ['출력된 파일·메시지 그대로 커밋 → PR → CI 통과 후 머지. 글·log.md·다른 문서는 고치지 않음']
    else:
        steps = common_metrics + [
            f'지표 블록: `python3 -I apps/ad-blog/experiment/tools/session_report.py --out {args.log_dir}/dashboard` → log.md 세션 기록에 그대로 붙여 넣고 해석은 따로',
        ]
        if weekly_check:
            steps.append(f'주간 SEO 점검 데이터: `python3 -I apps/ad-blog/experiment/tools/weekly_checks.py --out {args.log_dir}/weekly.md` → 그 결과로 log.md `## {{날짜}} · 주간 SEO 점검` 섹션')
        if session == '일반':
            steps += [
                '주제 선정·브리프·조사·작성 (판단, README 주제 선정 기준·writing-guide)',
                '발행 전 점검: `python3 -I apps/ad-blog/experiment/tools/prepublish_check.py --slug {slug} --build` → FAIL 0이 될 때까지 고침',
            ]
        else:
            steps.append('개선 작업 2~3개 (판단, README 개선 세션 순서·SEO 스킬)')
        steps += ['log.md·backlog·clusters 기록 → 커밋 → PR → CI 통과 후 머지']
    for i, s in enumerate(steps, 1):
        print(f'{i}. {s}')

    if args.json:
        print(json.dumps({'session': session, 'weeklyCheck': weekly_check, 'newsAllowed': news_ok, 'thisWeek': [r['slug'] for r in this_week], 'now': now.isoformat()}, ensure_ascii=False))


if __name__ == '__main__':
    main()
