# free-image-converter-photo-tools 사실 확인표

## 브리프 (2026-10-26 KST 12시 개선 세션, 허브)

| 항목 | 내용 |
| --- | --- |
| 클러스터·역할 | `photo-video` 허브 (상시 글 6편: `convert-heic-to-jpg-free`·`convert-webp-to-jpg-free`·`compress-image-to-100kb`·`remove-bg-alternative-free`·`remove-metadata-from-photos`·`compress-video-for-discord-email`). 주간 SEO 점검(2026-10-26) 우선순위 2번 |
| 주 검색어 | `free image converter` — `demand_check.py suggest` 2026-10-26: 본 검색어 Google·Bing·YouTube 3곳, 하위 24개(`heic to jpg`·`online`·`software`·`to jpg`·`to png` 2곳, `free photo converter` YouTube). Trends 미국 3개월 `free image converter` 0.5 · `free photo tools` 0.0 · `free image tools` 0.0 · `free photo editing tools` 0.0 · 기준 `remove background` 35.4 → 후보 중 가장 큼 |
| 하위 검색어 | `free image converter heic to jpg`, `free image converter to jpg`, `free image converter software`, `free photo tools`(Google·Bing), `free photo tool to remove background`(Bing), `free photo resize tools online`(Bing), `free image tools online`(Google·Bing) |
| 검색 의도 | 비교형(best·free). 허브 글 유형 = Comparison (결론 → 요약 표 → 평가 기준 → 작업별 결과 → 상황별 추천) |
| 채널 | 검색형. 제목 `Best Free Image Converter and Photo Tools` (41자, 꼬리표·연도 없음) |
| 상위 결과 (WebSearch 2026-10-26) | `free image converter`: StockSnap 변환기(도구) · Adobe Express 변환 2곳(도구) · dealeaphotography 무료 변환기 안내(작은 블로그) · Chrome 웹 스토어 확장(도구) · lovable.app 변환기·Microsoft Store 앱·Movavi(도구). `best free photo tools convert compress remove background metadata`: codaone·wallpapers.com·fitgap 목록 글(작은 블로그·도구 회사), ImagesTools·PixPrep 소개(도구). 공통: 지원 형식 나열·"무료·업로드 없음" 문구. 빠진 것: 같은 파일로 잰 결과(색 프로필·GPS가 남는지, 투명 배경이 어떤 색이 되는지, 무료 다운로드 해상도, 100 KB에서 화질), 기본값 함정, 앱 vs 웹 업로드 여부 |
| 차별점 | 6개 작업을 14개 무료 도구로 직접 측정한 결과(10-15 ~ 10-22)를 작업별 추천 1개로 묶음 + 기본값 때문에 결과가 틀어진 6가지(색 프로필·Exif·GPS·투명 배경 검정·Save as copy 실패·Social 25 MB 초과) + 앱(파일이 안 나감) vs 웹(업로드) 구분 |
| 내부 링크 계획 | 나가는 링크: 상시 글 6편 전부(작업별 절) + `best-free-pdf-tools`(사진 → PDF) + `image-to-text-offline-free`(사진 속 글자). 받는 링크: 상시 글 6편 끝 문단에 1문장씩(색인된 `compress-image-to-100kb`·`convert-heic-to-jpg-free` 포함), `hub: true`로 홈 "Start here" 고정(홈은 10-21에 마지막으로 크롤링된 페이지) |
| 개요 | 요약 표 → How we tested → HEIC to JPG(XnConvert) → WebP to JPG(XnConvert·ezgif) → 100 KB(크기 줄이고 GIMP) → 배경 제거(iLoveIMG) → 메타데이터(ExifCleaner·ExifRemove) → 영상(HandBrake) → 기본값 함정 → 앱 vs 웹·무료 한도 → 상황별 추천 |
| 이미지 | 대표 이미지: 도구 상자에서 사진 인화지가 나오고 한 장이 작아지는 장면 + 필름 릴, 연살구 배경 + 코발트 블루·라임, 정면 (최근 3장: 라일락 3/4, 하늘색 위에서 3/4, 버터 노랑 아이소메트릭과 겹치지 않게). 본문: ① 작업별 추천 카드 그래픽(새로) ② 기본값 함정 그래픽(새로) ③ 투명 WebP 결과 격자(`convert-webp-to-jpg-free` 재사용) ④ 100 KB 고양이 확대 비교(`compress-image-to-100kb` 재사용) ⑤ 세로 사진이 눕는 결과(`remove-metadata-from-photos` 재사용) |

