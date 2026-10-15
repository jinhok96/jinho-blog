# convert-heic-to-jpg-free 사실 확인표

- 주 검색어: `heic to jpg` (+ `convert heic to jpg`). Trends 미국 3개월(2026-10-15): `heic to jpg` 8.8 (기준 `remove background` 35.7), `png to jpg` 4.0, `compress video` 2.5, `webp to jpg` 1.9
- 하위 검색어 (2026-10-15 `demand_check.py suggest`): heic to jpg converter (Google·Bing·YouTube), heic to jpg windows (Google·Bing·YouTube), heic to jpg bulk converter, heic to jpg converter free, heic to jpg on iphone, heic to jpg on mac, heic to jpg converter offline, convert heic to jpg windows 11 (Google·Bing·YouTube), convert heic to jpg on mac. 하위 검색어 34개 + 25개
- 채널: **검색형** (상시 수요, 비교·측정 + How-to). 제목 53자, 설명 155자
- 차별점: 상위 결과가 업로드형 온라인 변환기·단순 단계 안내인 검색어에서, 무료 오프라인 도구 3개가 **기본 설정에서 무엇을 잃는지**(색 프로필·GPS 위치·날짜·회전)를 24장으로 직접 측정. 위치 정보 제거(공유 전) 설정도 측정
- 적용한 노하우: 검색형 제목(노하우 1), 측정 규모 제목 표기 `(3 Tools Tested)`(노하우 2), 이미지 5장(노하우 7: 대표 그래프 1200×675 + 설정 후 색·메모리 그래프 + 같은 사진 색 비교 + XnConvert 설정 화면 + GIMP 내보내기 화면, 스크린샷 2장은 컨테이너 Xvfb에서 직접 캡처), 요약 표, 내부 링크 5개(허브·배경 제거·OCR·PDF→Word·AI 이미지 판별) + PDF→Word 글에서 역링크. 카테고리 `software`
- 측정 환경: Ubuntu 24.04, Intel Xeon 2.80GHz 4코어, RAM 16GB, GPU 없음, 2026-10-15 (`env.txt`)

## 측정 (직접 실행)

| 주장 | 근거 |
| --- | --- |
| 테스트 HEIC 24개: CC0 사진 20장(PD12M, 원출처 Wikimedia Commons) → 4032×3024 가운데 자르기 → Display P3로 변환·ICC 내장 → libheif 1.17.6 `heif-enc -q 70`(x265). 세로 4장(03·08·11·16 일부)은 가로 픽셀 + irot(270° ccw) + EXIF Orientation=6. 모두 EXIF DateTimeOriginal 2026-10-01 12:00, GPS 40.6892 N 74.0445 W, Make "ToolProof". 합계 69.4MB | `build_set.sh`, `mkp3.c`(lcms2로 Display P3 ICC 생성: P3 원색·D65·sRGB 감마), `sources.json` |
| 도구: XnConvert 1.118.0(Linux deb, Xvfb에서 GUI 실행·xdotool로 Convert 클릭), ImageMagick 7.1.2-34(공식 AppImage, `magick mogrify -format jpg *.heic`), GIMP 3.2.6(공식 AppImage, python-fu로 `Gimp.file_save` 기본 설정) | `run_tools.py`, `gimp_batch.py`, `env.txt` |
| XnConvert 기본값: Format "Same as original"(JPG로 바꿈), JPEG 품질 85·4:4:4, Preserve Metadata 켜짐, Preserve color profile 꺼짐, Use multiple CPU Cores 꺼짐(1) | 첫 실행 화면 스크린샷·`~/.config/xnconvert/xnconvert.ini` (`KeepIcc=false`, `KeepMeta=true`, `JPEGQuality=85`) |
| GIMP 3.2.6 JPEG 내보내기 기본값(새 설치): 품질 90, Progressive 켜짐, 4:4:4, Save Exif·Save color profile·Save XMP·IPTC·thumbnail 꺼짐. HEIC 열 때 "Keep the image's color profile" 대화상자 (Keep / Convert) | GUI에서 직접 열어 스크린샷 (`gimp-export-jpeg-save-exif-color-profile.webp`). GUI 기본 내보내기 결과와 배치 결과의 메타데이터 동일(Exif·ICC 없음), 픽셀 평균 차 0.002 |
| ImageMagick 출력 품질 92 | `magick identify -format %Q` |
| 기본 설정 결과: 색 차이(ΔE2000 사진별 평균의 중앙값) XnConvert 1.63, ImageMagick 0.61, GIMP 1.60. 최대 XnConvert 2.78, GIMP 2.77 (GIMP 상위: 01 노을 2.77, 24 토마토 세로 2.69, 16 토마토 2.59, 04 보라 꽃 2.46) | `summary.json` `deltaE_median`·`deltaE_max`, `analyze.py` (EXIF 방향 적용 + 내장 ICC → sRGB 상대 색역, 없으면 sRGB로 간주, 1008×756로 축소 후 CIEDE2000) |
| ICC 유지: XnConvert 0/24, ImageMagick 24/24, GIMP 0/24 | `summary.json` `icc_kept` |
| GPS·날짜 유지: XnConvert 24/24, ImageMagick 24/24, GIMP 0/24 | `summary.json` `gps_kept`·`date_kept` (ExifTool 12.76) |
| 세로 4장 회전: 세 도구 모두 3024×4032로 올바름, Orientation 태그는 1(정상)로 바뀜 (GIMP 기본은 Exif 없음) | `summary.json` `orientation_ok`, exiftool 21.jpg |
| 설정 변경 후: XnConvert Preserve color profile 켬 → ΔE 0.67·ICC 24/24, GIMP Save Exif·Save color profile 켬 → ΔE 0.63·ICC·GPS·날짜 24/24 | `summary.json` `xnconvert_icc`, `gimp_meta` (`gimp_batch_meta.py`: `file-jpeg-export` `include-exif`·`include-color-profile`) |
| XnConvert Preserve Metadata 끔 + Preserve color profile 켬 → GPS·날짜 0/24, ICC 24/24, ΔE 0.67 (1회 실행) | `summary.json` `xnconvert_icc_nometa` |
| 시간(24장 일괄, 3회 중앙값): XnConvert 33.47초(XnConvert 자체 표시 "Total Duration: 33 second(s)"), ImageMagick 55.46초, GIMP 66.83초(첫 실행 84.6초는 콜드 스타트). 최대 메모리 XnConvert 255MB, ImageMagick 244MB, GIMP 448MB | `summary.json` `sec_runs`·`max_rss_mb` (`/usr/bin/time -f %M`, XnConvert는 `/proc/pid/status` VmHWM), `timing_log.txt` |
| 파일 크기 평균: XnConvert 2.03MB, GIMP 2.50MB, ImageMagick 2.85MB, HEIC 2.89MB | `summary.json` `jpg_mean_mb`, `_input` |
| 토마토 비교 이미지 ΔE: ImageMagick 0.51, GIMP 2.59 | `summary.json` `per_file[15]` |
| `magick ... -strip` 결과에 ICC·GPS 모두 없음 | 컨테이너에서 01.heic로 직접 실행 |
| `mogrify -path`는 없는 폴더면 "unable to open image" 오류 | 컨테이너에서 직접 실행 |
| XnConvert 형식·옵션이 다음 실행에도 유지 | `xnconvert.ini`의 `Format=jpeg` 유지, 재실행 화면 |

