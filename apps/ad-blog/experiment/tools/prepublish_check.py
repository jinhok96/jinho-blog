"""발행 전 점검 — 결정론적 체크리스트 (2026-11-18 사용자 결정: "모든 과정에서 결정론적 방식을 도입")

새 글을 발행하기 전에 writing-guide.md '발행 전 체크리스트'·'이미지'·'제목·설명'·'파일·frontmatter'·'링크'와
routine-prompt.md '검증' 단계 중 기계적으로 판정할 수 있는 항목을 한 번에 점검한다. 점검마다 한 줄씩
`PASS`·`WARN`·`FAIL`과 짧은 사유를 출력하고 마지막에 개수를 요약한다. FAIL이 하나라도 있으면 종료 코드 1.

실행:
  python3 -I apps/ad-blog/experiment/tools/prepublish_check.py --slug {slug}
      → MDX·이미지·사실 확인표·클러스터를 점검하고, 빌드 HTML(.next)이 있으면 그것도 점검
  python3 -I apps/ad-blog/experiment/tools/prepublish_check.py --slug {slug} --build
      → 먼저 저장소 루트에서 pnpm --filter @jinho-blog/ad-blog lint → test → build (3~5분) 후 빌드 HTML까지 점검.
        build 출력에 SecurityFatalError(Next.js 첫 빌드)가 있으면 1회 다시 빌드하고 WARN,
        빌드가 바꾼 packages/nextjs-routes/dist/cli.js는 되돌림
  ... --extlinks          본문 외부 링크도 점검 (extlink_check.py --slug, 네트워크 사용)
  ... --allow-thumbnail   대표 이미지 생성 실패로 frontmatter thumbnail을 임시로 쓴 경우 (FAIL → WARN)
  python3 -I apps/ad-blog/experiment/tools/prepublish_check.py --compare-images 대표.webp og.jpg
      → og 이미지가 대표 이미지에서 만들어졌는지 판정하는 값(MAD·상관)만 출력 (임계값 확인용)

- FAIL: 가이드가 금지하거나 발행에 꼭 필요한 것. WARN: 권장 범위 밖이거나 맥락에 따라 괜찮을 수 있는 것
  (명령줄 단어는 "PowerShell 방법은 다루지 않음"처럼 정당하게 나올 수 있어 해당 줄을 보여 주고 세션이 판단)
- 제목 틀 반복: 다른 글과 첫 3단어(`How to`로 시작하면 그 뒤 3단어)나 끝 3단어가 같거나, 끝 2단어가 다른 글 2편 이상과
  같으면 WARN으로 비슷한 제목을 보여 줌 (가이드의 `How to {동작} {제품}` 유형 패턴 자체는 틀로 보지 않음)
- og 이미지: 대표 이미지(thumbnail이 있으면 그것)를 빌드와 같은 방식(sharp `fit: cover` = 가운데 기준 1200×630)으로
  자르고 둘 다 120×63으로 줄여 비교. 2026-11-18 글 58편 보정: 같은 글 MAD ≤ 1.6·상관 ≥ 0.998,
  다른 글끼리(3,306쌍) MAD ≥ 18·상관 ≤ 0.55 → MAD ≤ 6 이고 상관 ≥ 0.97이면 PASS
- 판단이 필요한 항목(사실·1차 출처, 첫 문장이 답인지, 그림 내용, 앵커 텍스트가 설명형인지 등)은 끝에 '사람이 볼 것'으로만 나열
- Pillow·numpy 필요 (이미지 크기·og 비교). 실행한 python에서 못 불러오면(컨테이너 기본 Pillow는 `_imaging` 오류로 깨져 있음)
  /tmp/check venv에 설치하고 그 python으로 다시 실행. 설치도 실패하면 이미지 항목만 WARN으로 두고 계속
"""

import argparse
import datetime as dt
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
APP = ROOT / 'apps/ad-blog'
EXPERIMENT = APP / 'experiment'
TOOLS = EXPERIMENT / 'tools'
POSTS = APP / 'content/posts'
TESTS = EXPERIMENT / 'tests'
CLUSTERS = EXPERIMENT / 'clusters.md'
TRENDS = EXPERIMENT / 'dashboard/keyword-trends.json'
BUILT = APP / '.next/server/app/posts'
OG_DIR = APP / 'public/_static/mdx/posts/og'
MEDIA_URL = '/_static/mdx/posts'
CLI_JS = 'packages/nextjs-routes/dist/cli.js'
PACKAGE = '@jinho-blog/ad-blog'
VENV_DIR = Path('/tmp/check')

sys.path.insert(0, str(TOOLS))
from link_audit import BRANDS, LINK_RE, parse_clusters  # noqa: E402
from stale_check import RELATIVE  # noqa: E402

CATEGORIES = {'ai-tools', 'software', 'news'}
ALLOWED_KEYS = {'title', 'description', 'category', 'createdAt', 'updatedAt', 'tags', 'thumbnail', 'draft', 'hub'}
ISO_UTC = re.compile(r'^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$')
DATE_OR_ISO = re.compile(r'^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}Z)?$')  # updatedAt은 날짜만도 허용 (가이드: 같은 UTC 날짜면 시각)
SLUG_RE = re.compile(r'^[a-z0-9]+(-[a-z0-9]+)*$')
YEAR_RE = re.compile(r'(?<!\d)(19|20)\d{2}(?!\d)')
FM_RE = re.compile(r'---\r?\n(.*?)\r?\n---[ \t]*(?:\r?\n|$)', re.S)
IMG_RE = re.compile(r'!\[([^\]]*)\]\(\s*<?((?:[^()\s<>]|\([^()\s]*\))+)>?(?:\s+"[^"]*")?\s*\)')
MD_LINK_RE = re.compile(r'(?<!!)\[([^\]]+)\]\(\s*<?((?:[^()\s<>]|\([^()\s]*\))+)>?(?:\s+"[^"]*")?\s*\)')
URL_PART_RE = re.compile(r'\]\((?:[^()\s]|\([^()\s]*\))+\)|https?://\S+')
EXT_URL_RE = re.compile(r'\]\(\s*<?(https?://(?:[^()\s<>]|\([^()\s]*\))+)|href="(https?://[^"]+)"')
OWN_HOSTS = ('tool-proof.com', 'www.tool-proof.com')
H3_RE = re.compile(r'검증 유형 \(가설 H3\): \*\*(검증형|일부|조사형)\*\*')
H6_RE = re.compile(r'주 검색어 \(가설 H6\): `([^`]+)`')
NEWS_TYPE_RE = re.compile(r'유형[^\n]*\*\*(화제|영향)\*\*')
BRIEF_HEADING_RE = re.compile(r'^#{1,6}\s*작성 전 브리프')
BRIEF_ITEMS = ['클러스터·역할', '주 검색어', '하위 검색어', '검색 의도', '채널', '상위 결과', '차별점', '내부 링크 계획', '개요', '이미지']
NEWS_SECTIONS = ['What happened', 'Who is affected', 'What changes for you', 'What to do now', 'Our take', 'What to watch next']
# writing-guide '독자와 문체' 금지 표현 + '정확성' 가상 체험담
FORBIDDEN = [
    (re.compile(r"\bin today['’]s (?:fast[- ]paced|digital|modern) world\b", re.I), "In today's … world"),
    (re.compile(r'\bin conclusion\b', re.I), 'In conclusion'),
    (re.compile(r'\bdelv(?:e|es|ed|ing)\b', re.I), 'delve'),
    (re.compile(r'\bgame[- ]chang(?:er|ers|ing)\b', re.I), 'game-changer'),
    (re.compile(r"\bI['’]ve (?:been )?us(?:ed|ing)\b[^.]*\bfor (?:weeks|months|years)\b", re.I), '가상 체험담'),
]
# writing-guide '독자와 문체': 비개발자 방법만 (명령줄·코드·패키지 관리자·명령줄 전용 도구)
CLI_HINTS = re.compile(
    r'\b(?:terminal|powershell|command prompt|cmd\.exe|command[- ]line|sudo|pip3? install|npm|npx|brew|homebrew|winget|'
    r'choco(?:latey)? install|apt(?:-get)? install|apt-get|python|ffmpeg|ghostscript|qpdf|pdftoppm|img2pdf|ocrmypdf|'
    r'imagemagick|exiftool)\b|\b[\w-]+\.exe\s+[-/]\w',
    re.I,
)
FIRST_PERSON = re.compile(r"(?<![\w'’])I(?:['’](?:m|ve|d|ll))?(?![\w'’])")
EMOJI = re.compile('[\U0001F000-\U0001FAFF☀-➿️]')
BAD_ANCHORS = {'click here', 'here', 'read more', 'this article'}
MEANINGLESS_NAME = re.compile(r'^(?:image|img|screenshot|screen|picture|pic|photo|figure|fig)[-_]?\d*$', re.I)
WORD_RE = re.compile(r"[A-Za-z0-9][\w'’.-]*")
SECURITY_ERROR = 'SecurityFatalError'
OG_SIZE = (1200, 630)
OG_SMALL = (120, 63)
OG_PASS = (6.0, 0.97)  # (MAD 최대, 상관 최소)
OG_WARN = (12.0, 0.85)
MAX_DETAILS = 8

