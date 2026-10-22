"""글 대표 이미지 생성 (ToolProof 운영 실험용)

무료 오픈 모델 Z-Image-Turbo(Apache-2.0)를 stable-diffusion.cpp로 컨테이너 CPU에서 돌려
ToolProof 공통 화풍(2.5D 일러스트)의 16:9 그림을 만들고, content/posts/images/{slug}/{name}.webp
(1280x720)로 저장한 뒤 모델·프롬프트·시드·소요 시간을 experiment/tests/{slug}/hero-image.md에 남긴다.
API를 쓰지 않으므로 비용이 없다.

실행:
  python3 -I apps/ad-blog/experiment/tools/hero_image.py --setup
      → 엔진 빌드 + 모델 다운로드(약 10GB). 세션 초반에 백그라운드로 먼저 실행
  python3 -I apps/ad-blog/experiment/tools/hero_image.py {slug} {name} "장면 설명(영어)" [--seed N]
      → 생성·저장·기록 (4코어 기준 약 47분). 준비가 안 됐으면 --setup부터 수행
  ... --from-file 그림.png   생성 대신 사용자가 준 그림을 같은 규격으로 변환

- 작업 폴더: 환경 변수 HERO_WORK_DIR (기본 /tmp/hero-image). 저장소 밖이라 커밋되지 않음
- 생성 중에는 CPU를 전부 쓰므로 속도를 재는 측정과 동시에 돌리지 않는다
- 장면 설명 뒤에 공통 화풍·금지 조건(글자·로고·실존 인물·화면 캡처)을 자동으로 붙인다 (STYLE)
- STYLE에는 색이 없으므로 장면 설명에 이 글의 색 조합(배경 + 강조색)과 시점을 직접 넣는다 (글마다 다르게)
- Pillow 필요. 실행한 python에서 Pillow를 못 불러오면(컨테이너 기본 Pillow는 `_imaging` 오류로 깨져 있음)
  /tmp/hero venv를 만들어 Pillow를 설치하고 그 python으로 자동으로 다시 실행한다
"""

import argparse
import datetime as dt
import os
import re
import secrets
import subprocess
import sys
import time
from pathlib import Path

VENV_DIR = Path("/tmp/hero")


def _ensure_pillow() -> None:
    """Pillow를 못 불러오면 venv에 설치하고 같은 인자로 다시 실행 (venv 안에서도 실패하면 오류를 그대로 냄)"""
    try:
        import PIL.Image  # noqa: F401
    except ImportError:
        venv_python = VENV_DIR / "bin" / "python"
        # venv의 python은 시스템 python을 가리키는 링크라 실행 파일 경로로는 구분이 안 됨 → sys.prefix로 판단
        if Path(sys.prefix).resolve() == VENV_DIR.resolve():
            raise
        if not venv_python.exists():
            subprocess.run([sys.executable, "-m", "venv", str(VENV_DIR)], check=True)
        subprocess.run([str(venv_python), "-m", "pip", "install", "-q", "pillow"], check=True)
        print(f"Pillow를 불러올 수 없어 {venv_python}로 다시 실행", file=sys.stderr)
        os.execv(str(venv_python), [str(venv_python), "-I", *sys.argv])


_ensure_pillow()

from PIL import Image  # noqa: E402

APP_DIR = Path(__file__).resolve().parents[2]
WORK_DIR = Path(os.environ.get("HERO_WORK_DIR", "/tmp/hero-image"))
SDCPP_DIR = WORK_DIR / "stable-diffusion.cpp"
SD_CLI = SDCPP_DIR / "build" / "bin" / "sd-cli"
MODEL_DIR = WORK_DIR / "models"

# 2026-10-22 시험한 엔진 버전 (태그를 바꾸면 결과 화풍이 달라질 수 있음)
SDCPP_REPO = "https://github.com/leejet/stable-diffusion.cpp"
SDCPP_TAG = "master-987-a77d362"