## 문서 (2026-10-15 직접 열어 확인)

| 주장 | 출처 |
| --- | --- |
| XnConvert 1.118.0, 무료, Windows·Mac·Linux | https://www.xnview.com/en/xnconvert/ |
| XnConvert는 개인(비상업)·교육용 프리웨어, 회사는 라이선스 구매 (1개 15.00 €) | 같은 페이지 + 설치본 `license.txt` |
| ImageMagick 7.1.2-34 Windows·macOS·Linux 바이너리 | https://imagemagick.org/download/ |
| GIMP 최신 안정판 3.2.6, Windows(`gimp-3.2.6-setup.exe`)·macOS | https://www.gimp.org/downloads/ |
| HEIF Image Extension 무료, .heic 보려면 HEVC Video Extensions 필요 | https://apps.microsoft.com/detail/9pmmsr1cgpwg (JSON-LD `price: 0`, 설명) |
| HEVC Video Extensions $0.99 | https://apps.microsoft.com/detail/9nmzlz57r3t7 (JSON-LD `price: 0.99`, 미국 Store) |
| 새 Photos 앱: Editor에 HEIC 편집, Windows Insiders부터 배포 (2026-10-15) | https://blogs.windows.com/windowsexperience/2026/10/15/meet-the-new-photos-app-on-windows-11/ |
| Settings > Camera > Formats > Most Compatible → 새 사진·동영상 JPEG·H.264. HEIF는 같은 화질로 저장 공간 적게. AirDrop·Messages·email로 미지원 기기에 보내면 JPEG 등으로 자동 변환될 수 있음. Preview·Photos에서 File > Export | https://support.apple.com/en-us/116944 |
| Preview: File > Export, Format에서 JPEG, 품질 조절, 여러 파일은 한 창의 사이드바에서 선택 후 내보내기 | https://support.apple.com/guide/preview/prvw1012/mac |
| Finder: Control-click > Quick Actions > More > Convert Image, 예시 ".heic photo from your iPhone to a .jpeg" | https://support.apple.com/guide/mac-help/perform-quick-actions-in-the-finder-mchl97ff9142/mac |
| 공유 시 위치 메타데이터 노출 경고, iPhone: 사진 > 정보 > Adjust Info > Adjust Location > No Location | https://support.apple.com/guide/personal-safety/manage-location-metadata-in-photos-ips0d7a5df82/web |
| PD12M: 퍼블릭 도메인·CC0 이미지, 메타데이터 CDLA-Permissive-2.0 | https://huggingface.co/datasets/Spawning/PD12M (README) |

## 쓰지 않은 것

- iPhone이 Display P3로 저장한다는 주장: 1차 출처(Apple 문서)를 찾지 못함 → "Our test photos used Display P3"로만 씀
- 실제 iPhone 원본 HEIC(타일 격자·깊이·HDR 보조 이미지) 미사용 → 글에 "did not come straight from a phone camera" 명시
- Windows Photos·Paint·Mac Preview·Finder 변환 결과: 실행 불가 → 문서 기반, "not tested"로 표기
- 테스트 사진은 원래 sRGB → P3 바깥 색은 시험하지 못함. P3 전용 색이 많은 사진에서 차이가 더 클 수 있으나 측정하지 않아 글에 쓰지 않음
- ΔE 수치의 체감(“1 이하면 안 보임” 등) 기준은 출처를 열지 않아 쓰지 않고, 같은 사진 비교 이미지로 대신 보여 줌
- XnConvert 멀티코어 옵션 속도: 측정하지 않음
- Wikimedia Commons API·upload.wikimedia.org는 429(Too Many Requests)로 이미지 다운로드 실패 → PD12M S3 사본 사용