HAVE_IMAGING = False


def ensure_imaging() -> bool:
    """Pillow·numpy를 못 불러오면 /tmp/check venv에 설치하고 같은 인자로 다시 실행. 설치가 안 되면 False"""
    try:
        import numpy  # noqa: F401
        import PIL.Image  # noqa: F401
        return True
    except ImportError:
        pass
    # venv의 python은 시스템 python을 가리키는 링크라 실행 파일 경로로는 구분이 안 됨 → sys.prefix로 판단
    if Path(sys.prefix).resolve() == VENV_DIR.resolve():
        return False
    py = VENV_DIR / 'bin/python'
    try:
        if not py.exists():
            subprocess.run([sys.executable, '-m', 'venv', str(VENV_DIR)], check=True)
        probe = subprocess.run([str(py), '-c', 'import PIL.Image, numpy'], capture_output=True)
        if probe.returncode != 0:
            subprocess.run([str(py), '-m', 'pip', 'install', '-q', '--disable-pip-version-check', 'pillow', 'numpy'],
                           check=True)
    except (OSError, subprocess.CalledProcessError) as error:
        print(f'Pillow·numpy 준비 실패({error}) → 이미지 항목 없이 진행', file=sys.stderr)
        return False
    print(f'Pillow·numpy를 불러올 수 없어 {py}로 다시 실행', file=sys.stderr)
    sys.stdout.flush()
    os.execv(str(py), [str(py), '-I', *sys.argv])
    return False  # 도달하지 않음


class Report:
    def __init__(self) -> None:
        self.counts: Counter = Counter()

    def section(self, title: str) -> None:
        print(f'\n### {title}')

    def add(self, level: str, name: str, reason: str, details=()) -> None:
        self.counts[level] += 1
        print(f'{level}  {name}: {reason}')
        details = list(details)
        for item in details[:MAX_DETAILS]:
            print(f'      - {item}')
        if len(details) > MAX_DETAILS:
            print(f'      - … 외 {len(details) - MAX_DETAILS}건')
        sys.stdout.flush()

    def ok(self, name: str, reason: str, details=()) -> None:
        self.add('PASS', name, reason, details)

    def warn(self, name: str, reason: str, details=()) -> None:
        self.add('WARN', name, reason, details)

    def fail(self, name: str, reason: str, details=()) -> None:
        self.add('FAIL', name, reason, details)

    def check(self, passed: bool, name: str, good: str, bad: str, details=(), level: str = 'FAIL') -> None:
        if passed:
            self.ok(name, good)
        else:
            self.add(level, name, bad, details)


# ---------- 읽기 ----------

def scalar(raw: str):
    """frontmatter 값 하나 (따옴표 문자열·[a, b] 목록·true/false·그대로)"""
    value = raw.strip()
    if len(value) >= 2 and value[0] == value[-1] == "'":
        return value[1:-1].replace("''", "'")
    if len(value) >= 2 and value[0] == value[-1] == '"':
        try:
            return json.loads(value)
        except ValueError:
            return value[1:-1]
    if value.startswith('[') and value.endswith(']'):
        return [scalar(v) for v in value[1:-1].split(',') if v.strip()]
    if value in ('true', 'false'):
        return value == 'true'
    return value


def parse_mdx(path: Path) -> dict:
    """{meta, body, offset(본문 첫 줄 앞 줄 수)}. 사이트가 쓰는 frontmatter 형식(키: 값, 목록은 '  - 항목')만 읽음"""
    text = path.read_text(encoding='utf-8')
    m = FM_RE.match(text)
    if not m:
        return {'meta': {}, 'body': text, 'offset': 0, 'has_fm': False}
    meta: dict = {}
    key = None
    for line in m.group(1).splitlines():
        if not line.strip() or line.lstrip().startswith('#'):
            continue
        item = re.match(r'^\s*-\s+(.*)$', line)
        kv = re.match(r'^([A-Za-z_][\w-]*):(?:\s+(.*))?$', line)
        if item and key and isinstance(meta.get(key), list):
            meta[key].append(scalar(item.group(1)))
        elif kv:
            key, value = kv.group(1), kv.group(2) or ''
            meta[key] = scalar(value) if value.strip() else []
        elif key and line[:1].isspace() and isinstance(meta.get(key), str):
            meta[key] += ' ' + line.strip()  # 여러 줄로 이어 쓴 값
    return {'meta': meta, 'body': text[m.end():], 'offset': text[:m.end()].count('\n'), 'has_fm': True}


def words(text: str) -> list[str]:
    return WORD_RE.findall(text)


def prose(line: str) -> str:
    """이미지·링크 주소·굵게 표시를 뺀 글자 (링크 글자는 남김)"""
    line = IMG_RE.sub(' ', line)
    line = MD_LINK_RE.sub(lambda m: m.group(1), line)
    line = re.sub(r'https?://\S+', ' ', line)
    return re.sub(r'<[^>]+>|\*\*|__', ' ', line)


def title_words(title: str) -> list[str]:
    return [w.strip(".,:;!?'\"()[]—–").lower() for w in title.split() if w.strip(".,:;!?'\"()[]—–")]


def key_words(text: str) -> list[str]:
    """주 검색어 비교용 단어 (하이픈·기호로 나누고 끝 s 제거: AI-Generated = ai generated, Warnings = warning)"""
    return [re.sub(r'(?<=\w{3})s$', '', w) for w in re.findall(r'[a-z0-9]+', text.lower())]


def to_utc(value: str) -> dt.datetime:
    if 'T' not in value:
        value += 'T00:00:00Z'
    return dt.datetime.fromisoformat(value.replace('Z', '+00:00'))


def read_factcheck(slug: str) -> dict:
    path = TESTS / slug / 'factcheck.md'
    info = {'path': path, 'exists': path.exists(), 'h3': None, 'h6': None, 'brief': False, 'rows': {}, 'news_type': None}
    if not info['exists']:
        return info
    lines = path.read_text(encoding='utf-8').splitlines()
    for line in lines[:5]:
        if m := H3_RE.search(line):
            info['h3'] = m.group(1)
        if m := H6_RE.search(line):
            info['h6'] = m.group(1).strip()
    start = next((i for i, line in enumerate(lines) if BRIEF_HEADING_RE.match(line)), None)
    if start is not None:
        info['brief'] = True
        in_table = False
        for line in lines[start + 1:]:
            s = line.strip()
            if s.startswith('|') and s.endswith('|'):
                in_table = True
                cells = [c.strip() for c in re.split(r'(?<!\\)\|', s)[1:-1]]
                if len(cells) >= 2 and not re.fullmatch(r':?-{3,}:?', cells[0]) and cells[0] != '항목':
                    info['rows'][cells[0]] = cells[1]
            elif in_table or s.startswith('#'):
                break
    text = '\n'.join(lines)
    if m := NEWS_TYPE_RE.search(text):
        info['news_type'] = m.group(1)
    return info


