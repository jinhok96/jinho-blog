"""글 대표 이미지 생성 (ToolProof 운영 실험용)

Gemini(Nano Banana) 또는 OpenAI(GPT Image) 이미지 API로 16:9 그림을 만들어
content/posts/images/{slug}/{name}.webp (가로 1200~1600px)로 저장하고,
모델·프롬프트·크기를 experiment/tests/{slug}/hero-image.md에 남긴다.

실행:
  python3 -I apps/ad-blog/experiment/tools/hero_image.py {slug} {name} "프롬프트"
      → 대표 이미지 생성·저장·기록
  ... --provider gemini|openai   키가 둘 다 있을 때 고르기 (기본 auto: Gemini 우선)
  ... --from-file 그림.png       API 대신 직접 받은 그림(Gemini·ChatGPT 웹에서 저장한 파일 등)을 같은 규격으로 변환
  ... --dry-run                  요청 내용만 출력 (키 불필요)

- 키: 환경 변수 GEMINI_API_KEY 또는 OPENAI_API_KEY (claude.ai 환경 설정에 등록)
- Gemini: gemini-nano-banana-2.1, 16:9 2K(2752x1536) 요청 → 1600x900으로 축소. 유료 등급 전용, 장당 $0.0504 (2026-10 가격표)
- OpenAI: gpt-image-2.5-flare, 1536x864 요청, quality medium
- 프롬프트 끝에 공통 금지 조건(글자·로고·실존 인물·화면 캡처)을 자동으로 붙인다
- Pillow 필요 (없으면 python3 -m venv /tmp/hero && /tmp/hero/bin/pip install pillow 후 그 python으로 실행)
"""

import argparse
import base64
import datetime as dt
import io
import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

from PIL import Image

APP_DIR = Path(__file__).resolve().parents[2]
TIMEOUT = 300

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/interactions"
GEMINI_MODEL = "gemini-nano-banana-2.1"
OPENAI_URL = "https://api.openai.com/v1/images/generations"
OPENAI_MODEL = "gpt-image-2.5-flare"

# 모든 프롬프트에 붙이는 조건 (writing-guide.md 이미지 섹션의 금지 사항)
PROMPT_SUFFIX = (
    ". Wide 16:9 editorial illustration with the main subject near the center."
    " No text, letters, numbers, logos, brand marks, watermarks, real people,"
    " or screenshots of real apps or websites."
)

ASPECT = 16 / 9
MAX_WIDTH = 1600
MIN_WIDTH = 1200
NAME_PATTERN = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")


