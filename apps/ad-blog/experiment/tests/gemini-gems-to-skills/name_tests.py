"""Gem 이름을 그대로 스킬 이름으로 썼을 때 skills-ref 0.1.1 검사 결과와 스펙 정규식 비교."""
import json
import re
import shutil
import tempfile
from pathlib import Path

from skills_ref.validator import validate

from gem_to_skill import skill_name

SPEC = re.compile(r'^[a-z0-9]+(-[a-z0-9]+)*$')
NAMES = [
    'Weekly Newsletter Writer',
    'weekly-newsletter-writer',
    'Résumé Coach',
    'résumé-coach',
    'Q&A Prep (Sales)',
    'email--drafter',
    '-draft-helper',
    'plan-meal-from-recipe-and-build-a-grocery-list-for-the-whole-family-each-week',
]
rows = []
for n in NAMES:
    d = Path(tempfile.mkdtemp())
    folder = d / (n.replace('/', '-') or 'x')
    folder.mkdir()
    (folder / 'SKILL.md').write_text(f'---\nname: {json.dumps(n)}\ndescription: Test skill.\n---\n\nBody\n')
    errs = validate(folder)
    rows.append({'name_as_typed': n, 'skills_ref_errors': errs, 'spec_regex_ok': bool(SPEC.match(n) and len(n) <= 64), 'converted': skill_name(n)})
    shutil.rmtree(d)
print(json.dumps(rows, indent=2, ensure_ascii=False))
