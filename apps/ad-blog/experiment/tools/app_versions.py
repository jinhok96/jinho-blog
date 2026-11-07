"""글에서 직접 시험한 앱·브라우저 버전과 지금 최신 안정판을 비교한다 (반복 일정 점검).

2026-11-08 세션 89 (`seo-audit` Content Quality: Outdated content not refreshed / Accurate information).
개선 세션 6번(반복 일정)에서 새 판이 나와 다시 확인할 글을 찾는 데 씀. 브라우저는 traffic-playbook 노하우 4의 일정표로도 보지만,
PDF·사진·스캔 앱(GIMP·LibreOffice·PDFsam·Sejda·NAPS2 등)은 일정이 없어 새 판이 나와도 놓치기 쉬움.

- 글의 판: 본문의 "{앱 이름} {버전}" 표기 중 최신판 이하에서 가장 높은 버전 (브라우저는 주 버전만). 최신판보다 높은 표기는
  "Edge 158(11-19 주)" 같은 다음 판 예고라 뺌. 측정값과 섞이지 않게 앱마다 버전 모양을 정함
  (예: XnConvert는 `1.118`처럼 소수점 아래 세 자리, 그 밖의 앱은 `3.2.6`처럼 세 마디)
- 최신판: 공식 다운로드·릴리스 페이지(아래 SOURCES)에서 읽음. 확인하지 못하면 '확인 실패'로 표시
- 새 판이 있어도 바로 고치지 않음: 릴리스 노트로 글 내용(메뉴·기본값·측정 결과)과 관련 있는지 보고, 같은 시나리오로 다시
  시험할 수 있을 때 그 글을 갱신. 검증 기록(traffic-playbook V) 판정 중이거나 RSS 피드 구성을 바꾸면 안 되는 기간의 글은 그 뒤에

실행: python3 -I apps/ad-blog/experiment/tools/app_versions.py [--only-outdated] [--app 이름] [--json 저장경로]
"""
import argparse
import datetime as dt
import json
import re
import urllib.request
from pathlib import Path

POSTS = Path(__file__).resolve().parents[2] / "content" / "posts"
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"
V3 = r"(\d+\.\d+\.\d+)"


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en-US,en;q=0.9"})
    with urllib.request.urlopen(req, timeout=25) as r:
        return r.read().decode("utf-8", "replace")


def head_ok(url: str) -> bool:
    req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=25) as r:
            return r.status < 400
    except Exception:
        return False


def vkey(v: str) -> tuple:
    parts = [int(p) for p in re.findall(r"\d+", v)]
    return tuple(parts + [0] * (4 - len(parts)))


def max_version(found) -> str:
    return max(found, key=vkey)


def from_regex(url, pattern):
    def get():
        found = re.findall(pattern, fetch(url))
        if not found:
            raise ValueError("버전 글자를 찾지 못함")
        return max_version(found), url
    return get


def gimp():
    url = "https://www.gimp.org/gimp_versions.json"
    s = json.loads(fetch(url))["STABLE"][0]
    return s["version"], f"{url} ({s.get('date', '')})"


def libreoffice():
    url = "https://download.documentfoundation.org/libreoffice/stable/"
    return max_version(re.findall(r'href="(\d+\.\d+\.\d+)/"', fetch(url))), url


def flathub(app_id):
    def get():
        url = f"https://flathub.org/api/v2/appstream/{app_id}"
        rel = json.loads(fetch(url))["releases"][0]
        day = dt.datetime.fromtimestamp(int(rel.get("timestamp", 0)), dt.timezone.utc).date()
        return rel["version"], f"{url} ({day})"
    return get


def exifcleaner():
    # GitHub 목록·API는 컨테이너에서 403 → 소스 package.json 버전 + 그 태그의 Releases 파일이 있는지로 출시 확인
    url = "https://raw.githubusercontent.com/szTheory/exifcleaner/master/package.json"
    ver = json.loads(fetch(url))["version"]
    asset = f"https://github.com/szTheory/exifcleaner/releases/download/v{ver}/ExifCleaner-{ver}.AppImage"
    if not head_ok(asset):
        raise ValueError(f"package.json {ver}의 Releases 파일 없음 (아직 출시 전일 수 있음)")
    return ver, f"{url} + Releases v{ver}"


def chrome():
    url = "https://versionhistory.googleapis.com/v1/chrome/platforms/linux/channels/stable/versions"
    return json.loads(fetch(url))["versions"][0]["version"], url


def edge():
    url = "https://packages.microsoft.com/repos/edge/dists/stable/main/binary-amd64/Packages"
    text = fetch(url)
    found = re.findall(r"Package: microsoft-edge-stable\n(?:.+\n)*?Version: ([\d.]+)", text)
    return max_version(found), url


def firefox():
    url = "https://product-details.mozilla.org/1.0/firefox_versions.json"
    return json.loads(fetch(url))["LATEST_FIREFOX_VERSION"], url


def brave():
    url = "https://versions.brave.com/latest/release-linux-x64.version"
    return fetch(url).strip(), url