HF = "https://huggingface.co"
DIFFUSION_MODEL = "z_image_turbo-Q8_0.gguf"
VAE = "ae.safetensors"
TEXT_ENCODER = "Qwen3-4B-Instruct-2507-Q6_K.gguf"
MODEL_URLS = {
    DIFFUSION_MODEL: f"{HF}/leejet/Z-Image-Turbo-GGUF/resolve/main/{DIFFUSION_MODEL}",
    VAE: f"{HF}/Comfy-Org/z_image_turbo/resolve/main/split_files/vae/{VAE}",
    TEXT_ENCODER: f"{HF}/unsloth/Qwen3-4B-Instruct-2507-GGUF/resolve/main/{TEXT_ENCODER}",
}
MODEL_LABEL = f"Z-Image-Turbo ({DIFFUSION_MODEL}, stable-diffusion.cpp {SDCPP_TAG})"

# ToolProof 공통 화풍 (2026-10-22 사용자 결정: 2.5D 일러스트, 같은 사람이 그린 것처럼).
# 그리는 방식만 고정하고 특정 색·구도는 넣지 않음 — 색 조합·시점은 글마다 장면 설명에서 정함. 바꾸면 이후 모든 글의 화풍이 바뀜
STYLE = (
    "Drawn in one consistent house style, as if by the same illustrator every time: 2.5D illustration,"
    " soft matte 3D shapes with rounded edges, gentle diffused lighting with soft shadows, smooth subtle gradients,"
    " pastel tones, simple uncluttered background, minimal composition with the main subject centered"
    " and empty space around it. No text, letters, numbers, logos, brand marks, watermarks, real people,"
    " or screenshots of real apps or websites."
)

WIDTH, HEIGHT = 1280, 720
STEPS = 8
NAME_PATTERN = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*$")


def run(command: list[str], **kwargs) -> None:
    subprocess.run(command, check=True, **kwargs)


def setup() -> None:
    """엔진(sd-cli)을 빌드하고 모델 파일을 받음. 이미 있으면 건너뜀"""
    WORK_DIR.mkdir(parents=True, exist_ok=True)
    if not SD_CLI.exists():
        if not SDCPP_DIR.exists():
            run(["git", "clone", "--depth", "1", "--branch", SDCPP_TAG, "--recurse-submodules",
                 "--shallow-submodules", SDCPP_REPO, str(SDCPP_DIR)])
        run(["cmake", "-B", "build", "-DCMAKE_BUILD_TYPE=Release", "-DGGML_NATIVE=ON"], cwd=SDCPP_DIR)
        run(["cmake", "--build", "build", "--config", "Release", "--target", "sd-cli", "-j", str(os.cpu_count())],
            cwd=SDCPP_DIR)
    MODEL_DIR.mkdir(exist_ok=True)
    for name, url in MODEL_URLS.items():
        target = MODEL_DIR / name
        if target.exists():
            continue
        partial = target.with_suffix(target.suffix + ".part")
        # -C -: 끊긴 다운로드 이어받기
        run(["curl", "-fsSL", "-C", "-", "-o", str(partial), url])
        partial.rename(target)
    print(f"준비 완료: {WORK_DIR}")


def generate(prompt: str, seed: int, png: Path) -> float:
    if not SD_CLI.exists() or not all((MODEL_DIR / name).exists() for name in MODEL_URLS):
        setup()
    command = [
        str(SD_CLI),
        "--diffusion-model", str(MODEL_DIR / DIFFUSION_MODEL),
        "--vae", str(MODEL_DIR / VAE),
        "--llm", str(MODEL_DIR / TEXT_ENCODER),
        "-p", prompt,
        "--cfg-scale", "1.0", "--steps", str(STEPS),
        "-W", str(WIDTH), "-H", str(HEIGHT), "--seed", str(seed),
        "-t", str(os.cpu_count()),
        # VAE 디코딩을 타일로 나눠 메모리 초과(15GB) 방지
        "--vae-tiling",
        "-o", str(png),
    ]
    log_path = WORK_DIR / "last-run.log"
    start = time.monotonic()
    with log_path.open("w") as log:
        result = subprocess.run(command, stdout=log, stderr=subprocess.STDOUT)
    if result.returncode != 0 or not png.exists():
        tail = log_path.read_text(errors="replace").replace("\r", "\n").splitlines()[-15:]
        sys.exit(f"생성 실패 (exit {result.returncode}), 로그 {log_path}:\n" + "\n".join(tail))
    return time.monotonic() - start


