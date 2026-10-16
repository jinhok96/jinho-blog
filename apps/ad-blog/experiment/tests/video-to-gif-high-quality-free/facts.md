# video-to-gif-high-quality-free 사실 확인표

- 주 검색어: `video to gif` (+ `video to gif high quality`, `video to gif free`). Trends 미국 3개월(2026-10-16): `video to gif` **7.1**, `gif maker` 6.5, `mp4 to gif` 3.0, `compress video` 2.4, `webp to jpg` 1.8, `upscale image` 1.4 (기준 `remove background` 35.0)
- 하위 검색어 (2026-10-16 `demand_check.py suggest "video to gif"`, 23개): video to gif converter·**high quality**(Google·Bing·YouTube), video to gif free·converter free·discord·iphone·online·maker·4k(2곳), canva·ezgif·adobe express·premiere pro·capcut·photoshop(1곳)
- 채널: **검색형** (상시 수요, 비교·측정 + How-to). 제목 51자, 설명 159자
- 차별점: 상위 결과가 업로드형 온라인 변환기인 검색어에서, 무료 오프라인 도구 3개·설정 7개를 같은 75프레임 3개 클립으로 측정. 크기·SSIM뿐 아니라 **확대 비교(SSIM이 못 잡는 띠 현상)·재생 속도(GIF 지연값)** 확인 → "FFmpeg 기본 명령은 bgr8 고정 팔레트라 점투성이 + 더 큼", "ImageMagick `-delay 1x15`는 60ms로 저장돼 10% 빨리 재생" 같은 결과
- 적용한 노하우: 검색형 제목(노하우 1), 측정 규모 제목 표기 `(3 Tools Tested)`(노하우 2), 이미지 6장(노하우 7: 대표 그래프 1200×675 + 하늘·얼굴·화면 글자 확대 비교 3장 + 폭·fps 크기 그래프 + 속도·메모리 그래프, 모두 직접 측정·렌더링. 앱 화면 스크린샷 없음: 측정한 세 도구 모두 명령줄), 요약 표, 내부 링크 4개(PDF 압축·HEIC→JPG·배경 제거·허브) + HEIC→JPG 글에서 역링크. 카테고리 `software`
- 측정 환경: Ubuntu 24.04.5, Intel Xeon 2.80GHz 4코어, RAM 16GB, GPU 없음, 2026-10-16 (`env.txt`)

## 측정 (직접 실행)

| 주장 | 근거 |
| --- | --- |
| 도구: FFmpeg 9.0.2(BtbN 정적 빌드 n9.0.2-28), gifski 1.34.0(공식 Releases Linux 바이너리), ImageMagick 7.1.2-34(공식 AppImage) | `env.txt` |
| 클립 3개 × 5초 × 15fps = 75프레임, lanczos 축소: 애니메이션(Big Buck Bunny 170~175초, 480×270), 실사(Tears of Steel 240~245초, 480×200), 화면 녹화(직접 만든 페이지, 640×360) | `run_tests.py` `CLIPS`, `record_screen.sh`, `screen-page.html` |
| 모든 도구에 같은 PNG 프레임 입력. 설정 7개: FFmpeg 기본, palettegen+paletteuse, stats_mode=diff + bayer:bayer_scale=5 + diff_mode=rectangle, gifski 기본(Q90)·Q70, ImageMagick `-delay 1x15` 기본·`-layers Optimize` | `run_tests.py` `configs` |
| 크기·SSIM(3개 클립): FFmpeg 기본 3.8·3.7·6.4MB / 0.353·0.573·0.520, 팔레트 1.7·4.8·4.0MB / 0.950·0.937·0.9995, small 1.2·3.6·4.1MB / 0.956·0.957·0.997, gifski 0.9·2.6·3.0MB / 0.937·0.931·0.976, Q70 0.5·1.5·2.1MB, IM 기본 3.5·5.2·3.8MB / 0.960·0.961·0.997, IM Optimize 1.4·5.0·3.3MB | `results.json` |
| 합계·평균: FFmpeg 기본 13.79MB/0.482, 팔레트 10.53/0.962, small 8.90/0.970, gifski 6.50/0.948, Q70 4.11/0.897, IM 12.53/0.972, IM Optimize 9.64/0.958. gifski는 팔레트 대비 38% 작음, IM 기본의 52% | `results.json` 합산 |
| 최저 프레임 SSIM: FFmpeg 기본 0.345, 팔레트 0.934, small 0.951, gifski 0.925, Q70 0.863, IM 0.956, IM Optimize 0.937 | `results.json` `min_frame_ssim` |
| SSIM 비교 방법: GIF를 `-fps_mode passthrough`로 프레임별 PNG로 풀어 원본 PNG와 1:1 비교 (처음에 타임스탬프 기준 비교를 써서 프레임이 어긋난 결과가 나와 폐기) | `run_tests.py` `decode`·`compare` |
| 확대 비교: 애니메이션 37번 프레임 하늘에서 FFmpeg small·IM Optimize는 띠(얼룩), gifski는 미세한 입자, FFmpeg 팔레트는 매끈, FFmpeg 기본은 색 점 | `video-to-gif-sky-gradient-comparison.webp`, `check_crops.py` |
| FFmpeg 기본 GIF 출력은 `bgr8`로 자동 변환(고정 256색) | `ffmpeg -v verbose` 로그: `fmt:rgb24 ... -> fmt:bgr8` |
| 재생 시간: FFmpeg·gifski는 70ms×50 + 60ms×25 = 5.0초, ImageMagick `-delay 1x15`는 60ms×75 = 4.5초. IM `-delay 10`(50프레임)은 100ms×50 = 5.0초 | `delays.txt`, `gif_delays.py`(Pillow) |
| 시간(3회 중앙값, 3개 클립 합): FFmpeg 기본 0.8초, 팔레트 5.8, small 2.0, gifski 7.2, Q70 5.6, IM 41.2, IM Optimize 59.2. 최대 RAM: 44·120·121·57·57·744·451MB | `results.json` `seconds`·`peak_mb` (`os.wait4` ru_maxrss) |
| 폭·fps(실사, 영상 직접 입력): 320→640px 약 3.6~3.8배, 480→320px 52~54% 감소, 15→10fps 26~27% 감소(약 1.4배 차이) | `sweep.json`, `size_sweep.py` |
| 영상 파일 직접 입력 확인: FFmpeg 팔레트 한 줄 명령 1.75MB, gifski y4m 파이프 0.89MB (애니메이션, 프레임 입력 결과 1.72MB·0.88MB와 비슷) | 세션 중 실행 (`/tmp/v2g/oneliner`) |
| gifski Q70은 Q90 대비 37% 작음 (4.11/6.50) | `results.json` |
| Ubuntu 24.04 apt FFmpeg 6.1.1 | 컨테이너 `ffmpeg -version` (6.1.1-3ubuntu5) |