# (이름, 글 본문에서 버전을 찾는 정규식, 최신판 조회, 주 버전만 비교)
SOURCES = [
    ("Google Chrome", r"\bChrome (\d{3})(?:\.\d+){0,3}\b", chrome, True),
    ("Microsoft Edge", r"\bEdge (\d{3})(?:\.\d+){0,3}\b", edge, True),
    ("Firefox", r"\bFirefox (\d{3})(?:\.\d+){0,2}\b", firefox, True),
    ("Brave", r"\bBrave (1\.\d{2,3}\.\d+)\b", brave, False),
    ("GIMP", rf"\bGIMP {V3}", gimp, False),
    ("LibreOffice", rf"\bLibreOffice(?: Writer| Draw| Calc| Impress)? {V3}", libreoffice, False),
    ("PDFsam Basic", rf"\bPDFsam Basic {V3}", from_regex("https://pdfsam.org/download-pdfsam-basic/", r"pdfsam-basic-(\d+\.\d+\.\d+)"), False),
    ("Sejda PDF Desktop", rf"\bSejda (?:PDF )?Desktop {V3}", from_regex("https://www.sejda.com/desktop", r"sejda-desktop_(\d+\.\d+\.\d+)"), False),
    ("PDF Arranger", r"\bPDF Arranger (\d+\.\d+(?:\.\d+)?)\b", flathub("com.github.jeromerobert.pdfarranger"), False),
    ("XnConvert", r"\bXnConvert (1\.\d{3}(?:\.\d+)?)\b", from_regex("https://www.xnview.com/en/xnconvert/", r'"softwareVersion":\s*"(\d+\.\d+(?:\.\d+)?)"'), False),
    ("HandBrake", rf"\bHandBrake {V3}", from_regex("https://handbrake.fr/", r"Download HandBrake (\d+\.\d+\.\d+)"), False),
    ("NAPS2", rf"\bNAPS2 {V3}", from_regex("https://www.naps2.com/download", r"naps2-(\d+\.\d+\.\d+)-linux"), False),
    ("ExifCleaner", rf"\bExifCleaner {V3}", exifcleaner, False),
]


def post_versions(pattern: str) -> dict:
    """글별 본문의 버전 표기 전부 (slug → 목록)"""
    out = {}
    for f in sorted(POSTS.glob("*.mdx")):
        body = f.read_text(encoding="utf-8").split("---", 2)[2]
        body = re.sub(r"\]\([^)]*\)", "]", body)  # 링크 주소 안 숫자는 빼고 링크 글자·alt는 셈
        found = re.findall(pattern, body)
        if found:
            out[f.stem] = found
    return out


def tested_version(found: list, latest_cmp) -> tuple:
    """최신판 이하에서 가장 높은 표기와, 최신판보다 높아 뺀 표기(다음 판 예고)"""
    if not latest_cmp:
        return max_version(found), []
    upcoming = sorted({v for v in found if vkey(v) > vkey(latest_cmp)}, key=vkey)
    rest = [v for v in found if vkey(v) <= vkey(latest_cmp)]
    return (max_version(rest) if rest else max_version(found)), upcoming


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only-outdated", action="store_true", help="새 판이 나온 앱·글만")
    ap.add_argument("--app", help="이 이름이 들어간 앱만 (예: GIMP)")
    ap.add_argument("--json", help="결과를 JSON으로도 저장")
    args = ap.parse_args()

    rows = []
    for name, pattern, get_latest, major_only in SOURCES:
        if args.app and args.app.lower() not in name.lower():
            continue
        posts = post_versions(pattern)
        if not posts:
            continue
        try:
            latest, source = get_latest()
            error = None
        except Exception as e:  # 네트워크·페이지 구조 변경
            latest, source, error = None, "", str(e)[:120]
        latest_cmp = latest.split(".")[0] if (latest and major_only) else latest
        for slug, found in posts.items():
            tested, upcoming = tested_version(found, latest_cmp)
            outdated = bool(latest_cmp) and vkey(latest_cmp) > vkey(tested)
            rows.append({"app": name, "slug": slug, "tested": tested, "upcoming": upcoming, "latest": latest,
                         "outdated": outdated, "source": source, "error": error, "majorOnly": major_only})

    shown = [r for r in rows if r["outdated"] or r["error"]] if args.only_outdated else rows
    today = dt.datetime.now(dt.timezone.utc).date()
    print(f"## 앱·브라우저 버전 점검 ({today}, 글 {len({r['slug'] for r in rows})}편 · 앱 {len({r['app'] for r in rows})}개)\n")
    print("| 앱 | 최신판 | 글 (본문에서 최신판 이하 가장 높은 판) | 상태 |")
    print("| --- | --- | --- | --- |")
    for name in dict.fromkeys(r["app"] for r in shown):
        group = [r for r in shown if r["app"] == name]
        latest = group[0]["latest"] or f"확인 실패: {group[0]['error']}"
        posts = " · ".join(f"`{r['slug']}` {r['tested']}" + (f" (예고 {', '.join(r['upcoming'])} 뺌)" if r["upcoming"] else "") for r in group)
        n_out = sum(r["outdated"] for r in group)
        state = (f"새 판 ({n_out}편)" if n_out else "같음") + (" · 주 버전만 비교" if group[0]["majorOnly"] else "")
        print(f"| {name} | {latest} | {posts} | {state} |")
    print("\n출처:")
    for name in dict.fromkeys(r["app"] for r in shown):
        src = next(r["source"] for r in shown if r["app"] == name)
        if src:
            print(f"- {name}: {src}")
    if args.json:
        Path(args.json).write_text(json.dumps({"checkedAt": str(today), "rows": rows}, ensure_ascii=False, indent=1), encoding="utf-8")


if __name__ == "__main__":
    main()