def post_json(url: str, headers: dict[str, str], body: dict) -> dict:
    request = urllib.request.Request(
        url,
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json", **headers},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=TIMEOUT) as response:
            return json.load(response)
    except urllib.error.HTTPError as error:
        sys.exit(f"API 오류 {error.code}: {error.read().decode(errors='replace')[:1000]}")


def gemini_request(prompt: str) -> dict:
    return {
        "model": GEMINI_MODEL,
        "input": [{"type": "text", "text": prompt}],
        "response_format": {"type": "image", "mime_type": "image/png", "aspect_ratio": "16:9", "image_size": "2K"},
    }


def openai_request(prompt: str) -> dict:
    return {"model": OPENAI_MODEL, "prompt": prompt, "size": "1536x864", "quality": "medium", "output_format": "png"}


def find_image_blocks(node) -> list[str]:
    """Interactions 응답의 steps 안 이미지 블록({"type": "image", "data": base64})을 순서대로 모음"""
    found = []
    if isinstance(node, dict):
        if node.get("type") == "image" and isinstance(node.get("data"), str):
            found.append(node["data"])
        for value in node.values():
            found.extend(find_image_blocks(value))
    elif isinstance(node, list):
        for item in node:
            found.extend(find_image_blocks(item))
    return found


def generate(provider: str, prompt: str) -> bytes:
    if provider == "gemini":
        result = post_json(GEMINI_URL, {"x-goog-api-key": os.environ["GEMINI_API_KEY"]}, gemini_request(prompt))
        blocks = find_image_blocks(result)
        if not blocks:
            sys.exit(f"응답에 이미지가 없음: {json.dumps(result)[:1000]}")
        # 마지막 이미지 블록이 최종 결과 (공식 문서의 output_image와 같은 기준)
        return base64.b64decode(blocks[-1])

    result = post_json(
        OPENAI_URL, {"Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}"}, openai_request(prompt)
    )
    return base64.b64decode(result["data"][0]["b64_json"])


def to_hero(image: Image.Image) -> Image.Image:
    """가운데 기준 16:9로 자르고 가로 MAX_WIDTH 이하로 축소 (확대하지 않음)"""
    image = image.convert("RGB")
    width, height = image.size
    if width / height > ASPECT:
        crop_width = round(height * ASPECT)
        left = (width - crop_width) // 2
        image = image.crop((left, 0, left + crop_width, height))
    else:
        crop_height = round(width / ASPECT)
        top = (height - crop_height) // 2
        image = image.crop((0, top, width, top + crop_height))
    if image.width > MAX_WIDTH:
        image = image.resize((MAX_WIDTH, round(MAX_WIDTH / ASPECT)), Image.LANCZOS)
    if image.width < MIN_WIDTH:
        sys.exit(f"가로 {image.width}px: 대표 이미지는 {MIN_WIDTH}px 이상이어야 함")
    return image


def record(slug: str, name: str, source: str, prompt: str, output: Path, image: Image.Image) -> Path:
    log_path = APP_DIR / "experiment" / "tests" / slug / "hero-image.md"
    log_path.parent.mkdir(parents=True, exist_ok=True)
    if not log_path.exists():
        log_path.write_text("# 대표 이미지 생성 기록\n")
    now = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    size_kb = output.stat().st_size / 1024
    with log_path.open("a") as file:
        file.write(
            f"\n## {output.name}\n\n"
            f"- 생성: {now}, {source}\n"
            f"- 결과: {image.width}x{image.height} WebP, {size_kb:.0f} KB\n"
            f"- 프롬프트: {prompt}\n"
        )
    return log_path


def main():
    parser = argparse.ArgumentParser(description="글 대표 이미지 생성")
    parser.add_argument("slug")
    parser.add_argument("name", help="파일 이름 (확장자 제외, 내용이 드러나게. 예: windows-update-deadline-hero)")
    parser.add_argument("prompt", help="그림 내용 (영어 권장). 금지 조건은 자동으로 붙음")
    parser.add_argument("--provider", choices=["auto", "gemini", "openai"], default="auto")
    parser.add_argument("--from-file", type=Path, help="API 대신 이 그림을 변환")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if not NAME_PATTERN.match(args.slug) or not NAME_PATTERN.match(args.name):
        sys.exit("slug·name은 영문 소문자·숫자·하이픈만")
    prompt = args.prompt.strip().rstrip(".") + PROMPT_SUFFIX

    provider = args.provider
    if provider == "auto":
        provider = "gemini" if os.environ.get("GEMINI_API_KEY") else "openai"

    if args.dry_run:
        body = gemini_request(prompt) if provider == "gemini" else openai_request(prompt)
        print(json.dumps({"provider": provider, "request": body}, indent=2, ensure_ascii=False))
        return

    if args.from_file:
        source = f"직접 받은 파일 `{args.from_file.name}` 변환"
        prompt = args.prompt.strip()
        raw = args.from_file.read_bytes()
    else:
        key = "GEMINI_API_KEY" if provider == "gemini" else "OPENAI_API_KEY"
        if not os.environ.get(key):
            sys.exit("GEMINI_API_KEY·OPENAI_API_KEY가 없음: claude.ai 환경 설정에 등록 필요")
        model = GEMINI_MODEL if provider == "gemini" else OPENAI_MODEL
        source = f"{provider} `{model}`"
        raw = generate(provider, prompt)

    image = to_hero(Image.open(io.BytesIO(raw)))
    output = APP_DIR / "content" / "posts" / "images" / args.slug / f"{args.name}.webp"
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output, "WEBP", quality=82, method=6)
    log_path = record(args.slug, args.name, source, prompt, output, image)

    print(f"저장: {output.relative_to(APP_DIR)} ({image.width}x{image.height})")
    print(f"기록: {log_path.relative_to(APP_DIR)}")
    print(f"본문 첫 줄: ![구체적인 대체 텍스트](./images/{args.slug}/{args.name}.webp)")


if __name__ == "__main__":
    main()