def brief_row(info: dict, item: str) -> str | None:
    return next((v for k, v in info['rows'].items() if k.startswith(item)), None)


def git(*args: str, **kw) -> subprocess.CompletedProcess:
    return subprocess.run(['git', '-C', str(ROOT), *args], capture_output=True, text=True, **kw)


def rel(path: Path) -> str:
    try:
        return str(path.relative_to(ROOT))
    except ValueError:
        return str(path)


# ---------- 이미지 ----------

def image_size(path: Path) -> tuple[int, int] | None:
    if not HAVE_IMAGING:
        return None
    from PIL import Image
    with Image.open(path) as im:
        return im.size


def og_similarity(source: Path, og: Path) -> tuple[float, float]:
    """빌드처럼 source를 가운데 기준 1200×630으로 자른 뒤 og와 비교 → (평균 절대 차이 0~255, 밝기 상관)"""
    import numpy as np
    from PIL import Image, ImageOps

    with Image.open(source) as im:
        a = ImageOps.fit(im.convert('RGB'), OG_SIZE, Image.LANCZOS, centering=(0.5, 0.5))
    with Image.open(og) as im:
        b = im.convert('RGB')
        if b.size != OG_SIZE:
            b = b.resize(OG_SIZE, Image.LANCZOS)
    x = np.asarray(a.resize(OG_SMALL, Image.BILINEAR), dtype=np.float32)
    y = np.asarray(b.resize(OG_SMALL, Image.BILINEAR), dtype=np.float32)
    mad = float(np.abs(x - y).mean())
    gx = x.mean(axis=2).ravel()
    gy = y.mean(axis=2).ravel()
    gx -= gx.mean()
    gy -= gy.mean()
    den = float(np.sqrt((gx * gx).sum() * (gy * gy).sum()))
    corr = float((gx * gy).sum() / den) if den else 0.0
    return mad, corr


def og_verdict(mad: float, corr: float) -> str:
    if mad <= OG_PASS[0] and corr >= OG_PASS[1]:
        return 'PASS'
    if mad <= OG_WARN[0] and corr >= OG_WARN[1]:
        return 'WARN'
    return 'FAIL'


# ---------- 점검 ----------

