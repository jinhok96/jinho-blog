"""Google 개인정보처리방침 버전별로 광고·Gmail·Photos 관련 문장을 뽑아 비교.

policies.google.com 보관본(archive)을 받아 같은 문장이 언제 바뀌었는지 표로 출력.
실행: python3 -I policy_diff.py > policy-sentences.md
"""
import html
import re
import urllib.request

VERSIONS = [
    ('April 2, 2026', 'archive/20260402'),
    ('May 26, 2026', 'archive/20260526'),
    ('October 1, 2026', 'archive/20261001'),
    ('October 16, 2026 (current)', ''),
]
PATTERNS = {
    'Gmail/Photos ads promise': r'We don’t show you personalized ads based on your content from[^.]*\.',
    'Personalized ads basis': r'Depending on your settings, we may also show you personalized ads based on[^.]*\.',
    'Cross-service access': r'You may choose to allow certain Google services[^.]*\.',
    'Search ads example': r'For example, Search may process[^.]*\.',
    'Personal Intelligence mentions': r'Personal Intelligence',
}


def text(path):
    url = f'https://policies.google.com/privacy/{path}?hl=en-US'.replace('privacy/?', 'privacy?')
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    d = urllib.request.urlopen(req, timeout=60).read().decode('utf-8')
    d = re.sub(r'<script.*?</script>|<style.*?</style>', '', d, flags=re.S)
    t = html.unescape(re.sub(r'<[^>]+>', ' ', d))
    return re.sub(r'\s+', ' ', t)


print('| Version | ' + ' | '.join(PATTERNS) + ' |')
print('| --- |' + ' --- |' * len(PATTERNS))
for label, path in VERSIONS:
    t = text(path)
    cells = []
    for key, pat in PATTERNS.items():
        found = re.findall(pat, t)
        if key == 'Personal Intelligence mentions':
            cells.append(str(len(found)))
        else:
            cells.append(found[0].strip() if found else '(none)')
    print(f'| {label} | ' + ' | '.join(c.replace('|', '/') for c in cells) + ' |')
