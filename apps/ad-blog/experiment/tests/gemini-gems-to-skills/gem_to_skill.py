"""Gem(이름·설명·지시문 + 지식 파일) → Gemini 스킬 폴더·zip 변환 및 검사.

규칙 출처 (2026-10-13 확인):
- support.google.com/gemini/answer/17094296 (Upload requirements: 지원 형식, SKILL.md 위치, 소문자-하이픈 이름, 100MB, 숨은 파일 경고)
- support.google.com/gemini/answer/17102773 (설명 1024자)
- agentskills.io/specification (name 64자, a-z0-9-, 연속·앞뒤 하이픈 금지, 폴더명 = name)

사용: python3 gem_to_skill.py gem.json knowledge_dir out_dir
"""
import json
import re
import shutil
import sys
import unicodedata
import zipfile
from pathlib import Path

SUPPORTED = {
    '.txt', '.md', '.rst', '.rtf', '.tex', '.log', '.py', '.sh', '.json', '.yaml', '.yml', '.csv',
    '.toml', '.xml', '.env', '.sql', '.html', '.css', '.svg', '.pdf', '.jpg', '.jpeg', '.png',
    '.gif', '.webp',
}
SUPPORTED_NAMES = {'Makefile', 'Dockerfile'}
BINARY_OFFICE = {'.docx', '.doc', '.xlsx', '.xls', '.pptx', '.ppt', '.odt', '.ods', '.pages', '.numbers', '.key'}
MAX_TOTAL = 100 * 1024 * 1024


def skill_name(gem_name: str) -> str:
    """Gem 이름 → 스펙 이름: 악센트 제거, 소문자, 영숫자 외는 하이픈, 연속·앞뒤 하이픈 제거, 64자."""
    s = unicodedata.normalize('NFKD', gem_name).encode('ascii', 'ignore').decode()
    s = re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')
    if len(s) > 64:
        s = s[:65].rsplit('-', 1)[0]  # 단어 중간에서 자르지 않음
    return s


def check_file(p: Path) -> str:
    if p.name.startswith('.') or p.suffix in {'.pyc'} or p.name == '__MACOSX':
        return 'remove (hidden/system file)'
    if p.suffix.lower() in BINARY_OFFICE:
        return 'convert (binary office file not supported)'
    if p.suffix.lower() in SUPPORTED or p.name in SUPPORTED_NAMES:
        return 'ok'
    return 'unknown type (check)'


def build(gem: dict, knowledge: Path, out: Path) -> dict:
    name = skill_name(gem['name'])
    folder = out / name
    if folder.exists():
        shutil.rmtree(folder)
    folder.mkdir(parents=True)
    desc = ' '.join(gem['description'].split())
    report = {'gem_name': gem['name'], 'skill_name': name, 'description_chars': len(desc), 'files': []}
    total = 0
    for f in sorted(knowledge.rglob('*')) if knowledge.exists() else []:
        if not f.is_file():
            continue
        verdict = check_file(f)
        report['files'].append({'file': f.name, 'bytes': f.stat().st_size, 'verdict': verdict})
        if verdict == 'ok':
            shutil.copy2(f, folder / f.name)
            total += f.stat().st_size
    body = gem['instructions'].strip()
    refs = [x['file'] for x in report['files'] if x['verdict'] == 'ok']
    if refs:
        body += '\n\n## Reference files\n\n' + '\n'.join(f'- `{r}`' for r in refs)
    (folder / 'SKILL.md').write_text(f'---\nname: {name}\ndescription: {json.dumps(desc)}\n---\n\n{body}\n', encoding='utf-8')
    total += (folder / 'SKILL.md').stat().st_size
    report['total_bytes'] = total
    report['under_100mb'] = total <= MAX_TOTAL
    report['description_ok'] = 0 < len(desc) <= 1024
    zpath = out / f'{name}.zip'
    with zipfile.ZipFile(zpath, 'w', zipfile.ZIP_DEFLATED) as z:
        for f in sorted(folder.iterdir()):
            z.write(f, f.name)  # SKILL.md를 zip 최상위에
    report['zip'] = zpath.name
    report['zip_root_has_skill_md'] = 'SKILL.md' in zipfile.ZipFile(zpath).namelist()
    return report


if __name__ == '__main__':
    gem = json.loads(Path(sys.argv[1]).read_text())
    print(json.dumps(build(gem, Path(sys.argv[2]), Path(sys.argv[3])), indent=2))