class Checker:
    def __init__(self, slug: str, args: argparse.Namespace, rep: Report) -> None:
        self.slug = slug
        self.args = args
        self.rep = rep
        self.path = POSTS / f'{slug}.mdx'
        post = parse_mdx(self.path)
        self.meta = post['meta']
        self.has_fm = post['has_fm']
        self.body = post['body']
        self.offset = post['offset']
        self.lines = self.body.splitlines()
        self.others = {p.stem: parse_mdx(p)['meta'] for p in sorted(POSTS.glob('*.mdx')) if p.stem != slug}
        self.fact = read_factcheck(slug)
        self.category = self.meta.get('category') if isinstance(self.meta.get('category'), str) else ''
        self.news = self.category == 'news'
        channel = brief_row(self.fact, '채널') or ''
        self.feed = self.news or '피드형' in channel
        self.images = [
            {'alt': m.group(1).strip(), 'src': m.group(2), 'line': self.lineno(m.start())}
            for m in IMG_RE.finditer(self.body)
        ]
        first = next((i for i, line in enumerate(self.lines) if line.strip()), None)
        self.first_line = self.lines[first].strip() if first is not None else ''
        is_hero = first is not None and self.images and self.images[0]['line'] == self.offset + first + 1
        self.hero = self.images[0] if is_hero else None
        self.body_images = self.images[1:] if self.hero else self.images

    def lineno(self, index: int) -> int:
        return self.offset + self.body.count('\n', 0, index) + 1

    def numbered(self):
        for i, line in enumerate(self.lines):
            yield self.offset + i + 1, line

    def media_path(self, src: str) -> Path:
        return POSTS / src[2:] if src.startswith('./') else POSTS / src

    # --- frontmatter ---
    def frontmatter(self) -> None:
        rep, meta = self.rep, self.meta
        rep.section('frontmatter')
        if not self.has_fm:
            rep.fail('frontmatter', '파일 첫 줄에 --- 로 시작하는 frontmatter 없음')
            return
        unknown = sorted(set(meta) - ALLOWED_KEYS)
        rep.check(not unknown, '키', '허용된 키만 사용', f'스키마에 없는 키 {", ".join(unknown)} (빌드 실패)')
        self.title_checks()

        desc = meta.get('description') if isinstance(meta.get('description'), str) else ''
        rep.check(140 <= len(desc) <= 160, '설명 길이', f'{len(desc)}자', f'{len(desc)}자 (140~160자)')
        same = [s for s, m in self.others.items() if desc and m.get('description') == desc]
        rep.check(not same, '설명 중복', '다른 글과 같은 설명 없음', '다른 글과 설명이 같음', same)

        rep.check(self.category in CATEGORIES, 'category', self.category,
                  f'{self.category or "없음"} (ai-tools·software·news 중 하나)')
        created = str(meta.get('createdAt') or '')
        if not ISO_UTC.match(created):
            rep.fail('createdAt', f'{created or "없음"} (YYYY-MM-DDTHH:MM:SSZ, 커밋 시점 UTC 시각)')
        else:
            ahead = to_utc(created) - dt.datetime.now(dt.timezone.utc)
            rep.check(ahead <= dt.timedelta(minutes=30), 'createdAt', created,
                      f'{created}: 지금보다 {ahead.total_seconds() / 3600:.1f}시간 뒤 (date -u 확인)', level='WARN')
        updated = meta.get('updatedAt')
        if updated not in (None, []):
            updated = str(updated)
            if not DATE_OR_ISO.match(updated):
                rep.fail('updatedAt', f'{updated} (YYYY-MM-DDTHH:MM:SSZ, 발행일과 다른 날이면 날짜만도 됨)')
            else:
                rep.check(not ISO_UTC.match(created) or to_utc(updated) >= to_utc(created), 'updatedAt',
                          f'{updated} ≥ createdAt', f'{updated} < createdAt {created} (빌드 실패, 같은 날이면 시각까지)')

        tags = meta.get('tags') if isinstance(meta.get('tags'), list) else []
        tags = [str(t) for t in tags]
        rep.check(3 <= len(tags) <= 6, '태그 수', f'{len(tags)}개', f'{len(tags)}개 (3~6개)')
        self.tag_checks(tags)

        if 'thumbnail' in meta:
            msg = 'thumbnail 있음 (대표 이미지가 썸네일·OG가 되도록 비움)'
            if self.args.allow_thumbnail:
                rep.warn('thumbnail', msg + ' — --allow-thumbnail: 생성 실패 임시 처리, log.md 다음 할 일에 기록')
            else:
                rep.fail('thumbnail', msg + ' (생성 실패 임시 처리면 --allow-thumbnail)')
        else:
            rep.ok('thumbnail', '없음')
        rep.check(meta.get('draft') is not True, 'draft', '초안 표시 없음', 'draft: true (빌드에서 빠짐)')
        self.slug_checks()

    def title_checks(self) -> None:
        rep = self.rep
        title = self.meta.get('title') if isinstance(self.meta.get('title'), str) else ''
        n = len(title)
        if not title:
            rep.fail('제목', '없음')
            return
        kind = '피드형' if self.feed else '검색형'
        limit = 75 if self.feed else 60
        if n > limit:
            rep.fail('제목 길이', f'{n}자 > {kind} 최대 {limit}자')
        elif self.feed or 40 <= n <= 55:
            rep.ok('제목 길이', f'{n}자 ({kind}, 최대 {limit}자)')
        else:
            rep.warn('제목 길이', f'{n}자 ({kind} 권장 40~55자, 최대 60자)')
        brackets = sorted(set(re.findall(r'[()\[\]]', title)))
        rep.check(not brackets, '제목 괄호', '괄호·대괄호 없음', f'{" ".join(brackets)} 사용 (괄호 꼬리표 금지)')
        subtitle = [p for p in (': ', ' — ', ' – ', ' - ') if p in title]
        rep.check(not subtitle, '제목 부제', '콜론·대시 부제 없음',
                  f'{", ".join(repr(p) for p in subtitle)} — 부제·꼬리표인지 확인', level='WARN')
        if YEAR_RE.search(title):
            rep.warn('제목 연도', '연도 포함 — 해마다 바뀌는 목록·가격 글만, 매년 재검증·updatedAt 갱신')
        if re.search(r"\bhere['’]?s (?:what|why|how)\b", title, re.I):
            rep.warn('제목 답 숨김', '"Here\'s what…" 형식 — 답을 숨기는 제목 금지')
        emoji = EMOJI.findall(title)
        if emoji:
            rep.fail('제목 이모지', ' '.join(emoji))

        same = [s for s, m in self.others.items() if str(m.get('title', '')).strip().lower() == title.strip().lower()]
        rep.check(not same, '제목 중복', '같은 제목 없음', '다른 글과 제목이 같음', same)
        mine = title_words(title)
        start = lambda ws: tuple(ws[2:5] if ws[:2] == ['how', 'to'] else ws[:3])  # noqa: E731
        similar = []
        end2 = []
        for slug, meta in self.others.items():
            other = title_words(str(meta.get('title', '')))
            if len(other) < 3 or len(mine) < 3:
                continue
            reasons = []
            if len(start(mine)) == 3 and start(mine) == start(other):
                reasons.append('시작 "' + ' '.join(start(mine)) + '"')
            if mine[-3:] == other[-3:]:
                reasons.append('끝 "' + ' '.join(mine[-3:]) + '"')
            if reasons:
                similar.append(f'{meta.get("title")} ({", ".join(reasons)})')
            elif mine[-2:] == other[-2:]:
                end2.append(str(meta.get('title')))
        if len(end2) >= 2:
            similar += [f'{t} (끝 "{" ".join(mine[-2:])}")' for t in end2]
        rep.check(not similar, '제목 틀 반복', '다른 글과 같은 시작·끝 문구 없음',
                  f'비슷한 제목 {len(similar)}편 — 같은 틀 반복인지 비교', similar, level='WARN')

        keyword = self.fact['h6']
        if keyword:
            head = set(key_words(title[:60] if self.feed else title))
            missing = [w for w in dict.fromkeys(key_words(keyword)) if w not in head]
            rep.check(not missing, '제목 주 검색어', f'주 검색어 단어가 모두 제목{" 앞 60자" if self.feed else ""}에 있음',
                      f'주 검색어 `{keyword}`에서 빠진 단어: {", ".join(missing)} (동의어로 바꾸지 않음)', level='WARN')

    def tag_checks(self, tags: list[str]) -> None:
        rep = self.rep
        dup = [t for t, c in Counter(t.lower() for t in tags).items() if c > 1]
        if dup:
            rep.warn('태그 중복', ', '.join(dup))
        existing = Counter(str(t) for m in self.others.values() if isinstance(m.get('tags'), list) for t in m['tags'])

        def norm(tag: str) -> str:
            return re.sub(r's$', '', re.sub(r'[\s-]', '', tag.lower()))

        def similar(a: str, b: str) -> bool:  # link_audit 비슷한 태그와 같은 기준
            short, long = sorted((a.lower().split(), b.lower().split()), key=len)
            brand_prefix = len(long) == len(short) + 1 and long[0] in BRANDS and long[1:] == short
            return norm(a) == norm(b) or brand_prefix

        near = []
        new = []
        for tag in tags:
            if tag in existing:
                continue
            hits = [f'{o} ({existing[o]})' for o in existing if similar(tag, o)]
            if hits:
                near.append(f'{tag} → 기존 표기 {", ".join(hits)}')
            else:
                new.append(tag)
        note = f' · 새 태그 {len(new)}개: {", ".join(new)}' if new else ''
        rep.check(not near, '태그 표기', f'기존 표기와 어긋나는 태그 없음{note}',
                  '기존 글과 표기가 다른 비슷한 태그 (같은 대상이면 기존 표기로)', near, level='WARN')

    def slug_checks(self) -> None:
        rep, slug = self.rep, self.slug
        parts = slug.split('-')
        rep.check(bool(SLUG_RE.match(slug)), 'slug 형식', '소문자·숫자·하이픈', '영문 소문자·숫자·하이픈만')
        rep.check(3 <= len(parts) <= 6, 'slug 단어 수', f'{len(parts)}개', f'{len(parts)}개 (3~6개)')
        years = [p for p in parts if re.fullmatch(r'(19|20)\d{2}', p)]
        rep.check(not years, 'slug 연도', '연도 없음', f'연도 {", ".join(years)} (URL을 바꾸지 않도록 넣지 않음)')
        if self.fact['h6']:
            kw = set(key_words(self.fact['h6']))
            extra = [p for p in parts if key_words(p)[0] not in kw]
            rep.check(not extra, 'slug 주 검색어', '모든 단어가 주 검색어 단어',
                      f'주 검색어에 없는 단어: {", ".join(extra)}', level='WARN')

    # --- 본문 ---
    def body_checks(self) -> None:
        rep = self.rep
        rep.section('본문')
        fences = [f'{n}행' for n, line in self.numbered() if re.match(r'^\s*(```|~~~)', line)]
        ticks = [f'{n}행: {line.strip()[:100]}' for n, line in self.numbered() if '`' in line and not re.match(r'^\s*(```|~~~)', line)]
        tags = [f'{n}행: {line.strip()[:100]}' for n, line in self.numbered() if re.search(r'<(pre|code)\b', line, re.I)]
        found = ([f'코드 블록 {len(fences)}곳 ({", ".join(fences[:5])})'] if fences else []) + \
                [f'인라인 코드 {t}' for t in ticks] + [f'<pre>/<code> {t}' for t in tags]
        rep.check(not found, '코드 표시', '코드 블록·인라인 코드·<pre> 없음', '비개발자 글에 코드 표시 금지', found)

        h1 = [f'{n}행: {line.strip()[:80]}' for n, line in self.numbered() if re.match(r'^#\s', line)]
        rep.check(not h1, '본문 H1', '없음 (제목이 H1)', '본문 `#` 제목 금지 (`##`부터)', h1)
        h2 = [line[3:].strip() for line in self.lines if re.match(r'^##\s', line)]
        rep.check(len(h2) >= 3, '## 소제목', f'{len(h2)}개', f'{len(h2)}개 (3개 이상)')
        self.faq_check(h2)
        if self.news:
            missing = [s for s in NEWS_SECTIONS if not any(h.lower().startswith(s.lower()) for h in h2)]
            rep.check(not missing, '뉴스 칼럼 구성', '필수 소제목 모두 있음',
                      f'빠진 소제목: {", ".join(missing)}', level='WARN')

        intro = self.intro_words()
        rep.check(100 <= intro <= 250, '도입 분량', f'첫 소제목 전 {intro}단어',
                  f'첫 소제목 전 {intro}단어 (100~250단어, 표·이미지 제외)', level='WARN')
        total = sum(len(words(prose(line))) for line in self.lines if not line.lstrip().startswith('|'))
        if self.news:
            rep.check(800 <= total <= 1500, '본문 분량', f'{total}단어 (뉴스 칼럼 800~1,500)',
                      f'{total}단어 (뉴스 칼럼 800~1,500단어)', level='WARN')
        else:
            rep.ok('본문 분량', f'{total}단어 (표 제외, 참고값)')

        self.scan('금지 표현', FORBIDDEN, 'FAIL', '가이드 금지 표현')
        emoji = [f'{n}행: {line.strip()[:100]}' for n, line in self.numbered() if EMOJI.search(line)]
        rep.check(not emoji, '이모지', '없음', '이모지 금지', emoji)
        dashes = [f'{n}행: {line.strip()[:100]}' for n, line in self.numbered() if '—' in line]
        rep.check(not dashes, 'em dash', '없음', f'{sum(line.count("—") for line in self.lines)}개 — 쉼표·마침표로 바꿀지 확인',
                  dashes, level='WARN')
        self.scan('명령줄 단어', [(CLI_HINTS, None)], 'WARN',
                  '비개발자 방법만 — 독자에게 명령·코드·패키지 관리자를 권하는 줄인지 확인')
        # FAQ 소제목은 검색 질문 그대로("How do I …")라 뺌
        self.scan('1인칭 I', [(FIRST_PERSON, None)], 'WARN', '브랜드 1인칭은 we — 인용문인지 확인', skip_headings=True)
        self.scan('상대 시점', [(RELATIVE, None)], 'WARN', '쓴 날에 기대는 표현 → 날짜·월로 (stale_check 기준)')
        self.duplicate_sentences()

    def faq_check(self, h2: list[str]) -> None:
        start = next((i for i, line in enumerate(self.lines) if re.match(r'^##\s+FAQ\b', line, re.I)), None)
        if start is None:
            self.rep.ok('FAQ', '없음 (실제 하위 검색어가 있을 때만)')
            return
        count = 0
        for line in self.lines[start + 1:]:
            if re.match(r'^##\s', line):
                break
            count += bool(re.match(r'^###\s', line))
        self.rep.check(2 <= count <= 5, 'FAQ', f'### 질문 {count}개', f'### 질문 {count}개 (2~5개)', level='WARN')

    def intro_words(self) -> int:
        total = 0
        for line in self.lines:
            if re.match(r'^##\s', line):
                break
            s = line.strip()
            if not s or s.startswith('|') or IMG_RE.fullmatch(s):
                continue
            total += len(words(prose(s)))
        return total

    def scan(self, name: str, patterns, level: str, hint: str, skip_headings: bool = False) -> None:
        hits = []
        for n, line in self.numbered():
            if skip_headings and re.match(r'^#{2,6}\s', line):
                continue
            text = URL_PART_RE.sub(']', line)
            found = []
            for pattern, label in patterns:
                found += [label or m.group(0) for m in pattern.finditer(text)]
            if found:
                hits.append(f'{n}행 [{", ".join(dict.fromkeys(found))}]: {line.strip()[:120]}')
        self.rep.check(not hits, name, '없음', f'{len(hits)}줄 — {hint}', hits, level=level)

    def duplicate_sentences(self) -> None:
        """8단어 이상 문장이 다른 글에 그대로 있는지 (dup_check.py와 같은 목적, 대량 생산처럼 보이는 반복 문구)"""
        def sentences(text: str) -> set[str]:
            out = set()
            for line in text.splitlines():
                if line.lstrip().startswith('|'):
                    continue
                for s in re.split(r'(?<=[.!?])\s+', prose(line).strip()):
                    s = re.sub(r'\s+', ' ', s).strip().lower()
                    if len(words(s)) >= 8:
                        out.add(s)
            return out

        mine = sentences(self.body)
        hits = []
        for path in sorted(POSTS.glob('*.mdx')):
            if path.stem == self.slug:
                continue
            for s in sorted(mine & sentences(parse_mdx(path)['body'])):
                hits.append(f'{path.stem}: {s[:110]}')
        self.rep.check(not hits, '다른 글과 같은 문장', '8단어 이상 같은 문장 없음',
                       f'{len(hits)}문장 — 글마다 다르게 (대량 생산처럼 보이지 않게)', hits, level='WARN')

    # --- 이미지 ---
    def image_checks(self) -> None:
        rep, slug = self.rep, self.slug
        rep.section('이미지')
        hero = self.hero
        rep.check(hero is not None, '대표 이미지 위치', '본문 첫 줄이 이미지',
                  f'본문 첫 줄이 이미지가 아님: {self.first_line[:80]}')
        hero_name = None
        if hero:
            m = re.fullmatch(rf'\./images/{re.escape(slug)}/([\w.-]+\.webp)', hero['src'])
            line_ok = IMG_RE.fullmatch(self.first_line) is not None
            rep.check(bool(m) and line_ok, '대표 이미지 경로', hero['src'],
                      f'{hero["src"]} (첫 줄 전체가 `![alt](./images/{slug}/파일.webp)` 이어야 함)')
            hero_name = Path(hero['src']).name
            path = self.media_path(hero['src'])
            if not path.exists():
                rep.fail('대표 이미지 파일', f'{rel(path)} 없음')
            elif HAVE_IMAGING:
                size = image_size(path)
                if size == (1280, 720):
                    rep.ok('대표 이미지 크기', '1280×720')
                elif size and size[0] >= 1200 and abs(size[0] / size[1] - 16 / 9) < 0.01:
                    rep.warn('대표 이미지 크기', f'{size[0]}×{size[1]} (hero_image.py 규격 1280×720)')
                else:
                    rep.fail('대표 이미지 크기', f'{size} (16:9, 가로 1200px 이상 · 규격 1280×720)')
            else:
                rep.warn('대표 이미지 크기', 'Pillow 없음 — 확인 못 함')
            rep.check(hero['alt'].lower().startswith('illustration of'), '대표 이미지 alt', '"Illustration of …"',
                      f'"{hero["alt"][:60]}…" (그림 장면을 `Illustration of …`로)', level='WARN')
        log = TESTS / slug / 'hero-image.md'
        if not log.exists():
            rep.fail('hero-image.md', f'{rel(log)} 없음 (hero_image.py 생성 기록)')
        else:
            text = log.read_text(encoding='utf-8')
            if hero_name and hero_name not in text:
                rep.fail('hero-image.md', f'{hero_name} 기록 없음')
            else:
                rep.ok('hero-image.md', f'{hero_name or "기록"} 있음')
                part = text.split(f'## {hero_name}', 1)[-1].split('\n## ', 1)[0] if hero_name else text
                rep.check('확인' in part, '대표 이미지 확인 기록', '직접 열어 본 확인 줄 있음',
                          '확인 줄 없음 (그림을 직접 열어 금지 사항·화풍 판단 후 기록)', level='WARN')

        imgs = self.body_images
        target = '' if self.fact['h3'] != '검증형' else ' · 검증형 목표 5장'
        if len(imgs) < 3:
            rep.fail('본문 이미지 수', f'대표 이미지 제외 {len(imgs)}장 (3장 이상)')
        elif self.fact['h3'] == '검증형' and len(imgs) < 5:
            rep.warn('본문 이미지 수', f'대표 이미지 제외 {len(imgs)}장 (측정·비교 글은 5장 목표)')
        else:
            rep.ok('본문 이미지 수', f'대표 이미지 제외 {len(imgs)}장{target}')
        missing = [f'{i["line"]}행 {i["src"]}' for i in self.images if not self.media_path(i['src']).exists()]
        rep.check(not missing, '이미지 파일', f'{len(self.images)}개 모두 있음', '참조한 파일 없음', missing)
        not_webp = [f'{i["line"]}행 {i["src"]}' for i in self.images if not i['src'].lower().endswith('.webp')]
        rep.check(not not_webp, '이미지 형식', '모두 .webp', '.webp가 아닌 이미지', not_webp)
        outside = [f'{i["line"]}행 {i["src"]}' for i in self.images if not i['src'].startswith(f'./images/{slug}/')]
        rep.check(not outside, '이미지 폴더', f'모두 images/{slug}/', f'images/{slug}/ 밖 이미지', outside, level='WARN')
        short = [f'{i["line"]}행 ({len(words(i["alt"]))}단어) {i["src"]}' for i in self.images if len(words(i['alt'])) < 5]
        rep.check(not short, '이미지 alt', '모두 5단어 이상', '비었거나 짧은 alt (보여 주는 내용을 구체적으로)', short, level='WARN')
        vague = [i['src'] for i in self.images if MEANINGLESS_NAME.match(Path(i['src']).stem)]
        rep.check(not vague, '이미지 파일 이름', '내용이 드러나는 이름', '의미 없는 이름 (image1·screenshot 금지)', vague, level='WARN')
        if re.search(r'<img\b', self.body, re.I):
            rep.warn('JSX <img>', '본문에 <img> 태그 — 이 점검은 Markdown 이미지만 셈')

    # --- 링크 ---
    def link_checks(self) -> None:
        rep, slug = self.rep, self.slug
        rep.section('링크')
        targets = [t for t in LINK_RE.findall(self.body) if t != slug]
        unique = list(dict.fromkeys(targets))
        broken = [t for t in unique if not (POSTS / f'{t}.mdx').exists()]
        rep.check(not broken, '내부 링크 대상', f'{len(unique)}개 모두 글 있음', '글 파일이 없는 링크', broken)
        n = len(unique)
        need = '2개 이상 (뉴스 칼럼)' if self.news else '4개 이상 (How-to·측정 글)'
        if n < 2:
            rep.fail('내부 링크 수', f'서로 다른 글 {n}개 ({need})')
        elif n < 4 and not self.news:
            rep.warn('내부 링크 수', f'서로 다른 글 {n}개 ({need}, 관련 글이 없을 때만 예외)')
        else:
            rep.ok('내부 링크 수', f'서로 다른 글 {n}개')
        crowded = []
        for block in self.blocks():
            count = len(LINK_RE.findall(block))
            if count > 4:
                crowded.append(f'{count}개: {prose(block).strip()[:90]}…')
        rep.check(not crowded, '문단당 내부 링크', '모두 4개 이하', '4개 초과 문단 (나눠서 다른 절에)', crowded, level='WARN')
        bad = [f'{self.lineno(m.start())}행 "{m.group(1)}"' for m in MD_LINK_RE.finditer(self.body)
               if m.group(1).strip().strip('*').lower() in BAD_ANCHORS]
        rep.check(not bad, '앵커 텍스트', '"click here"류 없음', '링크 대상이 드러나게 (click here·read more·this article 금지)', bad)
        ext = {a or b for a, b in EXT_URL_RE.findall(self.body)}
        ext = {u for u in ext if not re.match(r'https?://(?:' + '|'.join(map(re.escape, OWN_HOSTS)) + r')(?:/|$)', u)}
        rep.check(bool(ext), '외부 출처 링크', f'고유 URL {len(ext)}개', '없음 (확인한 1차 출처를 본문에 링크)')
        if self.args.extlinks:
            self.extlink_check()

    def blocks(self):
        """문단 단위 (목록 항목·표 행은 한 줄씩)"""
        buf: list[str] = []
        for line in self.lines + ['']:
            s = line.strip()
            if not s or re.match(r'^(#{1,6}\s|[-*+]\s|\d+\.\s|\|)', s):
                if buf:
                    yield ' '.join(buf)
                buf = []
                if s and not s.startswith('#'):
                    yield s
            else:
                buf.append(s)

    def extlink_check(self) -> None:
        out = Path(tempfile.gettempdir()) / f'prepublish-{self.slug}-extlinks.json'
        res = subprocess.run([sys.executable, '-I', str(TOOLS / 'extlink_check.py'), '--slug', self.slug, '--json', str(out)],
                             capture_output=True, text=True, cwd=ROOT)
        if res.returncode != 0 or not out.exists():
            self.rep.fail('외부 링크 점검', f'extlink_check.py 실패 (exit {res.returncode})', res.stderr.strip().splitlines()[-5:])
            return
        results = json.loads(out.read_text(encoding='utf-8'))
        kinds: dict[str, list[str]] = {}
        for url, r in results.items():
            kinds.setdefault(r['kind'], []).append(f'[{r.get("status")}] {url}' + (f' → {r["final"]}' if r.get('final') and r['final'] != url else ''))
        bad = kinds.get('broken', []) + kinds.get('soft404', [])
        unsure = kinds.get('moved', []) + kinds.get('error', [])
        blocked = len(kinds.get('blocked', []))
        note = f' · 확인 불가 {blocked}개 (README 인프라 상태)' if blocked else ''
        if bad:
            self.rep.fail('외부 링크 점검', f'깨짐·찾을 수 없음 {len(bad)}개{note}', bad + unsure)
        elif unsure:
            self.rep.warn('외부 링크 점검', f'이동·연결 실패 {len(unsure)}개 — 최종 주소로 바꿀지 확인{note}', unsure)
        else:
            self.rep.ok('외부 링크 점검', f'고유 URL {len(results)}개 문제 없음{note}')

    # --- 실험 기록 ---
    def experiment_checks(self) -> None:
        rep, fact = self.rep, self.fact
        rep.section('사실 확인표·출처·클러스터')
        if not fact['exists']:
            rep.fail('factcheck.md', f'{rel(fact["path"])} 없음')
        else:
            rep.check(bool(fact['h3']), '검증 유형 줄', f'**{fact["h3"]}**',
                      '첫 5줄에 `- 검증 유형 (가설 H3): **검증형|일부|조사형** — 근거` 없음')
            rep.check(bool(fact['h6']), '주 검색어 줄', f'`{fact["h6"]}`',
                      '첫 5줄에 ``- 주 검색어 (가설 H6): `검색어` — 브리프 주 검색어`` 없음')
            rep.check(fact['brief'], '작성 전 브리프', '제목 있음', '`작성 전 브리프` 제목 없음 (factcheck.md 맨 위)')
            if fact['brief']:
                missing = [item for item in BRIEF_ITEMS if brief_row(fact, item) is None]
                rep.check(not missing, '브리프 항목', f'{len(BRIEF_ITEMS)}개 모두 있음', f'빠진 항목: {", ".join(missing)}', level='WARN')
                row = brief_row(fact, '주 검색어')
                if fact['h6'] and row is not None:
                    rep.check(fact['h6'].lower() in row.lower(), '브리프 주 검색어', 'H6 줄과 같음',
                              f'브리프 주 검색어 칸에 `{fact["h6"]}`가 없음 (같은 문자열이어야 함)', level='WARN')
            if self.news:
                rep.check(bool(fact['news_type']), '뉴스 유형 줄', f'**{fact["news_type"]}**',
                          '`뉴스 유형: **화제|영향**` 줄 없음 (대시보드 newsType)')
        if fact['h6']:
            try:
                keywords = json.loads(TRENDS.read_text(encoding='utf-8')).get('keywords', {})
            except (OSError, ValueError) as error:
                keywords = None
                rep.fail('Trends 값', f'{rel(TRENDS)} 읽기 실패: {error}')
            if keywords is not None:
                entry = keywords.get(fact['h6'].lower())
                if entry is None:
                    rep.fail('Trends 값', f'`{fact["h6"]}`가 keyword-trends.json에 없음 → keyword_trends.py 실행 필요')
                else:
                    rep.ok('Trends 값', f'avg {entry.get("avg")} ({entry.get("measuredAt")})')
        self.source_checks()
        self.cluster_checks()

    def source_checks(self) -> None:
        rep = self.rep
        files = sorted((TESTS / self.slug).glob('source-*.txt'))
        if not files:
            rep.fail('출처 사본', f'tests/{self.slug}/source-*.txt 없음 (연 1차 출처 원문 저장)')
            return
        good = 0
        for path in files:
            lines = path.read_text(encoding='utf-8', errors='replace').splitlines()
            header = len(lines) >= 2 and lines[0].startswith('# 가져온 시각:') and lines[1].startswith('# 원본:')
            size = len('\n'.join(lines[2:]).strip())
            if not header:
                rep.warn('출처 머리말', f'{path.name}: 첫 두 줄이 `# 가져온 시각:`·`# 원본:`이 아님 (source_diff.cjs 재비교 안 됨)')
            elif size < 300:
                rep.warn('출처 본문', f'{path.name}: 본문 {size}자 — 짧음, 저장 실패(404·배너만)인지 확인',
                         [lines[2][:100]] if len(lines) > 2 else [])
            else:
                good += 1
        if good:
            rep.ok('출처 사본', f'{good}/{len(files)}개 머리말·본문 정상')

    def cluster_checks(self) -> None:
        rep, slug = self.rep, self.slug
        clusters, error = parse_clusters(CLUSTERS)
        if error:
            rep.fail('clusters.md', error)
        else:
            places = [(c['id'], role) for c in clusters for role in ('허브', '상시 글', '뉴스 칼럼') if slug in c[role]]
            rep.check(bool(places), 'clusters.md', ', '.join(f'{cid} {role}' for cid, role in places),
                      '클러스터 맵 표에 없음 (같은 PR에서 추가)')
            row = brief_row(self.fact, '클러스터')
            if places and row is not None:
                rep.check(any(cid in row for cid, _ in places), '브리프 클러스터', '클러스터 맵과 같음',
                          f'브리프 클러스터 칸에 {places[0][0]} 없음', level='WARN')
        res = subprocess.run([sys.executable, '-I', str(TOOLS / 'link_audit.py'), '--only-problems'],
                             capture_output=True, text=True, cwd=ROOT)
        if res.returncode != 0:
            rep.fail('link_audit', f'실행 실패 (exit {res.returncode})', res.stderr.strip().splitlines()[-5:])
            return
        section = ''
        hits = []
        total = 0
        for line in res.stdout.splitlines():
            if line.startswith('### '):
                section = re.sub(r'\s*\(\d+건\)$', '', line[4:])
            elif line.startswith('- '):
                total += 1
                if f'`{slug}`' in line.split(' (←')[0]:  # 다른 글의 받는 링크 부족에 출처로만 나온 경우는 제외
                    hits.append(f'{section}: {line[2:]}')
        rep.check(not hits, 'link_audit', f'이 글 문제 없음 (전체 문제 {total}건)', '이 글 문제 (발행 전에 고침)', hits)

    # --- 빌드 결과 ---
    def build_output_checks(self, built_now: bool) -> None:
        rep, slug = self.rep, self.slug
        rep.section('빌드 HTML·OG 이미지')
        page_path = BUILT / f'{slug}.html'
        og_path = OG_DIR / f'{slug}.jpg'
        thumb = self.meta.get('thumbnail') if isinstance(self.meta.get('thumbnail'), str) else None
        source = self.media_path(thumb) if thumb and thumb.startswith('./') else (self.media_path(self.hero['src']) if self.hero else None)
        if not page_path.exists():
            rep.warn('빌드 HTML', f'{rel(page_path)} 없음 — --build로 확인')
        else:
            if not built_now and page_path.stat().st_mtime < self.path.stat().st_mtime:
                rep.warn('빌드 HTML', 'MDX가 빌드 뒤에 바뀜 — 오래된 HTML (--build로 다시)')
            self.html_checks(page_path)
        if og_path.exists():
            if not HAVE_IMAGING:
                rep.warn('OG 이미지', 'Pillow·numpy 없음 — 크기·대표 이미지 비교 못 함')
                return
            size = image_size(og_path)
            rep.check(size == OG_SIZE, 'OG 이미지 크기', '1200×630', f'{size} (1200×630)')
            if source and source.exists():
                mad, corr = og_similarity(source, og_path)
                verdict = og_verdict(mad, corr)
                what = '대표 이미지' if not thumb else 'thumbnail'
                msg = f'MAD {mad:.2f} · 상관 {corr:.4f} (PASS 기준 MAD ≤ {OG_PASS[0]:g}·상관 ≥ {OG_PASS[1]:g})'
                if verdict == 'PASS':
                    rep.ok('OG 이미지 출처', f'{what}에서 만들어짐 — {msg}')
                elif verdict == 'WARN':
                    rep.warn('OG 이미지 출처', f'{what}와 비슷하지만 차이 있음 — {msg} (오래된 og? --build로 다시)')
                else:
                    rep.fail('OG 이미지 출처', f'{what}에서 만들어지지 않음 — {msg}')
        elif page_path.exists():
            rep.fail('OG 이미지', f'{rel(og_path)} 없음 (registry가 첫 이미지로 만듦)')

    def html_checks(self, page_path: Path) -> None:
        rep, slug = self.rep, self.slug
        page = PageParser()
        page.feed(page_path.read_text(encoding='utf-8'))
        title = self.meta.get('title') if isinstance(self.meta.get('title'), str) else ''
        desc = self.meta.get('description') if isinstance(self.meta.get('description'), str) else ''
        rep.check(bool(title) and title in (page.title or ''), '<title>', f'"{page.title}"', f'"{page.title}"에 frontmatter 제목 없음')
        meta = {(m.get('name') or m.get('property') or ''): m.get('content') or '' for m in page.metas}
        rep.check(meta.get('description') == desc, 'meta description', 'frontmatter 설명과 같음',
                  f'다름: "{(meta.get("description") or "없음")[:80]}"')
        rep.check(page.h1 == 1, '<h1>', '1개', f'{page.h1}개 (1개)')
        items = []
        for raw in page.ld:
            try:
                data = json.loads(raw)
            except ValueError:
                continue
            for node in data if isinstance(data, list) else data.get('@graph', [data]):
                if isinstance(node, dict):
                    items.append(node)
        posting = next((n for n in items if n.get('@type') == 'BlogPosting'), None)
        authors = posting.get('author') if posting else None
        authors = authors if isinstance(authors, list) else [authors] if authors else []
        author_ok = any(isinstance(a, dict) and a.get('name') == 'ToolProof' for a in authors)
        rep.check(bool(posting) and author_ok and posting.get('headline') == title, 'JSON-LD BlogPosting',
                  'author ToolProof · headline = 제목',
                  'BlogPosting 없음' if not posting else f'author {[a.get("name") for a in authors if isinstance(a, dict)]} · headline "{posting.get("headline")}"')
        rep.check(any(n.get('@type') == 'BreadcrumbList' for n in items), 'JSON-LD BreadcrumbList', '있음', '없음')
        rep.check(page.pre == 0 and page.code == 0, '<pre>·<code>', '0개', f'<pre> {page.pre}개 · <code> {page.code}개')
        if self.hero:
            expected = f'{MEDIA_URL}/{self.hero["src"][2:]}' if self.hero['src'].startswith('./') else self.hero['src']
            first = page.imgs[0] if page.imgs else None
            rep.check(first == expected, '첫 <img>', '대표 이미지', f'{first or "없음"} (기대 {expected})')
        og = meta.get('og:image', '')
        rep.check(og.endswith(f'/og/{slug}.jpg'), 'og:image', og, f'{og or "없음"} (/og/{slug}.jpg로 끝나야 함)')

    # --- 실행 ---
    def run(self, built_now: bool) -> None:
        self.frontmatter()
        self.body_checks()
        self.image_checks()
        self.link_checks()
        self.experiment_checks()
        self.build_output_checks(built_now)


