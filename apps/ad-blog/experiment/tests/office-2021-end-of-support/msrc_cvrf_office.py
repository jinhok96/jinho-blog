"""MSRC 월간 보안 업데이트 CVRF(JSON)에서 Office 2021·2024·2019 제품별 취약점·수정 빌드를 뽑아 사본으로 저장.

원본: https://api.msrc.microsoft.com/cvrf/v3.0/cvrf/2026-Nov (Accept: application/json, 약 18 MB라 저장소에는 발췌만)
실행: python3 -I msrc_cvrf_office.py <cvrf.json> <가져온 시각 ISO> > source-msrc-cvrf-2026-nov-office.txt
"""
import json
import sys
from collections import defaultdict

path, fetched = sys.argv[1], sys.argv[2]
d = json.load(open(path, encoding="utf-8"))
names = {}


def walk(n):
    if isinstance(n, dict):
        if "ProductID" in n and "Value" in n and isinstance(n["ProductID"], str):
            names[n["ProductID"]] = n["Value"]
        for v in n.values():
            walk(v)
    elif isinstance(n, list):
        for v in n:
            walk(v)


walk(d["ProductTree"])
office = {k: v for k, v in names.items() if "Office" in v and any(y in v for y in ("2016", "2019", "2021", "2024"))}
per = defaultdict(lambda: {"cves": set(), "fixed": defaultdict(int)})
for vul in d["Vulnerability"]:
    aff = set()
    for st in vul.get("ProductStatuses", []):
        aff.update(st.get("ProductID", []))
    for pid in aff & office.keys():
        per[pid]["cves"].add(vul["CVE"])
        for r in vul.get("Remediations", []):
            if r.get("Type") == 2 and pid in r.get("ProductID", []):
                per[pid]["fixed"][r.get("FixedBuild") or "-"] += 1
print(f"# 가져온 시각: {fetched}")
print("# 원본: https://api.msrc.microsoft.com/cvrf/v3.0/cvrf/2026-Nov")
print(f"{d['DocumentTitle']['Value']} (InitialReleaseDate {d['DocumentTracking']['InitialReleaseDate']})")
print("Office products with 2016/2019/2021/2024 in the name found in the product tree:")
for pid, name in sorted(office.items(), key=lambda x: x[1]):
    p = per.get(pid)
    if not p:
        print(f"- {name} (ProductID {pid}): no vulnerabilities listed")
        continue
    fixed = ", ".join(f"{b} x{n}" for b, n in sorted(p["fixed"].items()))
    print(f"- {name} (ProductID {pid}): {len(p['cves'])} CVEs, vendor fix (Remediation Type 2) FixedBuild: {fixed}")
allc = set().union(*(p["cves"] for pid, p in per.items() if "2021" in office[pid]))
print(f"Unique CVEs affecting a 2021 product: {len(allc)}")
print("No product named Office 2016 or Office 2019 appears in this month's product tree.")
