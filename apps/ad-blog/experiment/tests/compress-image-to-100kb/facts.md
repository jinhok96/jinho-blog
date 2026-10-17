# compress-image-to-100kb 사실 확인표

- 주 검색어: `compress image to 100kb` (+ `compress image`, `reduce image size`). Google Trends API는 이번 세션에서 429가 반복돼 상대 검색량 비교를 못 함 → 자동완성 결과로 선정
- 하위 검색어 (2026-10-16 `demand_check.py suggest`): "compress image" 30개 — compress image to 2mb·without losing quality (Google·Bing·YouTube), to 1mb·free·size·online (Google·Bing), to 100kb (Google), 500kb·200kb·50kb·20kb (Bing), on iphone·on mac (YouTube). "reduce image size" 30개 — without losing quality (3곳), in kb·in mb·mac·free(Google·Bing), to 100kb·to 50kb·to 1mb (Bing). "upscale image" 32개, "webp to jpg" 22개는 후보로 남김
- 채널: **검색형** (상시 수요, How-to + 측정). 제목 52자, 설명 153자
- 차별점: 상위 결과가 업로드형 온라인 압축기인 검색어에서, **목표 용량별로 몇 px로 줄여야 하는지**를 20장 × 9개 크기 × 5개 목표로 측정. 원본 크기 그대로 목표 용량을 지정하면 도구가 목표를 넘긴 파일을 오류 없이 저장한다는 점을 측정으로 보임
- 적용한 노하우: 검색형 제목(노하우 1), 측정 규모 제목 표기 `(20 Photos Tested)`(노하우 2), 이미지 5장(노하우 7: 대표 그래프 1200×675 + 목표 용량 통과 수 그래프 + 같은 영역 확대 비교 + GIMP Scale Image·JPEG 내보내기 스크린샷 2장, Xvfb에서 직접 캡처), 요약 표, 내부 링크 5개(HEIC→JPG·PDF 압축·영상 압축·허브·배경 제거) + PDF 압축 글에서 역링크. 카테고리 `software`
- 측정 환경: Ubuntu 24.04, Intel Xeon 2.80GHz 4코어, RAM 16GB, GPU 없음, 2026-10-16 (`env.txt`)

## 측정 (직접 실행)

| 주장 | 근거 |
| --- | --- |
| 입력: CC0 사진 20장(PD12M, `convert-heic-to-jpg-free/sources.json`과 같은 사진) → 4032×3024 가운데 자르기 → 품질 92·4:2:0 JPEG. 평균 2.69MB, 821,978~5,334,665바이트 | `build_set.sh`, `ls -l /tmp/ci/in` |
| 방법: ImageMagick 7.1.2-34 `-define jpeg:extent=TKB` (원본·3200·2560·1920·1600·1280·1024·800·640 px), jpegoptim 1.5.6 `--size=T` (원본 크기만), cwebp 1.6.0 `-size T*1000 -pass 10` (9개 크기). 목표 1000·500·200·100·50KB. 합계 1,900건 | `run_tests.py`, `results.jsonl` |
| 점수: SSIMULACRA2(libjxl 0.11.1 `ssimulacra2`), 원본·결과 모두 Pillow Lanczos로 1600×1200으로 맞춘 뒤 비교 | `run_tests.py` `score()` |
| 통과 기준: 목표 × 1,000바이트 이하 (`fit_1000`), 참고로 × 1,024 (`fit_1024`) | `analyze.py` |
| 목표별 최적(20장 모두 통과 중 중앙값 최고, ImageMagick): 1MB 1600px 89.7(하위 10% 85.8, 2560px 89.5) / 500KB 1920px 83.8(1600px 83.4) / 200KB 1280px 69.1(1600px 68.8) / 100KB 1024px 52.8(1280px 52.3) / 50KB 800px 32.9 | `summary.json` `best`, `groups` |
| 원본 크기 그대로(ImageMagick): 1MB 88.0(하위 10% 69.4) / 500KB 75.1 / 200KB 15.3 / 100KB -49.9 / 50KB -50.6 | `summary.json` `{t}|im|4032` |
| 원본 크기 100KB: ImageMagick 14/20 통과(6장 초과, 최대 200,512바이트 = 05번 공원 사진, 품질 2), jpegoptim 2/20(≤102,400은 6/20), cwebp 9/20. 200KB: 19·3·17/20. 크기를 줄인 ImageMagick(100KB 1024px, 200KB 1280px)은 20/20 | `summary.json` `fit_1000`, `fit_1024` |
| ImageMagick이 목표를 못 맞춰도 종료 코드 0, 경고 없음 (12번 사진 100KB → 115,089바이트, 품질 2) | 컨테이너에서 직접 실행 `echo $?` |
| jpegoptim은 KB를 1,024바이트로 읽음(`Target size ... set to: 200 Kbytes`) + 근처에서 탐색 중단 (01번 200 → 205,101바이트, try 50·75·62) | `jpegoptim -v --size=200` 직접 실행 |
| ImageMagick이 고른 JPEG 품질(중앙값, 범위): 1MB@1600 96.5(90~100), 500KB@1600 89(64~97), 200KB@1280 78(33~94), 100KB@1024 67(23~92), 50KB@800 50.5(17~90). 100KB@1024: 01번 노을 91, 05번 공원 23 | `results.jsonl` `quality` (`magick identify -format %Q`) |
| 디테일 많은 사진 100KB@1024: 18번 눈 덮인 숲 14.0, 12번 자갈 해변 28.1. 1MB@1600에서도 85.9·86.3 (중앙값 89.7보다 낮음) | `results.jsonl` |
| WebP 비교: 100KB@1024 54.4 vs JPEG 52.8, 200KB@1600 71.6 vs 68.8. 표의 크기(1MB@1600·500KB@1600·200KB@1280·100KB@1024·50KB@800)에서 cwebp 미통과 1·5·0·2·3장 | `summary.json` |
| 100KB@1024 ImageMagick 크기 중앙값 96,525바이트 | `summary.json` `bytes_median` |
| 확대 비교(15번 고양이): 원본 2.2MB, 원본 크기 100KB → 88,316바이트·품질 2, 1024px 100KB → 96,539바이트·품질 69 | `results.jsonl`, `charts.py` |
| GIMP 3.2.6: Image > Scale Image(체인 연결, 4032→1600 입력 시 높이 1200 자동), File > Export As → JPEG 창. **Show preview in image window** 체크 시 "File size without metadata" 표시(체크 전 "unknown"). 1600×1200·품질 75·4:4:4 → 289.8 kB, 품질 60·4:4:4 → 213.5 kB, 품질 60·4:2:0 → 181.8 kB, 저장 파일 181,788바이트 | Xvfb에서 직접 조작·스크린샷 (`gimp-*.webp`) |