def to_hero(image: Image.Image) -> Image.Image:
    """가운데 기준 16:9로 자르고 WIDTHxHEIGHT로 맞춤 (가로 1200px 미만이면 중단)"""
    image = image.convert("RGB")
    width, height = image.size
    ratio = WIDTH / HEIGHT
    if width / height > ratio:
        crop_width = round(height * ratio)
        left = (width - crop_width) // 2
        image = image.crop((left, 0, left + crop_width, height))
    else:
        crop_height = round(width / ratio)
        top = (height - crop_height) // 2
        image = image.crop((0, top, width, top + crop_height))
    if image.width < 1200:
        sys.exit(f"가로 {image.width}px: 대표 이미지는 1200px 이상이어야 함")
    if image.size != (WIDTH, HEIGHT):
        image = image.resize((WIDTH, HEIGHT), Image.LANCZOS)
    return image


def record(slug: str, output: Path, image: Image.Image, lines: list[str]) -> Path:
    log_path = APP_DIR / "experiment" / "tests" / slug / "hero-image.md"
    log_path.parent.mkdir(parents=True, exist_ok=True)
    if not log_path.exists():
        log_path.write_text("# 대표 이미지 생성 기록\n")
    now = dt.datetime.now(dt.timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    size_kb = output.stat().st_size / 1024
    body = "".join(f"- {line}\n" for line in [f"생성: {now}", *lines, f"결과: {image.width}x{image.height} WebP, {size_kb:.0f} KB"])
    with log_path.open("a") as file:
        file.write(f"\n## {output.name}\n\n{body}")
    return log_path


def main():
    parser = argparse.ArgumentParser(description="글 대표 이미지 생성 (Z-Image-Turbo, 로컬 CPU)")
    parser.add_argument("slug", nargs="?")
    parser.add_argument("name", nargs="?", help="파일 이름 (확장자 제외, 내용이 드러나게. 예: office-2021-support-ending-hero)")
    parser.add_argument("scene", nargs="?", help="장면 설명 (영어). 화풍·금지 조건은 자동으로 붙음")
    parser.add_argument("--setup", action="store_true", help="엔진 빌드·모델 다운로드만 수행")
    parser.add_argument("--seed", type=int, help="같은 그림을 다시 만들 때 (기본: 무작위, 기록에 남음)")
    parser.add_argument("--from-file", type=Path, help="생성 대신 이 그림을 변환")
    args = parser.parse_args()

    if args.setup:
        setup()
        return
    if not (args.slug and args.name and args.scene):
        parser.error("slug, name, scene이 필요함 (준비만 하려면 --setup)")
    if not NAME_PATTERN.match(args.slug) or not NAME_PATTERN.match(args.name):
        sys.exit("slug·name은 영문 소문자·숫자·하이픈만")

    scene = args.scene.strip().rstrip(".")
    if args.from_file:
        lines = [f"원본: 직접 받은 파일 `{args.from_file.name}`", f"설명: {scene}"]
        source = Image.open(args.from_file)
    else:
        seed = args.seed if args.seed is not None else secrets.randbelow(2**31)
        prompt = f"{scene}. {STYLE}"
        png = WORK_DIR / f"{args.slug}-{args.name}.png"
        seconds = generate(prompt, seed, png)
        lines = [f"모델: {MODEL_LABEL}, {STEPS}단계, 시드 {seed}, {seconds / 60:.1f}분", f"장면: {scene}"]
        source = Image.open(png)

    image = to_hero(source)
    output = APP_DIR / "content" / "posts" / "images" / args.slug / f"{args.name}.webp"
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output, "WEBP", quality=82, method=6)
    log_path = record(args.slug, output, image, lines)

    print(f"저장: {output.relative_to(APP_DIR)} ({image.width}x{image.height})")
    print(f"기록: {log_path.relative_to(APP_DIR)}")
    print(f"본문 첫 줄: ![Illustration of ...](./images/{args.slug}/{args.name}.webp)")


if __name__ == "__main__":
    main()