class PageParser(HTMLParser):
    """빌드 HTML에서 <title>·<meta>·<h1>·<pre>·<code>·<img src>·JSON-LD만 모음"""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.title: str | None = None
        self.metas: list[dict] = []
        self.imgs: list[str] = []
        self.ld: list[str] = []
        self.h1 = self.pre = self.code = 0
        self._svg = 0
        self._capture: str | None = None
        self._buf: list[str] = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'svg':
            self._svg += 1
        elif tag == 'title' and self.title is None and not self._svg:
            self._capture, self._buf = 'title', []
        elif tag == 'script' and (a.get('type') or '') == 'application/ld+json':
            self._capture, self._buf = 'ld', []
        elif tag == 'meta':
            self.metas.append(a)
        elif tag == 'img':
            self.imgs.append(a.get('src') or '')
        elif tag == 'h1':
            self.h1 += 1
        elif tag == 'pre':
            self.pre += 1
        elif tag == 'code':
            self.code += 1

    def handle_endtag(self, tag):
        if tag == 'svg' and self._svg:
            self._svg -= 1
        elif tag == 'title' and self._capture == 'title':
            self.title, self._capture = ''.join(self._buf).strip(), None
        elif tag == 'script' and self._capture == 'ld':
            self.ld.append(''.join(self._buf))
            self._capture = None

    def handle_data(self, data):
        if self._capture:
            self._buf.append(data)