## 문서 (2026-10-16 직접 열어 확인)

| 주장 | 출처 |
| --- | --- |
| `jpeg:extent`: "search for the highest compression quality level that results in an output file that does not exceed the value" | https://imagemagick.org/defines/ |
| ImageMagick 7.1.2-34 Windows·macOS·Linux 바이너리 | https://imagemagick.org/download/ |
| jpegoptim `-S, --size`: "Try to optimize file to given size ... kilo bytes (1 - n) or as percentage" | `jpegoptim -h` (1.5.6), https://github.com/tjko/jpegoptim/releases/download/v1.5.6/ |
| cwebp `-size`: target size in bytes, several passes to get as close as possible; `-pass` max 10 | https://developers.google.com/speed/webp/docs/cwebp |
| SSIMULACRA2 점수: 90 visually lossless, 70 high, 50 medium, 30 low, 10 very low | https://github.com/cloudinary/ssimulacra2 (README) |
| GIMP 3.2.6 최신 안정판 | https://www.gimp.org/downloads/ |
| Preview: Tools > Adjust Size, Resample image, Resolution 줄이기, "The new size is shown at the bottom", 여러 장은 사이드바에서 선택 | https://support.apple.com/guide/preview/prvw2015/mac |
| Preview: File > Export, JPEG 선택 시 품질 조절 가능 | https://support.apple.com/guide/preview/prvw1012/mac |
| PowerToys: free, open-source utilities, Image Resizer는 File Explorer 우클릭 | https://learn.microsoft.com/en-us/windows/powertoys/ |
| Image Resizer: 우클릭 "Resize with Image Resizer", Fill·Fit·Stretch(Fit은 비율 유지·자르지 않음), CLI `--quality` JPEG 1–100 (2026-08-25 갱신) | https://learn.microsoft.com/en-us/windows/powertoys/image-resizer |
| iPhone Settings > Camera > Formats > Most Compatible → 새 사진 JPEG | https://support.apple.com/en-us/116944 |
| PD12M: 퍼블릭 도메인·CC0 | https://huggingface.co/datasets/Spawning/PD12M |

## 쓰지 않은 것

- Windows Photos 앱 Resize: 공식 Microsoft 문서를 찾지 못함(검색 결과가 제3자 글뿐) → PowerToys Image Resizer로 대체. PowerToys는 직접 실행하지 않았다고 본문에 명시
- AVIF(avifenc): 목표 용량 옵션이 없어 같은 방식으로 비교할 수 없어 제외
- 원본 해상도 기준(확대 비교) 점수: 12MP SSIMULACRA2 1회 약 14초로 1,900건에 너무 오래 걸려 화면 기준(1600×1200)만 측정. 작은 크기는 확대 시 손해라는 한계를 본문에 밝힘
- 시간: 4개 프로세스 병렬 실행 중 GIMP 조작을 함께 해 시간은 글에 쓰지 않음

## 변경 기록

- 2026-10-17: 비개발자 기준(명령줄 금지)에 따라 "from the command line" 섹션(ImageMagick `magick` 명령·`jpeg:extent`·`-strip`), jpegoptim·cwebp 비교(How we tested 목록·"Hitting the size" 문단의 도구 동작 설명·WebP 섹션의 cwebp 미통과 수·FAQ의 jpegoptim 예), "many photos" 추천(ImageMagick), 태그 ImageMagick, 삭제된 글(PDF 압축·배경 제거) 링크 제거 → OCR 글 링크로 교체. ImageMagick은 How we tested에 측정 도구로 한 문장만 남김(JPEG 측정값은 그대로). `charts_no_cli.py`로 대표 그래프 부제의 "via ImageMagick" 삭제, 목표 용량 통과 수 그래프에서 jpegoptim·cwebp 막대를 빼고 원본 크기 vs 줄인 뒤만 다시 그림(측정값 그대로). 제목·설명 그대로, `updatedAt: 2026-10-17`
