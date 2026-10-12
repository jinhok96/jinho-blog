"""IndexNow URL 제출 (ToolProof 운영 실험용)

글을 발행·수정한 뒤 배포가 끝나면 해당 URL을 IndexNow(Bing 등 참여 검색엔진)에 알린다.
키 파일은 apps/ad-blog/public/{key}.txt (사이트 루트에 배포됨). 키는 공개 파일이라 비밀이 아니다.
문서: https://www.indexnow.org/documentation

실행 (표준 라이브러리만 사용):
  python3 -I apps/ad-blog/experiment/tools/indexnow.py /posts/free-offline-text-to-speech [...]
  python3 -I apps/ad-blog/experiment/tools/indexnow.py --all     # content/posts의 모든 글 + 홈
  python3 -I apps/ad-blog/experiment/tools/indexnow.py --dry-run --all

- 배포 전에 제출하지 않는다 (검색엔진이 키 파일과 URL을 바로 확인함)
- 응답 200·202 = 접수됨. 403 = 키 파일 확인 실패, 422 = URL·키 불일치, 429 = 너무 잦은 제출
"""

import argparse
import json
import pathlib
import sys
import urllib.error
import urllib.request

SITE_ORIGIN = "https://tool-proof.com"
ENDPOINT = "https://api.indexnow.org/indexnow"
APP_DIR = pathlib.Path(__file__).resolve().parents[2]
PUBLIC_DIR = APP_DIR / "public"
POSTS_DIR = APP_DIR / "content" / "posts"


def find_key() -> str:
    """public/ 아래 '{key}.txt' 파일 중 내용이 파일명과 같은 것"""
    for path in PUBLIC_DIR.glob("*.txt"):
        if path.read_text(encoding="utf-8").strip() == path.stem:
            return path.stem
    sys.exit(f"IndexNow 키 파일이 없습니다: {PUBLIC_DIR}/{{key}}.txt")


def to_url(value: str) -> str:
    if value.startswith(SITE_ORIGIN):
        return value
    if not value.startswith("/"):
        sys.exit(f"URL은 {SITE_ORIGIN}로 시작하거나 /로 시작하는 경로여야 합니다: {value}")
    return SITE_ORIGIN + value


def all_urls() -> list[str]:
    return [SITE_ORIGIN] + [f"{SITE_ORIGIN}/posts/{p.stem}" for p in sorted(POSTS_DIR.glob("*.mdx"))]


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("paths", nargs="*", help="제출할 경로(/posts/slug) 또는 전체 URL")
    parser.add_argument("--all", action="store_true", help="홈 + 모든 글")
    parser.add_argument("--dry-run", action="store_true", help="요청 본문만 출력")
    args = parser.parse_args()

    urls = all_urls() if args.all else [to_url(p) for p in args.paths]
    if not urls:
        parser.error("제출할 URL이 없습니다 (경로를 주거나 --all)")

    key = find_key()
    body = {
        "host": SITE_ORIGIN.removeprefix("https://"),
        "key": key,
        "keyLocation": f"{SITE_ORIGIN}/{key}.txt",
        "urlList": urls,
    }
    print(json.dumps(body, indent=2))
    if args.dry_run:
        return

    request = urllib.request.Request(
        ENDPOINT,
        data=json.dumps(body).encode("utf-8"),
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            print(f"응답 {response.status} (접수됨, URL {len(urls)}개)")
    except urllib.error.HTTPError as error:
        sys.exit(f"응답 {error.code}: {error.read().decode('utf-8', 'replace')[:300]}")


if __name__ == "__main__":
    main()