## 문서 (2026-10-16 직접 열어 확인)

| 주장 | 출처 |
| --- | --- |
| GIF 색상표 크기는 2^(값+1), 3비트 → 최대 256색. 지연값은 1/100초 단위 | https://www.w3.org/Graphics/GIF/spec-gif89a.txt (Global Color Table Size, Delay Time) |
| palettegen "Generate one palette for a whole video stream", stats_mode diff 설명, paletteuse "Use a palette to downsample an input video stream", dither 기본 sierra2_4a, bayer_scale "less visible pattern at the cost of more banding"(기본 2), diff_mode rectangle | https://ffmpeg.org/ffmpeg-filters.html |
| gifski: "uses pngquant for the best palettes with temporal dithering", "thousands of colors per frame", Windows·Mac 무료 앱("It's free"), Mac은 App Store, CLI는 Linux·macOS·Windows | https://gif.ski/ (사이트의 CLI 표기는 1.32.0, 실제 최신은 1.34.0) |
| gifski 1.34.0 라이선스 AGPL-3.0-or-later, 2025-07-13 | https://crates.io/api/v1/crates/gifski/1.34.0 |
| FFmpeg 최신 9.0.2, LGPL 2.1 이상(일부 GPL), Windows 빌드는 gyan.dev·BtbN 링크 | https://ffmpeg.org/download.html, https://ffmpeg.org/legal.html |
| gyan.dev: `winget install ffmpeg` = release full | https://www.gyan.dev/ffmpeg/builds/ |
| Homebrew ffmpeg 9.0.2, gifski 1.34.0, imagemagick 7.1.2-34 | https://formulae.brew.sh/api/formula/{ffmpeg,gifski,imagemagick}.json |
| ImageMagick: "freely available without charge", 개인·상업 사용 가능 (ImageMagick License) | https://imagemagick.org/license/ |
| Big Buck Bunny CC BY 3.0, 표기 "(c) copyright 2008, Blender Foundation / www.bigbuckbunny.org" | https://peach.blender.org/about/ |
| Tears of Steel(Mango) CC BY 3.0, 표기 "(CC) Blender Foundation \| mango.blender.org" | https://mango.blender.org/sharing/ |

## 재현

1. 도구: `env.txt`의 URL에서 FFmpeg·gifski·ImageMagick을 `/tmp/v2g/tools`에 풀기 (ImageMagick은 `--appimage-extract`)
2. 클립: `env.txt`의 Blender URL 2개를 `/tmp/v2g/src`에 받기, `record_screen.sh`로 화면 녹화
3. `python3 -I run_tests.py results.json` (원본 프레임 `/tmp/v2g/ref`, GIF `/tmp/v2g/out`) → `python3 -I size_sweep.py` → Pillow venv로 `gif_delays.py /tmp/v2g/out/*/*.gif`
4. 그림: Pillow·matplotlib venv로 `charts.py /tmp/v2g <content/posts/images/video-to-gif-high-quality-free>`