# ---------- --build ----------

def git_status() -> set[str]:
    return set(git('status', '--porcelain').stdout.splitlines())


def run_step(step: str, slug: str, label: str | None = None) -> tuple[int, str, float]:
    cmd = ['pnpm', '--filter', PACKAGE, step]
    print(f'$ {" ".join(cmd)}', flush=True)
    start = time.monotonic()
    # stdin을 닫아야 vitest가 watch 모드로 멈추지 않음
    res = subprocess.run(cmd, cwd=ROOT, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, stdin=subprocess.DEVNULL, text=True)
    seconds = time.monotonic() - start
    out = re.sub(r'\x1b\[[0-9;]*m', '', res.stdout)  # 색 코드 제거
    log = Path(tempfile.gettempdir()) / f'prepublish-{slug}-{label or step}.log'
    log.write_text(out, encoding='utf-8')
    print(f'  → exit {res.returncode}, {seconds:.0f}초, 로그 {log}', flush=True)
    return res.returncode, out, seconds


def tail(output: str, n: int = 12) -> list[str]:
    return [line[:160] for line in output.strip().splitlines()[-n:]]


def run_build(rep: Report, slug: str) -> bool:
    """lint → test → build. 빌드가 성공했는지 반환 (실패해도 세 단계는 모두 실행)"""
    rep.section('lint·test·build (--build)')
    if not shutil.which('pnpm'):
        rep.fail('pnpm', '명령 없음')
        return False
    before = git_status()
    cli_dirty_before = git('diff', '--quiet', '--', CLI_JS).returncode == 1
    for step in ('lint', 'test'):
        code, out, _ = run_step(step, slug)
        counts = re.search(r'Test Files\s+(.+?)\n\s*Tests\s+(.+?)\n', out) if step == 'test' else None
        note = f' (파일 {counts.group(1).strip()} · 테스트 {counts.group(2).strip()})' if counts else ''
        rep.check(code == 0, step, '통과' + note, f'exit {code}', tail(out))
    code, out, _ = run_step('build', slug)
    if SECURITY_ERROR in out:
        print(f'  {SECURITY_ERROR} → 1회 다시 빌드', flush=True)
        code, out, _ = run_step('build', slug, 'build-retry')
        if code == 0:
            rep.warn('build', f'첫 실행 {SECURITY_ERROR}(Next.js 보안 권고 검사), 다시 실행해 통과')
        else:
            rep.fail('build', f'다시 실행해도 실패 (exit {code})', tail(out))
            code = code or 1
    else:
        rep.check(code == 0, 'build', '통과', f'exit {code}', tail(out))
    if git('diff', '--quiet', '--', CLI_JS).returncode == 1:
        if cli_dirty_before:
            rep.warn('nextjs-routes cli.js', '빌드 전부터 바뀌어 있어 되돌리지 않음 (의도한 변경인지 확인)')
        else:
            git('checkout', '--', CLI_JS)
            rep.ok('nextjs-routes cli.js', '빌드가 바꾼 파일을 되돌림 (git checkout)')
    changed = sorted(line for line in git_status() - before if not line.endswith(CLI_JS))
    rep.check(not changed, '작업 트리', 'lint·build가 바꾼 파일 없음', 'lint·build 뒤 새로 바뀐 파일 (커밋할지 확인)', changed, level='WARN')
    return code == 0