## 측정값 출처 (상시 글 측정 자료, 이번 세션에 다시 읽음)

| 주장 | 출처 | 확인 |
| --- | --- | --- |
| HEIC 24장, XnConvert 1.118·GIMP 3.2.6, 기본값 색 변화 중앙값 1.63·1.60 → 옵션 켜면 0.67·0.63, XnConvert GPS·날짜 24/24 유지·GIMP 0/24, 24장 33초 vs 67초 | `convert-heic-to-jpg-free.mdx`, `tests/convert-heic-to-jpg-free/summary.json` | 글 본문과 측정 기록 일치 (2026-10-15 측정) |
| WebP 10개(사진 6·투명 3·애니메이션 1), JPG 크기 1.66~2.23배, 투명 영역 흰색 4개·iLoveIMG 검정, ezgif만 배경색 선택, 애니메이션은 깔끔한 결과 없음 | `convert-webp-to-jpg-free.mdx`, `tests/convert-webp-to-jpg-free/` | 2026-10-21~22 측정 |
| 사진 20장, 원래 크기에서 100 KB: 6/20 초과·화질 점수 중앙값 -49.9, 1024 px로 줄이면 20/20·52.8 | `compress-image-to-100kb.mdx`, `tests/compress-image-to-100kb/summary.json` | 2026-10-16 측정 (ImageMagick 스크립트로 측정, 단계 화면은 GIMP 3.2.6) |
| 사진 20장 배경 제거: iLoveIMG 전부 원본 크기 무료·깨끗한 결과 17/20, remove.bg 19/20(무료는 약 0.25 MP 미리보기), removal.ai 18/20(약 600×400 미리보기), Pixlr 하루 3장 | `remove-bg-alternative-free.mdx` | 2026-10-21 측정 |
| 메타데이터 6개 도구 모두 위치·카메라 정보 삭제, Jimpl·Verexif·IMGonline은 업로드 + 세로 사진 2/2 눕힘, ExifCleaner 4.6.0은 Save as copy 켜면 8/8 실패 | `remove-metadata-from-photos.mdx` | 2026-10-22 측정 |
| 측정 방식: XnConvert·ExifCleaner는 Xvfb에서 창 조작, GIMP 내보내기(HEIC·WebP)는 python-fu 배치로 기본 내보내기 설정(HEIC은 GUI 내보내기 결과와 메타데이터·픽셀 동일 확인), HandBrake는 컨테이너에서 GUI 창이 뜨지 않아 같은 1.11.2 HandBrakeCLI + 공식 프리셋, 100 KB는 ImageMagick 스크립트(단계 화면만 GIMP) | `tests/convert-heic-to-jpg-free/facts.md`(15·17행), `tests/convert-webp-to-jpg-free/gimp_batch.py`, `tests/compress-video-for-discord-email/hb.sh`·`facts.md` 7행, `tests/compress-image-to-100kb/` | 허브 How we tested에 그대로 밝힘 (창 조작이라고 쓰지 않음) |
| HandBrake 1.11.2, 1분 1080p 3개: Social 25 MB 20.2~23.9 MB, 19 MB 평균 비트레이트(2,380 kbps) 17.0~19.0 MB·VMAF 90.4~99.6, Social 10 MB 540p·82.2~84.0 | `compress-video-for-discord-email.mdx`, `tests/compress-video-for-discord-email/results.json` | 2026-10-16 측정 |

## 이번 세션에 다시 연 1차 출처 (2026-10-26 UTC, 원문 `source-*.txt`)

