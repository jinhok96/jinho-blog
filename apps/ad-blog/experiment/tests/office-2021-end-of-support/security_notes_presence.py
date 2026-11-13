"""Microsoft Office 보안 릴리스 노트 사본에서 달마다 어떤 Office 판이 그 달 보안 수정 빌드 목록에 있는지 뽑음.

원본: https://learn.microsoft.com/en-us/officeupdates/microsoft365-apps-security-updates (Chromium 렌더링 사본)
실행: python3 -I security_notes_presence.py source-m365-apps-security-updates-2026-11-13.txt > security-notes-presence.md
charts.py가 parse()를 가져다 씀.
"""
import re
import sys

PRODUCTS = [
    "Office 2016 Retail",
    "Office 2019 Retail",
    "Office 2019 Volume Licensed",
    "Office 2021 Retail",
    "Office LTSC 2021 Volume Licensed",
    "Office 2024 Retail",
]
DATE = re.compile(
    r"^(January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, 20\d\d$"
)


def parse(path):
    """[{'date': 'November 10, 2026', 'builds': {제품: 빌드}}, ...] (최근 날짜가 앞)"""
    months, cur = [], None
    for line in open(path, encoding="utf-8").read().splitlines():
        s = line.strip()
        if DATE.match(s):
            cur = {"date": s, "builds": {}}
            months.append(cur)
        elif cur:
            for p in PRODUCTS:
                if s.startswith(p + ":"):
                    cur["builds"][p] = s.split(":", 1)[1].strip()
    return months


if __name__ == "__main__":
    print("| 날짜 | " + " | ".join(PRODUCTS) + " |")
    print("| --- " * (len(PRODUCTS) + 1) + "|")
    for m in parse(sys.argv[1]):
        if not m["builds"]:  # 2021-08 이전처럼 제품별 빌드 줄이 없는 달은 뺌
            continue
        print("| " + m["date"] + " | " + " | ".join(m["builds"].get(p, "-") for p in PRODUCTS) + " |")