# ---------- 출력 ----------

HUMAN_CHECKS = [
    '사실마다 이번 세션에 연 1차 출처가 있고, 본문이 인용한 문장이 source-*.txt 안에 있는지',
    '"we tested"는 직접 실행한 것만, 문서 기반은 "According to …" — 가상 인물·체험담 없음',
    '첫 2~3문장이 답이고, 소제목 첫 문장이 떼어 읽어도 통하는 답인지 · 측정값에 도구·버전·날짜·표본 수',
    '방법·도구가 3개 이상이면 요약 표, FAQ는 본문에 없는 실제 질문만',
    '모든 방법을 비개발자가 따라 할 수 있는지 (위 명령줄 WARN 줄의 맥락)',
    '대표 이미지 내용(2.5D 화풍, 글자·숫자·로고·실존 인물 없음), 직접 만든 그래픽은 디자인 토큰만',
    '앵커 텍스트가 링크 대상을 드러내는지, 외부 링크가 1차 출처인지, 제목 틀이 최근 글과 겹치지 않는지',
    '(뉴스 칼럼) 독창 요소 1개 이상, 견해는 Our take에만, 언론 단독 보도는 "{매체} reported"',
    '`searchfit-seo:seo-check`(없으면 seo-audit On-Page)로 새 MDX 점검',
]