| 주장 | 출처 | 확인 |
| --- | --- | --- |
| remove.bg 독립 웹사이트는 2026-12-01 09:00 CET부터 이용 불가, 배경 제거는 Canva로 | https://www.remove.bg/faq (`source-removebg-faq.txt`, 페이지 JSON의 FAQ) | "From 1 December 2026 at 9:00am CET, remove.bg's standalone website will no longer be available" |
| XnConvert 최신 1.118.0, 개인·교육용 프리웨어, 회사는 라이선스(1개 15.00 €) | https://www.xnview.com/en/xnconvert/ | "Version 1.118.0", "FREEWARE ... for private or educational use", "15.00 €" |
| GIMP 최신 안정판 3.2.6 (2026-09-10) | https://www.gimp.org/downloads/ | "The current stable release of GIMP is 3.2.6 (2026-09-10)" |
| HandBrake 1.11.2, 무료·오픈 소스, Windows·Mac·Linux | https://handbrake.fr/ | "Download HandBrake 1.11.2", "Free and Open Source", "Multi-Platform (Windows, Mac and Linux)" |
| ExifCleaner: 무료, 사진·영상·PDF, macOS·Windows·Linux | https://exifcleaner.com/ | 사이트에 버전 표기 없음 → 글에는 "the version we tested"로만 씀 |
| ExifRemove: 브라우저 안에서 처리·업로드 없음, JPG만, 파일당 25 MB·한 번에 50장 200 MB | https://exifremove.com/ | "Your photos stay in this browser. No uploads", "JPG / JPEG · Up to 25 MB each · 50 photos / 200 MB per batch" |
| iLoveIMG 무료(Basic)에 Remove background 포함, 한 번에 3장, Premium $5/월(연 $60)·월 결제 $9 | https://www.iloveimg.com/pricing | 비교표 Remove background Basic "Yes"(아이콘 alt), Batch processing Remove background 3/3/3, "5US$ / month 60US$ Billed annually 9US$ Billed monthly" |
| ezgif: 투명 영역 배경색 선택, 업로드 파일 1시간 뒤 자동 삭제 | https://ezgif.com/webp-to-jpg | "Background color: This color will be used as background if an image contains transparent areas", "automatically deleted 1 hour after upload" |
| CloudConvert 무료 하루 10회 | https://cloudconvert.com/pricing | "Start free with 10 conversions per day", "10 / day ... Daily reset" |
| Discord 무료 업로드 20MB(2026-08부터, 10MB에서), Nitro Basic 50MB·Nitro 최대 1GB | https://support.discord.com/hc/en-us/articles/25444343291031 (Help Center API, `source-discord-file-attachments.txt`) | "For non-Nitro subscribers, the maximum file upload is 20MB", "As of August 2026, the free upload limit is 20MB (up from 10MB)" |
| Gmail 개인 계정 첨부 25 MB, 넘으면 Drive 링크 | https://support.google.com/mail/answer/6584?hl=en | "For personal Gmail accounts, the limit is 25 MB", "automatically removes the attachment and adds it as a Google Drive link" |
| iPhone **Settings > Camera > Formats > Most Compatible** → 새 사진 JPEG | https://support.apple.com/en-us/116944 | "Tap Formats, then tap Most Compatible ... All new photos and videos will now use JPEG or H.264" |
| iPhone 공유 시 **Options**에서 Location 끄기 | https://support.apple.com/guide/personal-safety/manage-location-metadata-in-photos-ips0d7a5df82/web | "Tap , then tap Options. Turn off Location. Location Not Included is shown above the Options button" |
| Mac Preview 배경 제거 | https://support.apple.com/guide/preview/remove-a-background-prvw15636/mac | 페이지 제목 "Remove a background or extract an image in Preview on Mac" |

## 쓰지 않은 것

- removal.ai·Pixlr 요금(이번 세션에 다시 확인하지 않음) → 허브에서는 무료 다운로드 크기·하루 한도(10-21 측정)만 씀
- Canva 무료 요금제의 배경 제거 포함 여부 (상시 글 측정 때 Canva 페이지가 막힘, 확인 못 함)
- 상위 결과에 나온 브라우저 변환기(StockSnap·reaConverter Web 등): 측정하지 않음

## 같은 세션의 역링크 사실 확인

| 주장 | 출처 | 확인 |
| --- | --- | --- |
| `windows-10-esu-extended`에 넣은 문장: LTE Pixel Watch 2·3의 Safety Signal이 2026-12-12에 끝남 | https://support.google.com/googlepixelwatch/thread/471984501 (Chromium 렌더링, `source-pixel-watch-safety-signal.txt`) | "Google Pixel Watch 2 (LTE) / Google Pixel Watch 3 (LTE)", "we will be ending Safety Signal on Dec 12", "After Dec 12, 2026, this access will end" |