def compare_images(a: str, b: str) -> int:
    if not HAVE_IMAGING:
        print('Pillow·numpy를 불러올 수 없음')
        return 1
    mad, corr = og_similarity(Path(a), Path(b))
    print(f'{og_verdict(mad, corr)}  MAD {mad:.2f} · 상관 {corr:.4f} '
          f'(PASS: MAD ≤ {OG_PASS[0]:g}·상관 ≥ {OG_PASS[1]:g} / WARN: MAD ≤ {OG_WARN[0]:g}·상관 ≥ {OG_WARN[1]:g})')
    return 0


def main() -> int:
    global HAVE_IMAGING
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--slug', help='점검할 글 (content/posts/{slug}.mdx)')
    ap.add_argument('--build', action='store_true', help='lint → test → build를 먼저 실행 (3~5분)')
    ap.add_argument('--extlinks', action='store_true', help='본문 외부 링크 점검 (extlink_check.py, 네트워크)')
    ap.add_argument('--allow-thumbnail', action='store_true', help='대표 이미지 생성 실패로 thumbnail을 임시로 쓴 경우')
    ap.add_argument('--compare-images', nargs=2, metavar=('SOURCE', 'OG'), help='두 그림의 og 판정 값만 출력')
    args = ap.parse_args()
    if not args.slug and not args.compare_images:
        ap.error('--slug가 필요함')
    HAVE_IMAGING = ensure_imaging()
    if args.compare_images:
        return compare_images(*args.compare_images)

    slug = args.slug
    rep = Report()
    now = dt.datetime.now(dt.timezone.utc).strftime('%Y-%m-%d %H:%M UTC')
    print(f'## 발행 전 점검: {slug} ({now})')
    if not (POSTS / f'{slug}.mdx').exists():
        rep.fail('MDX', f'{rel(POSTS / f"{slug}.mdx")} 없음')
        return 1
    if not HAVE_IMAGING:
        rep.warn('Pillow·numpy', '불러올 수 없음 — 이미지 크기·OG 비교 항목은 WARN')
    built = run_build(rep, slug) if args.build else False
    Checker(slug, args, rep).run(built_now=built)

    print('\n### 사람이 볼 것 (스크립트 밖)')
    for item in HUMAN_CHECKS:
        print(f'- {item}')
    c = rep.counts
    print(f'\n### 요약\nPASS {c["PASS"]} · WARN {c["WARN"]} · FAIL {c["FAIL"]}')
    if c['FAIL']:
        print('→ FAIL을 고친 뒤 다시 실행 (종료 코드 1)')
        return 1
    print('→ FAIL 없음. WARN 줄은 읽고 판단')
    return 0


if __name__ == '__main__':
    sys.exit(main())
